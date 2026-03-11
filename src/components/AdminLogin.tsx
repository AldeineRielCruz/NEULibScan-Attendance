'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, AlertCircle, Loader2, UserPlus, LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function AdminLogin() {
  const router = useRouter();
  const auth = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      if (!auth) throw new Error('Auth service not initialized');
      
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      
      router.push('/admin/dashboard');
    } catch (error: any) {
      setStatus('error');
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('Account not found. Please use the "Register" mode to create your admin account.');
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please use "Sign In" mode.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password should be at least 6 characters.');
      } else {
        setErrorMessage(error.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setStatus('idle');
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-primary">
          {mode === 'signin' ? 'Admin Access' : 'Create Admin'}
        </h2>
        <p className="text-muted-foreground font-body">
          {mode === 'signin' ? 'Authorized personnel only.' : 'Set up your administrative credentials.'}
        </p>
      </div>

      {status === 'error' && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="admin-email" className="font-body font-bold text-sm">Email Address</Label>
          <Input 
            id="admin-email" 
            name="email" 
            type="email" 
            placeholder="admin@neu.edu.ph" 
            required 
            className="border-primary/20"
            disabled={status === 'loading'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-password" className="font-body font-bold text-sm">Password</Label>
          <Input 
            id="admin-password" 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required 
            className="border-primary/20"
            disabled={status === 'loading'}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-headline text-lg py-6"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            mode === 'signin' ? 'Enter Dashboard' : 'Register Account'
          )}
        </Button>
      </form>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-sm text-primary hover:underline font-bold flex items-center justify-center gap-2"
        >
          {mode === 'signin' ? (
            <><UserPlus className="w-4 h-4" /> No account? Register here</>
          ) : (
            <><LogIn className="w-4 h-4" /> Already have an account? Sign In</>
          )}
        </button>

        <div className="pt-4 flex items-center justify-center text-xs text-muted-foreground gap-2 border-t border-primary/10">
          <Lock className="w-4 h-4" />
          <span>Secure Administrative Gateway</span>
        </div>
      </div>
    </div>
  );
}
