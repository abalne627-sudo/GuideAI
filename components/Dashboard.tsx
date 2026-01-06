
import React, { useEffect, useState } from 'react';
import { User, AssessmentRecord, AppPhase } from '../types';
import { getUserAssessments } from '../services/assessmentApiService';
import LoadingIndicator from './LoadingIndicator';
import GoalManager from './GoalManager';
import Card from './shared/Card';

interface DashboardProps {
  user: User;
  onStartNewAssessment: () => void;
  onViewAssessment: (assessmentId: string) => void;
  onLogout: () => void;
  navigateTo: (phase: AppPhase, params?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onStartNewAssessment, onViewAssessment, onLogout, navigateTo }) => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoadingAssessments(true);
      setError(null);
      try {
        const userAssessments = await getUserAssessments(user.id);
        setAssessments(userAssessments);
      } catch (e) {
        setError("Could not load past assessments.");
      } finally {
        setLoadingAssessments(false);
      }
    };
    fetchAssessments();
  }, [user.id]);

  const handleCompareSelect = (assessmentId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(assessmentId)) return prev.filter(id => id !== assessmentId);
      if (prev.length < 2) return [...prev, assessmentId];
      return [prev[1], assessmentId];
    });
  };

  const handleStartComparison = () => {
    if (selectedForCompare.length === 2) {
      navigateTo(AppPhase.CompareAssessments, { assessmentId1: selectedForCompare[0], assessmentId2: selectedForCompare[1] });
      setCompareMode(false);
      setSelectedForCompare([]);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-3xl font-bold text-text-main font-serif">Hello, Student</h2>
          <p className="text-text-muted mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            {user.mobile}
          </p>
        </div>
        <button onClick={onLogout} className="mt-4 sm:mt-0 text-sm font-semibold text-secondary hover:underline px-4 py-2 rounded-lg hover:bg-rose-50 transition">
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Hero Card */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark p-8 rounded-3xl shadow-xl text-white group">
          <div className="relative z-10 max-w-lg">
            <h3 className="text-2xl font-bold mb-3">Shape Your Future Journey</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">Discover your ideal career path through our advanced psychometric assessment powered by Gemini AI.</p>
            <button 
              onClick={onStartNewAssessment}
              className="px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-blue-50 hover:scale-105 transition-all flex items-center"
            >
              Start New Assessment
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
          </div>
          <svg className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10 group-hover:scale-110 transition-transform duration-700" fill="currentColor" viewBox="0 0 24 24"><use href="#icon-academic-cap"></use></svg>
        </div>

        {/* Goal Manager Section */}
        <div className="lg:col-span-1">
          <GoalManager user={user} />
        </div>
      </div>

      {/* Discovery Hub Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div onClick={() => navigateTo(AppPhase.EducationExplorer)} className="cursor-pointer group">
          <Card className="h-full border border-slate-100 hover:border-accent group-hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><use href="#icon-academic-cap"></use></svg>
            </div>
            <h4 className="text-lg font-bold text-text-main group-hover:text-accent transition-colors">FutureStream Paths</h4>
            <p className="text-sm text-text-muted mt-2">Explore Indian curricula and stream options in detail.</p>
          </Card>
        </div>

        <div onClick={() => navigateTo(AppPhase.OccupationsExplorer)} className="cursor-pointer group">
          <Card className="h-full border border-slate-100 hover:border-primary group-hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><use href="#icon-globe-alt"></use></svg>
            </div>
            <h4 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">Global Occupations</h4>
            <p className="text-sm text-text-muted mt-2">The official ISCO-08 occupational database for students.</p>
          </Card>
        </div>

        <div onClick={() => navigateTo(AppPhase.ResourceHub)} className="cursor-pointer group">
          <Card className="h-full border border-slate-100 hover:border-amber-500 group-hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-amber-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            </div>
            <h4 className="text-lg font-bold text-text-main group-hover:text-amber-600 transition-colors">Resource Hub</h4>
            <p className="text-sm text-text-muted mt-2">Curated SAT guides, startup courses, and academic tools.</p>
          </Card>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-bold text-text-main flex items-center">
            <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Assessment History
          </h3>
          {assessments.length >= 2 && (
            <button 
              onClick={() => {setCompareMode(!compareMode); setSelectedForCompare([]);}}
              className={`mt-4 sm:mt-0 px-5 py-2 rounded-full text-sm font-bold transition-all ${compareMode ? 'bg-secondary text-white shadow-lg' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
              {compareMode ? 'Cancel Selection' : 'Compare Reports'}
            </button>
          )}
        </div>

        <div className="p-6">
          {loadingAssessments && <LoadingIndicator message="Fetching records..." />}
          {!loadingAssessments && assessments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted italic">You haven't completed any assessments yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.map((assessment) => (
                <div 
                  key={assessment.id}
                  onClick={compareMode ? () => handleCompareSelect(assessment.id) : () => onViewAssessment(assessment.id)}
                  className={`p-5 border-2 rounded-2xl transition-all cursor-pointer relative group ${selectedForCompare.includes(assessment.id) ? 'border-primary bg-blue-50' : 'border-slate-100 hover:border-primary-light hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-text-main group-hover:text-primary transition-colors">{assessment.assessmentName}</h4>
                      <p className="text-xs text-text-muted mt-1">{new Date(assessment.timestamp).toLocaleDateString()} at {new Date(assessment.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    {compareMode ? (
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedForCompare.includes(assessment.id) ? 'bg-primary border-primary' : 'border-slate-300'}`}>
                        {selectedForCompare.includes(assessment.id) && <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path></svg>}
                      </div>
                    ) : (
                      <svg className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {compareMode && selectedForCompare.length === 2 && (
            <div className="mt-8 text-center animate-fade-in">
              <button 
                onClick={handleStartComparison}
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-xl hover:bg-primary-dark transition-all scale-105 active:scale-95"
              >
                Compare Selected Reports
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
