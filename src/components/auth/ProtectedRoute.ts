'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/firebase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const [isLoading, setIsLoading] = useState(true);
  const publicPaths = ['/login'];

  useEffect(() => {
    setMounted(true);
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && !publicPaths.includes(pathname)) {
        router.push('/login');
      } else if (user && publicPaths.includes(pathname)) {
        router.push('/');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  // Don't render anything until mounted and initial auth check is complete
  if (!mounted || isLoading) {
    return null;
  }

  // Only render children if we're on a public path or user is authenticated
  if (!publicPaths.includes(pathname) && !auth.currentUser) {
    return null;
  }

  return {children};
};

export default ProtectedRoute; 