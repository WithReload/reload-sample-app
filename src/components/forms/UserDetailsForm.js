import { RefreshCw, Send } from "lucide-react";

export default function UserDetailsForm({ onMakeApiCall, loading, response }) {
  const handleSubmit = () => {
    onMakeApiCall("/user", "GET");
  };

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
          User Details
        </h3>
        <p className='text-sm text-gray-600'>
          Get user and organization information
        </p>
      </div>

      <div className='bg-gray-50 rounded-md p-4 space-y-4'>
        <div className='text-center py-8'>
          <p className='text-sm text-gray-600 mb-4'>
            This endpoint doesn&apos;t require any parameters. Click the button
            below to get user details.
          </p>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className='inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? (
              <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
            ) : (
              <Send className='w-4 h-4 mr-2' />
            )}
            {loading ? "Loading..." : "Get User Details"}
          </button>
        </div>
      </div>
    </div>
  );
}
