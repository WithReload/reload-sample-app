import { DEFAULTS } from "@/lib/constants";
import { RefreshCw, Send } from "lucide-react";
import { useState } from "react";

export default function PreviewChargeForm({
  onMakeApiCall,
  loading,
  response,
  authData,
}) {
  const [formData, setFormData] = useState({
    aiAgentId: "",
    amount: "",
    description: DEFAULTS.DESCRIPTION,
    idempotencyKey: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      aiAgentId: formData.aiAgentId,
      amount: parseFloat(formData.amount) || 0,
      description: formData.description || "Preview charge",
    };
    if (formData.idempotencyKey)
      payload.idempotencyKey = formData.idempotencyKey;
    onMakeApiCall({
      endpoint: "/preview-charge",
      method: "POST",
      body: payload,
    });
  };

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
          Preview Charge
        </h3>
        <p className='text-sm text-gray-600'>
          Check if user has sufficient balance for a charge
        </p>
      </div>

      <div className='bg-gray-50 rounded-md p-4 space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            AI Agent ID <span className='text-red-500 ml-1'>*</span>
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.aiAgentId}
            placeholder='Enter AI Agent ID'
            onChange={(e) => handleInputChange("aiAgentId", e.target.value)}
          />
          <p className='text-xs text-gray-500 mt-1'>
            Enter the ID of the AI Agent you want to use
          </p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Amount (USD) <span className='text-red-500 ml-1'>*</span>
          </label>
          <input
            type='number'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.amount}
            placeholder='10.00'
            onChange={(e) => handleInputChange("amount", e.target.value)}
            required
            min='0'
            step='0.01'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Description
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.description}
            placeholder='Preview charge for API usage'
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Idempotency Key (Optional)
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.idempotencyKey}
            placeholder='preview-123-456'
            onChange={(e) =>
              handleInputChange("idempotencyKey", e.target.value)
            }
          />
          <p className='text-xs text-gray-500 mt-1'>
            Optional: Prevents duplicate charges if the same key is used
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className='w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {loading ? (
            <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
          ) : (
            <Send className='w-4 h-4 mr-2' />
          )}
          {loading ? "Loading..." : "Make API Call"}
        </button>
      </div>
    </div>
  );
}
