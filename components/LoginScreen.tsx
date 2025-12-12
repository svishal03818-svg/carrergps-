import React, { useState } from 'react';
import { User } from '../types';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import Logo from './Logo';

interface Props {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate API delay for realistic effect
    setTimeout(() => {
      // Mock User Data - In production, this comes from Firebase/Google Auth
      // Name and Email are left empty to allow user to enter them manually in the Intake Flow
      const mockUser: User = {
        id: 'google-12345',
        name: '', 
        email: '',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
      };
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden">
      {/* Left Panel - Visuals & Value Prop */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-surface/40 backdrop-blur-md border-r border-slate-800">
        <div className="relative z-10">
           {/* Logo placeholder replaced with actual Logo */}
           <div className="mb-8">
             <Logo />
           </div>
           
           <h1 className="text-5xl font-bold text-white leading-tight mb-6">
             Your Career, <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Accelerated.</span>
           </h1>
           <p className="text-xl text-slate-300 max-w-md">
             Stop following generic advice. Get a personalized AI roadmap tailored to your branch, interests, and schedule.
           </p>
        </div>

        <div className="relative z-10 space-y-4">
           {[
             "Maps your college curriculum to industry needs",
             "Adapts to your exam schedule & holidays",
             "Real-world projects verified by AI"
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-secondary" size={20} />
                <span>{item}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
         <div className="max-w-md w-full space-y-8 relative z-10">
            <div className="text-center lg:text-left">
               {/* Logo added above Welcome Back (visible on mobile where left panel is hidden) */}
               <div className="flex justify-center lg:justify-start mb-6 lg:hidden">
                  <Logo />
               </div>
               
               <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
               <p className="text-slate-400">Sign in to access your personalized roadmap.</p>
            </div>

            <div className="space-y-4">
               <button
                 onClick={handleGoogleLogin}
                 disabled={loading}
                 className="w-full h-14 bg-white text-slate-900 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait relative overflow-hidden group shadow-xl"
               >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                       {/* Google 'G' Icon SVG */}
                       <svg className="w-6 h-6" viewBox="0 0 24 24">
                         <path
                           fill="#4285F4"
                           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                         />
                         <path
                           fill="#34A853"
                           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                         />
                         <path
                           fill="#FBBC05"
                           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                         />
                         <path
                           fill="#EA4335"
                           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                         />
                       </svg>
                       <span>Continue with Google</span>
                    </>
                  )}
               </button>

               <div className="relative flex items-center py-2">
                 <div className="flex-grow border-t border-slate-800"></div>
                 <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase font-bold tracking-wider">Secure Access</span>
                 <div className="flex-grow border-t border-slate-800"></div>
               </div>

               <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-surfaceHighlight/30 p-3 rounded-lg border border-slate-800/50 backdrop-blur-sm">
                     <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                     <div className="text-[10px] text-slate-400 font-bold uppercase">Private Data</div>
                  </div>
                  <div className="bg-surfaceHighlight/30 p-3 rounded-lg border border-slate-800/50 backdrop-blur-sm">
                     <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                     <div className="text-[10px] text-slate-400 font-bold uppercase">Instant Setup</div>
                  </div>
               </div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
               By continuing, you agree to CareerGPS <a href="#" className="text-slate-400 underline hover:text-white">Terms</a> & <a href="#" className="text-slate-400 underline hover:text-white">Privacy Policy</a>.
            </p>
         </div>
      </div>
    </div>
  );
};

export default LoginScreen;