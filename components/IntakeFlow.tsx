import React, { useState } from 'react';
import { Branch, Interest, UserProfile, User } from '../types';
import { Check, Sparkles, ChevronRight, ChevronLeft, Zap, Monitor, Wifi, BookOpen, AlertCircle } from 'lucide-react';

interface Props {
  onComplete: (profile: UserProfile) => void;
  initialUser?: User | null;
}

interface IntakeUserProfile extends Partial<UserProfile> {
  interestFields?: string[];
  communicationChannel?: string[];
}

interface StageProps {
  profile: IntakeUserProfile;
  updateProfile: (key: keyof IntakeUserProfile, value: any) => void;
  toggleArrayItem: (key: keyof IntakeUserProfile, item: string) => void;
  nextStage?: () => void;
  error?: string | null;
}

const BRANCH_SKILLS: Record<string, string[]> = {
  [Branch.CSE]: ['Python', 'Java', 'C++', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS', 'Linux', 'Data Structures'],
  [Branch.ECE]: ['C/C++', 'Python', 'MATLAB', 'Verilog', 'Embedded C', 'IoT', 'Arduino', 'Circuit Design', 'Signal Processing', 'Microcontrollers', 'SQL'],
  [Branch.Mechanical]: ['AutoCAD', 'SolidWorks', 'MATLAB', 'Python', 'ANSYS', 'Excel', '3D Printing', 'Thermodynamics', 'Project Mgmt', 'Robotics'],
  [Branch.Civil]: ['AutoCAD', 'Revit', 'Excel', 'Project Mgmt', 'Python', 'GIS', 'Structural Analysis', 'Estimation', 'Surveying'],
  [Branch.Chemical]: ['MATLAB', 'Aspen Plus', 'Python', 'Excel', 'Process Simulation', 'Lab Techniques', 'Data Analysis', 'Thermodynamics'],
  [Branch.Aerospace]: ['MATLAB', 'SolidWorks', 'Python', 'C++', 'Aerodynamics', 'ANSYS', 'Flight Mechanics', 'Propulsion', 'CFD'],
  [Branch.Biotech]: ['Python', 'R', 'Bioinformatics', 'Lab Techniques', 'Data Analysis', 'Excel', 'Molecular Biology', 'Genetics'],
  [Branch.BSc_Physics]: ['Python', 'MATLAB', 'Data Analysis', 'Lab Techniques', 'Research', 'Mathematica', 'LaTeX', 'Quantum Mechanics'],
  [Branch.BSc_Math]: ['Python', 'R', 'MATLAB', 'Statistics', 'Data Analysis', 'SQL', 'LaTeX', 'Cryptography', 'Linear Algebra'],
  [Branch.BSc_Bio]: ['Lab Techniques', 'Research', 'Excel', 'Data Analysis', 'Scientific Writing', 'Python', 'Microbiology'],
  [Branch.BCom]: ['Excel (Adv)', 'Tally', 'Financial Modeling', 'Accounting', 'Taxation', 'PowerBI', 'SQL', 'Python', 'Economics'],
  [Branch.BBA]: ['Excel', 'PowerPoint', 'Digital Marketing', 'CRM Tools', 'Project Mgmt', 'Financial Analysis', 'Tableau', 'HR Management'],
  [Branch.CA]: ['Excel (Adv)', 'Tally', 'SAP', 'Audit Tools', 'Taxation', 'Financial Reporting', 'Law', 'Cost Accounting'],
  [Branch.MBBS]: ['Clinical Skills', 'Patient Care', 'Medical Research', 'Biology', 'Chemistry', 'Anatomy', 'Pharmacology', 'Diagnostics'],
  [Branch.BPharm]: ['Pharmacology', 'Lab Techniques', 'Chemistry', 'Regulatory Affairs', 'Clinical Trials', 'Excel', 'Drug Formulation'],
  [Branch.BA]: ['Writing', 'Research', 'Critical Thinking', 'Digital Media', 'Editing', 'Communication', 'Psychology', 'History'],
  [Branch.Design]: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research', 'HTML/CSS', 'InDesign', 'After Effects'],
  [Branch.BArch]: ['AutoCAD', 'Revit', 'SketchUp', '3ds Max', 'Photoshop', 'Sustainable Design', 'Model Making', 'Rendering'],
  [Branch.Law]: ['Legal Research', 'Drafting', 'Corporate Law', 'Litigation', 'Negotiation', 'Communication', 'Constitutional Law'],
  [Branch.Other]: ['Excel', 'Python', 'Writing', 'Project Mgmt', 'Communication', 'Research', 'Data Entry', 'Analysis']
};

const DEFAULT_SKILLS = ['Python', 'Java', 'C++', 'JavaScript', 'SQL', 'Excel', 'Git', 'Communication'];

const SectionHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="mb-8 text-center space-y-2 animate-fade-in-up">
    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{title}</h1>
    <p className="text-lg text-slate-400 max-w-xl mx-auto">{subtitle}</p>
  </div>
);

