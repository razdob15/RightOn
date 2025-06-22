export enum FormQuestionLabels {
  GENERAL = 'general',
  ALIYAH = 'aliyah',
  ARMY = 'army',
  HOUSING = 'housing',
}

export type FormQuestionsProps = {
  onSubmit: () => void;
  onValidityChange: (valid: boolean) => void;
  answers: any;
  setAnswers: (label: FormQuestionLabels, data: any) => void;
};
