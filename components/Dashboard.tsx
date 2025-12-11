
import React, { useEffect, useState } from 'react';
import { User, AssessmentRecord, AppPhase } from '../types';
import { getUserAssessments } from '../services/assessmentApiService';
import LoadingIndicator from './LoadingIndicator';
import GoalManager from './GoalManager'; // New Import

interface DashboardProps {
  user: User;
  onStartNewAssessment: () => void;
  onViewAssessment: (assessmentId: string) => void;
  onLogout: () => void;
  navigateTo: (phase: AppPhase, params?: any) => void; // For navigation
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
        console.error("Failed to fetch assessments:", e);
        setError("Could not load your past assessments. Please try again later.");
      } finally {
        setLoadingAssessments(false);
      }
    };
    fetchAssessments();
  }, [user.id]);

  const handleCompareSelect = (assessmentId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(assessmentId)) {
        return prev.filter(id => id !== assessmentId);
      }
      if (prev.length < 2) {
        return [...prev, assessmentId];
      }
      return [prev[1], assessmentId]; // Keep last two selected
    });
  };

  const handleStartComparison = () => {
    if (selectedForCompare.length === 2) {
      navigateTo(AppPhase.CompareAssessments, { assessmentId1: selectedForCompare[0], assessmentId2: selectedForCompare[1] });
      setCompareMode(false); // Reset compare mode after navigation
      setSelectedForCompare([]);
    } else {
      alert("Please select exactly two assessments to compare.");
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-neutral-dark font-roboto-slab">Welcome!</h2>
            <p className="text-gray-600" aria-label={`Signed in as mobile number ${user.mobile}`}>Signed in as: {user.mobile}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow hover:bg-red-600 transition text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Action Card */}
        <div className="p-6 bg-white rounded-xl shadow-xl text-center col-span-1 md:col-span-2 border-2 border-primary">
            <h3 className="text-xl font-semibold text-primary mb-3">Ready for new insights?</h3>
            <p className="text-sm text-gray-600 mb-4">Take a psychometric assessment to get personalized career and stream recommendations.</p>
            <button
            onClick={onStartNewAssessment}
            className="px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-150 text-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
            Take New Assessment
            </button>
        </div>
      </div>
      
      {/* Navigation Cards */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
         <div 
            onClick={() => navigateTo(AppPhase.EducationExplorer)}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow cursor-pointer text-center"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigateTo(AppPhase.EducationExplorer)}
            aria-label="Explore Educational Paths"
          >
            <div className="flex justify-center mb-3">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><use href="#icon-academic-cap"></use></svg>
            </div>
            <h3 className="text-lg font-semibold text-accent mb-2">FutureStream Paths</h3>
            <p className="text-xs text-gray-500">Explore curricula, streams, and educational options in India.</p>
        </div>

        <div 
            onClick={() => navigateTo(AppPhase.OccupationsExplorer)}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow cursor-pointer text-center"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigateTo(AppPhase.OccupationsExplorer)}
            aria-label="Explore Global Occupations"
        >
            <div className="flex justify-center mb-3">
                 <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><use href="#icon-globe-alt"></use></svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-500 mb-2">Global Occupations</h3>
            <p className="text-xs text-gray-500">Discover careers with the ISCO-08 classification.</p>
        </div>

        <div 
            onClick={() => navigateTo(AppPhase.ResourceHub)}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow cursor-pointer text-center"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigateTo(AppPhase.ResourceHub)}
            aria-label="Go to Resource Hub"
        >
             <div className="flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-yellow-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-yellow-500 mb-2">Resource Hub</h3>
            <p className="text-xs text-gray-500">Find articles, videos, and tools for your journey.</p>
        </div>
      </div>
      
      {/* Goal Manager Integration */}
      <GoalManager user={user} />


      <div className="bg-white rounded-xl shadow-xl p-6 mt-8">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
            <h3 className="text-2xl font-semibold text-neutral-dark">Your Past Assessments</h3>
            {assessments.length >= 2 && (
                 <button 
                    onClick={() => {setCompareMode(!compareMode); setSelectedForCompare([]);}}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg shadow transition ${compareMode ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                    aria-pressed={compareMode}
                    aria-label={compareMode ? "Cancel assessment comparison" : "Compare assessments"}
                 >
                    {compareMode ? 'Cancel Compare' : 'Compare (Select 2)'}
                 </button>
            )}
        </div>

        {loadingAssessments && <LoadingIndicator message="Loading your assessments..." />}
        {error && <p className="text-red-500 text-center py-4" role="alert">{error}</p>}
        
        {!loadingAssessments && !error && assessments.length === 0 && (
          <p className="text-gray-500 text-center py-4">You haven't taken any assessments yet.</p>
        )}

        {!loadingAssessments && !error && assessments.length > 0 && (
          <ul className="space-y-4">
            {assessments.map((assessment) => (
              <li 
                key={assessment.id} 
                className={`p-4 border rounded-lg transition-all flex justify-between items-center
                            ${compareMode ? 'cursor-pointer hover:shadow-lg' : 'hover:shadow-md'}
                            ${selectedForCompare.includes(assessment.id) ? 'ring-2 ring-offset-1 ring-indigo-500 bg-indigo-50 border-indigo-300' : 'border-gray-200'}`}
                onClick={compareMode ? () => handleCompareSelect(assessment.id) : undefined}
                role={compareMode ? "checkbox" : undefined}
                aria-checked={compareMode ? selectedForCompare.includes(assessment.id) : undefined}
                tabIndex={compareMode ? 0 : -1}
                onKeyDown={compareMode ? (e) => { if (e.key === ' ' || e.key === 'Enter') handleCompareSelect(assessment.id); } : undefined}
              >
                <div>
                  <h4 className="text-lg font-medium text-primary">{assessment.assessmentName || `Assessment on ${new Date(assessment.timestamp).toLocaleDateString()}`}</h4>
                  <p className="text-xs text-gray-500">Taken on: {new Date(assessment.timestamp).toLocaleString()}</p>
                </div>
                {!compareMode && (
                    <button
                    onClick={() => onViewAssessment(assessment.id)}
                    className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-md hover:bg-emerald-600 transition focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-accent"
                    aria-label={`View results for assessment taken on ${new Date(assessment.timestamp).toLocaleDateString()}`}
                    >
                    View Results
                    </button>
                )}
                 {compareMode && (
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedForCompare.includes(assessment.id) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-400'}`}>
                       {selectedForCompare.includes(assessment.id) && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>}
                    </span>
                )}
              </li>
            ))}
          </ul>
        )}
         {compareMode && assessments.length >=2 && (
                <div className="mt-6 text-center">
                    <button 
                        onClick={handleStartComparison}
                        disabled={selectedForCompare.length !== 2}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
                        aria-label="Compare selected assessments"
                    >
                        Compare Selected
                    </button>
                     {selectedForCompare.length !== 2 && <p className="text-sm text-gray-500 mt-2">Please select exactly two assessments to compare.</p>}
                </div>
            )}
      </div>
    </div>
  );
};

export default Dashboard;
