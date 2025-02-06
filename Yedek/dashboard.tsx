import "@/app/globals.css";
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Adjust the import path as needed
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router'; // Assuming you're using Next.js
import { User } from 'firebase/auth'; // Firebase User type import
import {
    fetchSubscriptionDetails,
    updateUserProfile,
    updatePaymentCard,
    fetchPaymentHistory,
    changePassword,
    purchaseSubscription,
    deleteUserData
} from '../pages/api/api'; // Adjust path as needed
 import { CreditCard, Payment, Person, Lock, Refresh, Settings, AccountCircle } from "@mui/icons-material";
import Navbar from "@/components/navbar";
 import { Box, Card, CardContent,ListItemButton,ListSubheader, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
 import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)({
  backgroundColor: '#121212',
  color: '#fff',
  borderRadius: '12px',
  marginBottom: '16px',
});

const PremiumButton = styled(Button)({
  background: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 'bold',
  borderRadius: '12px',
});

const SectionTitle = styled(Typography)({
  color: '#fff',
  fontSize: '1rem',
  fontWeight: 'bold',
  padding: '16px',
});


function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [showPayment, setShowPayment] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
            try {
                await purchaseSubscription(user.uid, plan);
                alert("Subscription purchased successfully!");
                loadSubscriptionDetails(user.uid);
            } catch (error) {
                console.error("Failed to purchase subscription:", error);
                setError("Unable to purchase subscription.");
            }
        }
    };

    const handleDeleteAccount = async () => {
        if (user) {
            try {
                await deleteUserData(user.uid);
                await user.delete();
                alert("Account deleted successfully!");
                router.push('/');
            } catch (error) {
                console.error("Failed to delete account:", error);
                setError("Unable to delete account. Please try again.");
            }
        }
    };

    if (loading) return <p>Loading user information...</p>;

    return (
        <div> 
 <nav>
        <Navbar></Navbar>
      </nav>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ? (

               <Box sx={{ backgroundColor: '#000', minHeight: '100vh', padding: '16px' }}>
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Planın
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            Standy Free
          </Typography>
          <Button variant="outlined" sx={{ marginTop: '8px', color: '#fff', borderColor: '#fff' }}>
            Planları keşfet
          </Button>
        </CardContent>
      </StyledCard>

        
      <StyledCard>
        <SectionTitle>Hesap</SectionTitle>
        <List>
          <ListItem   component="li">
            <ListItemIcon><AccountCircle sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Üyeliğini yönet" sx={{ color: '#fff' }} />
          </ListItem>
          <ListItem component="li">
            <ListItemIcon><Settings sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Profili düzenle" sx={{ color: '#fff' }} />
          </ListItem>
          <ListItem component="li">
            <ListItemIcon><Refresh sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Çalma listelerini geri getir" sx={{ color: '#fff' }} />
          </ListItem>
        </List>
      </StyledCard>

      <StyledCard>
        <SectionTitle>Ödeme</SectionTitle>
        <List>
          <ListItem component="li">
            <ListItemIcon><Payment sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Sipariş geçmişi" sx={{ color: '#fff' }} />
          </ListItem>
          <ListItem component="li">
            <ListItemIcon><CreditCard sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Kayıtlı ödeme kartları" sx={{ color: '#fff' }} />
          </ListItem>
        </List>
      </StyledCard>

      <StyledCard>
        <SectionTitle>Güvenlik ve gizlilik</SectionTitle>
 
        <List>
          <ListItem component="li">
            <ListItemIcon><Lock sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Parolayı değiştir" sx={{ color: '#fff' }} />
          </ListItem>
          <ListItem onClick={handlePaymentUpdate} style={{ color: 'red' }} component="li">
            <ListItemIcon><Lock sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Delete My Account" sx={{ color: '#fff' }} />
          </ListItem>
        </List>
      </StyledCard>
    </Box>  
               
            ) : (
                <p>Loading user information...</p>
            )}

 
 </div>
    );
};

export default Dashboard;