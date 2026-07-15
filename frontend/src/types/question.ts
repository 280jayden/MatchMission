export type QuestionOption = {
  value: string;
  option: string;
};

export type QuestionType = 'radio' | 'checkbox' | 'text';

export type Question = {
  id: number;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
};
