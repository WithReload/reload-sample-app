import { DEFAULTS, OAUTH_PERMISSIONS } from "@/lib/constants";
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
    usageType: DEFAULTS.USAGE_TYPE,
    description: DEFAULTS.DESCRIPTION,
    shortDescription: DEFAULTS.SHORT_DESCRIPTION,
    costBeforeTax: "",
    taxRate: "",
    taxAmount: "",
    totalCost: "",
    llmModel: DEFAULTS.LLM_MODEL,
    llmProvider: DEFAULTS.LLM_PROVIDER,
    inputTokens: "",
    outputTokens: "",
    chargeUser: false,
    idempotencyKey: "",
    internalTokensOrCredits: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      aiAgentId: formData.aiAgentId,
      usageType: formData.usageType,
      description: formData.description,
      shortDescription: formData.shortDescription || "",
      totalCost: parseFloat(formData.totalCost),
    };

    // Add tax fields if provided
    if (formData.costBeforeTax)
      payload.costBeforeTax = parseFloat(formData.costBeforeTax);
    if (formData.taxRate) payload.taxRate = parseFloat(formData.taxRate);
    if (formData.taxAmount) payload.taxAmount = parseFloat(formData.taxAmount);

    // Add optional fields if provided
    if (formData.llmModel) payload.llmModel = formData.llmModel;
    if (formData.llmProvider) payload.llmProvider = formData.llmProvider;
    if (formData.inputTokens)
      payload.inputTokens = parseInt(formData.inputTokens);
    if (formData.outputTokens)
      payload.outputTokens = parseInt(formData.outputTokens);
    if (formData.chargeUser) payload.chargeUser = formData.chargeUser;
    if (formData.idempotencyKey)
      payload.idempotencyKey = formData.idempotencyKey;

    // Add AI Agent internal token/credit field if provided
    if (formData.internalTokensOrCredits)
      payload.internalTokensOrCredits = parseFloat(
        formData.internalTokensOrCredits
      );

    onMakeApiCall({
      endpoint: "/usage",
      method: "POST",
      body: payload,
    });
  };

  const hasPaymentPermission = authData?.permissions?.includes(
    OAUTH_PERMISSIONS.PAYMENT
  );

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
                    Deduct the specified amount from user&apos;s billing account
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
            Usage Type
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.usageType}
            placeholder='e.g., API Call, Token Usage, New Session, Feature Usage'
            onChange={(e) => handleInputChange("usageType", e.target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Description <span className='text-red-500 ml-1'>*</span>
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.description}
            placeholder='API call to process user data'
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
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
            Total Cost (USD) <span className='text-red-500 ml-1'>*</span>
          </label>
          <input
            type='number'
            className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
            value={formData.totalCost}
            placeholder='5.50'
            onChange={(e) => handleInputChange("totalCost", e.target.value)}
            required
            min='0'
            step='0.01'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Required field. Use 0 for free usage.
          </p>
        </div>

        {/* Tax Information Section */}
        <div className='border-t border-gray-200 pt-4'>
          <h4 className='text-sm font-medium text-gray-900 mb-3'>
            Tax Information (Optional)
          </h4>
          <p className='text-xs text-gray-500 mb-4'>
            Provide tax breakdown for detailed billing records
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Cost Before Tax (USD)
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
                value={formData.costBeforeTax}
                placeholder='5.00'
                onChange={(e) =>
                  handleInputChange("costBeforeTax", e.target.value)
                }
                min='0'
                step='0.01'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Cost before any taxes
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tax Rate (%)
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
                value={formData.taxRate}
                placeholder='8'
                onChange={(e) => handleInputChange("taxRate", e.target.value)}
                min='0'
                max='100'
                step='0.01'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Tax rate as percentage (e.g., 8 for 8%)
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tax Amount (USD)
              </label>
              <input
                type='number'
                className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
                value={formData.taxAmount}
                placeholder='0.40'
                onChange={(e) => handleInputChange("taxAmount", e.target.value)}
                min='0'
                step='0.01'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Calculated tax amount
              </p>
            </div>
          </div>

          <div className='mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md'>
            <p className='text-xs text-blue-800'>
              <strong>Note:</strong> If you provide tax fields, ensure totalCost
              = costBeforeTax + taxAmount. If you don't provide tax fields,
              totalCost will be used as the final amount.
            </p>
          </div>
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

        {/* AI Agent Internal Token/Credit System */}
        <div className='border-t border-gray-200 pt-4'>
          <h4 className='text-sm font-medium text-gray-900 mb-3'>
            AI Agent Internal System (Optional)
          </h4>
          <p className='text-xs text-gray-500 mb-4'>
            Track your internal token/credit consumption alongside USD costs
          </p>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Internal Tokens or Credits Used
            </label>
            <input
              type='number'
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900'
              value={formData.internalTokensOrCredits}
              placeholder='1000'
              onChange={(e) =>
                handleInputChange("internalTokensOrCredits", e.target.value)
              }
            />
            <p className='text-xs text-gray-500 mt-1'>
              Number of tokens or credits consumed from your internal system
            </p>
          </div>
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
