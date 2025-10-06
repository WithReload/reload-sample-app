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

      {/* Token Status Legend */}
      <div className='bg-gray-50 border border-gray-200 rounded-md p-4'>
        <h4 className='text-sm font-medium text-gray-900 mb-3'>
          Token Status Legend
        </h4>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs'>
          <div className='flex items-center gap-2'>
            <span
              className={`px-2 py-1 rounded-full ${getStatusColor("active")}`}
            >
              active
            </span>
            <span className='text-gray-600'>
              Token is valid and can be used
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span
              className={`px-2 py-1 rounded-full ${getStatusColor("revoked")}`}
            >
              revoked
            </span>
            <span className='text-gray-600'>
              Token has been revoked by client
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span
              className={`px-2 py-1 rounded-full ${getStatusColor(
                "disconnected"
              )}`}
            >
              disconnected
            </span>
            <span className='text-gray-600'>
              User disconnected from Reload portal
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span
              className={`px-2 py-1 rounded-full ${getStatusColor(
                "not_found"
              )}`}
            >
              not_found
            </span>
            <span className='text-gray-600'>Token does not exist</span>
          </div>
          <div className='flex items-center gap-2'>
            <span
              className={`px-2 py-1 rounded-full ${getStatusColor("expired")}`}
            >
              expired
            </span>
            <span className='text-gray-600'>
              Token has expired (rare for long-lived tokens)
            </span>
          </div>
        </div>
      </div>

      {/* Response Display Enhancement */}
      {response && (
        <div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
          <h4 className='text-sm font-medium text-blue-900 mb-2'>
            Quick Status Check
          </h4>
          <div className='text-sm text-blue-800'>
            {(() => {
              try {
                const data = JSON.parse(response);
                if (data.data) {
                  const { active, status, permissions, user, organization } =
                    data.data;
                  return (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            active
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                      {permissions && (
                        <div>
                          <span className='font-medium'>Permissions:</span>
                          <div className='flex flex-wrap gap-1 mt-1'>
                            {permissions.map((permission, index) => (
                              <span
                                key={index}
                                className='px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs'
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {user && (
                        <div>
                          <span className='font-medium'>User:</span>
                          <span className='ml-2 text-gray-700'>
                            {user.firstName} {user.lastName} ({user.email})
                          </span>
                        </div>
                      )}
                      {organization && (
                        <div>
                          <span className='font-medium'>Organization:</span>
                          <span className='ml-2 text-gray-700'>
                            {organization.name}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              } catch (e) {
                return null;
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntrospectTokenForm;
