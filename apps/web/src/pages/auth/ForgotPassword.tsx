import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@waqtify/ui';
import { z } from 'zod';

const resetSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6),
});

export function ForgotPassword() {
  const resetPassword = useAuthStore(s => s.resetPassword);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitMessage({ type: '', text: '' });

    const parsed = resetSchema.safeParse({ email, newPassword });
    if (!parsed.success) {
      setErrors({ form: "Please enter a valid email and a 6+ char password." });
      return;
    }

    // In a real app, this sends an email. Here we immediately simulate a reset.
    const result = await resetPassword(email, newPassword);
    if (result.success) {
       setSubmitMessage({ type: 'success', text: "Password reset successful! You can now log in." });
       setTimeout(() => navigate('/auth/login'), 2000);
    } else {
       setSubmitMessage({ type: 'error', text: result.message || "Failed to reset password." });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>Simulated immediate local password reset mechanism.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
               {submitMessage.text && (
                 <p className={`text-sm font-semibold ${submitMessage.type === 'success' ? 'text-green-500' : 'text-destructive'}`}>
                   {submitMessage.text}
                 </p>
               )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" type="submit">Reset Password</Button>
              <div className="text-center text-sm text-muted-foreground w-full">
                Remember your password?{" "}
                <Link to="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
