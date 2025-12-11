
import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StudentProfile, CareerSuggestion, StreamSuggestion, BigFiveCategory, MBTICategory, RIASECCategory, ValueCategory, SkillRecommendation, ChatMessage, ChatRole } from '../types';
import { BIG_FIVE_DESCRIPTIONS, MBTI_DESCRIPTIONS, RIASEC_DESCRIPTIONS, VALUE_DESCRIPTIONS } from '../constants';
import Chatbot from './Chatbot'; // Import Chatbot
import { Chat } from '@google/genai'; // For chatSession type

interface ResultsDisplayProps {
  profile: StudentProfile;
  profileNarrative: string | null; // Already streamed string
  careerSuggestions: CareerSuggestion[];
  streamSuggestions: StreamSuggestion[];
  skillRecommendations?: SkillRecommendation[]; // New
  onRetake: () => void;
  generalError?: string | null;
  // Chatbot related props
  chatSession: Chat | null;
  chatMessages: ChatMessage[];
  onSendChatMessage: (chat: Chat, messageText: string) => AsyncIterable<string>;
  addChatMessage: (message: ChatMessage) => void;
  updateLastBotMessage: (chunk: string, isLastChunk: boolean) => void;
  setChatError: (messageId: string, errorText: string) => void;
}

const getScoreLevel = (score?: number): 'high' | 'moderate' | 'low' => {
  if (score === undefined) return 'moderate'; // Default for rendering
  if (score >= 3.8) return 'high';
  if (score >= 2.3) return 'moderate';
  return 'low';
};

