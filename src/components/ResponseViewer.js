import { Check, Copy, Eye } from "lucide-react";
import { useState } from "react";

export default function ResponseViewer({ response, loading }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>API Response</h3>
        {response && (
          <button
            onClick={() => copyToClipboard(response)}
            className='flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors'
          >
            {copied ? (
              <Check className='w-4 h-4 text-green-600' />
            ) : (
              <Copy className='w-4 h-4' />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      <div className='bg-gray-900 rounded-md p-4 min-h-[400px] overflow-hidden'>
        {response ? (
          <div className='space-y-2'>
            {/* Status indicator */}
            {(() => {
              try {
                const parsedResponse = JSON.parse(response);
                const isSuccess =
                  parsedResponse.success !== false &&
                  parsedResponse.status >= 200 &&
                  parsedResponse.status < 300;
                const statusColor = isSuccess
                  ? "text-green-400"
                  : "text-red-400";
                const statusBg = isSuccess
                  ? "bg-green-900/20"
                  : "bg-red-900/20";

                return (
                  <div
                    className={`px-3 py-2 rounded-md ${statusBg} border ${
                      isSuccess ? "border-green-500/30" : "border-red-500/30"
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isSuccess ? "bg-green-400" : "bg-red-400"
                        }`}
                      ></div>
                      <span className={`text-sm font-medium ${statusColor}`}>
                        {parsedResponse.status}{" "}
                        {parsedResponse.statusText || "Unknown Status"}
                      </span>
                      {parsedResponse.timestamp && (
                        <span className='text-xs text-gray-400 ml-auto'>
                          {new Date(
                            parsedResponse.timestamp
                          ).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              } catch {
                return null;
              }
            })()}

            {/* Response content */}
            <pre className='text-green-400 text-xs leading-relaxed overflow-auto max-h-[350px] font-mono'>
              {response}
            </pre>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <div className='w-12 h-12 bg-gray-800 rounded-md flex items-center justify-center mb-3'>
              <Eye className='w-6 h-6' />
            </div>
            <h4 className='text-sm font-semibold mb-1'>No Response Yet</h4>
            <p className='text-xs text-center'>
              Make an API call to see the response here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
