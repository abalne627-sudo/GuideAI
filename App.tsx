
import React, { useState, useCallback, useEffect } from 'react';
import { AppPhase, Answers, StudentProfile, CareerSuggestion, StreamSuggestion, User, AssessmentRecord, AssessmentResultData, ChatMessage, ChatRole, SkillRecommendation, UserGoal } from './types';
import { QUESTIONS_DATA, GEMINI_API_KEY } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Questionnaire from './components/Questionnaire';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingIndicator from './components/LoadingIndicator';
import ResourceHub from './components/ResourceHub'; 
import AssessmentComparisonView from './components/AssessmentComparisonView'; 
import ErrorBoundary from './components/ErrorBoundary'; 
import OccupationsExplorerPage from './components/OccupationsExplorerPage';
import EducationExplorerPage from './components/EducationExplorerPage';
import BibliographyPage from './components/BibliographyPage';
import { calculateStudentProfile } from './services/assessmentService';
import { getCareerSuggestions, getStreamSuggestions, getProfileNarrativeStream, startChatSession, sendChatMessageStream, getSkillRecommendations } from './services/geminiService';
import { getCurrentUser, logout as authLogout } from './services/authService';
import { saveUserAssessment, getAssessmentById } from './services/assessmentApiService';
import { Chat } from '@google/genai';
import { dbIsISCODataLoaded, dbSaveISCOData } from './services/dbService'; 
import { fetchAndParseISCOData } from './services/iscoService'; 
import { IndianEducationSystemData } from './data/indianEducationSystemData';


