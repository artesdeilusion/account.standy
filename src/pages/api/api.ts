import { auth, db } from '@/firebase'; // Ensure the correct path
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

// Fetch subscription details
export const fetchSubscriptionDetails = async (uid: string) => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data().subscription : null;
    } catch (error) {
        console.error('Error fetching subscription:', error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (uid: string, newProfileData: any) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, newProfileData);
        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

// Update payment card
export const updatePaymentCard = async (uid: string, newPaymentData: any) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { paymentCard: newPaymentData });
        return { success: true };
    } catch (error) {
        console.error('Error updating payment info:', error);
        throw error;
    }
};

// Fetch payment history
export const fetchPaymentHistory = async (uid: string) => {
    try {
        const paymentRef = collection(db, 'users', uid, 'payments');
        const paymentSnap = await getDocs(paymentRef);
        return paymentSnap.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching payment history:', error);
        throw error;
    }
};

// Change password
export const changePassword = async (uid: string, newPassword: string) => {
    try {
        if (auth.currentUser) {
            await updatePassword(auth.currentUser, newPassword);
            return { success: true };
        }
        throw new Error('User not authenticated');
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

// Purchase subscription
export const purchaseSubscription = async (uid: string, plan: string) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { subscription: plan });
        return { success: true };
    } catch (error) {
        console.error('Error purchasing subscription:', error);
        throw error;
    }
};

// Delete user data
export const deleteUserData = async (uid: string) => {
    try {
        const userRef = doc(db, 'users', uid);
        await deleteDoc(userRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting user data:', error);
        throw error;
    }
};