const CheckboxCard: React.FC<{ 
  label: string; 
  selected: boolean; 
  onClick: () => void; 
  icon?: React.ReactNode 
}> = ({ label, selected, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 group
      ${selected 
        ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] backdrop-blur-sm' 
        : 'bg-surfaceHighlight/30 border-surfaceHighlight text-slate-400 hover:border-slate-600 hover:bg-surfaceHighlight/50 backdrop-blur-sm'}`}
  >
    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected ? 'bg-primary border-primary' : 'border-slate-600 bg-transparent'}`}>
      {selected && <Check size={12} className="text-white" />}
    </div>
    {icon && <div className={selected ? 'text-primary' : 'text-slate-500'}>{icon}</div>}
    <span className="font-medium">{label}</span>
  </button>
);

const RadioCard: React.FC<{
  title: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}> = ({ title, description, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-xl border transition-all text-left w-full h-full flex flex-col gap-2
      ${selected 
        ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(99,102,241,0.2)] backdrop-blur-sm' 
        : 'bg-surfaceHighlight/30 border-surfaceHighlight hover:bg-surfaceHighlight/50 hover:border-slate-600 backdrop-blur-sm'}`}
  >
    <div className="flex items-center justify-between w-full">
      <span className={`font-bold text-lg ${selected ? 'text-white' : 'text-slate-300'}`}>{title}</span>
      {selected && <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50" />}
    </div>
    {description && <p className={`text-sm ${selected ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>}
  </button>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }> = ({ label, required, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      className="w-full bg-surfaceHighlight/30 border border-surfaceHighlight rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all backdrop-blur-sm"
      {...props}
    />
  </div>
);

const Stage1_Basic: React.FC<StageProps> = ({ profile, updateProfile }) => (
  <div className="space-y-6 w-full max-w-2xl animate-fade-in-up">
    <SectionHeader title="Let's get to know you" subtitle="We'll tailor the curriculum to your exact background." />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField label="Full Name" required placeholder="e.g. Alex Sharma" value={profile.name || ''} onChange={e => updateProfile('name', e.target.value)} />
      <InputField label="Email" required placeholder="alex@example.com" value={profile.email || ''} onChange={e => updateProfile('email', e.target.value)} />
    </div>

    {/* Gender Selection */}
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender <span className="text-red-400">*</span></label>
      <div className="grid grid-cols-3 gap-3">
        {['Male', 'Female', 'Prefer not to say'].map((g) => (
          <button
            key={g}
            onClick={() => updateProfile('gender', g)}
            className={`px-3 py-3 rounded-xl text-sm font-medium border transition-all backdrop-blur-sm 
              ${profile.gender === g 
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-surfaceHighlight/30 border-surfaceHighlight text-slate-400 hover:bg-surfaceHighlight/50'}`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <InputField label="City" required placeholder="Mumbai" value={profile.city || ''} onChange={e => updateProfile('city', e.target.value)} />
      <InputField label="Country" required placeholder="India" value={profile.country || ''} onChange={e => updateProfile('country', e.target.value)} />
      <InputField label="Age" required type="number" placeholder="20" value={profile.age || ''} onChange={e => updateProfile('age', parseInt(e.target.value))} />
       <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Year <span className="text-red-400">*</span></label>
        <select 
          className="w-full bg-surfaceHighlight/30 border border-surfaceHighlight rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary backdrop-blur-sm"
          value={profile.year}
          onChange={e => updateProfile('year', parseInt(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(y => <option key={y} value={y} className="bg-surface">Year {y}</option>)}
        </select>
      </div>
    </div>

    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Branch/Field <span className="text-red-400">*</span></label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.values(Branch).map(b => (
          <button
            key={b}
            onClick={() => updateProfile('branch', b)}
            className={`px-3 py-2 rounded-lg text-sm text-left transition-all border backdrop-blur-sm ${profile.branch === b ? 'bg-primary border-primary text-white' : 'bg-surfaceHighlight/30 border-transparent text-slate-400 hover:bg-surfaceHighlight/50'}`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const Stage2_Skills: React.FC<StageProps> = ({ profile, toggleArrayItem }) => {
  const branchName = profile.branch || Branch.CSE;
  const technicalSkills = BRANCH_SKILLS[branchName] || DEFAULT_SKILLS;

  return (
    <div className="space-y-6 w-full max-w-3xl animate-fade-in-up">
      <SectionHeader title="Your Toolkit" subtitle={`Select what you already know in ${branchName}. We'll skip the basics for these.`} />
      
      <div className="space-y-4">
        <h3 className="text-slate-300 font-medium border-b border-slate-800 pb-2">Technical & Domain Skills <span className="text-red-400 text-xs">(Select at least 1)</span></h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {technicalSkills.map(skill => (
            <CheckboxCard 
              key={skill} 
              label={skill} 
              selected={profile.technicalSkills?.includes(skill) || false} 
              onClick={() => toggleArrayItem('technicalSkills', skill)} 
            />
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="text-slate-300 font-medium border-b border-slate-800 pb-2">Soft Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Communication', 'Leadership', 'Problem Solving', 'Design Thinking', 'Writing', 'Public Speaking'].map(skill => (
            <CheckboxCard 
              key={skill} 
              label={skill} 
              selected={profile.softSkills?.includes(skill) || false} 
              onClick={() => toggleArrayItem('softSkills', skill)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Stage3_Interests: React.FC<StageProps> = ({ profile, updateProfile }) => (
  <div className="space-y-8 w-full max-w-4xl animate-fade-in-up">
    <SectionHeader title="Your North Star" subtitle="Pick 1-3 fields that excite you the most." />
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.values(Interest).map(interest => (
        <button
          key={interest}
          onClick={() => {
              const current = profile.interestFields || [];
              // Limit to 3
              if (current.includes(interest)) {
                  updateProfile('interestFields', current.filter(i => i !== interest));
              } else if (current.length < 3) {
                  updateProfile('interestFields', [...current, interest]);
              }
          }}
          className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between h-32 group relative overflow-hidden backdrop-blur-sm
            ${profile.interestFields?.includes(interest)
              ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary text-white shadow-lg shadow-primary/20' 
              : 'bg-surfaceHighlight/30 border-surfaceHighlight text-slate-400 hover:border-slate-600 hover:bg-surfaceHighlight/50'}`}
        >
          <span className="font-bold relative z-10">{interest}</span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors ${profile.interestFields?.includes(interest) ? 'bg-primary text-white' : 'bg-slate-800 text-slate-600'}`}>
              {profile.interestFields?.includes(interest) ? <Check size={16} /> : <Sparkles size={16} />}
          </div>
        </button>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
       <div className="space-y-3">
          <label className="text-sm font-bold text-slate-400 uppercase">Depth Preference <span className="text-red-400">*</span></label>
          <div className="grid grid-cols-2 gap-2">
              {['Research', 'Product', 'Business', 'Mixed'].map(opt => (
                  <button key={opt} onClick={() => updateProfile('depthPreference', opt)} className={`p-3 rounded-lg text-sm border backdrop-blur-sm ${profile.depthPreference === opt ? 'bg-secondary/20 border-secondary text-white' : 'bg-surfaceHighlight/30 border-transparent text-slate-500'}`}>
                      {opt}
                  </button>
              ))}
          </div>
       </div>
       <div className="space-y-3">
          <label className="text-sm font-bold text-slate-400 uppercase">Role Type <span className="text-red-400">*</span></label>
           <div className="grid grid-cols-2 gap-2">
              {['Individual Contributor', 'Leadership', 'Founder', 'Flexible'].map(opt => (
                  <button key={opt} onClick={() => updateProfile('roleType', opt)} className={`p-3 rounded-lg text-sm border backdrop-blur-sm ${profile.roleType === opt ? 'bg-accent/20 border-accent text-white' : 'bg-surfaceHighlight/30 border-transparent text-slate-500'}`}>
                      {opt}
                  </button>
              ))}
          </div>
       </div>
    </div>
  </div>
);

const Stage4_Time: React.FC<StageProps> = ({ profile, updateProfile, toggleArrayItem }) => (
  <div className="space-y-8 w-full max-w-3xl animate-fade-in-up">
    <SectionHeader title="Time Commitment" subtitle="Be realistic. Consistency beats intensity." />
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
          { label: 'Micro', hours: '3-5h', desc: 'Busy schedule, learning on side' },
          { label: 'Mini', hours: '5-10h', desc: 'College balance, steady pace' },
          { label: 'Standard', hours: '10-15h', desc: 'Serious career switcher' },
          { label: 'Intensive', hours: '15-20h', desc: 'Bootcamp mode' },
          { label: 'Sprint', hours: '30-40h', desc: 'Full-time focus' }
      ].map((mode) => (
          <RadioCard 
              key={mode.label}
              title={`${mode.label} (${mode.hours})`}
              description={mode.desc}
              selected={profile.timeMode?.startsWith(mode.label) || false}
              onClick={() => {
                  updateProfile('timeMode', `${mode.label} (${mode.hours})`);
                  const h = parseInt(mode.hours.split('-')[0]);
                  updateProfile('weeklyHours', h);
              }}
          />
      ))}
    </div>

    <div className="bg-surfaceHighlight/30 p-6 rounded-2xl border border-surfaceHighlight backdrop-blur-sm">
       <div className="flex justify-between items-center mb-4">
          <label className="text-white font-medium">Fine-tune Weekly Hours</label>
          <span className="text-2xl font-bold text-primary">{profile.weeklyHours}h</span>
       </div>
       <input
          type="range"
          min="3"
          max="40"
          step="1"
          value={profile.weeklyHours}
          onChange={(e) => updateProfile('weeklyHours', parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
       />
    </div>

    <div>
      <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">Peak Productivity Hours <span className="text-red-400">*</span></label>
      <div className="flex flex-wrap gap-2">
          {['Early Morning (5-9 AM)', 'Morning (9-12 PM)', 'Afternoon (12-3 PM)', 'Evening (3-7 PM)', 'Night (7-11 PM)', 'Late Night (11 PM+)'].map((slot) => (
              <button
                key={slot}
                onClick={() => toggleArrayItem('peakHours', slot)}
                className={`px-4 py-2 rounded-full text-sm border transition-all
                  ${profile.peakHours?.includes(slot) ? 'bg-primary text-white border-primary' : 'bg-surfaceHighlight/30 text-slate-400 border-surfaceHighlight hover:border-slate-500'}`}
              >
                {slot}
              </button>
          ))}
      </div>
    </div>
  </div>
);

const Stage5_Constraints: React.FC<StageProps> = ({ profile, updateProfile }) => (
  <div className="space-y-8 w-full max-w-2xl animate-fade-in-up">
    <SectionHeader title="Resources & Constraints" subtitle="We'll suggest tools that fit your budget and setup." />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <RadioCard 
         title="Zero Budget" 
         description="Only free resources and open source tools." 
         selected={profile.budget === 'Free'} 
         onClick={() => updateProfile('budget', 'Free')} 
       />
       <RadioCard 
         title="Small Budget" 
         description="Can afford cheap courses ($10-50/mo)." 
         selected={profile.budget === 'Low'} 
         onClick={() => updateProfile('budget', 'Low')} 
       />
       <RadioCard 
         title="Flexible Budget" 
         description="Willing to pay for quality ($50-200)." 
         selected={profile.budget === 'Medium'} 
         onClick={() => updateProfile('budget', 'Medium')} 
       />
       <RadioCard 
         title="Full Access" 
         description="Employer sponsored or premium." 
         selected={profile.budget === 'High'} 
         onClick={() => updateProfile('budget', 'High')} 
       />
    </div>

    <div className="space-y-4 pt-6">
       <h3 className="text-lg font-bold text-white mb-4">Hardware & Network</h3>
       <div className="flex flex-col md:flex-row gap-4">
          <CheckboxCard 
            label="I have a dedicated Laptop" 
            icon={<Monitor size={18} />}
            selected={!!profile.hasLaptop} 
            onClick={() => updateProfile('hasLaptop', !profile.hasLaptop)} 
          />
           <div className="flex-1 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Internet Quality</label>
              <select 
                className="w-full bg-surfaceHighlight/30 border border-surfaceHighlight rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary backdrop-blur-sm"
                value={profile.internetQuality || 'Good'}
                onChange={e => updateProfile('internetQuality', e.target.value)}
              >
                <option className="bg-surface" value="Poor">Unstable / Mobile Data</option>
                <option className="bg-surface" value="Good">Good (Standard WiFi)</option>
                <option className="bg-surface" value="Excellent">Excellent (Fiber/High Speed)</option>
              </select>
           </div>
       </div>
    </div>
  </div>
);

const Stage6_Context: React.FC<StageProps> = ({ profile, updateProfile, toggleArrayItem }) => (
  <div className="space-y-8 w-full max-w-2xl animate-fade-in-up">
    <SectionHeader title="Final Context" subtitle="Help the AI understand your style." />

    <div className="space-y-2">
      <label className="text-lg font-bold text-white">What is your biggest career question?</label>
      <textarea 
        className="w-full h-32 bg-surfaceHighlight/30 border border-surfaceHighlight rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary backdrop-blur-sm"
        placeholder="e.g. 'Is it too late to switch to AI?' or 'How do I get a remote job abroad?'"
        value={profile.careerQuestion || ''}
        onChange={(e) => updateProfile('careerQuestion', e.target.value)}
      />
    </div>

    <div>
      <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">Learning Style Preference</label>
      <div className="grid grid-cols-2 gap-3">
         {['Video Tutorials', 'Documentation / Reading', 'Project-Based', 'Pair Programming', 'Theory First', 'Hackathons'].map((style) => (
             <CheckboxCard 
               key={style}
               label={style}
               selected={profile.learningStyle?.includes(style) || false}
               onClick={() => toggleArrayItem('learningStyle', style)}
               icon={<BookOpen size={16} />}
             />
         ))}
      </div>
    </div>
  </div>
);

const IntakeFlow: React.FC<Props> = ({ onComplete, initialUser }) => {
  const [stage, setStage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<IntakeUserProfile>({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    gender: 'Prefer not to say',
    year: 2,
    branch: Branch.CSE,
    technicalSkills: [],
    softSkills: [],
    interestFields: [],
    peakHours: [],
    learningStyle: [],
    weeklyHours: 10,
    timeMode: 'Mini (5-10h)',
    budget: 'Free',
    hasLaptop: true,
    internetQuality: 'Good',
    privacyAccepted: true
  });

  const updateProfile = (key: keyof IntakeUserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setError(null);
  };

  const toggleArrayItem = (key: keyof IntakeUserProfile, item: string) => {
    setProfile(prev => {
      const arr = (prev[key] as string[]) || [];
      return {
        ...prev,
        [key]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
      };
    });
    setError(null);
  };

  const validateStage = (currentStage: number): boolean => {
    switch (currentStage) {
      case 1:
        if (!profile.name || !profile.email || !profile.city || !profile.country || !profile.age || !profile.gender) return false;
        return true;
      case 2:
        if (!profile.technicalSkills || profile.technicalSkills.length === 0) return false;
        return true;
      case 3:
        if (!profile.interestFields || profile.interestFields.length === 0) return false;
        if (!profile.depthPreference || !profile.roleType) return false;
        return true;
      case 4:
        if (!profile.peakHours || profile.peakHours.length === 0) return false;
        return true;
      default:
        return true;
    }
  };

  const nextStage = () => {
    if (!validateStage(stage)) {
      setError("Please fill in all required fields to continue.");
      return;
    }
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStage(s => s + 1);
  };

  const prevStage = () => {
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStage(s => s - 1);
  };

  const finish = () => {
    if (!profile.careerQuestion) {
      setError("Please ask a career question to continue.");
      return;
    }
    // Map temporary interestFields to primary/secondary
    const finalProfile = {
      ...profile,
      primaryInterest: profile.interestFields?.[0] as Interest,
      secondaryInterests: profile.interestFields?.slice(1) || []
    } as UserProfile;
    
    onComplete(finalProfile);
  };

  const renderStage = () => {
    const props = { profile, updateProfile, toggleArrayItem, nextStage, error };
    switch (stage) {
      case 1: return <Stage1_Basic {...props} />;
      case 2: return <Stage2_Skills {...props} />;
      case 3: return <Stage3_Interests {...props} />;
      case 4: return <Stage4_Time {...props} />;
      case 5: return <Stage5_Constraints {...props} />;
      case 6: return <Stage6_Context {...props} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 flex flex-col items-center justify-center relative z-10 font-sans">
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-surfaceHighlight z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
          style={{ width: `${(stage / 6) * 100}%` }}
        />
      </div>

      <div className="mb-8 flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest">
        <span className="bg-surfaceHighlight px-2 py-1 rounded">Stage {stage} of 6</span>
      </div>

      {renderStage()}

      {error && (
        <div className="mt-6 flex items-center gap-2 text-red-400 bg-red-900/20 px-4 py-2 rounded-lg border border-red-900/50 animate-pulse">
           <AlertCircle size={18} />
           <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      <div className="mt-12 flex gap-4 w-full max-w-md">
        {stage > 1 && (
          <button 
            onClick={prevStage}
            className="flex-1 py-4 rounded-xl border border-surfaceHighlight text-slate-400 font-bold hover:bg-surfaceHighlight hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ChevronLeft size={20} /> Back
          </button>
        )}
        
        {stage < 6 ? (
          <button 
            onClick={nextStage}
            className="flex-1 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-slate-200 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2"
          >
            Next Step <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            onClick={finish}
            disabled={!profile.careerQuestion}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Roadmap <Zap size={20} fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
};

export default IntakeFlow;