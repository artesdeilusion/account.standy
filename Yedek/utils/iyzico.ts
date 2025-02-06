import Iyzipay from 'iyzipay';

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY!,
  secretKey: process.env.IYZIPAY_SECRET_KEY!,
  uri: 'https://sandbox-api.iyzipay.com'  // Make sure this is correct for sandbox
});

// Add type checking for required environment variables
if (!process.env.IYZIPAY_API_KEY || !process.env.IYZIPAY_SECRET_KEY) {
  throw new Error('Missing Iyzipay API credentials');
}

export interface PaymentFormData {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  price: number;
  currency?: string;
  installment?: number;
} 