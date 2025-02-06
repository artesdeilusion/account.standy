// components/CreditCardForm.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: string;
  currency: string;
  name: string;
}

interface SipayResponse {
  status: string;
  sipay_status: string;
  status_description?: string;
  error?: string;
  redirect_url?: string;
}

const CreditCardForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '100',
    currency: 'TRY',
    name: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Luhn algorithm for card number validation
  const isValidCardNumber = (number: string): boolean => {
    const digits = number.replace(/\D/g, '');
    if (digits.length !== 16) return false;

    let sum = 0;
    let isEven = false;

    // Loop through values starting from the rightmost digit
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateForm = (): boolean => {
    // Validate card number using Luhn algorithm
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!isValidCardNumber(cleanCardNumber)) {
      setError('Invalid card number');
      return false;
    }

    // Validate expiry date
    const [month, year] = formData.expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (!month || !year || 
        parseInt(month) < 1 || 
        parseInt(month) > 12 || 
        parseInt(year) < currentYear || 
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      setError('Invalid or expired card date');
      return false;
    }

    // Validate CVV
    if (!/^\d{3}$/.test(formData.cvv)) {
      setError('Invalid CVV (must be 3 digits)');
      return false;
    }

    // Validate amount
    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    // Validate name
    if (formData.name.trim().length < 3) {
      setError('Please enter a valid cardholder name');
      return false;
    }

    return true;
  };
// components/CreditCardForm.tsx
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await axios.post('/api/payment', formData);

    if (response.data.redirect_url) {
      window.location.href = response.data.redirect_url;
      return;
    }

    if (response.data.status === 'success' || response.data.sipay_status === '1') {
      setSuccess('Payment processed successfully!');
    } else {
      setError(response.data.error || response.data.status_description || 'Payment failed');
    }
  } catch (error: any) {
    console.error('Payment error:', error);
    setError(
      error.response?.data?.message || 
      error.response?.data?.error || 
      'Payment failed. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    // Format card number in groups of 4
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData(prev => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substr(0, 2) + '/' + value.substr(2, 2);
    }
    setFormData(prev => ({ ...prev, expiryDate: value }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    
    // Format card number
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Format expiry date
    if (e.target.name === 'expiryDate') {
      value = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }

    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };
 
 

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Card Number
        </label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="4508 0345 0803 4509"
          maxLength={19}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="MM/YY"
            maxLength={5}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            CVV
          </label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="000"
            maxLength={3}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-3 text-white rounded ${
          loading 
            ? 'bg-gray-400' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default CreditCardForm;