import { NextResponse } from 'next/server';
import Iyzipay, { PaymentRequestData } from 'iyzipay';

export const iyzipay = new Iyzipay({
    apiKey: process.env.IYZIPAY_API_KEY!,
    secretKey: process.env.IYZIPAY_SECRET_KEY!,
    uri: 'https://sandbox-api.iyzipay.com'  // Make sure this is correct for sandbox
  });
  
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.cardNumber || !body.expireMonth || !body.expireYear || !body.cvc) {
      return NextResponse.json(
        { error: 'Kart bilgileri eksik' },
        { status: 400 }
      );
    }

    const {
      cardHolderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      price,
      currency = 'TRY',
      installment = 1,
    } = body;

    const paymentRequest: PaymentRequestData = {
      locale: 'TR',
      conversationId: new Date().getTime().toString(),
      price: Number(price).toFixed(2),
      paidPrice: Number(price).toFixed(2),
      currency: 'TRY',
      installments: 1,
      basketId: `B${new Date().getTime()}`,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName,
        cardNumber: cardNumber.replace(/\s/g, ''),
        expireMonth: expireMonth.padStart(2, '0'),
        expireYear,
        cvc,
        cardAlias: 'Card Alias',
        registerCard: 0
      },
      buyer: {
        id: 'BY789',
        name: 'John',
        surname: 'Doe',
        gsmNumber: '+905350000000',
        email: 'email@email.com',
        identityNumber: '74300864791',
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: 'Address',
        ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: 'John Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Address',
        zipCode: '34732'
      },
      billingAddress: {
        contactName: 'John Doe',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Address',
        zipCode: '34732'
      },
      basketItems: [{
        id: 'BI101',
        name: 'Standy Premium',
        category1: 'Subscription',
        itemType: 'VIRTUAL',
        price: Number(price).toFixed(2)
      }]
    };

    return new Promise((resolve) => {
      iyzipay.payment.create(paymentRequest, (err: any, result: Iyzipay.PaymentResult) => {
        if (err) {
          console.error('Iyzipay Error:', err);
          return resolve(NextResponse.json({ 
            status: 'error',
            error: err.message || 'Ödeme işlemi başarısız oldu',
            details: err  // Include full error details in development
          }, { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
        
        console.log('Iyzipay Result:', result);  // Log the full result
        
        if (result.status !== 'success') {
          return resolve(NextResponse.json({
            status: 'error',
            error: result.status || 'Ödeme işlemi reddedildi',
            details: result  // Include full result in development
          }, { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
        
        return resolve(NextResponse.json({ 
          status: 'success', 
          data: result 
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }));
      });
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 