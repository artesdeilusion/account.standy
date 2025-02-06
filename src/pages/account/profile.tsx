import { useState, useEffect } from 'react';
import { auth } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import "@/app/globals.css";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    IconButton,
} from '@mui/material';
import Navbar from '@/components/navbar';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';

const StyledCard = styled(Card)({
    backgroundColor: '#313031',
    color: '#fff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  });

const Profile = () => {
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const user = auth.currentUser;
        if (user?.displayName) {
            setDisplayName(user.displayName);
        }
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (displayName.trim().length < 3) {
            setError('Kullanıcı adı en az 3 karakter olmalıdır');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const user = auth.currentUser;
            if (user) {
                await updateProfile(user, {
                    displayName: displayName.trim()
                });
                setSuccess(true);
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Profil güncellenemedi. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>            <title>Standy | Profili Düzenle</title>

            <Navbar />
            <Box  maxWidth="md" margin="auto" sx={{ paddingTop: '20', padding: '16px' }}>
            <StyledCard> 
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">
                        Profili Düzenle
                    </Typography>
                    <IconButton
                        onClick={() => router.back()}
                        sx={{ color: '#fff' }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Profil başarıyla güncellendi!</Alert>}

                <form onSubmit={handleProfileUpdate}>
                    <TextField
                        label="Kullanıcı Adı"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        fullWidth
                        margin="normal"
                        helperText="En az 3 karakter olmalıdır"
                        FormHelperTextProps={{ sx: { color: '#fff' } }}
                        sx={{ 
                            backgroundColor: '#1e1e1e',
                            borderRadius: '8px',
                            input: { color: '#fff' },
                            label: { color: '#fff' }
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading || displayName.trim().length < 3}
                        sx={{ mt: 2, borderRadius: '20px', color: '#fff', bgcolor: '#D81B60', textTransform: 'none', fontWeight: 'bold' }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Profili Güncelle'}
                    </Button>
                </form></StyledCard>
            </Box>
        </div>
    );
};

export default Profile; 