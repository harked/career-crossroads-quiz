import { Question, AnswerOption } from './types';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "I feel challenged and engaged by my daily tasks."
  },
  {
    id: 2,
    text: "I see clear opportunities for growth and advancement in my current role."
  },
  {
    id: 3,
    text: "My work-life balance is healthy and sustainable."
  },
  {
    id: 4,
    text: "I feel valued and recognized for my contributions."
  },
  {
    id: 5,
    text: "The company culture aligns with my personal values."
  },
  {
    id: 6,
    text: "I am fairly compensated for my skills and experience."
  },
  {
    id: 7,
    text: "I feel a sense of purpose and meaning in my work."
  },
  {
    id: 8,
    text: "I have a positive relationship with my manager and colleagues."
  }
];

export const ANSWER_OPTIONS: AnswerOption[] = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];
