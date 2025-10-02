export default function UserInfo({ authData, onDisconnect }) {
  if (!authData) return null;

  return (
    <div className='bg-gray-50 border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='flex-shrink-0'>
            <div className='w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center'>
              <span className='text-white font-semibold text-sm'>
                {authData.user.firstName?.charAt(0)}
                {authData.user.lastName?.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-900'>
              {authData.user.firstName} {authData.user.lastName}
            </h3>
            <p className='text-xs text-gray-600'>{authData.user.email}</p>
            <div className='flex items-center space-x-2 mt-1'>
              <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800'>
                {authData.organization.name}
              </span>
              <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700'>
                {authData.environment}
              </span>
            </div>
          </div>
        </div>
        <div className='text-right'>
          <div className='text-xs text-gray-500 mb-1'>Permissions</div>
          <div className='flex flex-wrap gap-1'>
            {authData.permissions.map((permission) => (
              <span
                key={permission}
                className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700'
              >
                {permission.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
