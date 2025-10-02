import clsx from "clsx";
import { RefreshCw, Send } from "lucide-react";
import ResponseViewer from "./ResponseViewer";

export default function APITester({
  activeTab,
  setActiveTab,
  apiEndpoints,
  tabs,
  onMakeApiCall,
  loading,
  response,
}) {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        {/* Tabs */}
        <div className='bg-gray-50 px-6 py-3 border-b border-gray-200'>
          <div className='flex space-x-1 overflow-x-auto'>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === tab
                    ? "bg-gray-800 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                )}
              >
                {apiEndpoints[tab].title}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Parameters Form */}
            <div className='space-y-4'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                  {apiEndpoints[activeTab].title}
                </h3>
                <p className='text-sm text-gray-600'>
                  {apiEndpoints[activeTab].description}
                </p>
              </div>

              <div className='bg-gray-50 rounded-md p-4 space-y-4'>
                {apiEndpoints[activeTab].params.map((param) => (
                  <div key={param.key}>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      {param.label}
                    </label>
                    {param.type === "textarea" ? (
                      <textarea
                        className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none'
                        rows={3}
                        value={param.value}
                        onChange={(e) =>
                          // This would need to be handled by parent component
                          console.log(
                            "Input change:",
                            param.key,
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <input
                        type={param.type}
                        className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                        value={param.value}
                        onChange={(e) =>
                          // This would need to be handled by parent component
                          console.log(
                            "Input change:",
                            param.key,
                            e.target.value
                          )
                        }
                      />
                    )}
                  </div>
                ))}

                <button
                  onClick={apiEndpoints[activeTab].action}
                  disabled={loading}
                  className='w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  {loading ? (
                    <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                  ) : (
                    <Send className='w-4 h-4 mr-2' />
                  )}
                  {loading ? "Loading..." : "Make API Call"}
                </button>
              </div>
            </div>

            {/* Response */}
            <ResponseViewer response={response} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
