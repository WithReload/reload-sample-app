import { Wallet } from "lucide-react";

export default function HeroSection() {
  return (
    <div className='text-center mb-8'>
      <div className='inline-flex items-center justify-center w-12 h-12 bg-gray-800 rounded-lg mb-4'>
        <Wallet className='w-6 h-6 text-white' />
      </div>
      <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
        Reload API Testing
      </h1>
      <p className='text-sm text-gray-600 max-w-2xl mx-auto'>
        Test and integrate with Reload&apos;s AI Agent APIs
      </p>
      <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md max-w-2xl mx-auto'>
        <p className='text-xs text-blue-700'>
          <strong>Available Endpoints:</strong> User Details, Preview Charge,
          and Report Usage. The Charge User option in Report Usage requires
          payment permission.
        </p>
      </div>
    </div>
  );
}
