import React, { useState, useEffect } from 'react';
import { CareerPath } from '../types';
import { Clock, Briefcase, Microscope, Box, Check, Play, Lock, ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
  pathways: CareerPath[];
  initialHours: number;
}

const RoadmapView: React.FC<Props> = ({ pathways, initialHours }) => {
  const [activePathId, setActivePathId] = useState<string>(pathways[0]?.id || '');
  const [weeklyHours, setWeeklyHours] = useState(initialHours);
  const [animateLine, setAnimateLine] = useState(false);

  // Trigger line animation on path change
  useEffect(() => {
    setAnimateLine(false);
    const timer = setTimeout(() => setAnimateLine(true), 100); // Short delay to allow render
    return () => clearTimeout(timer);
  }, [activePathId]);

  // If pathways are loading (empty array), show Skeleton Loader
  if (!pathways || pathways.length === 0) {
    return (
      <div className="flex flex-col h-full text-slate-200 overflow-hidden font-sans p-6 md:p-12 relative">
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-surfaceHighlight rounded-full"></div>
                <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
            </div>
            <h2 className="mt-8 text-2xl font-bold text-white animate-pulse">Designing Your Curriculum</h2>
            <p className="text-slate-400 mt-2 max-w-md text-center">Analyzing syllabus gaps, identifying project opportunities, and mapping career milestones...</p>
        </div>
        
        {/* Skeleton UI behind the loader */}
        <div className="opacity-20 pointer-events-none max-w-4xl mx-auto w-full space-y-12 mt-20">
            <div className="h-12 bg-slate-700 rounded-lg w-1/3 mb-10"></div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-8">
                    <div className="w-14 h-14 rounded-full bg-slate-800 shrink-0"></div>
                    <div className="flex-1 h-40 bg-slate-800 rounded-2xl"></div>
                </div>
            ))}
        </div>
      </div>
    );
  }

  const activePath = pathways.find(p => p.id === activePathId) || pathways[0];

  // Calculate adjusted duration based on hours
  const timeMultiplier = 15 / weeklyHours;
  const adjustedWeeks = Math.round(activePath.totalDurationWeeks * timeMultiplier);

  const getPathIcon = (name: string) => {
    if (name.includes('Research')) return <Microscope size={18} />;
    if (name.includes('Business')) return <Briefcase size={18} />;
    return <Box size={18} />;
  };

  const getIntensityColor = (hours: number) => {
    if (hours <= 10) return 'text-secondary';
    if (hours <= 25) return 'text-primary';
    return 'text-orange-500';
  };
  
  const getIntensityBg = (hours: number) => {
    if (hours <= 10) return 'bg-secondary';
    if (hours <= 25) return 'bg-primary';
    return 'bg-orange-500';
  };

  const getPathColorHex = (colorClass: string) => {
      if (colorClass.includes('purple')) return '#a855f7';
      if (colorClass.includes('emerald')) return '#10b981';
      return '#6366f1'; // default primary
  };

  return (
    <div className="flex flex-col h-full text-slate-200 overflow-hidden font-sans">
      {/* Controls Header (Sticky) */}
      <div className="px-6 py-6 border-b border-surfaceHighlight bg-surface/80 backdrop-blur-xl sticky top-0 z-30 transition-all duration-300 shadow-xl shadow-black/20">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          
          {/* Path Selector (Metro Lines Style) */}
          <div className="relative flex-1">
             {/* The "Track" Line behind buttons */}
             <div className="absolute top-1/2 left-2 right-2 md:left-4 md:right-auto md:w-[600px] h-1.5 bg-surfaceHighlight -translate-y-1/2 rounded-full -z-0 hidden md:block border border-slate-800/50 overflow-hidden">
             </div>
             
             <div className="flex flex-wrap gap-4 relative z-10">
              {pathways.map((path) => {
                const isActive = activePathId === path.id;
                const pathHex = getPathColorHex(path.color);
                
                return (
                  <button
                    key={path.id}
                    onClick={() => setActivePathId(path.id)}
                    className={`
                      relative px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-500 border-2
                      ${isActive 
                        ? `bg-surface border-transparent text-white scale-110 -translate-y-1 shadow-lg` 
                        : 'bg-surfaceHighlight border-surfaceHighlight text-slate-400 hover:text-white hover:border-slate-600 hover:scale-105 hover:-translate-y-0.5'}
                    `}
                    style={{
                        borderColor: isActive ? pathHex : '',
                        boxShadow: isActive ? `0 0 15px ${pathHex}40` : ''
                    }}
                  >
                    {/* Dot Indicator */}
                    <span className={`w-3 h-3 rounded-full transition-colors duration-300 relative ${isActive ? '' : 'bg-slate-600'}`} 
                          style={{ backgroundColor: isActive ? pathHex : '' }}
                    >
                        {isActive && <span className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: pathHex }}></span>}
                    </span>
                    
                    {getPathIcon(path.name)}
                    {path.name}
                  </button>
                );
              })}
             </div>
          </div>

          {/* Time Slider */}
          <div className="flex items-center gap-6 bg-surfaceHighlight/30 px-6 py-3 rounded-2xl border border-surfaceHighlight hover:border-slate-700 transition-colors group min-w-[320px] backdrop-blur-sm">
             {/* Icon with intensity color */}
            <div className={`p-2.5 rounded-xl bg-surfaceHighlight transition-colors duration-500 ${getIntensityColor(weeklyHours)}`}>
               <Clock size={22} />
            </div>
            
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-white flex items-center gap-2">
                   <span className="tabular-nums">{weeklyHours}h</span> <span className="text-slate-500 font-normal text-xs">/ week</span>
                </span>
                <span className={`text-sm font-bold text-white transition-all duration-500 transform bg-surfaceHighlight px-2 py-0.5 rounded border border-white/5 ${weeklyHours > 30 ? 'text-orange-400' : ''}`}>
                  <span className="tabular-nums">{adjustedWeeks}</span> weeks
                </span>
              </div>
              
              {/* Custom Range Slider */}
              <div className="relative h-2 w-full rounded-full bg-surfaceHighlight overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${getIntensityBg(weeklyHours)}`}
                    style={{ width: `${(weeklyHours / 40) * 100}%` }}
                  />
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-wider font-semibold">
                 <span>Chill</span>
                 <span className={weeklyHours > 15 && weeklyHours < 30 ? 'text-primary' : ''}>Balanced</span>
                 <span className={weeklyHours >= 30 ? 'text-orange-500' : ''}>Sprint</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 relative scroll-smooth">
        
        <div 
           key={activePathId} 
           className="max-w-4xl mx-auto space-y-0 relative z-10"
        >
          {/* Header Info */}
          <div className="mb-16 pl-20 animate-slide-in-right">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    {activePath.name}
                </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">{activePath.description}</p>
          </div>

          {activePath.nodes.map((node, index) => {
            const isCompleted = node.status === 'completed';
            const isActive = node.status === 'active';
            const isLast = index === activePath.nodes.length - 1;
            
            // Safe parse duration
            const baseDuration = parseInt(node.duration) || 2; 
            const adjustedDuration = Math.round(baseDuration * (15 / weeklyHours));
            
            // Staggered animation delay based on index for the Enter animation
            const animationDelay = `${index * 80}ms`;

            return (
              <div 
                key={node.id} 
                className="relative pl-6 pb-16 group animate-fade-in-up"
                style={{ animationDelay }}
              >
                
                {/* Vertical Connector Line (The "Track") */}
                {!isLast && (
                  <div 
                    className="absolute left-[3.4rem] top-14 bottom-0 w-[3px] -translate-x-1/2 bg-surfaceHighlight/30 rounded-full"
                  >
                     {/* The "Fill" of the line */}
                     {/* Using animateLine state to trigger the drawing after mount */}
                     <div 
                        className={`w-full transition-all duration-[1500ms] ease-in-out origin-top
                            ${isCompleted ? 'bg-secondary h-full' : 'h-0'}
                            ${isActive ? 'bg-gradient-to-b from-primary to-transparent h-full opacity-50' : ''}
                        `}
                        style={{ 
                            height: (isCompleted || isActive) && animateLine ? '100%' : '0%' 
                        }} 
                     />
                  </div>
                )}

                <div className="flex gap-8 items-start relative z-10">
                  {/* Node Indicator / Station Circle */}
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center border-[3px] shrink-0 transition-all duration-500 relative
                    ${isCompleted 
                        ? 'bg-surface border-secondary text-secondary shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                        : isActive 
                            ? 'bg-surface border-primary text-primary shadow-[0_0_25px_rgba(99,102,241,0.4)] scale-110' 
                            : 'bg-surface border-slate-800 text-slate-600 group-hover:border-slate-600'}
                  `}>
                    {isCompleted ? <Check size={24} strokeWidth={3} /> : isActive ? <Play size={24} fill="currentColor" className="ml-1" /> : <Lock size={20} />}
                    
                    {/* Ripple effect for active node */}
                    {isActive && (
                        <>
                          <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-20 duration-[2000ms]"></div>
                        </>
                    )}
                  </div>

                  {/* Content Card */}
                  <div 
                    className={`
                      flex-1 p-6 md:p-8 rounded-2xl border transition-all duration-500 group-hover:translate-x-1
                      ${isActive 
                        ? 'bg-surfaceHighlight/40 border-primary/30 shadow-2xl backdrop-blur-md' 
                        : 'bg-surfaceHighlight/10 border-transparent hover:bg-surfaceHighlight/20 hover:border-slate-700/50'}
                    `}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                      <h3 className={`font-bold text-xl md:text-2xl tracking-tight transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-slate-200'}`}>
                        {node.title}
                      </h3>
                      <span className={`
                         text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border w-fit transition-colors duration-300
                         ${isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface text-slate-500 border-surfaceHighlight'}
                      `}>
                        {node.type}
                      </span>
                    </div>
                    
                    <p className={`text-base leading-relaxed transition-colors duration-300 max-w-2xl ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {node.description}
                    </p>
                    
                    {/* Active State Actions & Metadata */}
                    <div className={`
                        grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
                        ${isActive ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-white/5' : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-none'}
                    `}>
                        <div className="min-h-0 flex flex-col gap-4">
                           <div className="flex flex-wrap items-center gap-4">
                               <button className="px-8 py-3 bg-primary hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center gap-2 group/btn transform active:scale-95">
                                 Start Module <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                               </button>
                               
                               <div className="flex items-center gap-2 text-sm font-medium text-slate-400 bg-surface/50 px-4 py-2.5 rounded-xl border border-white/5">
                                 <Clock size={16} className={`transition-colors duration-300 ${getIntensityColor(weeklyHours)}`} />
                                 <span className="transition-all duration-300 tabular-nums">
                                   ~{adjustedDuration} hours work
                                 </span>
                               </div>
                           </div>

                           {node.relatedResources && node.relatedResources.length > 0 && (
                             <div className="mt-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                               <div className="text-xs font-bold text-slate-500 uppercase mb-2">Recommended Resources</div>
                               <div className="flex flex-col gap-2">
                                 {node.relatedResources.map((resource, i) => (
                                   <a 
                                     key={i} 
                                     href={resource} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="flex items-center gap-2 text-sm text-primary hover:text-accent hover:underline transition-colors truncate max-w-md group/link"
                                   >
                                     <ExternalLink size={14} className="group-hover/link:rotate-45 transition-transform" />
                                     {resource}
                                   </a>
                                 ))}
                               </div>
                             </div>
                           )}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Finish Line / Goal */}
          <div className="pl-[3.1rem] flex items-center gap-8 opacity-50 hover:opacity-100 transition-opacity duration-300 pb-20 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
             <div className="w-16 h-16 rounded-full bg-slate-800/30 border-2 border-slate-700 border-dashed flex items-center justify-center shrink-0">
               <div className="w-4 h-4 bg-slate-600 rounded-full animate-pulse"></div>
             </div>
             <div>
                <div className="text-xl font-bold text-white mb-1">Career Goal Reached</div>
                <div className="text-slate-500">Ready for job application</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;