import "@/app/globals.css";
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase'; // Adjust the import path as needed
import { useRouter } from 'next/router'; // Assuming you're using Next.js
import { User } from 'firebase/auth'; // Firebase User type import
import {
    fetchSubscriptionDetails,
     fetchPaymentHistory,
     deleteUserData
} from './api/api'; // Adjust path as needed
import {  DeleteForever, HelpOutline, LockOutlined,  EditOutlined, } from "@mui/icons-material";
import Navbar from "@/components/navbar";
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Footer from "@/components/footer";
/* eslint-disable  @typescript-eslint/no-explicit-any */

const StyledCard = styled(Card)({
  backgroundColor: '#313031',
  color: '#fff',
  borderRadius: '12px',
  marginBottom: '16px',
});

const PremiumButton = styled(Button)({
   backgroundColor: '#fff',
  elevation: 0,
  color: '#fff',
  textTransform: 'none',
  fontWeight: 'bold',
  borderRadius: '20px',
});

const SectionTitle = styled(Typography)({
  color: '#fff',
  fontSize: '1rem',
  fontWeight: 'bold',
  padding: '16px',
  paddingBottom: '8px',
});

const Home: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
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
         } catch (error) {
            console.error("Failed to load subscription details:", error);
            setError("Unable to load subscription details.");
        }
    };

    const loadPaymentHistory = async (uid: string) => {
        try {
            const history = await fetchPaymentHistory(uid);
         } catch (error) {
            console.error("Failed to load payment history:", error);
            setError("Unable to load payment history.");
        }
    };

 
    const navigateToPage = (path: string) => {
        router.push(path);
    };

    if (loading) return <div className="h-screen flex items-center justify-center">
        <CircularProgress sx={{ color: 'white' }} />
    </div>;

    return (
        <div className="bg-[#121212]">
            <title>Standy</title>
            <nav>
                <Navbar />
            </nav>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {user ? (
                <Box  maxWidth="md" margin="auto" sx={{ paddingTop: '20', padding: '16px' }}>
                    {/* First Card - User Info */}
                    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                        <StyledCard sx={{ flex: 3 }}>
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Merhaba, {user.displayName}!
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        {user.email}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </StyledCard>
 
                    </Box>
                    <StyledCard>
                        <SectionTitle>Hesap</SectionTitle>
                        <List>
                            
                            <ListItem disablePadding component="li" onClick={() => navigateToPage('/account/profile')}>
                            <ListItemButton>
                                <ListItemIcon><EditOutlined sx={{ color: '#fff' }} /></ListItemIcon>
                                <ListItemText primary="Profili düzenle" sx={{ color: '#fff' }} />
                                 </ListItemButton>
                            </ListItem>
                          
                        </List>
                    </StyledCard>
                     <StyledCard>
                        <SectionTitle>Güvenlik ve gizlilik</SectionTitle>
                        <List>
                            <ListItem component="li" disablePadding   onClick={() => navigateToPage('/security/password')}  >
                            <ListItemButton>

                                <ListItemIcon><LockOutlined sx={{ color: '#fff' }} /></ListItemIcon>
                                <ListItemText primary="Parolayı değiştir" sx={{ color: '#fff' }} />
                                </ListItemButton>

                            </ListItem>
                        
                        </List>
                    </StyledCard>
                    <StyledCard>
                        <SectionTitle>Yardım</SectionTitle>
                        <List>
                            <ListItem 
                                component="li" 
                                disablePadding 
                                onClick={() => window.open('https://help.standyroutes.com/', '_blank')}
                            >
                                <ListItemButton>
                                    <ListItemIcon><HelpOutline sx={{ color: '#fff' }} /></ListItemIcon>
                                    <ListItemText primary="Standy Destek" sx={{ color: '#fff' }} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </StyledCard>
                </Box>
            ) : (
                <div className="h-screen flex items-center justify-center">

                </div>
            )}
                    <Footer />

        </div>
    );
};

export default Home;