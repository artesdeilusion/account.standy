import { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Firebase auth import
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { User } from 'firebase/auth'; // Firebase User type import
import { fetchSubscriptionDetails, updateUserProfile, updatePaymentCard, fetchPaymentHistory, changePassword, purchaseSubscription } from '../api/api'; // Adjust path as needed
import Payment from '../components/Payment';
 

const Dashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [showPayment, setShowPayment] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error handling
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            if (!user) {
                router.push('/login');
            } else {
                loadSubscriptionDetails(user.uid);
                loadPaymentHistory(user.uid);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const loadSubscriptionDetails = async (uid: string) => {
        try {
            const subscriptionData = await fetchSubscriptionDetails(uid);
            setSubscription(subscriptionData);
        } catch (error) {
            console.error("Failed to load subscription details:", error);
            setError("Unable to load subscription details.");
        }
    };

    const loadPaymentHistory = async (uid: string) => {
        try {
            const history = await fetchPaymentHistory(uid);
            setPaymentHistory(Array.isArray(history) ? history : []);
        } catch (error) {
            console.error("Failed to load payment history:", error);
            setError("Unable to load payment history.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error("Error logging out:", error);
            setError("Logout failed. Please try again.");
        }
    };

    const handleProfileUpdate = async (newProfileData: any) => {
        if (user) {
            try {
                await updateUserProfile(user.uid, newProfileData);
                alert("Profile updated successfully!");
            } catch (error) {
                console.error("Failed to update profile:", error);
                setError("Unable to update profile.");
            }
        }
    };

    const handlePaymentUpdate = async (newPaymentData: any) => {
        if (user) {
            try {
                await updatePaymentCard(user.uid, newPaymentData);
                alert("Payment information updated successfully!");
            } catch (error) {
                console.error("Failed to update payment information:", error);
                setError("Unable to update payment information.");
            }
        }
    };

    const handlePasswordChange = async (newPassword: string) => {
        if (user) {
            try {
                await changePassword(user.uid, newPassword);
                alert("Password changed successfully!");
            } catch (error) {
                console.error("Failed to change password:", error);
                setError("Unable to change password.");
            }
        }
    };

    const handlePurchaseSubscription = async (plan: string) => {
        if (user) {

        }
    };

    if (loading) return <p>Loading user information...</p>;

    return (
        <div>
            <h2>Dashboard</h2>
            <a href="/subscribe"></a>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ? (
                <div>
                    <p>Welcome, {user.displayName || user.email}!</p>
                    <button onClick={handleLogout}>Logout</button>
 
                    {showPayment ? (
                        <Payment
                            onPurchase={handlePurchaseSubscription}
                            onBack={() => setShowPayment(false)}
                        />
                    ) : (
                        <div>
                            <h3>Current Subscription</h3>
                            {subscription ? (
                                <div>
                                    <p>Plan: {subscription.plan}</p>
                                    <p>Status: {subscription.status}</p>
                                    <p>Next Payment Date: {subscription.nextPaymentDate}</p>
                                    <button onClick={() => setShowPayment(true)}>Purchase Subscription</button>
                                </div>
                            ) : (
                                <p>No active subscription found.</p>
                            )}

                            <h3>Edit Profile</h3>
                            <button onClick={() => handleProfileUpdate({ /* new profile data */ })}>
                                Update Profile
                            </button>

                            <h3>Payment History</h3>
                            {paymentHistory.length > 0 ? (
                                <ul>
                                    {paymentHistory.map((payment, index) => (
                                        <li key={index}>
                                            {payment.date}: {payment.amount} {payment.currency}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No payment history found.</p>
                            )}

                            <h3>Change Password</h3>
                            <button onClick={() => handlePasswordChange('newPassword')}>
                                Change Password
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default Dashboard;
