import React from 'react';
import { User, UserProfile } from '../types';
import { 
  User as UserIcon, Mail, MapPin, BookOpen, Clock, Briefcase, 
  Code, Award, Calendar, Zap, Wifi, Monitor 
} from 'lucide-react';

interface Props {
  user: User;
  profile: UserProfile;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-surfaceHighlight/30 border border-surfaceHighlight backdrop-blur-sm rounded-2xl p-6 h-full animate-fade-in-up">
    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const DetailRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start group">
      <span className="text-slate-500 text-sm font-medium">{label}</span>
      <span className="text-slate-200 text-sm text-right font-medium max-w-[60%]">{value}</span>
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-slate-700' }) => (
  <span className={`px-3 py-1 ${color} rounded-full text-xs text-white border border-white/10`}>
    {children}
  </span>
);

const ProfileView: React.FC<Props> = ({ user, profile }) => {
  return (
    <div className="h-full overflow-y-auto p-6 lg:p-10 font-sans">
      
      {/* Hero Section */}
      <div className="relative mb-10 rounded-3xl overflow-hidden bg-surfaceHighlight/20 border border-surfaceHighlight animate-fade-in-up">
         <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent"></div>
         <div className="absolute top-0 right-0 p-8 opacity-20">
            <Zap size={120} />
         </div>
         
         <div className="relative p-8 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-surface bg-surfaceHighlight overflow-hidden shadow-2xl">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover" />
               </div>
               <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-surface rounded-full" title="Active Scholar"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
               <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400 text-sm">
                  <div className="flex items-center gap-1.5">
                     <Mail size={14} /> {user.email}
                  </div>
                  {profile.city && (
                    <div className="flex items-center gap-1.5">
                       <MapPin size={14} /> {profile.city}, {profile.country}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                     <UserIcon size={14} /> {profile.gender}
                  </div>
               </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
               <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Track</span>
               <div className="px-4 py-2 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 border border-primary/50">
                  {profile.primaryInterest}
               </div>
            </div>
         </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         
         {/* Academic Background */}
         <InfoCard title="Academic Profile" icon={<BookOpen size={20} />}>
            <DetailRow label="Institution" value={profile.college || "Not Specified"} />
            <DetailRow label="Branch" value={profile.branch} />
            <DetailRow label="Current Year" value={`Year ${profile.year}`} />
            <DetailRow label="Graduation" value={profile.graduationDate || "2025"} />
            <DetailRow label="CGPA" value={profile.cgpa ? `${profile.cgpa}/10` : undefined} />
            <div className="pt-4 mt-2 border-t border-white/5">
                <span className="text-xs font-bold text-slate-500 uppercase mb-3 block">Learning Style</span>
                <div className="flex flex-wrap gap-2">
                   {profile.learningStyle?.map(style => (
                      <Badge key={style} color="bg-indigo-500/20 text-indigo-200 border-indigo-500/30">{style}</Badge>
                   ))}
                </div>
            </div>
         </InfoCard>

         {/* Career Preferences */}
         <InfoCard title="Career Goals" icon={<Briefcase size={20} />}>
            <DetailRow label="Depth Focus" value={profile.depthPreference} />
            <DetailRow label="Role Type" value={profile.roleType} />
            <DetailRow label="Target Industry" value={profile.industryPreference} />
            <DetailRow label="Motivation" value={profile.impactMotivation} />
            
            <div className="pt-4 mt-2 border-t border-white/5">
                <span className="text-xs font-bold text-slate-500 uppercase mb-3 block">Secondary Interests</span>
                <div className="flex flex-wrap gap-2">
                   {profile.secondaryInterests?.map(int => (
                      <Badge key={int} color="bg-purple-500/20 text-purple-200 border-purple-500/30">{int}</Badge>
                   ))}
                   {(!profile.secondaryInterests || profile.secondaryInterests.length === 0) && <span className="text-slate-600 text-sm">None selected</span>}
                </div>
            </div>
         </InfoCard>

         {/* Skills & Toolkit */}
         <InfoCard title="Skill Arsenal" icon={<Code size={20} />}>
            <div className="space-y-4">
               <div>
                  <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">Technical</span>
                  <div className="flex flex-wrap gap-2">
                     {profile.technicalSkills.map(skill => (
                        <Badge key={skill} color="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{skill}</Badge>
                     ))}
                  </div>
               </div>
               <div>
                  <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">Soft Skills</span>
                  <div className="flex flex-wrap gap-2">
                     {profile.softSkills.map(skill => (
                        <Badge key={skill} color="bg-blue-500/10 text-blue-400 border-blue-500/20">{skill}</Badge>
                     ))}
                  </div>
               </div>
            </div>
         </InfoCard>

         {/* Logistics */}
         <InfoCard title="Logistics & Time" icon={<Clock size={20} />}>
            <DetailRow label="Commitment" value={`${profile.weeklyHours} hours/week`} />
            <DetailRow label="Mode" value={profile.timeMode} />
            <DetailRow label="Budget" value={profile.budget} />
            
            <div className="flex gap-4 mt-4">
               <div className={`flex items-center gap-2 text-sm ${profile.hasLaptop ? 'text-green-400' : 'text-red-400'}`}>
                  <Monitor size={16} /> {profile.hasLaptop ? 'Laptop Available' : 'No Laptop'}
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Wifi size={16} /> {profile.internetQuality} Net
               </div>
            </div>

            <div className="pt-4 mt-2 border-t border-white/5">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">Peak Hours</span>
                <div className="flex flex-wrap gap-2">
                    {profile.peakHours?.map(h => (
                        <span key={h} className="text-xs text-slate-400 border border-slate-700 px-2 py-1 rounded">{h}</span>
                    ))}
                </div>
            </div>
         </InfoCard>

         {/* Context */}
         <div className="md:col-span-2 lg:col-span-2 bg-surfaceHighlight/30 border border-surfaceHighlight backdrop-blur-sm rounded-2xl p-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                  <Award size={20} />
               </div>
               <h3 className="text-lg font-bold text-white">The Big Question</h3>
            </div>
            <p className="text-slate-300 italic leading-relaxed text-lg">
               "{profile.careerQuestion || "No specific career question provided."}"
            </p>
         </div>

      </div>
    </div>
  );
};

export default ProfileView;