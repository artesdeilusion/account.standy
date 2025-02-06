import React, { useState } from 'react';

interface PaymentProps {
    onPurchase: (plan: string) => Promise<void>;
    onBack: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onPurchase, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePurchase = async (plan: string) => {
        setLoading(true);
        setError(null);

        try {
            await onPurchase(plan);
            // Optionally, provide further feedback or redirect on success
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>Purchase Subscription</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Processing your purchase...</p>
            ) : (
                <div>
                    <button onClick={() => handlePurchase('monthly')}>
                        Buy Monthly Plan (100 TL)
                    </button>
                    <button onClick={() => handlePurchase('six_months')}>
                        Buy 6-Month Plan (400 TL)
                    </button>
                    <button onClick={() => handlePurchase('yearly')}>
                        Buy Yearly Plan (700 TL)
                    </button>
                    <button onClick={onBack}>Back to Dashboard</button>
                </div>
            )}
        </div>
    );
};

export default Payment;
