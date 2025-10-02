"use client";

import {
  APITester,
  HeroSection,
  Navigation,
  UserInfo,
  WalletConnection,
} from "@/components";
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

  const apiEndpoints = {
    user: {
      title: "User Details",
      description: "Get user and organization information",
      endpoint: "/user",
      method: "GET",
      params: [],
      action: () => makeApiCall("/user"),
    },
    // Note: Other endpoints (wallet, transactions, charges, etc.) are not yet implemented
    // in the backend. They will be added in future iterations.
  };

  const tabs = Object.keys(apiEndpoints);

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
              <APITester
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                apiEndpoints={apiEndpoints}
                tabs={tabs}
                onMakeApiCall={makeApiCall}
                loading={loading}
                response={response}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
