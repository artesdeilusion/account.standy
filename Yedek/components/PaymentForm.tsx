// src/components/PaymentForm.tsx
import React, { useState } from 'react';

const PaymentForm: React.FC<{ onSuccess: () => void; plan: string }> = ({ onSuccess, plan }) => {
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);

        // Prepare payment data
        const paymentData = {
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            plan, // or any other necessary plan details
        };

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                onSuccess(); // Callback on successful payment
            }
        } catch (error) {
            setError("An error occurred while processing payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Card Holder Name</label>
                <input type="text" value={cardHolderName} onChange={(e) => setCardHolderName(e.target.value)} required />
            </div>
            <div>
                <label>Card Number</label>
                <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
            </div>
            <div>
                <label>Expiry Date (MM/YY)</label>
                <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
            </div>
            <div>
                <label>CVV</label>
                <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default PaymentForm;
