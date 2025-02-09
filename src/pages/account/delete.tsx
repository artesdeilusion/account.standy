import { useEffect } from 'react';
import { auth } from '@/firebase';
import { useRouter } from 'next/router';
import {
    Box,
    Typography,
    Avatar,
    Stack,
    Card,
    IconButton,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

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

const InstructionStep = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    '& .MuiSvgIcon-root': {
        marginLeft: '8px',
        marginRight: '8px',
        color: '#FFB3C9',
    }
});

export default function DeleteAccountInstructions() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push('/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="bg-[#121212]">
                <title>Standy | Hesap Silme</title>
                <PageContainer direction="column" justifyContent="center">
                    <Box maxWidth="md" sx={{ width: '100%', maxWidth: 450 }}>
                        <StyledCard variant="outlined">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton
                                    onClick={() => router.push('/')}
                                    sx={{ color: '#fff' }}
                                    aria-label="close"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, mb: 1 }}>
                                <Avatar sx={{ bgcolor: '#D81B60', width: 45, height: 45 }}>
                                    <Image src="/standylogo.png" alt="logo" width={45} height={45} />
                                </Avatar>
                            </Box>
                            
                            <Typography variant="h5" component="h1" align="center" sx={{ mx: 2 }} gutterBottom>
                               Standy Hesabınızı Nasıl Silebilirsiniz?
                            </Typography>
                            <Typography variant="body2" sx={{  mx: 2, mt: 2, textAlign: 'left' }}>
                            Hesap silme işleminizi artık uygulama içinden tamamlayabilirsiniz.
                            </Typography>
                            <Box sx={{ mt: 2, mx: 2, mb: 3 }}>
                            <InstructionStep>
                                    <Typography variant="body1">1. Standy uygulamasını açın</Typography>
                                   
                                </InstructionStep>
                                <InstructionStep>
                                    <Typography variant="body1">2. Profil sayfanıza gidin</Typography>
                                     
                                </InstructionStep>
                                
                                <InstructionStep>
                                    <Typography variant="body1">3. Hesap Ayarları&apos;na tıklayın</Typography>
                                    
                                </InstructionStep>
                                
                                <InstructionStep>
                                    <Typography variant="body1">4. &quot;Hesabımı Sil&quot; seçeneğini bulun</Typography>
                                </InstructionStep>
                            </Box>

                            <Typography variant="body2" sx={{ color: '#FFB3C9',   mx:2 ,textAlign: 'start' }}>
                                Dikkat: Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.
                            </Typography>
                        </StyledCard>
                    </Box>
                </PageContainer>
            </div>
        </ThemeProvider>
    );
}
