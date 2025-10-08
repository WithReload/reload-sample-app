import { useEffect, useState } from "react";

const IntrospectTokenForm = ({
  onMakeApiCall,
  loading,
  response,
  authData,
}) => {
  const [formData, setFormData] = useState({
    token: "",
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
      alert("Please enter a token to introspect");
      return;
    }

    const requestData = {
      endpoint: "/introspect-token",
      method: "POST",
      body: {
        token: formData.token.trim(),
      },
    };

    await onMakeApiCall(requestData);
  };

  const handleReset = () => {
    setFormData({
      token: "",
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "revoked":
        return "text-red-600 bg-red-100";
      case "disconnected":
        return "text-orange-600 bg-orange-100";
      case "not_found":
        return "text-gray-600 bg-gray-100";
      case "expired":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Introspect OAuth Token
        </h3>
        <p className='text-sm text-gray-600 mb-4'>
          Check the validity and status of an OAuth access token. This endpoint
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
              placeholder='Enter OAuth token to introspect'
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
            The OAuth access token to check
          </p>
        </div>

        <div className='flex gap-3'>
          <button
            type='submit'
            disabled={loading || !formData.token.trim()}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? "Checking..." : "Introspect Token"}
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
    </div>
  );
};

export default IntrospectTokenForm;
