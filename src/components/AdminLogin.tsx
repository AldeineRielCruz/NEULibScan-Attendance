
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminLogin } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoggingIn(true);

    const formData = new FormData(event.currentTarget);
    
    try {
      await adminLogin(formData);
      toast({
        title: "Login Successful",
        description: "Redirecting to admin dashboard...",
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <ShieldCheck className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-headline font-bold text-primary">Admin Access</h2>
        <p className="text-muted-foreground font-body">Authorized personnel only.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="admin-email" className="font-body font-bold text-sm">Email Address</Label>
          <Input 
            id="admin-email" 
            name="email" 
            type="email" 
            placeholder="email" 
            required 
            className="border-primary/20"
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
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-headline text-lg py-6"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Authenticating...' : 'Enter Dashboard'}
        </Button>
      </form>

      <div className="pt-4 flex items-center justify-center text-xs text-muted-foreground gap-2">
        <Lock className="w-4 h-4" />
        <span>Secure Administrative Gateway</span>
      </div>
    </div>
  );
}
