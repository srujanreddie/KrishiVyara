import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, LogIn, UserCircle2, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onGoogleLogin: () => void;
  onEmailLogin: (email: string, pass: string) => Promise<void>;
  onEmailSignUp: (email: string, pass: string) => Promise<void>;
  onGuestLogin: () => void;
}

export function LoginScreen({ onGoogleLogin, onEmailLogin, onEmailSignUp, onGuestLogin }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (isSignUp) {
        await onEmailSignUp(email, password);
      } else {
        await onEmailLogin(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 font-['Outfit']">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex w-1/2 bg-emerald-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background pattern / gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-950 z-0"></div>
        <div className="absolute top-0 right-0 p-32 opacity-10">
          <Sprout size={400} className="text-emerald-100" />
        </div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 text-white"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sprout size={28} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">KrishiVeyra</span>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative z-10 max-w-lg"
        >
          <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Intelligent farming starts here.
          </h2>
          <p className="text-emerald-200 text-lg font-medium leading-relaxed">
            Diagnose crop health, track your daily activities, and manage your farm seamlessly across all your devices.
          </p>
        </motion.div>

        <div className="relative z-10 text-emerald-400 text-sm font-medium">
          © {new Date().getFullYear()} KrishiVeyra Agricultural Systems.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Mobile only branding */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden flex items-center gap-3 mb-12 justify-center"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <Sprout size={28} />
            </div>
            <span className="text-3xl font-black tracking-tight text-emerald-900">KrishiVeyra</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
            <p className="text-slate-500 font-medium mb-8 text-lg">
              {isSignUp 
                ? 'Sign up to sync your farm data and diagnostic reports securely.'
                : 'Sign in to sync your farm data, diagnostic reports, and activity logs securely.'}
            </p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'Sign Up' : 'Sign In'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative py-2 flex items-center"
            >
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-semibold uppercase tracking-wider">or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 gap-4"
            >
              <button
                onClick={onGoogleLogin}
                className="w-full group py-3.5 px-6 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-base transition-all flex items-center justify-center gap-3 border border-emerald-200/50"
              >
                <LogIn className="w-5 h-5" />
                Google
              </button>
              <button
                onClick={onGuestLogin}
                className="w-full group py-3.5 px-6 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-base transition-all flex items-center justify-center gap-3 border border-slate-200"
              >
                <UserCircle2 className="w-5 h-5" />
                Guest Mode (Offline)
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center pt-4"
            >
              <p className="text-slate-600 font-medium">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }} 
                  className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center text-sm text-slate-400 max-w-sm mx-auto"
          >
            By continuing, you agree to KrishiVeyra's Terms of Service and Privacy Policy.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
