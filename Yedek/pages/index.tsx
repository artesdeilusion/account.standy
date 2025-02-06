// src/pages/index.tsx
import Link from 'next/link';

const Home: React.FC = () => {
    return (
        <div>
            <h2>Welcome to My Firebase App</h2>
            <p>This is the home page.</p>
            <Link href="/login">Login</Link>
            <Link href="/dashboard">Dashboard</Link>
        </div>
    );
};

export default Home;
