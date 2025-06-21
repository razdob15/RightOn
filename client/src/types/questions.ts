export type Option = {
  value: string;
  label: string;
};

export type QuestionType = 'radio' | 'date';

export interface BaseQuestion {
  type: QuestionType;
  question: string;
}

export interface DateQuestion extends BaseQuestion {
  type: 'date';
  value?: number;
  onChange: (value: number) => void;
}

export interface RadioQuestion extends BaseQuestion {
  type: 'radio';
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
}

export type Question = (DateQuestion | RadioQuestion) & {
  value?: unknown;
};
