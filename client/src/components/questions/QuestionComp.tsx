import React from 'react';
import { DateQuestion } from './DateQuestion';
import { RadioQuestion } from './RadioQuestion';
import type { Question } from '../../types/questions';

type QuestionCompProperties = {
  question: Question;
};

export const QuestionComp: React.FC<QuestionCompProperties> = ({
  question,
}: QuestionCompProperties) => {
  switch (question.type) {
    case 'date': {
      return (
        <DateQuestion
          question={question.question}
          value={question.value ? new Date(question.value as number) : undefined}
          onChange={question.onChange}
        />
      );
    }
    case 'radio': {
      return (
        <RadioQuestion
          question={question.question}
          value={question.value as string}
          onChange={question.onChange}
          options={question.options}
        />
      );
    }
    default: {
      return null;
    }
  }
};
