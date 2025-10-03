import { RefreshCw, Send } from "lucide-react";
import { useState } from "react";

export default function ReportUsageForm({
  onMakeApiCall,
  loading,
  response,
  authData,
}) {
  const [formData, setFormData] = useState({
    aiAgentId: "",
    usageType: "api_call",
    description: "",
    shortDescription: "",
    amount: "",
    totalCost: "",
    llmModel: "",
    llmProvider: "",
    inputTokens: "",
    outputTokens: "",
    chargeUser: false,
    idempotencyKey: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      aiAgentId: formData.aiAgentId,
      usageType: formData.usageType,
      description: formData.description || "",
      shortDescription: formData.shortDescription || "",
      currency: "USD",
    };

    // Add optional fields if provided
    if (formData.amount) payload.amount = parseFloat(formData.amount);
    if (formData.totalCost) payload.totalCost = parseFloat(formData.totalCost);
    if (formData.llmModel) payload.llmModel = formData.llmModel;
    if (formData.llmProvider) payload.llmProvider = formData.llmProvider;
    if (formData.inputTokens)
      payload.inputTokens = parseInt(formData.inputTokens);
    if (formData.outputTokens)
      payload.outputTokens = parseInt(formData.outputTokens);
    if (formData.chargeUser) payload.chargeUser = formData.chargeUser;
    if (formData.idempotencyKey)
      payload.idempotencyKey = formData.idempotencyKey;

    onMakeApiCall("/usage", "POST", payload);
  };

  const hasPaymentPermission = authData?.permissions?.includes("payment");

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
          Report Usage
        </h3>
        <p className='text-sm text-gray-600'>
          Report usage data with optional charging
        </p>
      </div>

      <div className='bg-gray-50 rounded-md p-4 space-y-4'>
        {/* Create Charge Toggle - Moved to top */}
        <div className='p-4 bg-white border border-gray-200 rounded-md'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center space-x-3'>
              <div className='flex items-center space-x-3'>
                <button
                  type='button'
                  onClick={() =>
                    hasPaymentPermission &&
                    handleInputChange("chargeUser", !formData.chargeUser)
                  }
                  disabled={!hasPaymentPermission}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.chargeUser ? "bg-blue-600" : "bg-gray-200"
                  } ${
                    !hasPaymentPermission
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.chargeUser ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <div>
                  <label
                    htmlFor='chargeUser'
                    className={`text-sm font-medium ${
                      !hasPaymentPermission ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    Create Charge
                  </label>
                  <p className='text-xs text-gray-500 mt-1'>
                    Deduct the specified amount from user&apos;s wallet
                  </p>
                </div>
              </div>
              {!hasPaymentPermission && (
                <span className='text-xs text-gray-400'>
                  (Requires payment permission)
                </span>
              )}
            </div>
            <div className='flex items-center'>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.chargeUser
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {formData.chargeUser ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

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
            Usage Type <span className='text-red-500 ml-1'>*</span>
          </label>
          <select
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.usageType}
            onChange={(e) => handleInputChange("usageType", e.target.value)}
          >
            <option value='api_call'>API Call</option>
            <option value='token_usage'>Token Usage</option>
            <option value='session'>Session</option>
            <option value='feature_usage'>Feature Usage</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Description
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.description}
            placeholder='API call to process user data'
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Short Description
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.shortDescription}
            placeholder='Data processing'
            onChange={(e) =>
              handleInputChange("shortDescription", e.target.value)
            }
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Amount (optional)
          </label>
          <input
            type='number'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.amount}
            placeholder='5.00'
            onChange={(e) => handleInputChange("amount", e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Total Cost (USD)
          </label>
          <input
            type='number'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.totalCost}
            placeholder='5.50'
            onChange={(e) => handleInputChange("totalCost", e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            LLM Model
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.llmModel}
            placeholder='gpt-4'
            onChange={(e) => handleInputChange("llmModel", e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            LLM Provider
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.llmProvider}
            placeholder='OpenAI'
            onChange={(e) => handleInputChange("llmProvider", e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Input Tokens
          </label>
          <input
            type='number'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.inputTokens}
            placeholder='150'
            onChange={(e) => handleInputChange("inputTokens", e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Output Tokens
          </label>
          <input
            type='number'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.outputTokens}
            placeholder='75'
            onChange={(e) => handleInputChange("outputTokens", e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Idempotency Key
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.idempotencyKey}
            placeholder='usage-123-456'
            onChange={(e) =>
              handleInputChange("idempotencyKey", e.target.value)
            }
          />
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
