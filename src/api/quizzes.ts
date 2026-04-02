import { apiClient } from './client';
import type { QuizResponse, QuizResultCreate, QuizResultResponse, QuizCreateOptions } from '../types';

export const createQuiz = (lectureId: string, options?: QuizCreateOptions) =>
  apiClient.post<QuizResponse>(`/lectures/${lectureId}/quizzes`, options ?? {});

export const getQuizzesByLecture = (lectureId: string) =>
  apiClient.get<QuizResponse[]>(`/lectures/${lectureId}/quizzes`);

export const getQuiz = (quizId: string) =>
  apiClient.get<QuizResponse>(`/quizzes/${quizId}`);

export const submitQuizResult = (quizId: string, data: QuizResultCreate) =>
  apiClient.post<QuizResultResponse>(`/quizzes/${quizId}/results`, data);

export const getQuizResults = () =>
  apiClient.get<QuizResultResponse[]>('/quiz-results');
