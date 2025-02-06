//import PaymentForm from '@/components/PaymentForm';
//  
//export default function PaymentPage() {
//  const { user } = useAuth();
//
//  return (
//    <div className="container mx-auto py-8">
//      <h1 className="text-2xl font-bold mb-6 text-center">Payment</h1>
//      <PaymentForm 
//        cartProduct={[{
//          id: 'premium',
//          attributes: {
//            products: {
//              data: [{
//                attributes: {
//                  title: 'Premium Subscription',
//                  price: 29.99
//                }
//              }]
//            },
//            quantity: 1
//          }
//        }]}
//        totalPrice={29.99}
//        currentUserId={user?.uid || ''}
//      />
//    </div>
//  );
//} 