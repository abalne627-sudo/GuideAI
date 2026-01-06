
import React, { useState } from 'react';
import { Question, Answers, Framework } from '../types';
import LikertScaleInput from './LikertScaleInput';

interface QuestionnaireProps {
  questions: Question[];
  answers: Answers;
  onAnswerChange: (questionId: string, value: number) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

const getFrameworkName = (framework: Framework): string => {
  switch (framework) {
    case Framework.BigFive: return "Big Five Personality";
    case Framework.MBTI: return "MBTI-Style Preferences";
    case Framework.RIASEC: return "Holland's RIASEC Interests";
    case Framework.Values: return "Work Value Preferences"; 
    default: return "Question";
  }
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ questions, answers, onAnswerChange, onSubmit, onCancel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  const allQuestionsAnsweredForSubmit = () => {
    return Object.keys(answers).length === questions.length;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-2xl">
      <div className="mb-6 text-center">
        <p className="text-sm font-medium text-primary" aria-label={`Current section: ${getFrameworkName(currentQuestion.framework)}`}>
          {getFrameworkName(currentQuestion.framework)}
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-dark mt-1" aria-label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3" role="progressbar" aria-valuenow={(currentQuestionIndex + 1) / questions.length * 100} aria-valuemin={0} aria-valuemax={100} aria-label="Questionnaire progress">
          <div 
            className="bg-accent h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="py-6 px-2 sm:px-4 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-lg sm:text-xl text-neutral-dark text-center font-medium min-h-[60px] flex items-center justify-center">
          {currentQuestion.text}
        </p>
      </div>
      
      <LikertScaleInput
        questionId={currentQuestion.id}
        currentValue={answers[currentQuestion.id]}
        onChange={(value) => onAnswerChange(currentQuestion.id, value)}
      />

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-300 text-neutral-dark font-semibold rounded-lg shadow hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
          aria-label="Previous question"
        >
          Previous
        </button>
        {!isLastQuestion && (
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            aria-label="Next question"
          >
            Next
          </button>
        )}
        {isLastQuestion && (
          <button
            onClick={onSubmit}
            disabled={!allQuestionsAnsweredForSubmit()}
            className="px-6 py-3 bg-accent text-white font-semibold rounded-lg shadow hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
            aria-label="Submit all answers"
          >
            Submit Answers
          </button>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-red-500 text-sm font-medium flex items-center transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m9.75 0V18.75A2.25 2.25 0 0115.75 21h-7.5A2.25 2.25 0 016 18.75V9m13.5 0h-15" />
            </svg>
            Cancel and Return to Dashboard
          </button>
        )}
      </div>

      {!allQuestionsAnsweredForSubmit() && isLastQuestion && (
         <p className="text-center text-red-500 text-sm mt-4" role="alert">Please answer all questions before submitting.</p>
      )}
    </div>
  );
};

export default Questionnaire;
