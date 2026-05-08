import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Rocket, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['ADMIN', 'MEMBER']),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'MEMBER' }, // Everyone registers as MEMBER by default now visually
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...rest } = data;
      await signup(rest);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-1">
      <div className="w-full max-w-md">
        <div className="text-center mb-0.5">
          <Link to="/" className="inline-flex items-center gap-2 mb-1 brutal-card p-6 brutal-shadow-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform bg-accent">
            <div className="w-4 h-4 bg-dark-900 flex items-center justify-center">
              <Rocket className="w-3 h-3 text-white" />
            </div>
            <span className="text-[8px] font-bold text-dark-900 pr-2 uppercase tracking-wide">ProjectPilot</span>
          </Link>
          <h1 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">Join Workspace</h1>
        </div>

        <div className="brutal-card p-6 sm:p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label-text">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-dark-900" />
                <input {...register('name')} placeholder="JOHN DOE" className="brutal-input pl-11 uppercase placeholder:normal-case" id="signup-name" />
              </div>
              {errors.name && <p className="text-danger font-bold text-[8px] mt-2">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label-text">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-dark-900" />
                <input {...register('email')} type="email" placeholder="user@projectpilot.com" className="brutal-input pl-11" id="signup-email" />
              </div>
              {errors.email && <p className="text-danger font-bold text-[8px] mt-2">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <div>
                <label className="label-text">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-dark-900" />
                  <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="MIN 6 CHARS" className="brutal-input pl-11 pr-11" id="signup-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-900 hover:text-dark-600 transition-colors">
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                {errors.password && <p className="text-danger font-bold text-[8px] mt-2">{errors.password.message}</p>}
              </div>

              <div>
                <label className="label-text">Confirm</label>
                <input {...register('confirmPassword')} type="password" placeholder="CONFIRM" className="brutal-input" id="signup-confirm" />
                {errors.confirmPassword && <p className="text-danger font-bold text-[8px] mt-2">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Hidden role input, default to MEMBER since everyone is just a user visually */}
            <input type="hidden" {...register('role')} value="MEMBER" />

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-0.5 mt-4 flex justify-center items-center text-[10px] uppercase tracking-wider" id="signup-submit">
              {isSubmitting ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[8px] font-bold text-dark-900 mt-8">
          ALREADY IN?{' '}
          <Link to="/login" className="text-accent underline decoration-2 underline-offset-4 hover:text-dark-900 transition-colors bg-dark-900 px-2 py-1">
            SIGN IN
          </Link>
        </p>
      </div>
    </div>
  );
}
