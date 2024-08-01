export class ProblemDTO {
  question: string;
  answer: any;
}

export class GeneratedProblemDTO {
  id: string;
  question: string;
  answer: string;
  image: string;
  image_path: string;
  whole_text: string;
}
