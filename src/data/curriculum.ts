export interface Lecture {
  id: string; // date string (e.g. "2026-02-02")
  week: number;
  date: string;
  subject: string;
  topic: string;
  learning_goal: string;
  instructor: string;
  script_file: string;
}

export const LECTURES: Lecture[] = [
  // 1주차
  {
    id: '2026-02-02', week: 1, date: '2026-02-02',
    subject: '객체지향 프로그래밍',
    topic: '데코레이터 패턴 · 옵저버 패턴',
    learning_goal: '데코레이터 패턴과 옵저버 패턴의 구조를 이해하고 Java로 구현할 수 있다',
    instructor: '김영아', script_file: '2026-02-02_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-03', week: 1, date: '2026-02-03',
    subject: 'Front-End Programming',
    topic: 'HTML · CSS를 이용한 화면 설계 및 표현',
    learning_goal: 'HTML 구조와 CSS 스타일링 기법을 이해하고 기본 웹 페이지를 구현할 수 있다',
    instructor: '김영아', script_file: '2026-02-03_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-04', week: 1, date: '2026-02-04',
    subject: 'Front-End Programming',
    topic: 'HTML · CSS 심화',
    learning_goal: 'HTML 구조와 CSS 스타일링 기법을 이해하고 기본 웹 페이지를 구현할 수 있다',
    instructor: '김영아', script_file: '2026-02-04_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-05', week: 1, date: '2026-02-05',
    subject: 'Front-End Programming',
    topic: 'JavaScript 기본 문법',
    learning_goal: 'JavaScript의 변수, 함수, 이벤트 처리 등 기본 문법을 이해하고 활용할 수 있다',
    instructor: '김영아', script_file: '2026-02-05_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-06', week: 1, date: '2026-02-06',
    subject: 'Front-End Programming',
    topic: 'JavaScript 기본 문법 심화',
    learning_goal: 'JavaScript의 변수, 함수, 이벤트 처리 등 기본 문법을 이해하고 활용할 수 있다',
    instructor: '김영아', script_file: '2026-02-06_kdt-backendj-21th.txt',
  },
  // 2주차
  {
    id: '2026-02-09', week: 2, date: '2026-02-09',
    subject: 'Front-End Programming',
    topic: 'React.js 기반의 웹 사이트 구현',
    learning_goal: 'React 컴포넌트 구조와 상태 관리를 이해하고 기본 웹 사이트를 구현할 수 있다',
    instructor: '김영아', script_file: '2026-02-09_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-10', week: 2, date: '2026-02-10',
    subject: 'Front-End Programming',
    topic: 'React.js 컴포넌트와 Props',
    learning_goal: 'React 컴포넌트 구조와 상태 관리를 이해하고 기본 웹 사이트를 구현할 수 있다',
    instructor: '김영아', script_file: '2026-02-10_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-11', week: 2, date: '2026-02-11',
    subject: 'Front-End Programming',
    topic: 'React.js State와 Hooks',
    learning_goal: 'React 컴포넌트 구조와 상태 관리를 이해하고 기본 웹 사이트를 구현할 수 있다',
    instructor: '김영아', script_file: '2026-02-11_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-12', week: 2, date: '2026-02-12',
    subject: 'Front-End Programming',
    topic: '컴포넌트 스타일링 (Tailwind CSS)',
    learning_goal: 'Tailwind CSS를 활용하여 React 컴포넌트를 스타일링할 수 있다',
    instructor: '김영아', script_file: '2026-02-12_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-13', week: 2, date: '2026-02-13',
    subject: 'Front-End Programming',
    topic: 'Tailwind CSS 심화 및 반응형 디자인',
    learning_goal: 'Tailwind CSS를 활용하여 React 컴포넌트를 스타일링할 수 있다',
    instructor: '김영아', script_file: '2026-02-13_kdt-backendj-21th.txt',
  },
  // 3주차
  {
    id: '2026-02-23', week: 3, date: '2026-02-23',
    subject: 'Front-End Programming',
    topic: 'React Query · 서버 상태 관리',
    learning_goal: 'React Query를 활용하여 서버 상태를 관리하고 비동기 데이터를 처리할 수 있다',
    instructor: '김영아', script_file: '2026-02-23_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-24', week: 3, date: '2026-02-24',
    subject: 'Back-End Programming',
    topic: 'HTTP 통신 개요 및 웹 작동 방식',
    learning_goal: 'HTTP 프로토콜의 구조와 요청/응답 방식을 이해하고 웹 통신 흐름을 설명할 수 있다',
    instructor: '김영아', script_file: '2026-02-24_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-25', week: 3, date: '2026-02-25',
    subject: 'Back-End Programming',
    topic: 'HTTP 메서드와 REST API',
    learning_goal: 'HTTP 프로토콜의 구조와 요청/응답 방식을 이해하고 웹 통신 흐름을 설명할 수 있다',
    instructor: '김영아', script_file: '2026-02-25_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-26', week: 3, date: '2026-02-26',
    subject: 'Back-End Programming',
    topic: 'HTTP 심화 · 상태코드와 헤더',
    learning_goal: 'HTTP 프로토콜의 구조와 요청/응답 방식을 이해하고 웹 통신 흐름을 설명할 수 있다',
    instructor: '김영아', script_file: '2026-02-26_kdt-backendj-21th.txt',
  },
  {
    id: '2026-02-27', week: 3, date: '2026-02-27',
    subject: 'Back-End Programming',
    topic: 'HTTP 실습 및 정리',
    learning_goal: 'HTTP 프로토콜의 구조와 요청/응답 방식을 이해하고 웹 통신 흐름을 설명할 수 있다',
    instructor: '김영아', script_file: '2026-02-27_kdt-backendj-21th.txt',
  },
];

export const WEEKS = [...new Set(LECTURES.map((l) => l.week))].sort();

export const getLectureById = (id: string) => LECTURES.find((l) => l.id === id);

const SUBJECT_COLORS: Record<string, string> = {
  '객체지향 프로그래밍': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'Front-End Programming': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Back-End Programming': 'bg-green-500/10 text-green-400 border-green-500/30',
};
export const getSubjectStyle = (subject: string) =>
  SUBJECT_COLORS[subject] || 'bg-zinc-700/50 text-zinc-400 border-zinc-600';
