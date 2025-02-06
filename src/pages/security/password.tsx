'use client';
import { useState } from 'react';
import { auth } from '@/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import "@/app/globals.css";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Container,
    Card
} from '@mui/material';
import Navbar from '@/components/navbar';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
/* eslint-disable  @typescript-eslint/no-explicit-any */

const StyledCard = styled(Card)({
  backgroundColor: '#313031',
  color: '#fff',
  borderRadius: '12px',
  marginBottom: '16px',
  padding: '16px'
});

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Parolalar eşleşmiyor');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const user = auth.currentUser;
            if (user && user.email) {
                // First reauthenticate
                const credential = EmailAuthProvider.credential(
                    user.email,
                    currentPassword
                );
                await reauthenticateWithCredential(user, credential);
                
                // Then change password
                await updatePassword(user, newPassword);
                setSuccess(true);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => router.push('/'), 1500);
            }
        } catch (error: any) {
            console.error("Error changing password:", error);
            if (error.code === 'auth/wrong-password') {
                setError('Mevcut parola yanlış');
            } else {
                setError('Parola değiştirme başarısız oldu. Lütfen tekrar deneyin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#121212]">
            <title>Standy | Parola Değiştir</title>

            <nav>
                <Navbar />
            </nav>
            <Container maxWidth="md" sx={{ paddingTop: '20', padding: '16px', bgcolor: '#121212' }}>  
                <Box sx={{ minHeight: '100vh', color: '#fff' }}>
                    <StyledCard>  
                        <Typography variant="h5" gutterBottom>
                            Parola Değiştir
                        </Typography>
                        
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 2 }}>Parola başarıyla değiştirildi!</Alert>}

                        <form onSubmit={handlePasswordChange}>
                            <TextField
                                type="password"
                                label="Mevcut Parola"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ 
                                    backgroundColor: '#1e1e1e',
                                    input: { color: '#fff' },
                                    label: { color: '#fff' },
                                    borderRadius: '8px'
                                }}
                            />
                            <TextField
                                type="password"
                                label="Yeni Parola"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                helperText="En az 8 karakter olmalıdır"
                                FormHelperTextProps={{ sx: { color: '#fff' } }}
                                sx={{ 
                                    backgroundColor: '#1e1e1e',
                                    input: { color: '#fff' },
                                    label: { color: '#fff' },
                                    borderRadius: '8px'
                                }}
                            />
                            <TextField
                                type="password"
                                label="Parolayı Onayla"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ 
                                    backgroundColor: '#1e1e1e',
                                    input: { color: '#fff' },
                                    label: { color: '#fff' },
                                    borderRadius: '8px'
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading || newPassword.length < 8}
                                sx={{ mt: 2, borderRadius: '20px', backgroundColor: '#D81B60', color: '#fff', textTransform: 'none', fontWeight: 'bold' }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Parolayı Değiştir'}
                            </Button>
                        </form>
                    </StyledCard>
                </Box>
            </Container>
        </div>
    );
};

export default ChangePassword; 