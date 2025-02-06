import * as React from 'react';
import { useState } from 'react';
import "@/app/globals.css";
import { auth } from '../firebase'; // Ensure this path is correct
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import Image from 'next/image';

import {
  Box,
  Button,
  CssBaseline,
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
    <div className="bg-[#121212]">
      <title>Standy | Oturum Aç</title>
      <CssBaseline enableColorScheme />
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
                fullWidth 
                variant="contained" 
                disabled={!email || !password}
                sx={{ mb: 2 }}
              >
                Oturum Aç
              </StyledButton>

              <Link 
                href="#" 
                variant="body2" 
                sx={{ 
                  textAlign: 'center',
                  color: '#fff',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Parolanızı mı unuttunuz?
              </Link>
            </Box>
          </StyledCard>
        </Box>
      </PageContainer>
    </div>
  );
}
