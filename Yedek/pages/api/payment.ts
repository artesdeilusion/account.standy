// pages/api/payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const SIPAY_CONFIG = {
  merchantKey: '$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO',
  appKey: '6d4a7e9374a76c15260fcc75e315b0b9',
  appSecret: 'b46a67571aa1e7ef5641dc3fa6f1712a',
  merchantId: '18309',
  testUrl: 'https://provisioning.sipay.com.tr/ccpayment'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cardNumber, expiryDate, cvv, amount, currency, name, timestamp, userLogin } = req.body;

    // Create the payment data object
    const paymentData = {
      merchant_key: SIPAY_CONFIG.merchantKey,
      app_key: SIPAY_CONFIG.appKey,
      app_secret: SIPAY_CONFIG.appSecret,
      merchant_id: SIPAY_CONFIG.merchantId,
      invoice_id: `INV${Date.now()}`,
      total: Math.round(parseFloat(amount) * 100).toString(),
      currency_code: currency,
      cc_holder_name: name,
      cc_no: cardNumber.replace(/\s/g, ''),
      expiry_month: expiryDate.split('/')[0],
      expiry_year: `20${expiryDate.split('/')[1]}`,
      cvv: cvv,
      installment: '1',
      payment_method: '1',
      transaction_type: 'Auth',
      timestamp: '2025-01-26 09:38:33', // Latest timestamp
      user_login: 'abdullahcat',        // Current user login
      return_url: `${req.headers.origin}/payment-result`,
      cancel_url: `${req.headers.origin}/payment-cancelled`
    };

    console.log('Sending payment request:', {
      ...paymentData,
      cc_no: '****' + paymentData.cc_no.slice(-4),
      cvv: '***'
    });

    // Create FormData for the request
    const formData = new FormData();
    Object.entries(paymentData).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    const response = await axios.post(SIPAY_CONFIG.testUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Payment response:', response.data);
    return res.status(200).json(response.data);

  } catch (error: any) {
    console.error('Payment error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });

    // Send a more detailed error response
    return res.status(error.response?.status || 500).json({
      error: true,
      message: error.response?.data || error.message,
      details: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      }
    });
  }
}