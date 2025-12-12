import React, { useEffect, useState } from 'react';
import { BridgeData, Branch, Interest } from '../types';
import { analyzeBridge } from '../services/geminiService';
import { ArrowRight, Briefcase, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

interface Props {
  branch: Branch;
  interest: Interest;
  onContinue: (data: BridgeData) => void;
}

const BridgeReveal: React.FC<Props> = ({ branch, interest, onContinue }) => {
  const [data, setData] = useState<BridgeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const result = await analyzeBridge(branch, interest);
      if (mounted) {
        setData(result);
        setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [branch, interest]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <div className="relative w-24 h-24">
           <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
           <div className="absolute inset-2 border-r-4 border-accent rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
        <h2 className="text-2xl font-bold text-white animate-pulse">Analyzing Syllabus Overlap...</h2>
        <p className="text-slate-400">Comparing {branch} curriculum with {interest} industry demands.</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: The Visual Bridge */}
        <div className="relative h-[400px] flex items-center justify-center">
          {/* Circle 1: Branch */}
          <div className="absolute left-0 w-64 h-64 rounded-full border-2 border-slate-700 bg-slate-900/50 flex items-center justify-center backdrop-blur-sm z-10 transition-transform hover:scale-105">
            <div className="text-center p-4">
              <h3 className="text-2xl font-bold text-slate-300">{branch}</h3>
              <p className="text-sm text-slate-500 mt-2">Current Foundation</p>
            </div>
          </div>

          {/* Circle 2: Interest */}
          <div className="absolute right-0 w-64 h-64 rounded-full border-2 border-accent/30 bg-accent/5 flex items-center justify-center backdrop-blur-sm z-10 transition-transform hover:scale-105">
            <div className="text-center p-4">
              <h3 className="text-2xl font-bold text-accent">{interest}</h3>
              <p className="text-sm text-accent/60 mt-2">Target Goal</p>
            </div>
          </div>

          {/* The Intersection (The Magic) */}
          <div className="absolute z-20 flex flex-col items-center justify-center animate-float">
             <div className="bg-gradient-to-r from-primary to-accent p-[2px] rounded-2xl shadow-2xl shadow-primary/20">
                <div className="bg-surfaceHighlight/90 backdrop-blur-xl rounded-2xl p-6 max-w-xs text-center">
                   <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2 fill-current" />
                   <div className="font-bold text-white text-lg mb-1">Unfair Advantage</div>
                   <div className="text-xs text-slate-300 leading-relaxed">
                     {data.uniqueAdvantage}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right: The Data Reveal */}
        <div className="space-y-8 animate-fade-in-up">
           <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Wait... {branch} + {interest}?
              </h1>
              <p className="text-xl text-slate-400">That's a rare and powerful combination.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surfaceHighlight/30 p-4 rounded-lg border border-slate-800 backdrop-blur-sm">
                 <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">
                    <CheckCircle2 size={18} /> Transferable Skills
                 </div>
                 <ul className="space-y-2">
                    {data.transferableSkills.slice(0,3).map(skill => (
                      <li key={skill} className="text-slate-300 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> {skill}
                      </li>
                    ))}
                 </ul>
              </div>

              <div className="bg-surfaceHighlight/30 p-4 rounded-lg border border-slate-800 backdrop-blur-sm">
                 <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-3">
                    <TrendingUp size={18} /> Career Outlook
                 </div>
                 <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-white">{data.salaryPremium}</span>
                    <span className="text-slate-500 text-sm mb-1">Salary Premium</span>
                 </div>
                 <div className="text-sm text-slate-400">
                    Target Role: <span className="text-white font-medium">{data.roleTitle}</span>
                 </div>
              </div>
           </div>

           <button 
             onClick={() => onContinue(data)}
             className="w-full py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:translate-y-[-2px] shadow-lg shadow-white/10"
           >
             Build My Roadmap <ArrowRight size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default BridgeReveal;