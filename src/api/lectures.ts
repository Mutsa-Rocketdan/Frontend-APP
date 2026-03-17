import { apiClient } from './client';
import type { LectureCreate, LectureResponse, ConceptResponse, AITaskResponse } from '../types';

export const createLecture = (data: LectureCreate) =>
  apiClient.post<LectureResponse>('/lectures', data);

export const getLectures = () =>
  apiClient.get<LectureResponse[]>('/lectures');

export const getConcepts = (lectureId: string) =>
  apiClient.get<ConceptResponse[]>(`/lectures/${lectureId}/concepts`);

export const getTaskStatus = (taskId: string) =>
  apiClient.get<AITaskResponse>(`/tasks/${taskId}`);
