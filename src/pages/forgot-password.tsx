import { useState } from 'react';
import { auth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Avatar,
    Stack,
    Card,
    TextField,
    Button,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        primary: { main: '#D81B60' },
        secondary: { main: '#C2185B' },
    },
});

const StyledCard = styled(Card)({
    backgroundColor: '#313031',
    color: '#fff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        '& input': { color: '#fff' },
        '& fieldset': { borderColor: '#1e1e1e' }
    },
    '& .MuiInputLabel-root': { color: '#fff' },
    '& .MuiFormHelperText-root': { color: '#fff' }
});

const StyledButton = styled(Button)({
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 'bold',
    backgroundColor: '#D81B60',
    '&:hover': {
        backgroundColor: '#C2185B'
    }
});

const PageContainer = styled(Stack)(({ theme }) => ({
    height: '100vh',
    padding: theme.spacing(2),
    backgroundColor: '#121212',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    }
}));

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage('Parola sıfırlama bağlantısı e-posta adresinize gönderildi.');
            setEmail('');
        } catch (error: any) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.');
                    break;
                case 'auth/invalid-email':
                    setError('Geçersiz e-posta adresi.');
                    break;
                default:
                    setError('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="bg-[#121212]">
                <title>Standy | Parola Sıfırlama</title>
                <PageContainer direction="column" justifyContent="center">
                    <Box maxWidth="md" sx={{ width: '100%', maxWidth: 450 }}>
                        <StyledCard variant="outlined">
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 1 }}>
                                <Avatar sx={{ bgcolor: '#D81B60', width: 45, height: 45 }}>
                                    <Image src="/standylogo.png" alt="logo" width={45} height={45} />
                                </Avatar>
                            </Box>
                            <Typography variant="h4" component="h1" align="center" gutterBottom>
                                Parola Sıfırlama
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {successMessage && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {successMessage}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <StyledTextField
                                    fullWidth
                                    label="E-posta"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    margin="normal"
                                    required
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <StyledButton
                                        type="submit"
                                        variant="contained"
                                        disabled={!email || isLoading}
                                        sx={{ width: 'auto' }}
                                    >
                                        {isLoading ? <CircularProgress size={24} /> : 'Sıfırlama Bağlantısı Gönder'}
                                    </StyledButton>
                                </Box>
                            </form>

                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                <Box
                                    component={Link}
                                    href="/login"
                                    sx={{
                                        color: '#FFB3C9',
                                        textDecoration: 'none',
                                        transition: 'text-decoration 0.2s ease',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Giriş sayfasına dön
                                </Box>
                            </Box>
                        </StyledCard>
                    </Box>
                </PageContainer>
            </div>
        </ThemeProvider>
    );
} 