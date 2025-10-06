import { useEffect, useState } from "react";

const RevokeTokenForm = ({ onMakeApiCall, loading, response, authData }) => {
  const [formData, setFormData] = useState({
    token: "",
    reason: "",
  });

  // Auto-populate token when authData changes
  useEffect(() => {
    if (authData?.access_token && !formData.token) {
      setFormData((prev) => ({
        ...prev,
        token: authData.access_token,
      }));
    }
  }, [authData?.access_token, formData.token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.token.trim()) {
      alert("Please enter a token to revoke");
      return;
    }

    const requestData = {
      endpoint: "/revoke-token",
      method: "POST",
      body: {
        token: formData.token.trim(),
        ...(formData.reason.trim() && { reason: formData.reason.trim() }),
      },
    };

    await onMakeApiCall(requestData);
  };

  const handleReset = () => {
    setFormData({
      token: "",
      reason: "",
    });
  };

  const handleUseCurrentToken = () => {
    if (authData?.access_token) {
      setFormData((prev) => ({
        ...prev,
        token: authData.access_token,
      }));
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Revoke OAuth Token
        </h3>
        <p className='text-sm text-gray-600 mb-4'>
          Revoke an OAuth access token to prevent further use. This endpoint
          only requires client credentials (Basic Auth).
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='token'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            OAuth Token *
          </label>
          <div className='flex gap-2'>
            <input
              type='text'
              id='token'
              name='token'
              value={formData.token}
              onChange={handleInputChange}
              placeholder='Enter OAuth token to revoke'
              className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
              required
            />
            {authData?.access_token && (
              <button
                type='button'
                onClick={handleUseCurrentToken}
                className='px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors'
              >
                Use Current
              </button>
            )}
          </div>
          <p className='text-xs text-gray-500 mt-1'>
            The OAuth access token to revoke
          </p>
        </div>

        <div>
          <label
            htmlFor='reason'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Reason (Optional)
          </label>
          <input
            type='text'
            id='reason'
            name='reason'
            value={formData.reason}
            onChange={handleInputChange}
            placeholder='e.g., User disconnected from application'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
            maxLength={500}
          />
          <p className='text-xs text-gray-500 mt-1'>
            Optional reason for revoking the token (max 500 characters)
          </p>
        </div>

        <div className='flex gap-3'>
          <button
            type='submit'
            disabled={loading || !formData.token.trim()}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? "Revoking..." : "Revoke Token"}
          </button>

          <button
            type='button'
            onClick={handleReset}
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors'
          >
            Reset
          </button>
        </div>
      </form>

      <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <svg
              className='h-5 w-5 text-yellow-400'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-yellow-800'>Important</h3>
            <div className='mt-2 text-sm text-yellow-700'>
              <ul className='list-disc list-inside space-y-1'>
                <li>This action cannot be undone</li>
                <li>The token will be immediately invalidated</li>
                <li>
                  Any ongoing sessions using this token will be terminated
                </li>
                <li>Only requires client credentials (Basic Auth)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevokeTokenForm;
