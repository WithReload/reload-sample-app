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
          <pre className='text-green-400 text-xs leading-relaxed overflow-auto max-h-[400px] font-mono'>
            {response}
          </pre>
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
