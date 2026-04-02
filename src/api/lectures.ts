import { apiClient } from './client';
import type { LectureCreate, LectureResponse, ConceptResponse, AITaskResponse, GuideResponse } from '../types';

export const createLecture = (data: LectureCreate) =>
  apiClient.post<LectureResponse>('/lectures', data);

export const getLectures = () =>
  apiClient.get<LectureResponse[]>('/lectures');

export const getLectureById = (id: string) =>
  apiClient.get<LectureResponse>(`/lectures/${id}`);

export const getConcepts = (lectureId: string) =>
  apiClient.get<ConceptResponse[]>(`/lectures/${lectureId}/concepts`);

export const getGuide = (lectureId: string) =>
  apiClient.get<GuideResponse>(`/lectures/${lectureId}/guides`);

export const createGuide = (lectureId: string) =>
  apiClient.post<AITaskResponse>(`/lectures/${lectureId}/guides`);

export const getTaskStatus = (taskId: string) =>
  apiClient.get<AITaskResponse>(`/tasks/${taskId}`);
