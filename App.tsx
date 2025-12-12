import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, BridgeData, CareerPath, DailyTask, User } from './types';
import IntakeFlow from './components/IntakeFlow';
import BridgeReveal from './components/BridgeReveal';
import RoadmapView from './components/RoadmapView';
import Dashboard from './components/Dashboard';
import LoginScreen from './components/LoginScreen';
import MentorSidebar from './components/MentorSidebar';
import BackgroundEffects from './components/BackgroundEffects';
import ProfileView from './components/ProfileView';
import Logo from './components/Logo';
import { generatePathways } from './services/geminiService';
import { LayoutDashboard, Map, BookOpen, Settings, LogOut, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.AUTH);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bridgeData, setBridgeData] = useState<BridgeData | null>(null);
  const [pathways, setPathways] = useState<CareerPath[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roadmap' | 'profile'>('dashboard');

  // Mock Tasks for demo
  const mockTasks: DailyTask[] = [
    { id: '1', title: 'Understanding Market Structures', durationMin: 20, type: 'theory', completed: true },
    { id: '2', title: 'Python for Finance: Pandas 101', durationMin: 45, type: 'practice', completed: false },
    { id: '3', title: 'Setup GitHub Repo', durationMin: 15, type: 'project', completed: false },
  ];

  const handleLogin = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setAppState(AppState.INTAKE);
  };

  const handleIntakeComplete = (p: UserProfile) => {
    setProfile(p);
    
    // Sync the manually entered name/email from Intake back to the main user state
    if (user) {
        setUser({
            ...user,
            name: p.name,
            email: p.email
        });
    }

    setAppState(AppState.BRIDGE_ANALYSIS);
  };

  const handleBridgeContinue = (data: BridgeData) => {
    setBridgeData(data);
    
    // Optimistic Update: Switch to dashboard immediately
    setAppState(AppState.DASHBOARD);
    
    // If user clicked "Build Roadmap", they probably want to see the roadmap tab or dashboard. 
    // We stick to dashboard as the landing, but start fetching pathways in background.
    if (profile) {
      generatePathways(profile.branch, profile.primaryInterest)
        .then((paths) => {
          setPathways(paths);
        })
        .catch((err) => {
          console.error("Failed to generate pathways", err);
          // Handle error state if needed
        });
    }
  };

  const renderContent = () => {
    if (appState === AppState.AUTH) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    if (appState === AppState.INTAKE) {
      return <IntakeFlow onComplete={handleIntakeComplete} initialUser={user} />;
    }

    if (appState === AppState.BRIDGE_ANALYSIS && profile) {
      return <BridgeReveal branch={profile.branch} interest={profile.primaryInterest} onContinue={handleBridgeContinue} />;
    }

    if (appState === AppState.DASHBOARD && profile && bridgeData) {
      return (
        <div className="flex h-screen bg-transparent overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-20 lg:w-64 bg-surface/80 backdrop-blur-xl border-r border-surfaceHighlight flex flex-col justify-between py-6 z-20">
             <div>
                <div className="px-6 mb-10">
                   <Logo />
                </div>
                
                <nav className="space-y-2 px-3">
                   <button 
                     onClick={() => setActiveTab('dashboard')}
                     className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-surfaceHighlight/50'}`}
                   >
                      <LayoutDashboard size={22} />
                      <span className="hidden lg:block font-medium">Mission Control</span>
                   </button>
                   <button 
                     onClick={() => setActiveTab('roadmap')}
                     className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'roadmap' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-surfaceHighlight/50'}`}
                   >
                      <Map size={22} />
                      <span className="hidden lg:block font-medium">Roadmap</span>
                   </button>
                   <button 
                     onClick={() => setActiveTab('profile')}
                     className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-surfaceHighlight/50'}`}
                   >
                      <UserIcon size={22} />
                      <span className="hidden lg:block font-medium">My Profile</span>
                   </button>
                </nav>
             </div>
             
             <div className="px-6 hidden lg:block space-y-4">
                <div className="bg-surfaceHighlight/50 rounded-xl p-4 border border-slate-800 backdrop-blur-md">
                   <div className="flex items-center gap-3 mb-3">
                      {user?.avatar && <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />}
                      <div>
                          <div className="text-white font-medium text-sm">{user?.name}</div>
                          <div className="text-slate-500 text-xs truncate w-24">{user?.email}</div>
                      </div>
                   </div>
                   <div className="text-xs text-slate-500 uppercase font-bold mb-1 mt-2">Current Track</div>
                   <div className="text-primary text-xs font-medium">{profile.primaryInterest}</div>
                </div>
                
                <button 
                  onClick={() => setAppState(AppState.AUTH)}
                  className="w-full flex items-center gap-2 text-slate-500 hover:text-white text-sm px-2"
                >
                   <LogOut size={16} /> Sign Out
                </button>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative z-10">
             {activeTab === 'dashboard' ? (
               <Dashboard profile={profile} bridgeData={bridgeData} tasks={mockTasks} />
             ) : activeTab === 'roadmap' ? (
               <RoadmapView pathways={pathways} initialHours={profile.weeklyHours} />
             ) : (
               <ProfileView user={user!} profile={profile} />
             )}
             
             {/* Context-Aware AI Mentor */}
             <MentorSidebar context={`Student is focusing on ${profile.primaryInterest} coming from ${profile.branch}. Current view: ${activeTab}. User: ${user?.name}`} />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <BackgroundEffects />
      <div className="relative z-10 w-full h-full">
        {/* Persistent Logo for Non-Dashboard Pages */}
        {appState !== AppState.DASHBOARD && (
          <div className="fixed top-6 left-6 z-50">
             <Logo showText={true} />
          </div>
        )}
        
        {renderContent()}
      </div>
    </>
  );
};

export default App;