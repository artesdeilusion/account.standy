'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/firebase';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress
} from '@mui/material';
import Navbar from '@/components/navbar';

interface PaymentRecord {
    id: string;
    date: string;
    amount: number;
    status: string;
}

const PaymentHistory = () => {
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Here you would fetch payment history from your backend
        // For now, using mock data
        setPayments([
            { id: '1', date: '2024-03-15', amount: 29.99, status: 'Başarılı' },
            { id: '2', date: '2024-02-15', amount: 29.99, status: 'Başarılı' },
        ]);
        setIsLoading(false);
    }, []);

    return (
        <div>
            <Navbar />
            <Box sx={{ 
                backgroundColor: '#000', 
                minHeight: '100vh', 
                padding: '16px',
                color: '#fff'
            }}>
                <Typography variant="h5" gutterBottom>
                    Ödeme Geçmişi
                </Typography>

                {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ backgroundColor: '#121212' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#fff' }}>Tarih</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Tutar</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>Durum</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell sx={{ color: '#fff' }}>{payment.date}</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>{payment.amount} TL</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>{payment.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </div>
    );
};

export default PaymentHistory; 