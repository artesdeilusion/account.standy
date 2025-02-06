import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/firebase';
import { deleteUserData } from '../api/api';
import { styled } from '@mui/material/styles';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';

import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Container,Card
} from '@mui/material';
import "@/app/globals.css";
import Navbar from '@/components/navbar';
const StyledCard = styled(Card)({
    backgroundColor: '#313031',
    color: '#fff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  });
const DeleteAccount = () => {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDeleteRequest = () => {
        setIsDialogOpen(true);
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const user = auth.currentUser;
            if (user) {
                // Delete user data from custom endpoints
                await deleteUserData(user.uid);
                
                // Delete user document from Firestore
                const db = getFirestore();
                await deleteDoc(doc(db, 'users', user.uid));
                
                // Delete the authentication account
                await user.delete();
                router.push('/login');
            }
        } catch (error) {
            console.error("Failed to delete account:", error);
            setError("Hesap silme işlemi başarısız oldu. Lütfen tekrar deneyin.");
        } finally {
            setIsDeleting(false);
            setIsDialogOpen(false);
        }
    };

    return (
        <div className='bg-[#121212]'>
            <title>Standy | Hesabı Sil</title>
            <nav>
            <Navbar />
             </nav>

           

            <Container maxWidth="md" sx={{ paddingTop: '20', padding: '16px', bgcolor: '#121212' }}>  

            <Box sx={{ 
                backgroundColor: '#121212', 
                minHeight: '100vh', 
                 color: '#fff'
            }}>

                <StyledCard>  
                <Typography variant="h5" gutterBottom>
                    Hesabı Sil
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Hesabınızı silmek üzeresiniz. Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteRequest}
                    disabled={isDeleting}
                    sx={{
                         color: '#fff',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        borderRadius: '20px'
                    }}
                >
                    Hesabımı Sil
                </Button>

                <Dialog

                    open={isDialogOpen}
                     
                    onClose={handleCancelDelete}
                >
                    <DialogTitle>
                        Hesabınızı silmek istediğinizden emin misiniz?
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDelete} disabled={isDeleting}>
                            İptal
                        </Button>
                        <Button 
                            onClick={handleConfirmDelete} 
 
                            color="error" 
                            disabled={isDeleting}
                            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
                        >
                            {isDeleting ? 'Siliniyor...' : 'Evet, Sil'}
                        </Button>
                    </DialogActions>
                </Dialog>
                </StyledCard>
            </Box>
            </Container>
        </div>
    );
};

export default DeleteAccount; 