// --- Auth ---
export interface UserResponse {
  id: string;
  email: string;
  nickname?: string;
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// --- Task ---
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AITaskResponse {
  task_id: string;
  type: string;
  status: TaskStatus;
  progress: number;
  result_url?: string;
  created_at: string;
}

// --- Lecture ---
export interface LectureResponse {
  id: string;
  user_id: string;
  title: string;
  content: string;
  task_id?: string;
  created_at: string;
}

export interface LectureCreate {
  title: string;
  content: string;
}

// --- Concept ---
export interface ConceptResponse {
  id: number;
  lecture_id: string;
  concept_name: string;
  description?: string;
  mastery_score: number;
}

// --- Quiz ---
export interface QuizQuestionResponse {
  id: number;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

export interface QuizResponse {
  id: string;
  lecture_id: string;
  user_id: string;
  title: string;
  task_id?: string;
  created_at: string;
  questions: QuizQuestionResponse[];
}

// --- Quiz Result ---
export interface QuizResultCreate {
  score: number;
  user_answers: string[];
  ai_feedback?: string;
}

export interface QuizResultResponse extends QuizResultCreate {
  id: number;
  user_id: string;
  quiz_id: string;
  created_at: string;
}
