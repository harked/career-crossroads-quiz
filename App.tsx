import React, { useState, useCallback } from 'react';
import { QuizState, GeminiAnalysis } from './types';
import { QUIZ_QUESTIONS, ANSWER_OPTIONS } from './constants';
import { analyzeJobSatisfaction } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import ResultScreen from './components/ResultScreen';
import ProgressBar from './components/ProgressBar';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUIZ_QUESTIONS.length).fill(null));
  const [result, setResult] = useState<GeminiAnalysis | null>(null);

  const handleStartQuiz = () => {
    setQuizState('quiz');
  };

  const handleAnswerSelect = (answerValue: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerValue;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishQuiz = useCallback(async () => {
    setQuizState('loading');
    const analysis = await analyzeJobSatisfaction(answers);
    setResult(analysis);
    setQuizState('results');
  }, [answers]);

  const handleRetakeQuiz = () => {
    setQuizState('welcome');
    setCurrentQuestionIndex(0);
    setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null));
    setResult(null);
  };

  const renderContent = () => {
    switch (quizState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartQuiz} />;
      case 'quiz':
        const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
        const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;
        const isAnswerSelected = answers[currentQuestionIndex] !== null;

        return (
          <div className="w-full max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-xl animate-fade-in">
            <ProgressBar current={currentQuestionIndex + 1} total={QUIZ_QUESTIONS.length} />
            <p className="text-sm font-medium text-slate-500 mb-2">Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-8 min-h-[6rem]">{currentQuestion.text}</h2>
            
            <div className="space-y-3 mb-8">
              {ANSWER_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQuestionIndex] === option.value
                      ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-300'
                      : 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className="py-2 px-6 bg-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!isAnswerSelected}
                className="py-2 px-6 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-md disabled:shadow-none"
              >
                {isLastQuestion ? 'Finish & Analyze' : 'Next'}
              </button>
            </div>
          </div>
        );
      case 'loading':
        return <LoadingSpinner />;
      case 'results':
        return <ResultScreen result={result} onRetake={handleRetakeQuiz} />;
      default:
        return <WelcomeScreen onStart={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 relative overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <main className="z-10 w-full">
            {renderContent()}
        </main>
        <style>{`
            .animate-fade-in {
                animation: fadeIn 0.5s ease-in-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-blob {
                animation: blob 7s infinite;
            }
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
    </div>
  );
};

export default App;
