import { Wallet } from "lucide-react";

export default function Navigation({ isConnected }) {
  return (
    <nav className='bg-white border-b border-gray-200 sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-14'>
          <div className='flex items-center space-x-2'>
            <div className='w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center'>
              <Wallet className='w-4 h-4 text-white' />
            </div>
            <span className='text-lg font-medium text-gray-900'>Reload</span>
          </div>
          <div className='flex items-center space-x-4'>
            {isConnected && (
              <div className='flex items-center space-x-2 px-2 py-1 bg-gray-100 border border-gray-300 rounded-md'>
                <div className='w-2 h-2 bg-gray-600 rounded-full'></div>
                <span className='text-xs font-medium text-gray-700'>
                  Connected
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