const renderQualitativeScore = (score?: number): string => {
  if (score === undefined) return 'N/A';
  let qualitative = '';
  const level = getScoreLevel(score);
  if (level === 'high') qualitative = score >= 4.5 ? 'Very High' : 'High';
  else if (level === 'moderate') qualitative = 'Moderate';
  else qualitative = score < 1.5 ? 'Very Low' : 'Low';
  return `${score.toFixed(1)}/5 (${qualitative})`;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  profile, profileNarrative, careerSuggestions, streamSuggestions, skillRecommendations, onRetake, generalError,
  chatSession, chatMessages, onSendChatMessage, addChatMessage, updateLastBotMessage, setChatError
}) => {
  const resultsContentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleDownloadPdf = async () => {
    if (!resultsContentRef.current) {
      setPdfError("Could not find content to download.");
      return;
    }
    setIsGeneratingPdf(true);
    setPdfError(null);
    setShowChatbot(false); // Hide chatbot before taking screenshot

    // Brief delay to allow UI to update (chatbot to hide)
    await new Promise(resolve => setTimeout(resolve, 100));


    try {
      const sourceElement = resultsContentRef.current;
      const canvas = await html2canvas(sourceElement, {
        scale: 2, 
        useCORS: true, 
        logging: false, 
        width: sourceElement.scrollWidth, 
        height: sourceElement.scrollHeight,
        windowWidth: sourceElement.scrollWidth, // Correctly placed inside options object
        windowHeight: sourceElement.scrollHeight, // Correctly placed inside options object
      });

      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const pdfContentWidth = pdfPageWidth - 2 * margin;
      const pdfContentHeight = pdfPageHeight - 2 * margin;
      const sourceCanvasWidth = canvas.width;
      const sourceCanvasHeight = canvas.height;
      const onePageCanvasHeightPx = (pdfContentHeight * sourceCanvasWidth) / pdfContentWidth;
      let CROP_Y_POSITION = 0;
      let pageIndex = 0;

      while (CROP_Y_POSITION < sourceCanvasHeight) {
        if (pageIndex > 0) pdf.addPage();
        const remainingSourceHeight = sourceCanvasHeight - CROP_Y_POSITION;
        const sliceHeightPx = Math.min(remainingSourceHeight, onePageCanvasHeightPx);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = sourceCanvasWidth;
        pageCanvas.height = sliceHeightPx;
        const pageCtx = pageCanvas.getContext('2d');
        if (!pageCtx) {
          setPdfError("Failed to create canvas context for PDF page."); setIsGeneratingPdf(false); return;
        }
        pageCtx.drawImage(canvas, 0, CROP_Y_POSITION, sourceCanvasWidth, sliceHeightPx, 0, 0, sourceCanvasWidth, sliceHeightPx);
        const pageImgData = pageCanvas.toDataURL('image/png');
        const renderWidthMM = pdfContentWidth;
        const renderHeightMM = (sliceHeightPx / sourceCanvasWidth) * renderWidthMM;
        pdf.addImage(pageImgData, 'PNG', margin, margin, renderWidthMM, renderHeightMM);
        CROP_Y_POSITION += sliceHeightPx;
        pageIndex++;
      }
      pdf.save('GuideAI_Results.pdf');
    } catch (err) {
      console.error("Error generating PDF:", err);
      setPdfError(err instanceof Error ? `PDF Error: ${err.message}` : "PDF generation failed.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  
  // Simplified Chatbot message sender for ResultsDisplay context
  const handleChatbotSendMessage = async (currentChatSession: Chat, messageText: string): Promise<void> => {
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: ChatRole.User, text: messageText, timestamp: Date.now() };
    addChatMessage(userMsg);

    const botMsgId = `model-${Date.now()}`;
    addChatMessage({ id: botMsgId, role: ChatRole.Model, text: "...", timestamp: Date.now() });
    
    let accumulatedResponse = "";
    try {
        for await (const chunk of onSendChatMessage(currentChatSession, messageText)) {
            accumulatedResponse += chunk;
            updateLastBotMessage(accumulatedResponse + "...", false);
        }
        updateLastBotMessage(accumulatedResponse, true);
    } catch (error) {
        console.error("Chatbot stream error in ResultsDisplay:", error);
        setChatError(botMsgId, "Sorry, I encountered an error.");
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto">
      <div ref={resultsContentRef} className="p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-2xl print-content">
        {/* Completion Badge */}
        <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-lg text-center shadow">
          <h3 className="text-xl font-semibold flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 mr-2">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l4.006-5.5a.75.75 0 00-.227-1.06z" clipRule="evenodd" />
            </svg>
            Assessment Completed!
          </h3>
          <p className="text-sm">Your personalized guidance is ready below.</p>
        </div>

        <h2 className="text-3xl font-bold text-center text-primary mb-8 font-roboto-slab">Your Assessment Results</h2>

        {generalError}

        {profileNarrative && (
          <section className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md border border-blue-200" aria-labelledby="profile-overview-heading">
            <h3 id="profile-overview-heading" className="text-2xl font-semibold text-neutral-dark mb-3 flex items-center">
              {/* SVG Icon */} Your Profile Overview
            </h3>
            <div className="text-gray-700 space-y-3 leading-relaxed whitespace-pre-wrap">
              {profileNarrative}
            </div>
          </section>
        )}

        <section className="mb-8" aria-labelledby="psychometric-profile-heading">
          <h3 id="psychometric-profile-heading" className="text-2xl font-semibold text-neutral-dark mb-4 border-b-2 border-primary pb-2">
             Detailed Psychometric Profile
          </h3>
          {/* Big Five */}
          {profile.bigFive && Object.keys(profile.bigFive).length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-gray-700 mb-3">Big Five Traits:</h4>
              {Object.entries(profile.bigFive).map(([trait, score]) => {
                const category = trait as BigFiveCategory;
                const descriptions = BIG_FIVE_DESCRIPTIONS[category];
                const scoreLevel = getScoreLevel(score);
                return (
                  <div key={trait} className="mb-4 p-3 bg-white border border-gray-200 rounded" aria-labelledby={`b5-${category}-heading`}>
                    <h5 id={`b5-${category}-heading`} className="font-bold text-primary">{category}</h5>
                    <p className="text-sm text-gray-600 italic mt-1">{descriptions.general}</p>
                    <p className="mt-2 font-medium">Your Score: <span className="text-accent">{renderQualitativeScore(score)}</span></p>
                    <p className="text-sm text-gray-700 mt-1">{descriptions[scoreLevel]}</p>
                  </div>
                );
              })}
            </div>
          )}
          {/* MBTI */}
          {profile.mbti && Object.keys(profile.mbti).length > 0 && (
             <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-gray-700 mb-3">MBTI-Style Preferences:</h4>
              {Object.entries(profile.mbti).map(([categoryStr, data]) => {
                  if (!data) return null;
                  const category = categoryStr as MBTICategory;
                  const descriptions = MBTI_DESCRIPTIONS[category];
                  const preferredPoleData = data.dominantPole === descriptions.pole1.pole ? descriptions.pole1 : descriptions.pole2;
                  return (
                    <div key={category} className="mb-4 p-3 bg-white border border-gray-200 rounded" aria-labelledby={`mbti-${category}-heading`}>
                      <h5 id={`mbti-${category}-heading`} className="font-bold text-primary">{category} - <span className="italic text-gray-600 text-sm">{descriptions.dimension}</span></h5>
                      <p className="mt-2 font-medium">Your Preference: <span className="text-accent">{preferredPoleData.name}</span></p>
                      <p className="text-sm text-gray-700 mt-1">{preferredPoleData.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        (Score for {data.dominantPole}: {data.scoreDominant.toFixed(1)} vs Score for {data.dominantPole === descriptions.pole1.pole ? descriptions.pole2.pole : descriptions.pole1.pole}: {data.scoreRecessive.toFixed(1)})
                      </p>
                    </div>
                  );
              })}
            </div>
          )}
          {/* RIASEC */}
          {profile.riasec && Object.keys(profile.riasec).length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-gray-700 mb-3">RIASEC Interests:</h4>
              {Object.entries(profile.riasec).map(([interest, score]) => {
                const category = interest as RIASECCategory;
                const descriptions = RIASEC_DESCRIPTIONS[category];
                const scoreLevel = getScoreLevel(score);
                return (
                  <div key={interest} className="mb-4 p-3 bg-white border border-gray-200 rounded" aria-labelledby={`riasec-${category}-heading`}>
                    <h5 id={`riasec-${category}-heading`} className="font-bold text-primary">{category}</h5>
                    <p className="text-sm text-gray-600 italic mt-1">{descriptions.general}</p>
                    <p className="mt-2 font-medium">Your Score: <span className="text-accent">{renderQualitativeScore(score)}</span></p>
                    <p className="text-sm text-gray-700 mt-1">{descriptions[scoreLevel]}</p>
                  </div>
                );
              })}
            </div>
          )}
          {/* Values - New Section */}
          {profile.values && Object.keys(profile.values).length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg shadow">
              <h4 className="text-xl font-semibold text-gray-700 mb-3">Work Value Preferences:</h4>
              {Object.entries(profile.values).map(([value, score]) => {
                const category = value as ValueCategory;
                const descriptions = VALUE_DESCRIPTIONS[category];
                const scoreLevel = getScoreLevel(score);
                return (
                  <div key={value} className="mb-4 p-3 bg-white border border-gray-200 rounded" aria-labelledby={`value-${category}-heading`}>
                    <h5 id={`value-${category}-heading`} className="font-bold text-primary">{category}</h5>
                    <p className="text-sm text-gray-600 italic mt-1">{descriptions.general}</p>
                    <p className="mt-2 font-medium">Your Score: <span className="text-accent">{renderQualitativeScore(score)}</span></p>
                    <p className="text-sm text-gray-700 mt-1">{descriptions[scoreLevel]}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Career Suggestions */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg shadow" aria-labelledby="career-suggestions-heading">
          <h3 id="career-suggestions-heading" className="text-2xl font-semibold text-neutral-dark mb-4 border-b-2 border-accent pb-2 flex items-center">
            Career Suggestions
          </h3>
          {(!careerSuggestions || careerSuggestions.length === 0) && !generalError ? (
             <p className="text-gray-600">No specific career suggestions could be generated at this time.</p>
          ) : (
          <ul className="space-y-4">
            {careerSuggestions?.map((career, index) => (
              <li key={index} className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-lg transition-shadow">
                <h4 className="text-xl font-semibold text-accent">{career.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{career.description}</p>
                <p className="text-sm text-gray-700 mt-2"><strong className="font-medium">Rationale:</strong> {career.rationale}</p>
                <p className="text-sm text-gray-700 mt-1"><strong className="font-medium">Education Path (India):</strong> {career.educationPathIndia}</p>
                {career.dayInTheLifeNarrative && (
                  <p className="text-sm text-gray-700 mt-2 italic bg-blue-50 p-2 rounded">
                    <strong className="font-medium not-italic">A Day in the Life:</strong> {career.dayInTheLifeNarrative}
                  </p>
                )}
                {career.dayInTheLifeImageUrl && (
                  <div className="mt-3">
                    <img src={career.dayInTheLifeImageUrl} alt={`Visual representation of ${career.name}`} className="rounded-md shadow-sm max-h-48 object-contain border" />
                  </div>
                )}
              </li>
            ))}
          </ul>
          )}
        </section>

        {/* Stream Suggestions */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg shadow" aria-labelledby="stream-suggestions-heading">
          <h3 id="stream-suggestions-heading" className="text-2xl font-semibold text-neutral-dark mb-4 border-b-2 border-secondary pb-2 flex items-center">
            Academic Stream Suggestions
          </h3>
           {(!streamSuggestions || streamSuggestions.length === 0) && !generalError ? (
             <p className="text-gray-600">No specific academic stream suggestions could be generated at this time.</p>
          ) : (
          <ul className="space-y-4">
            {streamSuggestions?.map((stream, index) => (
              <li key={index} className="p-4 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-lg transition-shadow">
                <h4 className="text-xl font-semibold text-secondary">{stream.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{stream.description}</p>
                <p className="text-sm text-gray-700 mt-2"><strong className="font-medium">Rationale:</strong> {stream.rationale}</p>
                {stream.subjects && stream.subjects.length > 0 && (
                  <p className="text-sm text-gray-700 mt-1"><strong className="font-medium">Key Subjects:</strong> {stream.subjects.join(', ')}</p>
                )}
              </li>
            ))}
          </ul>
          )}
        </section>

        {/* Skill Recommendations - New Section */}
        {skillRecommendations && skillRecommendations.length > 0 && (
          <section className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow" aria-labelledby="skill-recs-heading">
            <h3 id="skill-recs-heading" className="text-2xl font-semibold text-neutral-dark mb-4 border-b-2 border-yellow-400 pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-yellow-600"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
              Skills to Develop
            </h3>
            <ul className="space-y-4">
              {skillRecommendations.map((skill, index) => (
                <li key={index} className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                  <h4 className="text-xl font-semibold text-yellow-700">{skill.skillName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                  <p className="text-sm text-gray-700 mt-2"><strong className="font-medium">Relevance:</strong> {skill.relevance}</p>
                  {skill.learningResources && skill.learningResources.length > 0 && (
                    <div className="mt-2">
                      <strong className="text-sm font-medium text-gray-700">Suggested Resources:</strong>
                      <ul className="list-disc list-inside ml-4 text-sm">
                        {skill.learningResources.map((res, resIdx) => (
                          <li key={resIdx}>
                            <a href={res.url !== '#' ? res.url : undefined} target="_blank" rel="noopener noreferrer" className={`hover:underline ${res.url !== '#' ? 'text-blue-600' : 'text-gray-500 cursor-default'}`}>
                              {res.title} ({res.type})
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Chatbot Toggle & Display Area - NOT part of PDF content */}
      <div className="mt-6 text-center">
        <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition duration-150 flex items-center justify-center mx-auto focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            aria-expanded={showChatbot}
            aria-controls="ai-mentor-chatbot"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
               <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m2.25-3H12m2.25-3H12M3 12l3 3m0 0l3-3m-3 3v6m0-6V6m6-3v18m6-18v18" />
            </svg>
            {showChatbot ? "Hide AI Mentor Chat" : "Chat with AI Mentor"}
        </button>
      </div>

      {showChatbot && chatSession && (
        <div id="ai-mentor-chatbot" className="mt-6 max-w-2xl mx-auto" role="region" aria-live="polite">
           <Chatbot
                chatSession={chatSession}
                initialMessages={chatMessages}
                onSendMessage={(session, text) => {
                    // This is a bit of a workaround: Chatbot directly calls onSendMessage which is async iterable
                    // We need to manage message state in App.tsx
                    handleChatbotSendMessage(session, text); 
                    // The onSendMessage prop for Chatbot itself needs to match its signature.
                    // The actual streaming logic will be handled via App.tsx states.
                    // So we return an empty async iterable here, or handle it inside Chatbot more directly if preferred.
                    // For this structure, where App.tsx manages messages:
                    return (async function*() {})(); // Return empty async iterable.
                }}
            />
        </div>
      )}
       {showChatbot && !chatSession && (
         <p className="text-center text-red-500 mt-2">AI Mentor Chat session could not be started. Please try reloading the results.</p>
       )}


      {pdfError && ( null /* PDF error display. Comment was: {pdfError && ( /* PDF error display * / )} */ )}
      <div className="text-center mt-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf || !resultsContentRef.current}
          className="px-8 py-3 bg-accent text-white font-semibold rounded-lg shadow hover:bg-emerald-600 transition duration-150 flex items-center justify-center sm:w-auto w-full disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
          aria-label="Download results as PDF"
        >
          {isGeneratingPdf ? "Generating PDF..." : "Download Results as PDF"}
        </button>
        <button
          onClick={onRetake}
          className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-150 flex items-center justify-center sm:w-auto w-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          aria-label="Retake assessment and return to dashboard"
        >
          Retake Assessment
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
