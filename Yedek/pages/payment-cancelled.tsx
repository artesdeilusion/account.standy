// pages/payment-cancelled.tsx
import Link from 'next/link';

const PaymentCancelled = () => {
  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      
      <div className="mb-4">
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          The payment process was cancelled.
        </div>
      </div>

      <Link href="/" className="text-blue-600 hover:text-blue-800">
        Return to Payment Page
      </Link>
    </div>
  );
};

export default PaymentCancelled;