import React from 'react';
import { DailyTask, UserProfile, BridgeData } from '../types';
import { CheckCircle, Circle, Flame, TrendingUp, Target } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface Props {
  profile: UserProfile;
  bridgeData: BridgeData;
  tasks: DailyTask[];
}

const mockVelocityData = [
  { name: 'M', hours: 2.5 },
  { name: 'T', hours: 3.1 },
  { name: 'W', hours: 1.8 },
  { name: 'T', hours: 4.0 },
  { name: 'F', hours: 0 },
  { name: 'S', hours: 5.2 },
  { name: 'S', hours: 2.0 },
];

const Dashboard: React.FC<Props> = ({ profile, bridgeData, tasks }) => {
  return (
    <div className="h-full p-6 lg:p-10 overflow-y-auto">
      
      {/* North Star Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
         <div>
            <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Current Mission</div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
               <Target className="text-primary" />
               {bridgeData.roleTitle}
            </h1>
         </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-surfaceHighlight/50 backdrop-blur-md rounded-full text-secondary text-sm font-medium border border-secondary/20">
            <Flame size={16} fill="currentColor" />
            <span>3 Day Streak</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Today's Focus */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface/60 backdrop-blur-xl rounded-2xl p-1 border border-surfaceHighlight shadow-xl">
             <div className="p-6 border-b border-surfaceHighlight">
                <h2 className="text-xl font-semibold text-white">Today's Focus</h2>
                <p className="text-slate-400 text-sm mt-1">Approx 90 minutes remaining</p>
             </div>
             <div className="p-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-surfaceHighlight/50 rounded-xl group transition-colors cursor-pointer">
                     <button className="text-slate-600 group-hover:text-primary transition-colors">
                        {task.completed ? <CheckCircle className="text-secondary" /> : <Circle />}
                     </button>
                     <div className="flex-1">
                        <div className="text-slate-200 font-medium group-hover:text-white">{task.title}</div>
                        <div className="text-xs text-slate-500 flex gap-2 mt-1">
                           <span className="uppercase">{task.type}</span>
                           <span>•</span>
                           <span>{task.durationMin} min</span>
                        </div>
                     </div>
                     <button className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-surfaceHighlight border border-slate-700 rounded text-xs text-slate-300 font-medium hover:bg-primary hover:text-white hover:border-primary transition-all">
                        Start
                     </button>
                  </div>
                ))}
             </div>
          </div>

          {/* AI Insight */}
          <div className="bg-indigo-900/20 border border-indigo-500/20 p-6 rounded-2xl flex gap-4 items-start backdrop-blur-sm">
             <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <TrendingUp size={20} />
             </div>
             <div>
                <h3 className="text-indigo-200 font-medium mb-1">Pacing Adjustment</h3>
                <p className="text-indigo-200/60 text-sm leading-relaxed">
                   You crushed the "Neural Net Basics" module faster than expected. We've unlocked the "Advanced PyTorch" project early to keep your momentum high.
                </p>
             </div>
          </div>
        </div>

        {/* Right Column: Stats & Meta */}
        <div className="space-y-6">
           {/* Velocity Chart */}
           <div className="bg-surface/60 backdrop-blur-xl rounded-2xl p-6 border border-surfaceHighlight">
              <h3 className="text-slate-400 text-sm font-medium mb-4">Weekly Velocity</h3>
              <div className="h-40 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockVelocityData}>
                       <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                       />
                       <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Skills Gained */}
           <div className="bg-surface/60 backdrop-blur-xl rounded-2xl p-6 border border-surfaceHighlight">
              <h3 className="text-slate-400 text-sm font-medium mb-4">Recently Acquired Skills</h3>
              <div className="flex flex-wrap gap-2">
                 {bridgeData.transferableSkills.slice(0, 5).map(skill => (
                    <span key={skill} className="px-3 py-1 bg-surfaceHighlight/50 rounded-full text-xs text-slate-300 border border-slate-700">
                       {skill}
                    </span>
                 ))}
                 <span className="px-3 py-1 bg-surfaceHighlight/50 rounded-full text-xs text-slate-500 border border-slate-700 border-dashed">
                    +3 more
                 </span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;