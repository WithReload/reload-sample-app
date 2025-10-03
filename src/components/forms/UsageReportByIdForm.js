"use client";

import { useState } from "react";

const UsageReportByIdForm = ({ authData, onApiCall, loading }) => {
  const [usageReportId, setUsageReportId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!usageReportId.trim()) {
      alert("Please enter a usage report ID");
      return;
    }

    onApiCall(`/usage-reports/${usageReportId.trim()}`, "GET");
  };

  const handleReset = () => {
    setUsageReportId("");
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Get Usage Report by ID
        </h3>
        <p className='text-sm text-gray-600'>
          Retrieve detailed information about a specific usage report including
          all associated transactions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Usage Report ID
          </label>
          <input
            type='text'
            value={usageReportId}
            onChange={(e) => setUsageReportId(e.target.value)}
            placeholder='Enter usage report ID'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            required
          />
          <p className='mt-1 text-xs text-gray-500'>
            Enter the ID of the usage report you want to retrieve
          </p>
        </div>

        <div className='flex gap-3 pt-4'>
          <button
            type='submit'
            disabled={loading || !usageReportId.trim()}
            className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
          >
            {loading ? "Loading..." : "Get Usage Report"}
          </button>
          <button
            type='button'
            onClick={handleReset}
            className='px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium'
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsageReportByIdForm;