const App: React.FC = () => {
  const initialUser = getCurrentUser();
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [appPhase, setAppPhase] = useState<AppPhase>(initialUser ? AppPhase.Dashboard : AppPhase.Login);
  
  const [answers, setAnswers] = useState<Answers>({});
  const [currentAssessmentData, setCurrentAssessmentData] = useState<AssessmentResultData | null>(null);
  const [selectedAssessmentToView, setSelectedAssessmentToView] = useState<AssessmentRecord | null>(null);
  const [comparisonParams, setComparisonParams] = useState<{id1: string, id2: string} | null>(null);

  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [profileNarrativeStreamed, setProfileNarrativeStreamed] = useState<string>("");


  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);

  const [iscoDataLoading, setIscoDataLoading] = useState<boolean>(false);
  const [iscoDataError, setIscoDataError] = useState<string | null>(null);
  const [isIscoDataSuccessfullyLoaded, setIsIscoDataSuccessfullyLoaded] = useState<boolean>(false);

  // Deep-linking state for the Occupations Explorer
  const [iscoDeepLinkCode, setIscoDeepLinkCode] = useState<string | null>(null);


  useEffect(() => {
    const loadISCODataIfNeeded = async () => {
      if (!dbIsISCODataLoaded()) {
        console.log("ISCO data not found in localStorage. Fetching and parsing...");
        setIscoDataLoading(true);
        setIscoDataError(null);
        setIsIscoDataSuccessfullyLoaded(false);
        try {
          const iscoData = await fetchAndParseISCOData();
          if (iscoData) {
            dbSaveISCOData(iscoData);
            console.log("ISCO data fetched, parsed, and saved to localStorage successfully.");
            setIsIscoDataSuccessfullyLoaded(true);
          } else {
            throw new Error("Failed to fetch or parse ISCO data.");
          }
        } catch (err) {
          console.error("Error loading ISCO data:", err);
          setIscoDataError(err instanceof Error ? err.message : "An unknown error occurred while loading ISCO data.");
          setIsIscoDataSuccessfullyLoaded(false);
        } finally {
          setIscoDataLoading(false);
        }
      } else {
        console.log("ISCO data already loaded in localStorage.");
        setIsIscoDataSuccessfullyLoaded(true);
        setIscoDataLoading(false);
      }
    };

    loadISCODataIfNeeded();
  }, []);


  const resetCurrentAssessmentState = () => {
    setAnswers({});
    setCurrentAssessmentData(null);
    setSelectedAssessmentToView(null);
    setComparisonParams(null);
    setError(null);
    setProfileNarrativeStreamed("");
    setChatMessages([]);
    setChatSession(null);
  };
  
  const navigateTo = (phase: AppPhase, params?: any) => {
    setError(null); 
    if (phase === AppPhase.CompareAssessments && params?.assessmentId1 && params?.assessmentId2) {
        setComparisonParams({ id1: params.assessmentId1, id2: params.assessmentId2 });
    } else {
        setComparisonParams(null);
    }

    if (phase === AppPhase.OccupationsExplorer && params?.selectedCode) {
      setIscoDeepLinkCode(params.selectedCode);
    } else if (phase !== AppPhase.OccupationsExplorer) {
      setIscoDeepLinkCode(null);
    }

    setAppPhase(phase);
  };


  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    navigateTo(AppPhase.Dashboard);
    resetCurrentAssessmentState();
  };

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    navigateTo(AppPhase.Login);
    resetCurrentAssessmentState();
  };

  const handleStartNewAssessment = () => {
    resetCurrentAssessmentState();
    navigateTo(AppPhase.Questionnaire);
  };

  const handleAnswerChange = useCallback((questionId: string, value: number) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: value }));
  }, []);

  const addChatMessageToList = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };
  const updateLastBotMessageInList = (chunk: string, isLastChunk: boolean) => {
      setChatMessages(prev => {
          const lastMsgIndex = prev.length -1;
          if(lastMsgIndex >= 0 && prev[lastMsgIndex].role === ChatRole.Model) {
              const updatedMessages = [...prev];
              updatedMessages[lastMsgIndex] = {
                  ...updatedMessages[lastMsgIndex],
                  text: isLastChunk ? chunk.replace(/\.\.\.$/, '') : chunk, 
              };
              return updatedMessages;
          }
          return prev; 
      });
  };
  const setChatErrorMessageInList = (messageId: string, errorText: string) => {
      setChatMessages(prev => prev.map(msg => msg.id === messageId ? {...msg, text:errorText, role: ChatRole.Error} : msg));
  };


  const handleSubmitAssessment = async () => {
    if (Object.keys(answers).length !== QUESTIONS_DATA.length) {
        setError("Please answer all questions before submitting.");
        navigateTo(AppPhase.Questionnaire);
        return;
    }
    navigateTo(AppPhase.LoadingResults);
    setLoadingMessage("Crafting your personalized guidance...");
    setSelectedAssessmentToView(null); 
    setProfileNarrativeStreamed(""); 

    try {
      const profile = calculateStudentProfile(answers);
      
      if (!GEMINI_API_KEY) {
        setError("Gemini API Key is not configured. Cannot fetch AI suggestions.");
        const assessmentResult: AssessmentResultData = { profile, profileNarrative: "AI features disabled: API Key missing.", careerSuggestions: [], streamSuggestions: [], skillRecommendations: [] };
        if(currentUser){ await saveUserAssessment(currentUser.id, assessmentResult); }
        setCurrentAssessmentData(assessmentResult);
        setProfileNarrativeStreamed(assessmentResult.profileNarrative || "");
        navigateTo(AppPhase.Results);
        return;
      }
      
      let finalNarrative = ""; 
      const narrativeStreamingLogic = async () => {
        for await (const chunk of getProfileNarrativeStream(profile)) {
          finalNarrative += chunk;
          setProfileNarrativeStreamed(prev => prev + chunk); 
        }
      };
      const narrativePromise = narrativeStreamingLogic(); 

      const [careers, streams, skills, _narrativeCompletion] = await Promise.all([
        getCareerSuggestions(profile), 
        getStreamSuggestions(profile),
        getSkillRecommendations(profile),
        narrativePromise 
      ]);
      
      const newAssessmentResult: AssessmentResultData = {
          profile,
          profileNarrative: finalNarrative, 
          careerSuggestions: careers,
          streamSuggestions: streams,
          skillRecommendations: skills
      };
      setCurrentAssessmentData(newAssessmentResult);

      if (currentUser) {
        await saveUserAssessment(currentUser.id, newAssessmentResult);
      }
      
      if (profile.summary) {
        const session = startChatSession(profile.summary);
        setChatSession(session);
        setChatMessages([]); 
      }

      if (!finalNarrative && (!careers || careers.length === 0) && (!streams || streams.length === 0)) {
        setError("Could not retrieve full personalized guidance from AI. Basic profile calculated.");
      }
      navigateTo(AppPhase.Results);

    } catch (e) {
      console.error("Error during assessment processing or API call:", e);
      setError("An unexpected error occurred. Please try again.");
      const basicProfile = calculateStudentProfile(answers);
      setCurrentAssessmentData({ profile: basicProfile, profileNarrative: "Error generating AI guidance.", careerSuggestions:[], streamSuggestions:[], skillRecommendations: [] }); 
      setProfileNarrativeStreamed("Error generating AI guidance.");
      navigateTo(AppPhase.Results); 
    } finally {
        setLoadingMessage(undefined);
    }
  };

  const handleViewAssessment = async (assessmentId: string) => {
    navigateTo(AppPhase.LoadingResults);
    setLoadingMessage("Loading assessment results...");
    resetCurrentAssessmentState(); 

    try {
        const assessment = await getAssessmentById(assessmentId);
        if (assessment) {
            setSelectedAssessmentToView(assessment);
            setProfileNarrativeStreamed(assessment.profileNarrative || ""); 
             if (assessment.profile.summary) {
                const session = startChatSession(assessment.profile.summary);
                setChatSession(session);
                setChatMessages([]);
            }
            navigateTo(AppPhase.Results);
        } else {
            setError("Could not find the selected assessment.");
            navigateTo(AppPhase.Dashboard); 
        }
    } catch (e) {
        console.error("Error fetching assessment by ID:", e);
        setError("Failed to load the assessment. Please try again.");
        navigateTo(AppPhase.Dashboard);
    } finally {
        setLoadingMessage(undefined);
    }
  };
  
  const [comparisonData, setComparisonData] = useState<{
    assessment1: AssessmentRecord | null;
    assessment2: AssessmentRecord | null;
  }>({ assessment1: null, assessment2: null});

  useEffect(() => {
    if (appPhase === AppPhase.CompareAssessments && comparisonParams) {
      const fetchForCompare = async () => {
        setLoadingMessage("Loading assessments for comparison...");
        navigateTo(AppPhase.LoadingResults); 
        try {
          const [a1, a2] = await Promise.all([
            getAssessmentById(comparisonParams.id1),
            getAssessmentById(comparisonParams.id2)
          ]);
          if (a1 && a2) {
            setComparisonData({assessment1: a1, assessment2: a2});
            navigateTo(AppPhase.CompareAssessments); 
          } else {
            setError("Could not load one or both assessments for comparison.");
            navigateTo(AppPhase.Dashboard);
          }
        } catch (err) {
          setError("Error fetching assessments for comparison.");
          navigateTo(AppPhase.Dashboard);
        } finally {
          setLoadingMessage(undefined);
        }
      };
      fetchForCompare();
    }
  }, [appPhase, comparisonParams]);


  const renderContent = () => {
    const iscoStatusDisplay = () => {
        if (appPhase !== AppPhase.Login && appPhase !== AppPhase.LoadingResults && appPhase !== AppPhase.OccupationsExplorer) { 
            if (iscoDataLoading) {
                return <div className="text-center p-2 bg-blue-50 text-blue-700 rounded-md mb-4 text-sm" role="status">Initializing background data (occupations)...</div>;
            }
            if (iscoDataError && !isIscoDataSuccessfullyLoaded) { 
                return <div className="text-center p-2 bg-yellow-50 text-yellow-700 rounded-md mb-4 text-sm" role="alert">Occupational data unavailable: {iscoDataError}. Some features may be limited.</div>;
            }
        }
        return null;
    };


    const errorDisplay = (message: string | null) => message && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-2xl mx-auto text-center" role="alert">
            {message}
        </div>
    );

    const handleBackToDashboard = () => navigateTo(AppPhase.Dashboard);

    switch (appPhase) {
      case AppPhase.Login:
        return <AuthForm onLoginSuccess={handleLoginSuccess} />;
      
      case AppPhase.Dashboard:
        if (!currentUser) { navigateTo(AppPhase.Login); return <LoadingIndicator message="Redirecting..."/>; }
        return (
            <>
                {iscoStatusDisplay()}
                {errorDisplay(error)}
                <Dashboard 
                    user={currentUser} 
                    onStartNewAssessment={handleStartNewAssessment} 
                    onViewAssessment={handleViewAssessment}
                    onLogout={handleLogout}
                    navigateTo={navigateTo}
                />
            </>
        );

      case AppPhase.Questionnaire:
        if (!currentUser) { navigateTo(AppPhase.Login); return <LoadingIndicator message="Redirecting..."/>; }
        return (
          <>
            {iscoStatusDisplay()}
            {errorDisplay(error)}
            <Questionnaire
              questions={QUESTIONS_DATA}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmitAssessment}
              onCancel={handleBackToDashboard}
            />
          </>
        );
      case AppPhase.LoadingResults:
        return <LoadingIndicator message={loadingMessage} />;
      
      case AppPhase.Results:
        const displayData = selectedAssessmentToView || currentAssessmentData;
        if (!displayData || !displayData.profile) {
          setError("Failed to load profile for results. Please try from dashboard.");
          if (currentUser) navigateTo(AppPhase.Dashboard); else navigateTo(AppPhase.Login);
          return <LoadingIndicator message="Error loading results data..." />;
        }
        return (
            <>
                {iscoStatusDisplay()}
                {errorDisplay(error)}
                <ResultsDisplay
                    profile={displayData.profile}
                    profileNarrative={profileNarrativeStreamed} 
                    careerSuggestions={displayData.careerSuggestions}
                    streamSuggestions={displayData.streamSuggestions}
                    skillRecommendations={displayData.skillRecommendations}
                    onRetake={() => {
                        resetCurrentAssessmentState();
                        if (currentUser) navigateTo(AppPhase.Dashboard); else navigateTo(AppPhase.Login); 
                    }}
                    onBackToDashboard={handleBackToDashboard}
                    generalError={null} 
                    chatSession={chatSession}
                    chatMessages={chatMessages}
                    onSendChatMessage={sendChatMessageStream} 
                    addChatMessage={addChatMessageToList}
                    updateLastBotMessage={updateLastBotMessageInList}
                    setChatError={setChatErrorMessageInList}
                    navigateTo={navigateTo}
                />
            </>
        );
      case AppPhase.ResourceHub:
        return <> {iscoStatusDisplay()} <ResourceHub navigateToDashboard={handleBackToDashboard} /> </>;

      case AppPhase.CompareAssessments:
        if (!comparisonData.assessment1 || !comparisonData.assessment2) {
            if(!loadingMessage) setError("Assessments for comparison not loaded.");
            navigateTo(AppPhase.Dashboard); 
            return loadingMessage ? <LoadingIndicator message={loadingMessage} /> : errorDisplay(error);
        }
        return <> {iscoStatusDisplay()} <AssessmentComparisonView assessment1={comparisonData.assessment1} assessment2={comparisonData.assessment2} onBack={handleBackToDashboard} /> </>;
      
      case AppPhase.OccupationsExplorer:
        if (!currentUser) { navigateTo(AppPhase.Login); return <LoadingIndicator message="Redirecting..."/>; }
        return (
          <OccupationsExplorerPage 
            navigateToDashboard={handleBackToDashboard} 
            iscoInitialLoading={iscoDataLoading} 
            iscoLoadError={iscoDataError} 
            iscoSuccessfullyLoaded={isIscoDataSuccessfullyLoaded}
            deepLinkCode={iscoDeepLinkCode}
          />
        );

      case AppPhase.EducationExplorer:
        if (!currentUser) { navigateTo(AppPhase.Login); return <LoadingIndicator message="Redirecting..."/>; }
        return <EducationExplorerPage educationSystemData={IndianEducationSystemData} navigateToDashboard={handleBackToDashboard} />;

      case AppPhase.Bibliography:
        return <BibliographyPage navigateToDashboard={handleBackToDashboard} />;

      case AppPhase.Error: 
        return (
          <div className="text-center p-10 bg-white rounded-xl shadow-2xl max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-secondary mb-4">Oops! Something went wrong.</h2>
            <p className="text-gray-600 mb-6">{error || "An unexpected error occurred."}</p>
            <button
              onClick={() => {
                resetCurrentAssessmentState();
                if (currentUser) navigateTo(AppPhase.Dashboard); else navigateTo(AppPhase.Login);
              }}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
            >
              {currentUser ? "Back to Dashboard" : "Go to Login"}
            </button>
          </div>
        );
      default:
        console.warn("Unknown app phase:", appPhase);
        navigateTo(AppPhase.Login);
        return <LoadingIndicator message="Initializing..." />;
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-neutral font-sans">
      <Header onHomeClick={currentUser ? () => navigateTo(AppPhase.Dashboard) : undefined} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ErrorBoundary>
          {renderContent()}
        </ErrorBoundary>
      </main>
      <Footer onBibliographyClick={() => navigateTo(AppPhase.Bibliography)} />
    </div>
  );
};

export default App;
