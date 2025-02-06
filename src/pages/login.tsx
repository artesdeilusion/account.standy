import * as React from 'react';
import { useState } from 'react';
import "@/app/globals.css";
import { auth } from '../firebase'; // Ensure this path is correct
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {
  Box,
  Button,
  FormControl,
  Link,
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

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateInputs()) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect on success
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message); // Show Firebase auth errors
      }
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
                  <Typography 
                    color="error" 
                    variant="body2" 
                    sx={{ textAlign: 'center', mb: 2 }}
                  >
                    {errorMessage}
                  </Typography>
                )}

                <StyledButton 
                  type="submit" 
                  variant="contained" 
                  disabled={!email || !password}
                  sx={{  alignSelf: 'center', width: 'auto' }}
                >
                  Oturum Aç
                </StyledButton>

               
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
