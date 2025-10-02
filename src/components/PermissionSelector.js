import { Check } from "lucide-react";

export default function PermissionSelector({
  selectedPermissions,
  onPermissionChange,
}) {
  const permissionDescriptions = {
    identity: "View your basic profile information",
    usage_reporting: "Report usage data and analytics",
    payment: "Deduct credits from your wallet",
  };

  return (
    <div className='bg-gray-50 rounded-lg p-4'>
      <div className='text-center mb-4'>
        <h3 className='text-base font-semibold text-gray-900 mb-1'>
          Select Permissions
        </h3>
        <p className='text-sm text-gray-600'>
          Choose what your application can access
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
        {Object.entries(selectedPermissions).map(([permission, isSelected]) => (
          <label
            key={permission}
            className={`group relative flex flex-col p-4 rounded-md border-2 cursor-pointer transition-all duration-200 ${
              isSelected
                ? "bg-gray-50 border-gray-600 text-gray-900"
                : "bg-white border-gray-200 hover:border-gray-400 text-gray-700"
            }`}
          >
            <input
              type='checkbox'
              checked={isSelected}
              onChange={() => onPermissionChange(permission)}
              className='sr-only'
            />
            <div className='flex items-center justify-between mb-2'>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center ${
                  isSelected ? "bg-gray-600" : "bg-gray-200"
                }`}
              >
                {isSelected && <Check className='w-3 h-3 text-white' />}
              </div>
              {isSelected && (
                <span className='text-xs font-medium text-gray-600'>
                  Selected
                </span>
              )}
            </div>
            <h4 className='text-sm font-semibold mb-1 capitalize'>
              {permission.replace("_", " ")}
            </h4>
            <p className='text-xs text-gray-600'>
              {permissionDescriptions[permission]}
            </p>
          </label>
        ))}
      </div>
    </div>
  );
}
