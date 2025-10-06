"use client";

import {
  HeroSection,
  Navigation,
  UserInfo,
  WalletConnection,
} from "@/components";
import {
  IntrospectTokenForm,
  PreviewChargeForm,
  ReportUsageForm,
  RevokeTokenForm,
  UsageReportByIdForm,
  UsageReportsForm,
  UserDetailsForm,
} from "@/components/forms";
import { useAPICalls, useOAuth } from "@/hooks";
import { clientConfig } from "@/lib/config";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("user");

  // OAuth permissions state
  const [selectedPermissions, setSelectedPermissions] = useState({
    identity: true,
    usage_reporting: true,
    payment: true,
  });

  // Custom hooks
  const { isConnected, walletToken, authData, connectWallet, disconnect } =
    useOAuth();
  const { loading, response, makeApiCall } = useAPICalls(walletToken);

  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleConnect = () => {
    connectWallet(selectedPermissions);
  };

  const tabs = [
    { key: "user", title: "User Details" },
    { key: "previewCharge", title: "Preview Charge" },
    { key: "reportUsage", title: "Report Usage" },
    { key: "usageReports", title: "Usage Reports" },
    { key: "usageReportById", title: "Get Report by ID" },
    { key: "revokeToken", title: "Revoke Token" },
    { key: "introspectToken", title: "Introspect Token" },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation isConnected={isConnected} />

      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <HeroSection />

        {/* Wallet Connection Section */}
        {!isConnected ? (
          <WalletConnection
            selectedPermissions={selectedPermissions}
            onPermissionChange={handlePermissionChange}
            onConnect={handleConnect}
            clientConfig={clientConfig}
          />
        ) : (
          <div className='max-w-6xl mx-auto'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
              {/* Connected Header */}
              <div className='bg-gray-800 px-6 py-4 rounded-t-lg'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-white/20 rounded-md flex items-center justify-center'>
                      <svg
                        className='w-4 h-4 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold text-white'>
                        Wallet Connected
                      </h2>
                      <p className='text-gray-300 text-sm'>
                        Ready to test Reload APIs
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={disconnect}
                    className='px-3 py-2 bg-white/20 text-white text-sm font-medium rounded-md hover:bg-white/30 transition-colors'
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              {/* User Info Section */}
              <UserInfo authData={authData} onDisconnect={disconnect} />

              {/* API Tester */}
              <div className='max-w-6xl mx-auto'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
                  {/* Tabs */}
                  <div className='bg-gray-50 px-6 py-3 border-b border-gray-200'>
                    <div className='flex space-x-1 overflow-x-auto'>
                      {tabs.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                            activeTab === tab.key
                              ? "bg-gray-800 text-white"
                              : "text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {tab.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className='p-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                      {/* Form */}
                      <div>
                        {activeTab === "user" && (
                          <UserDetailsForm
                            onMakeApiCall={makeApiCall}
                            loading={loading}
                            response={response}
                          />
                        )}
                        {activeTab === "previewCharge" && (
                          <PreviewChargeForm
                            onMakeApiCall={makeApiCall}
                            loading={loading}
                            response={response}
                            authData={authData}
                          />
                        )}
                        {activeTab === "reportUsage" && (
                          <ReportUsageForm
                            onMakeApiCall={makeApiCall}
                            loading={loading}
                            response={response}
                            authData={authData}
                          />
                        )}
                        {activeTab === "usageReports" && (
                          <UsageReportsForm
                            onApiCall={makeApiCall}
                            loading={loading}
                            authData={authData}
                          />
                        )}
                        {activeTab === "usageReportById" && (
                          <UsageReportByIdForm
                            onApiCall={makeApiCall}
                            loading={loading}
                            authData={authData}
                          />
                        )}
                        {activeTab === "revokeToken" && (
                          <RevokeTokenForm
                            onMakeApiCall={makeApiCall}
                            loading={loading}
                            response={response}
                            authData={authData}
                          />
                        )}
                        {activeTab === "introspectToken" && (
                          <IntrospectTokenForm
                            onMakeApiCall={makeApiCall}
                            loading={loading}
                            response={response}
                            authData={authData}
                          />
                        )}
                      </div>

                      {/* Response */}
                      <div className='bg-gray-50 rounded-md p-4'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                          API Response
                        </h3>
                        {loading ? (
                          <div className='flex items-center justify-center py-8'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800'></div>
                          </div>
                        ) : response ? (
                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <span className='text-sm font-medium text-gray-700'>
                                Response
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(response);
                                }}
                                className='text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors text-gray-800 hover:text-gray-900'
                              >
                                Copy
                              </button>
                            </div>
                            <pre className='bg-white border border-gray-200 rounded-md p-3 text-xs text-gray-800 overflow-auto max-h-96'>
                              {response}
                            </pre>
                          </div>
                        ) : (
                          <p className='text-gray-500 text-sm'>
                            No response yet. Make an API call to see the result.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
