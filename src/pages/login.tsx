import * as React from 'react';
import { useState, useEffect } from 'react';
import "@/app/globals.css";
import { auth } from '../firebase'; // Ensure this path is correct
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Link from 'next/link';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  Stack,
  Avatar,
  Card ,
} from '@mui/material';
import { styled } from '@mui/material/styles';
const StyledCard = styled(Card)({
  backgroundColor: '#313031',
  color: '#fff',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
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

const StyledFormControl = styled(FormControl)({
  marginBottom: '8px',
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

// Create a custom theme with your desired primary color.
const theme = createTheme({
  palette: {
    primary: {
      main: '#D81B60', // Set your desired primary color here
    },
    secondary: {
      main: '#C2185B', // Optionally, set a custom secondary color
    },
  },
});

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, redirect to home page
        router.push('/');
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  const validateInputs = async () => {
    setEmailError(false);
    setPasswordError(false);
    setErrorMessage('');

    const emailValue = email.trim();
    const passwordValue = password.trim();

    // Email validation
    if (!emailValue) {
      setEmailError(true);
      setErrorMessage('E-posta adresi boş olamaz.');
      return false;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailValue)) {
      setEmailError(true);
      setErrorMessage('Geçerli bir e-posta adresi giriniz.');
      return false;
    }

    // Check if business user
    const db = getFirestore();
    const businessQuery = query(
      collection(db, 'businesses'),
      where('email', '==', emailValue)
    );
    const businessSnapshot = await getDocs(businessQuery);

    if (!businessSnapshot.empty) {
      setEmailError(true);
      setErrorMessage('Bu hesap işletme kullanıcıları içindir.');
      return false;
    }

    // Password validation
    if (!passwordValue) {
      setPasswordError(true);
      setErrorMessage('Parola boş olamaz.');
      return false;
    }

    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!await validateInputs()) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect on success
    } catch (error: any) {
      // Convert Firebase error messages to Turkish
      let turkishError = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          turkishError = 'Bu e-posta adresi ile bir hesap bulunmadı.';
          break;
        case 'auth/wrong-password':
          turkishError = 'Hatalı parola.';
          break;
        case 'auth/invalid-email':
          turkishError = 'Geçersiz e-posta adresi.';
          break;
        case 'auth/too-many-requests':
          turkishError = 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.';
          break;
      }
      
      setErrorMessage(turkishError);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="bg-[#121212]">
        <title>Standy | Oturum Aç</title>
        <PageContainer direction="column" justifyContent="center">
          <Box maxWidth="md" sx={{ width: '100%', maxWidth: 450 }}>
            <StyledCard variant="outlined">
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2,mb:1}}>
                <Avatar sx={{ bgcolor: '#D81B60', width: 45, height: 45 }}>
                  <Image src="/standylogo.png" alt="logo" width={45} height={45} />
                </Avatar>
              </Box>
              <Typography component="h1" variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
                Standy&apos;de oturum aç
              </Typography>

              <Box component="form" onSubmit={handleLogin} noValidate sx={{ display: 'flex', flexDirection: 'column' }}>
                <StyledFormControl>
                  <StyledTextField
                    color="secondary"
                    error={emailError}
                    helperText={emailError ? 'Geçerli bir e-posta adresi girin' : ''}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta adresi"
                    autoComplete="email"
                    required
                    fullWidth
                    size="medium"
                    label="E-posta adresi"
                    margin="dense"
                  />
                </StyledFormControl>

                <StyledFormControl>
                  <StyledTextField
                    error={passwordError}
                    helperText={passwordError ? 'Parola en az 6 karakter olmalıdır' : ''}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parola"
                    autoComplete="current-password"
                    required
                    fullWidth
                    size="medium"
                    label="Parola"
                    margin="dense"
                  />
                </StyledFormControl>

                {errorMessage && (
                  <StyledCard 
                    sx={{ 
                      backgroundColor: '#ff1744',
                      color: 'white',
                      mb: 2,
                      p: 1.5,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="body1">
                      {errorMessage}
                    </Typography>
                  </StyledCard>
                )}

                <StyledButton 
                  type="submit" 
                  variant="contained" 
                  disabled={!email || !password}
                  sx={{  alignSelf: 'center', width: 'auto' }}
                >
                  Oturum Aç
                </StyledButton>

                <Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
                    <Box
                        component={Link}
                        href="/forgot-password" 
                        sx={{ 
                            color: '#FFB3C9', 
                            textDecoration: 'none',
                            transition: 'text-decoration 0.2s ease',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Parolanı mı unuttun?
                    </Box>
                </Box>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <span className='text-white'>
                    Hesabın yok mu?{' '}
                    <Box
                      component={Link}
                      href="/register" 
                      sx={{ 
                        color: '#FFB3C9', 
                        textDecoration: 'none',
                        transition: 'text-decoration 0.2s ease',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Kayıt ol
                    </Box>
                  </span>
                </Box>
              </Box>
            </StyledCard>
          </Box>
      
          <footer>
          <p className='text-center text-sm text-gray-500'>
            &copy; {new Date().getFullYear()} Artes de ilusion. Tüm hakları saklıdır.
          </p>
        </footer>  </PageContainer>
      
      </div>
    </ThemeProvider>
  );
}
