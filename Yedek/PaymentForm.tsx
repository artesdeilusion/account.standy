'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import "@/app/globals.css";

interface CartProduct {
  id: string;
  attributes: {
    products: {
      data: [{
        attributes: {
          title: string;
          price: number;
        }
      }]
    };
    quantity: number;
  };
}

interface PaymentFormProps {
  cartProduct: CartProduct[];
  totalPrice: number;
  currentUserId: string;
  userDetails?: {
    name?: string;
    surname?: string;
    phone?: string;
    email?: string;
    city?: string;
    country?: string;
    address?: string;
    zipCode?: string;
  };
}

interface PaymentResponse {
  status?: string;
  error?: string;
  data?: any;
}

export default function PaymentForm({ 
  cartProduct, 
  totalPrice, 
  currentUserId,
  userDetails = {} 
}: PaymentFormProps) {
  const router = useRouter();
  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expireMonth, setExpireMonth] = useState('');
  const [expireYear, setExpireYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [response, setResponse] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    name = '',
    surname = '',
    phone = '',
    email = '',
    city = '',
    country = '',
    address = '',
    zipCode = ''
  } = userDetails;

  const handlePayment = async () => {
    setLoading(true);
    setResponse(null);

    // Validate the card details first
    if (!cardNumber || !expireMonth || !expireYear || !cvc || !holderName) {
      setResponse({
        status: 'error',
        error: 'Lütfen tüm kart bilgilerini doldurun'
      });
      setLoading(false);
      return;
    }

    const basketItems = cartProduct?.map(item => ({
      id: item.id,
      name: item.attributes.products.data[0].attributes.title,
      category1: 'Category',
      itemType: 'PHYSICAL',
      price: (item.attributes.products.data[0].attributes.price * item.attributes.quantity).toString()
    })) || [];

    const paymentData = {
      cardHolderName: holderName,
      cardNumber,
      expireMonth,
      expireYear,
      cvc,
      price: totalPrice,
      currency: 'TRY',
      installment: 1,
      buyer: {
        id: currentUserId,
        name,
        surname,
        gsmNumber: phone,
        email,
        identityNumber: '74300864791',
        registrationAddress: address,
        ip: '85.34.78.112',  // Replace with actual user's IP if possible
        city,
        country,
        zipCode
      },
      shippingAddress: {
        contactName: `${name} ${surname}`,
        city,
        country,
        address,
        zipCode
      },
      billingAddress: {
        contactName: `${name} ${surname}`,
        city,
        country,
        address,
        zipCode
      },
      basketItems
    };

    try {
      // Make API call to process payment
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      // Ensure the response is in the expected format
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Sunucu hatası: Geçersiz yanıt formatı');
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Ödeme işlemi başarısız oldu');
      }

      setResponse(data);
      if (data.status === 'success') {
        router.push('/success');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse({
        status: 'error',
        error: error instanceof Error ? error.message : 'Ödeme işlemi başarısız oldu'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Ödeme Formu
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="py-2">
              <input
                id="card-holder-name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Kart Sahibi"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
              />
            </div>
            <div className="py-2">
              <input
                id="card-number"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Kart Numarası"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="py-2">
              <input
                id="expire-month"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ay"
                value={expireMonth}
                onChange={(e) => setExpireMonth(e.target.value)}
              />
            </div>
            <div className="py-2">
              <input
                id="expire-year"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Yıl"
                value={expireYear}
                onChange={(e) => setExpireYear(e.target.value)}
              />
            </div>
            <div className="py-2">
              <input
                id="cvc"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'İşleniyor...' : 'Ödeme Yap'}
            </button>
          </div>
        </form>
      </div>
      
      {response && (
        <div className="max-w-md w-full mt-8 bg-white p-6 text-black rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Sonuç:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
