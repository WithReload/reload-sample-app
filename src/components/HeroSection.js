import { UI_TEXT } from "@/lib/constants";

export default function HeroSection() {
  return (
    <div className='text-center mb-8'>
      <h1 className='text-2xl font-semibold text-gray-900 mb-2'>
        {UI_TEXT.APP_TITLE}
      </h1>
      <p className='text-sm text-gray-600 max-w-2xl mx-auto'>
        {UI_TEXT.APP_DESCRIPTION}
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
