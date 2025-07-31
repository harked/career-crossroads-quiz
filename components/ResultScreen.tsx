import React from 'react';
import { GeminiAnalysis } from '../types';

interface ResultScreenProps {
  result: GeminiAnalysis | null;
  onRetake: () => void;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRetake }) => {
  if (!result) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">No results to display.</h2>
        <button
          onClick={onRetake}
          className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">{result.title}</h2>
      <div className="w-20 h-1 bg-sky-500 mx-auto mb-6 rounded-full"></div>
      
      <p className="text-slate-600 mb-8 text-lg leading-relaxed">{result.analysis}</p>
      
      <h3 className="text-2xl font-semibold text-slate-700 mb-4">Your Recommended Next Steps:</h3>
      <ul className="space-y-4 mb-8">
        {result.nextSteps.map((step, index) => (
          <li key={index} className="flex items-start bg-slate-50 p-4 rounded-lg">
            <CheckIcon />
            <span className="text-slate-700">{step}</span>
          </li>
        ))}
      </ul>
      
      <div className="text-center">
        <button
          onClick={onRetake}
          className="bg-slate-700 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-800 transition-all duration-300 transform hover:scale-105"
        >
          Retake the Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
