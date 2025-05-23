import { Option } from "../components/questions/RadioQuestion";

export type QuestionType = "radio" | "date";

export interface BaseQuestion {
  type: QuestionType;
  question: string;
  value: any;
  options?: Option[]
  onChange: (value: any) => void;

}

export interface DateQuestion extends BaseQuestion {
  type: "date";
}

export interface RadioQuestion extends BaseQuestion {
  type: "radio";

}

export type Question = (DateQuestion | RadioQuestion) & {
  value: unknown;

}; 