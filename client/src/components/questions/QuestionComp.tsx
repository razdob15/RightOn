import React from 'react';
import { DateQuestion } from './DateQuestion';
import { RadioQuestion } from './RadioQuestion';
import { Question } from '../../types/questions';

type QuestionCompProps = {
  question: Question;
}

export const QuestionComp: React.FC<QuestionCompProps> = ({ question }: QuestionCompProps) => {
  switch (question.type) {
    case 'date':
      return (
        <DateQuestion
          question={question.question}
          value={new Date(question.value as number)}
          onChange={question.onChange}
        />
      );
    case 'radio':
      return (
        <RadioQuestion
          question={question.question}
          value={question.value}
          onChange={question.onChange}
          options={question.options}
        />
      );
    default:
      return null;
  }
}