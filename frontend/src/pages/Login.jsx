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
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-1">
      <div className="w-full max-w-md">
        <div className="text-center mb-0.5">
          <Link to="/" className="inline-flex items-center gap-2 mb-1 brutal-card p-6 brutal-shadow-sm hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform bg-accent">
            <div className="w-4 h-4 bg-dark-900 flex items-center justify-center">
              <Rocket className="w-3 h-3 text-white" />
            </div>
            <span className="text-[8px] font-bold text-dark-900 pr-2 uppercase tracking-wide">ProjectPilot</span>
          </Link>
          <h1 className="text-[10px] font-black text-dark-900 uppercase tracking-tight">Sign in to workspace</h1>
        </div>

        <div className="brutal-card p-6 sm:p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label-text">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-dark-900" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="user@projectpilot.com"
                  className="brutal-input pl-11"
                  id="login-email"
                />
              </div>
              {errors.email && <p className="text-danger font-bold text-[8px] mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-text flex justify-between">
                <span>Password</span>
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-dark-900" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="brutal-input pl-11 pr-11"
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-900 hover:text-dark-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              {errors.password && <p className="text-danger font-bold text-[8px] mt-2">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-0.5 mt-4 flex justify-center items-center text-[10px] uppercase tracking-wider"
              id="login-submit"
            >
              {isSubmitting ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Enter Workspace'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-dark-900">
            <p className="text-[8px] font-bold text-dark-900 mb-0.5 uppercase tracking-wide">Demo Credentials</p>
            <div className="bg-accent brutal-border p-1 text-[8px] font-medium text-dark-900 brutal-shadow-sm">
              <p>Email: <span className="font-bold">admin@projectpilot.com</span></p>
              <p>Password: <span className="font-bold">password123</span></p>
            </div>
          </div>
        </div>

        <p className="text-center text-[8px] font-bold text-dark-900 mt-8">
          NO ACCOUNT YET?{' '}
          <Link to="/signup" className="text-accent underline decoration-2 underline-offset-4 hover:text-dark-900 transition-colors bg-dark-900 px-2 py-1">
            CREATE ONE
          </Link>
        </p>
      </div>
    </div>
  );
}
