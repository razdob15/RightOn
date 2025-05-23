import React from 'react';
import { DateQuestion } from './DateQuestion';
import { RadioQuestion } from './RadioQuestion';
import { Question } from '../../types/questions';

export const QuestionComp: React.FC<Question> = (props) => {
  if (props.type === 'date') {
    return (
      <DateQuestion
        question={props.question}
        value={props.value}
        onChange={props.onChange}
      />
    );
  }

  return (
    <RadioQuestion
      question={props.question}
      value={props.value}
      onChange={props.onChange} options={props?.options} />
  );
};
