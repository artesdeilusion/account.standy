export interface SipayCredentials {
    merchantKey: string;
    appKey: string;
    appSecret: string;
    merchantId: string;
  }
  
  export interface PaymentRequest {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    amount: string;
    currency?: string;
    installment?: number;
    invoiceId?: string;
    name?: string;
  }
  
  export interface PaymentResponse {
    status: string;
    message: string;
    orderNo?: string;
    transactionId?: string;
  }