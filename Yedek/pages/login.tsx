// src/pages/login.tsx
import { useState } from 'react';
import { auth } from '../firebase'; // Adjust the path to your firebase file
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to the dashboard or another protected route after successful login
            router.push('/dashboard');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message); // Set the error message to state
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
        </div>
    );
};

export default Login;
