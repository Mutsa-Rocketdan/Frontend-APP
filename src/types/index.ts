// --- Auth ---
export interface UserResponse {
  id: string;
  email: string;
  nickname?: string;
  role: 'user' | 'admin';
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
  week?: number;
  subject?: string;
  instructor?: string;
  session?: string;
  date?: string;
  is_active?: boolean;
  task_id?: string;
  created_at: string;
}

export interface LectureCreate {
  title: string;
  content: string;
  week?: number;
  subject?: string;
  instructor?: string;
  session?: string;
  date?: string;
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
export type QuizQuestionType = 'multiple_choice' | 'short_answer' | 'fill_blank' | 'code';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestionResponse {
  id: number;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
  type?: QuizQuestionType;
  difficulty?: QuizDifficulty;
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

// --- Guide ---
export interface GuideResponse {
  id: string;
  lecture_id: string;
  summary: string;
  key_summaries: string[];
  review_checklist: string[];
  concept_map?: Record<string, unknown>;
  created_at: string;
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
