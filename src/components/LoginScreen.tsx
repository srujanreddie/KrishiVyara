import React from 'react';
import { motion } from 'motion/react';
import { Sprout, LogIn, UserCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onGoogleLogin: () => void;
  onGuestLogin: () => void;
}

export function LoginScreen({ onGoogleLogin, onGuestLogin }: LoginScreenProps) {
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
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
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 font-medium mb-10 text-lg">
              Sign in to sync your farm data, diagnostic reports, and activity logs securely.
            </p>
          </motion.div>

          <div className="space-y-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGoogleLogin}
              className="w-full group py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Sign in with Google
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative py-4 flex items-center"
            >
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-semibold uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGuestLogin}
              className="w-full group py-4 px-6 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-lg transition-all flex items-center justify-center gap-3"
            >
              <UserCircle2 className="w-5 h-5 text-slate-500" />
              Continue as Guest (Offline)
            </motion.button>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center text-sm text-slate-500 max-w-sm mx-auto"
          >
            By continuing, you agree to KrishiVeyra's Terms of Service and Privacy Policy.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
