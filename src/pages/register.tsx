import { useState, useEffect } from 'react';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import "@/app/globals.css";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Container,
    Card,
    Avatar,
    Stack,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';

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

const generateCustomUID = () => {
    const length = 8;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(Array(length))
        .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
        .join('');
};

const isUIDUnique = async (uid: string) => {
    const db = getFirestore();
    const querySnapshot = await getDocs(
        query(collection(db, 'users'), where('customUID', '==', uid))
    );
    return querySnapshot.empty;
};

const generateUniqueUID = async () => {
    let uid;
    let isUnique = false;
    do {
        uid = generateCustomUID();
        isUnique = await isUIDUnique(uid);
    } while (!isUnique);
    return uid;
};
const StyledButton = styled(Button)({
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: 'bold',
    backgroundColor: '#D81B60',
    '&:hover': {
      backgroundColor: '#C2185B'
    }
  });
  
const theme = createTheme({
  palette: {
    primary: {
      main: '#D81B60',
    },
    secondary: {
      main: '#C2185B',
    },
  },
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

const isValidEmail = (email: string) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
     const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [emailExists, setEmailExists] = useState(false);
    const [isEmailChecking, setIsEmailChecking] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                router.push('/');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const validateEmail = async (email: string) => {
        if (!email) {
            setIsEmailValid(false);
            setError('E-posta adresi boş olamaz');
            return false;
        }

        if (!isValidEmail(email)) {
            setIsEmailValid(false);
            setError('Geçerli bir e-posta adresi giriniz');
            return false;
        }

        setIsEmailChecking(true);
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            if (methods.length > 0) {
                setEmailExists(true);
                setIsEmailValid(false);
                setError('Bu e-posta adresi zaten kullanımda');
                return false;
            }
            
            setEmailExists(false);
            setIsEmailValid(true);
            setError(null);
            return true;
        } catch (error) {
            setIsEmailValid(false);
            setError('E-posta kontrolü sırasında bir hata oluştu');
            return false;
        } finally {
            setIsEmailChecking(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        

        if (password.length < 8) {
            setError('Parola en az 8 karakter olmalıdır');
            return;
        }

        if (name.length < 3) {
            setError('İsim en az 3 karakter olmalıdır');
            return;
        }

        if (!await validateEmail(email)) {
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                const customUID = await generateUniqueUID();
                await updateProfile(user, { displayName: name });

                const db = getFirestore();
                await setDoc(doc(db, 'users', user.uid), {
                    name,
                    email: user.email,
                    uid: user.uid,
                    customUID,
                    creator: false,
                    signDate: Timestamp.now(),
                    favorites: [],
                    region_codes: [],
                    standy_plus: false,
                    subscriber_until: null,
                    last_payment_date: null,
                    currentDiscount: null,
                    referralVisited: false,
                    discounts: [],
                    isNewUser: true,
                });

                await sendEmailVerification(user);
                router.push('/');
            }
        } catch (error: any) {
            let errorMessage = 'Kayıt olurken bir hata oluştu';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Bu e-posta adresi zaten kullanımda';
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="bg-[#121212]">
            <title>Standy | Kayıt Ol</title>
            <PageContainer direction="column" justifyContent="center">
              <Box maxWidth="md" sx={{ width: '100%', maxWidth: 450 }}>
                <StyledCard variant="outlined">
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2,mb:1}}>
                    <Avatar sx={{ bgcolor: '#D81B60', width: 45, height: 45 }}>
                      <Image src="/standylogo.png" alt="logo" width={45} height={45} />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" component="h1" align="center" gutterBottom>
                      Standy&apos;e Kayıt Ol
                  </Typography>

                  {error && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                          {error}
                      </Alert>
                  )}

                  <form onSubmit={handleRegister}>
                      <StyledTextField
                          fullWidth
                          label="İsim"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          margin="normal"
                          required
                      />
                      <StyledTextField
                          fullWidth
                          label="E-posta"
                          type="email"
                          value={email}
                          onChange={(e) => {
                              setEmail(e.target.value);
                              if (e.target.value) {
                                  validateEmail(e.target.value);
                              }
                          }}
                          margin="normal"
                          required
                          error={!isEmailValid}
                          helperText={!isEmailValid ? error : ''}
                          InputProps={{
                              endAdornment: isEmailChecking && (
                                  <CircularProgress size={20} sx={{ color: '#D81B60' }} />
                              )
                          }}
                      />
                      <StyledTextField
                          fullWidth
                          label="Parola"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          margin="normal"
                          required
                          helperText="En az 8 karakter olmalıdır"
                          error={password.length > 0 && password.length < 8}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                          <StyledButton 
                              type="submit" 
                              variant="contained" 
                              disabled={!email || !password || !name || !isEmailValid || password.length < 8 || isLoading}
                              sx={{ width: 'auto' }}
                          >
                              {isLoading ? <CircularProgress size={24} /> : 'Kayıt Ol'}
                          </StyledButton>
                      </Box>
                  </form>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <span className='text-white'>
                    Zaten bir hesabın var mı?{' '}
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
                        Giriş yap
                      </Box>
                    </span>
                  </Box>
                </StyledCard>
              </Box>
              
              <footer>
                <Box sx={{ textAlign: 'center', mb: 2, px: 1 }}>
                    <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                        Devam ederek{' '}
                        <Link href="/terms" style={{ color: '#FFB3C9' }} className="hover:underline">
                            Kullanım Koşulları
                        </Link>
                        {' '}ve{' '}
                        <Link href="/privacy" style={{ color: '#FFB3C9' }} className="hover:underline">
                            Gizlilik Politikası
                        </Link>
                        &apos;nı kabul etmiş olursunuz.
                    </Typography>
                </Box>
                <p className='text-center text-sm text-gray-500'>
                    &copy; {new Date().getFullYear()} Artes de ilusion. Tüm hakları saklıdır.
                </p>
              </footer>
            </PageContainer>
          </div>
        </ThemeProvider>
    );
} 