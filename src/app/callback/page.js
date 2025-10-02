"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Callback() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const state = searchParams.get("state");

    if (error) {
      setError(errorDescription || error);
      setStatus("Authorization failed");
      return;
    }

    if (code) {
      setStatus("Authorization successful! Redirecting...");

      // Store the code and state in sessionStorage for the main app to access
      sessionStorage.setItem("reload_auth_code", code);
      if (state) {
        sessionStorage.setItem("reload_auth_state", state);
      }

      // Redirect back to the main app after a short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      setError("No authorization code received");
      setStatus("Authorization failed");
    }
  }, [searchParams]);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full mx-4'>
        <div className='text-center'>
          {error ? (
            <>
              <div className='w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-red-600 dark:text-red-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Authorization Failed
              </h2>
              <p className='text-red-600 dark:text-red-400 mb-4'>{error}</p>
            </>
          ) : (
            <>
              <div className='w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-green-600 dark:text-green-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Authorization Successful
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                You can close this window now.
              </p>
            </>
          )}

          <p className='text-sm text-gray-500 dark:text-gray-400'>{status}</p>
        </div>
      </div>
    </div>
  );
}
