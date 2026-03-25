import { apiClient } from './client';
import type { LectureCreate, LectureResponse, ConceptResponse, AITaskResponse, GuideResponse } from '../types';

export const createLecture = (data: LectureCreate) =>
  apiClient.post<LectureResponse>('/lectures', data);

export const getLectures = () =>
  apiClient.get<LectureResponse[]>('/lectures');

export const getLectureById = async (id: string) => {
  const res = await apiClient.get<LectureResponse[]>('/lectures');
  const lecture = res.data.find((l) => l.id === id);
  if (!lecture) throw new Error('Lecture not found');
  return { ...res, data: lecture };
};

export const getConcepts = (lectureId: string) =>
  apiClient.get<ConceptResponse[]>(`/lectures/${lectureId}/concepts`);

export const getGuide = (lectureId: string) =>
  apiClient.get<GuideResponse>(`/lectures/${lectureId}/guides`);

export const getTaskStatus = (taskId: string) =>
  apiClient.get<AITaskResponse>(`/tasks/${taskId}`);
