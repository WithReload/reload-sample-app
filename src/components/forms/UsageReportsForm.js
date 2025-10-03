"use client";

import { useState } from "react";

const UsageReportsForm = ({ authData, onApiCall, loading }) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    userId: "",
    userEmail: "",
    startDate: "",
    endDate: "",
    hasCharges: "",
    minAmount: "",
    maxAmount: "",
    status: "",
    aiAgentId: "",
    transactionType: "",
    idempotencyKey: "",
    usageType: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build query parameters
    const queryParams = new URLSearchParams();

    // Add non-empty filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/usage-reports?${queryString}`
      : "/usage-reports";

    onApiCall(endpoint, "GET");
  };

  const handleReset = () => {
    setFilters({
      page: 1,
      limit: 20,
      userId: "",
      userEmail: "",
      startDate: "",
      endDate: "",
      hasCharges: "",
      minAmount: "",
      maxAmount: "",
      status: "",
      aiAgentId: "",
      transactionType: "",
      idempotencyKey: "",
      usageType: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Get Usage Reports
        </h3>
        <p className='text-sm text-gray-600'>
          Retrieve usage reports with comprehensive filtering and pagination
          options.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {/* Pagination */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Page
            </label>
            <input
              type='number'
              min='1'
              value={filters.page}
              onChange={(e) =>
                handleInputChange("page", parseInt(e.target.value) || 1)
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Limit
            </label>
            <select
              value={filters.limit}
              onChange={(e) =>
                handleInputChange("limit", parseInt(e.target.value))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* User Filters */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              User ID
            </label>
            <input
              type='text'
              value={filters.userId}
              onChange={(e) => handleInputChange("userId", e.target.value)}
              placeholder='Enter user ID'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              User Email
            </label>
            <input
              type='email'
              value={filters.userEmail}
              onChange={(e) => handleInputChange("userEmail", e.target.value)}
              placeholder='Enter user email'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          {/* Date Filters */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Start Date
            </label>
            <input
              type='date'
              value={filters.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              End Date
            </label>
            <input
              type='date'
              value={filters.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          {/* Charge Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Has Charges
            </label>
            <select
              value={filters.hasCharges}
              onChange={(e) =>
                handleInputChange(
                  "hasCharges",
                  e.target.value === "" ? "" : e.target.value === "true"
                )
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            >
              <option value=''>All</option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>

          {/* Amount Range */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Min Amount
            </label>
            <input
              type='number'
              step='0.01'
              value={filters.minAmount}
              onChange={(e) => handleInputChange("minAmount", e.target.value)}
              placeholder='0.00'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Max Amount
            </label>
            <input
              type='number'
              step='0.01'
              value={filters.maxAmount}
              onChange={(e) => handleInputChange("maxAmount", e.target.value)}
              placeholder='1000.00'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            >
              <option value=''>All</option>
              <option value='completed'>Completed</option>
              <option value='pending'>Pending</option>
              <option value='failed'>Failed</option>
              <option value='cancelled'>Cancelled</option>
            </select>
          </div>

          {/* AI Agent Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              AI Agent ID
            </label>
            <input
              type='text'
              value={filters.aiAgentId}
              onChange={(e) => handleInputChange("aiAgentId", e.target.value)}
              placeholder='Enter AI Agent ID'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          {/* Transaction Type Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Transaction Type
            </label>
            <select
              value={filters.transactionType}
              onChange={(e) =>
                handleInputChange("transactionType", e.target.value)
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            >
              <option value=''>All</option>
              <option value='usage'>Usage</option>
              <option value='refund'>Refund</option>
              <option value='adjustment'>Adjustment</option>
            </select>
          </div>

          {/* Idempotency Key Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Idempotency Key
            </label>
            <input
              type='text'
              value={filters.idempotencyKey}
              onChange={(e) =>
                handleInputChange("idempotencyKey", e.target.value)
              }
              placeholder='Enter idempotency key'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          {/* Usage Type Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Usage Type
            </label>
            <input
              type='text'
              value={filters.usageType}
              onChange={(e) => handleInputChange("usageType", e.target.value)}
              placeholder='e.g., API Call, Token Usage, New Session, Feature Usage'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            />
          </div>

          {/* Sorting */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleInputChange("sortBy", e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            >
              <option value='createdAt'>Created At</option>
              <option value='usageDate'>Usage Date</option>
              <option value='amount'>Amount</option>
              <option value='totalCost'>Total Cost</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Sort Order
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleInputChange("sortOrder", e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900'
            >
              <option value='desc'>Descending</option>
              <option value='asc'>Ascending</option>
            </select>
          </div>
        </div>

        <div className='flex gap-3 pt-4'>
          <button
            type='submit'
            disabled={loading}
            className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
          >
            {loading ? "Loading..." : "Get Usage Reports"}
          </button>
          <button
            type='button'
            onClick={handleReset}
            className='px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium'
          >
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsageReportsForm;
