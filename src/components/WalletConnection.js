import { Wallet } from "lucide-react";
import PermissionSelector from "./PermissionSelector";

export default function WalletConnection({
  selectedPermissions,
  onPermissionChange,
  onConnect,
  clientConfig,
}) {
  const hasValidPermissions = Object.values(selectedPermissions).some(
    (permission) => permission
  );

  const isConfigValid =
    clientConfig.reloadClientId && clientConfig.reloadRedirectUri;

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        {/* Header */}
        <div className='bg-gray-800 px-6 py-4 rounded-t-lg'>
          <div className='text-center'>
            <h2 className='text-lg font-semibold text-white mb-1'>
              Connect Your Reload Account
            </h2>
            <p className='text-gray-300 text-sm'>
              Authorize access to your Reload account
            </p>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          <div className='space-y-6'>
            {/* Permission Selector */}
            <PermissionSelector
              selectedPermissions={selectedPermissions}
              onPermissionChange={onPermissionChange}
            />

            {/* Connect Button */}
            <div className='text-center'>
              <button
                onClick={onConnect}
                disabled={!isConfigValid || !hasValidPermissions}
                className='inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <Wallet className='w-4 h-4 mr-2' />
                Connect Reload Account
              </button>
              {!hasValidPermissions && (
                <p className='text-red-500 text-xs mt-2'>
                  Please select at least one permission to continue
                </p>
              )}
            </div>

            {/* Configuration Warning */}
            {!isConfigValid && (
              <div className='mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md'>
                <div className='flex items-start space-x-3'>
                  <div className='flex-shrink-0'>
                    <span className='text-amber-600 text-lg'>⚠️</span>
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-sm font-semibold text-amber-800 mb-1'>
                      Configuration Required
                    </h4>
                    <p className='text-xs text-amber-700 mb-2'>
                      Please set the following environment variables in your{" "}
                      <code className='bg-amber-100 px-1 py-0.5 rounded text-xs font-mono'>
                        .env.local
                      </code>{" "}
                      file:
                    </p>
                    <div className='space-y-1'>
                      <div className='flex items-center space-x-2'>
                        <div className='w-1.5 h-1.5 bg-amber-500 rounded-full'></div>
                        <code className='text-xs bg-amber-100 px-2 py-1 rounded font-mono'>
                          NEXT_PUBLIC_RELOAD_CLIENT_ID
                        </code>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <div className='w-1.5 h-1.5 bg-amber-500 rounded-full'></div>
                        <code className='text-xs bg-amber-100 px-2 py-1 rounded font-mono'>
                          NEXT_PUBLIC_RELOAD_REDIRECT_URI
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
