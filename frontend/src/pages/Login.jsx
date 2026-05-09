import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Rocket, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 brutal-card p-3 brutal-shadow-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform bg-accent">
            <div className="w-6 h-6 bg-dark-900 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black text-dark-900 pr-1 uppercase tracking-tighter">ProjectPilot</span>
          </Link>
          <h1 className="text-xl font-black text-dark-900 uppercase tracking-tight">Sign in to workspace</h1>
        </div>

        <div className="brutal-card p-8 bg-white shadow-[6px_6px_0px_#111827]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-dark-900 uppercase tracking-widest mb-2 block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-900" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="user@projectpilot.com"
                  className="brutal-input pl-11 py-3 text-sm"
                  id="login-email"
                />
              </div>
              {errors.email && <p className="text-danger font-bold text-[10px] mt-2 uppercase">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-[10px] font-black text-dark-900 uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-900" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="brutal-input pl-11 pr-11 py-3 text-sm"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-900 hover:text-dark-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-danger font-bold text-[10px] mt-2 uppercase">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 mt-2 flex justify-center items-center text-xs font-black uppercase tracking-widest"
              id="login-submit"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Enter Workspace'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-bold text-dark-900 mt-8 uppercase tracking-widest">
          NO ACCOUNT YET?{' '}
          <Link to="/signup" className="text-white underline decoration-2 underline-offset-4 hover:bg-accent hover:text-dark-900 transition-all bg-dark-900 px-3 py-1 ml-2">
            CREATE ONE
          </Link>
        </p>
      </div>
    </div>
  );
}
