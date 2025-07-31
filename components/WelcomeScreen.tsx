import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center p-8 max-w-2xl mx-auto">
      <img src="/harma.png" alt="Harmadillo" className="mx-auto mb-8 w-70" />
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
        Is It Time for a Career Change?
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        This short quiz will help you reflect on your current job satisfaction. Answer honestly to get a personalized AI-powered analysis of your situation.
      </p>
      <button
        onClick={onStart}
        className="bg-sky-600 text-white font-bold py-3 px-8 rounded-full hover:bg-sky-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Start the Quiz
      </button>
    </div>
  );
};

export default WelcomeScreen;
