'use client';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Signed out successfully');
            router.push('/sign-in'); // Redirection après déconnexion
          },
        },
      });
    } catch (error) {
      console.error('Sign-out error:', error);
      toast.error('An error occurred while signing out');
    }
  };

  return (
    <Button onClick={handleSignOut} variant="destructive" className="w-full">
      Sign Out
    </Button>
  );
};
