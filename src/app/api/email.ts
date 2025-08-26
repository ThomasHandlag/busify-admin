import apiClient from ".";

export interface CustomerSupportEmailRequestDTO {
    /** Recipient email — required, must be a valid email */
    toEmail: string;
    /** User name — required, max 100 characters */
    userName: string;
    /** Email subject — required, max 200 characters */
    subject: string;
    /** Message content — required, max 1000 characters */
    message: string;
    /** Case number — optional, max 50 characters */
    caseNumber?: string;
    /** Customer support representative name — required, max 100 characters */
    csRepName: string;
}

// post request
export const sendCustomerSupportEmail = async (emailData: CustomerSupportEmailRequestDTO) => {
    const response = await apiClient.post('/api/email/customer-support', emailData);
    return response.data;
};