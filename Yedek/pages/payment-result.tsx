// pages/payment-result.tsx
import { useRouter } from 'next/router';
import Link from 'next/link';

const PaymentResult = () => {
  const router = useRouter();
  const {
    sipay_status,
    status_description,
    error,
    amount,
    transaction_type
  } = router.query;

  const isSuccess = sipay_status === '1';

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {isSuccess ? 'Payment Successful' : 'Payment Failed'}
      </h1>

      <div className="mb-4">
        <div className={`p-4 rounded-lg ${
          isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status_description || error || 'An error occurred'}
        </div>
      </div>

      {amount && (
        <p className="mb-2">
          Amount: {(parseInt(amount as string) / 100).toFixed(2)} TRY
        </p>
      )}

      {transaction_type && (
        <p className="mb-4">
          Transaction Type: {transaction_type}
        </p>
      )}

      <Link href="/" className="text-blue-600 hover:text-blue-800">
        Return to Payment Page
      </Link>
    </div>
  );
};

export default PaymentResult;