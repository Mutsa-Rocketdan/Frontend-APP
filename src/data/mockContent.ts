import { getLectureById, type Lecture } from './curriculum';
import type { ConceptResponse, QuizResponse } from '../types';

interface StudyGuideMock {
  summary: string;
  keyPoints: string[];
  reviewPoints: string[];
  conceptMap: Array<{ name: string; related: string[] }>;
}

const conceptEntry = (
  id: number,
  lectureId: string,
  conceptName: string,
  description: string,
  masteryScore: number,
): ConceptResponse => ({
  id,
  lecture_id: lectureId,
  concept_name: conceptName,
  description,
  mastery_score: masteryScore,
});

const quizEntry = (
  lectureId: string,
  title: string,
  questions: QuizResponse['questions'],
): QuizResponse => ({
  id: lectureId,
  lecture_id: lectureId,
  user_id: 'mock',
  title,
  created_at: new Date('2026-03-18T09:00:00+09:00').toISOString(),
  questions,
});

const MOCK_CONCEPTS: Record<string, ConceptResponse[]> = {
  '2026-02-02': [
    conceptEntry(1, '2026-02-02', '데코레이터 패턴', '기존 객체에 새로운 기능을 동적으로 추가하는 구조적 디자인 패턴이다. 상속 대신 합성을 통해 기능을 유연하게 확장한다.', 0.3),
    conceptEntry(2, '2026-02-02', '옵저버 패턴', '한 객체의 상태 변화를 다른 객체들에게 자동으로 알리는 행동 패턴이다. 이벤트 기반 구조와 느슨한 결합을 이해할 때 핵심이 된다.', 0.6),
    conceptEntry(3, '2026-02-02', '파사드 패턴', '복잡한 서브시스템을 단순한 인터페이스로 감싸는 구조적 패턴이다. 클라이언트 코드의 의존성을 낮추는 데 도움이 된다.', 0.1),
    conceptEntry(4, '2026-02-02', '전략 패턴', '알고리즘을 캡슐화해 런타임에 교체할 수 있도록 설계하는 행동 패턴이다. 조건문 분기를 줄이고 확장성을 높인다.', 0.2),
  ],
  '2026-02-03': [
    conceptEntry(1, '2026-02-03', 'HTML 구조 설계', '시맨틱 태그를 활용해 문서의 의미와 계층 구조를 설계하는 기본 개념이다. 헤더, 메인, 섹션, 푸터 등의 역할을 구분한다.', 0.55),
    conceptEntry(2, '2026-02-03', 'CSS 선택자와 우선순위', '클래스, 아이디, 태그 선택자를 이해하고 어떤 스타일이 우선 적용되는지 판단하는 개념이다.', 0.4),
    conceptEntry(3, '2026-02-03', '박스 모델', 'margin, border, padding, content로 구성된 박스 모델을 이해하고 요소의 실제 크기를 계산하는 개념이다.', 0.35),
    conceptEntry(4, '2026-02-03', '레이아웃 기본기', 'display, flex, grid를 활용해 화면을 구성하는 기초 레이아웃 방식이다. 반응형 UI 설계의 출발점이 된다.', 0.2),
  ],
  '2026-02-12': [
    conceptEntry(1, '2026-02-12', 'Tailwind 유틸리티 클래스', '작은 단위의 유틸리티 클래스를 조합해 빠르게 UI를 구성하는 방식이다.', 0.5),
    conceptEntry(2, '2026-02-12', '컴포넌트 스타일링', '반복되는 UI 패턴을 공통 컴포넌트로 정리하고 일관된 스타일 규칙을 적용하는 개념이다.', 0.45),
    conceptEntry(3, '2026-02-12', '상태별 스타일 처리', 'hover, focus, disabled 같은 상호작용 상태를 스타일 레벨에서 관리하는 방법이다.', 0.3),
  ],
  '2026-02-24': [
    conceptEntry(1, '2026-02-24', 'HTTP 요청과 응답', '클라이언트와 서버가 요청과 응답으로 통신하는 기본 구조를 이해하는 개념이다.', 0.65),
    conceptEntry(2, '2026-02-24', '상태 코드', '200, 404, 500 같은 응답 상태 코드를 통해 서버 처리 결과를 해석하는 개념이다.', 0.45),
    conceptEntry(3, '2026-02-24', '헤더와 바디', 'HTTP 메시지의 메타데이터와 실제 데이터가 어떤 식으로 나뉘는지 이해하는 개념이다.', 0.25),
  ],
};

const MOCK_QUIZZES: Record<string, QuizResponse> = {
  '2026-02-02': quizEntry('2026-02-02', '데코레이터·옵저버 패턴 복습 퀴즈', [
    {
      id: 1,
      quiz_id: '2026-02-02',
      question_text: '데코레이터 패턴의 주요 목적은 무엇인가요?',
      options: ['객체 생성을 단순화한다', '기존 객체에 동적으로 새로운 기능을 추가한다', '복잡한 서브시스템을 단순한 인터페이스로 감싼다', '알고리즘을 캡슐화하여 교체 가능하게 한다'],
      correct_answer: '기존 객체에 동적으로 새로운 기능을 추가한다',
      explanation: '데코레이터 패턴은 상속 대신 합성을 사용하여 런타임에 객체의 책임을 유연하게 확장합니다.',
    },
    {
      id: 2,
      quiz_id: '2026-02-02',
      question_text: '옵저버 패턴에서 상태 변화를 구독하는 객체는 무엇인가요?',
      options: ['Subject', 'Observer', 'Facade', 'Strategy'],
      correct_answer: 'Observer',
      explanation: 'Subject가 상태를 변경하면 등록된 Observer들이 알림을 받아 동작합니다.',
    },
    {
      id: 3,
      quiz_id: '2026-02-02',
      question_text: '파사드 패턴의 대표적인 장점은 무엇인가요?',
      options: ['성능 최적화', '결합도 감소', '메모리 절약', '병렬 처리'],
      correct_answer: '결합도 감소',
      explanation: '파사드 패턴은 복잡한 하위 시스템을 하나의 단순한 인터페이스 뒤로 숨겨 클라이언트 코드의 의존성을 낮춥니다.',
    },
  ]),
  '2026-02-03': quizEntry('2026-02-03', 'HTML·CSS 화면 설계 복습 퀴즈', [
    {
      id: 1,
      quiz_id: '2026-02-03',
      question_text: '시맨틱 HTML 태그를 사용하는 가장 큰 이유는 무엇인가요?',
      options: ['파일 용량을 줄이기 위해', '문서의 의미 구조를 명확히 하기 위해', 'CSS를 사용하지 않기 위해', 'JavaScript 실행 속도를 높이기 위해'],
      correct_answer: '문서의 의미 구조를 명확히 하기 위해',
      explanation: '시맨틱 태그는 화면 구조를 더 잘 이해할 수 있게 도와주고 접근성과 유지보수성에도 이점을 줍니다.',
    },
    {
      id: 2,
      quiz_id: '2026-02-03',
      question_text: '박스 모델에 포함되지 않는 요소는 무엇인가요?',
      options: ['margin', 'padding', 'border', 'selector'],
      correct_answer: 'selector',
      explanation: '박스 모델은 content, padding, border, margin으로 구성되며 selector는 CSS 문법 요소입니다.',
    },
    {
      id: 3,
      quiz_id: '2026-02-03',
      question_text: '1차원 레이아웃 정렬에 가장 적합한 CSS 방식은 무엇인가요?',
      options: ['position absolute', 'float', 'flex', 'table'],
      correct_answer: 'flex',
      explanation: 'Flexbox는 한 방향 레이아웃에서 정렬과 간격 제어를 간단하게 처리할 수 있도록 도와줍니다.',
    },
  ]),
  '2026-02-12': quizEntry('2026-02-12', 'Tailwind 스타일링 복습 퀴즈', [
    {
      id: 1,
      quiz_id: '2026-02-12',
      question_text: 'Tailwind CSS의 핵심 스타일링 방식은 무엇인가요?',
      options: ['전역 CSS 파일만 사용한다', '유틸리티 클래스를 조합한다', '인라인 스타일만 사용한다', 'CSS를 자동 제거한다'],
      correct_answer: '유틸리티 클래스를 조합한다',
      explanation: 'Tailwind는 작은 유틸리티 클래스를 조합해 빠르게 UI를 구성하는 방식을 중심으로 합니다.',
    },
    {
      id: 2,
      quiz_id: '2026-02-12',
      question_text: '반복되는 UI 패턴을 정리할 때 가장 적절한 접근은 무엇인가요?',
      options: ['각 페이지에 복사한다', '공통 컴포넌트로 분리한다', '스타일을 모두 제거한다', '색상만 통일한다'],
      correct_answer: '공통 컴포넌트로 분리한다',
      explanation: '공통 컴포넌트로 분리하면 반복을 줄이고 일관된 디자인 시스템을 유지하기 쉬워집니다.',
    },
  ]),
  '2026-02-24': quizEntry('2026-02-24', 'HTTP 통신 개요 복습 퀴즈', [
    {
      id: 1,
      quiz_id: '2026-02-24',
      question_text: 'HTTP에서 클라이언트가 서버에 보내는 메시지는 무엇인가요?',
      options: ['response', 'request', 'header', 'status'],
      correct_answer: 'request',
      explanation: 'HTTP 통신은 클라이언트의 request와 서버의 response로 이루어집니다.',
    },
    {
      id: 2,
      quiz_id: '2026-02-24',
      question_text: '성공적으로 처리된 응답을 가장 일반적으로 나타내는 상태 코드는 무엇인가요?',
      options: ['200', '301', '404', '500'],
      correct_answer: '200',
      explanation: '200 OK는 요청이 정상적으로 처리되었음을 나타내는 대표적인 성공 상태 코드입니다.',
    },
  ]),
};

const MOCK_GUIDES: Record<string, StudyGuideMock> = {
  '2026-02-02': {
    summary: '이번 강의에서는 객체지향 디자인 패턴 중 데코레이터, 옵저버, 파사드, 전략 패턴을 살펴봤습니다. 공통적으로 확장 가능하고 변경에 유연한 구조를 만드는 것이 핵심이었습니다.',
    keyPoints: [
      '데코레이터 패턴은 상속보다 합성을 선호하는 대표적인 예시다.',
      '옵저버 패턴은 이벤트 기반 구조와 느슨한 결합을 설명할 때 자주 등장한다.',
      '파사드 패턴은 복잡한 하위 시스템을 감추고 단순한 진입점을 제공한다.',
      '전략 패턴은 알고리즘 교체를 쉽게 만들어 조건 분기를 줄여준다.',
    ],
    reviewPoints: [
      '데코레이터와 상속 기반 확장의 차이를 설명할 수 있는가?',
      'Subject와 Observer가 각각 어떤 책임을 가지는가?',
      '파사드 패턴이 복잡도를 낮추는 방식은 무엇인가?',
      '전략 패턴이 필요한 상황을 실제 예시로 설명할 수 있는가?',
    ],
    conceptMap: [
      { name: '데코레이터 패턴', related: ['합성', '래퍼', '동적 기능 추가'] },
      { name: '옵저버 패턴', related: ['이벤트', 'Subject/Observer', '느슨한 결합'] },
      { name: '파사드 패턴', related: ['단순화', '서브시스템', '결합도 감소'] },
      { name: '전략 패턴', related: ['알고리즘', '교체 가능', '분기 축소'] },
    ],
  },
  '2026-02-03': {
    summary: '이번 강의에서는 HTML과 CSS를 활용해 웹 화면의 구조와 표현을 설계하는 방법을 다뤘습니다. 문서 구조를 먼저 잡고 스타일을 단계적으로 적용하는 흐름이 중요했습니다.',
    keyPoints: [
      'HTML은 화면의 뼈대와 의미 구조를 담당한다.',
      'CSS는 선택자와 우선순위를 이해해야 예측 가능한 스타일링이 가능하다.',
      '박스 모델은 요소 간 간격과 실제 크기를 계산하는 데 필수다.',
      'Flex와 Grid는 화면 배치와 반응형 설계의 핵심 도구다.',
    ],
    reviewPoints: [
      '시맨틱 태그를 쓰는 이유를 설명할 수 있는가?',
      'margin, padding, border의 차이를 구분할 수 있는가?',
      'Flex와 Grid의 사용 상황 차이를 설명할 수 있는가?',
      '간단한 페이지 레이아웃을 직접 구조화할 수 있는가?',
    ],
    conceptMap: [
      { name: 'HTML 구조 설계', related: ['시맨틱 태그', '계층 구조', '접근성'] },
      { name: 'CSS 기본기', related: ['선택자', '우선순위', '스타일 상속'] },
      { name: '레이아웃', related: ['박스 모델', 'Flex', 'Grid'] },
    ],
  },
  '2026-02-12': {
    summary: '이번 강의에서는 Tailwind CSS를 활용해 React 컴포넌트를 더 빠르고 일관되게 스타일링하는 방법을 학습했습니다.',
    keyPoints: [
      '유틸리티 클래스를 조합해 빠르게 UI를 구성할 수 있다.',
      '반복되는 스타일은 컴포넌트 단위로 정리해야 유지보수가 쉬워진다.',
      '상태별 스타일을 미리 정의하면 상호작용 품질이 좋아진다.',
    ],
    reviewPoints: [
      'Tailwind의 장점과 단점을 설명할 수 있는가?',
      '공통 버튼 컴포넌트를 어떤 기준으로 분리할 것인가?',
      'hover, focus, disabled 상태를 어떻게 설계할 것인가?',
    ],
    conceptMap: [
      { name: 'Tailwind CSS', related: ['유틸리티 클래스', '빠른 스타일링', '일관성'] },
      { name: '컴포넌트 스타일링', related: ['재사용', '추상화', '디자인 시스템'] },
    ],
  },
  '2026-02-24': {
    summary: '이번 강의에서는 HTTP 통신의 기본 구조와 요청·응답 흐름을 이해하고, 상태 코드와 헤더를 해석하는 기초를 다졌습니다.',
    keyPoints: [
      'HTTP 통신은 요청과 응답의 쌍으로 이해해야 한다.',
      '상태 코드는 서버 처리 결과를 빠르게 해석하는 기준이 된다.',
      '헤더는 메타데이터, 바디는 실제 데이터를 담는다.',
    ],
    reviewPoints: [
      'request와 response의 차이를 설명할 수 있는가?',
      '200, 404, 500 상태 코드를 구분할 수 있는가?',
      '헤더와 바디에 어떤 정보가 들어가는지 예를 들 수 있는가?',
    ],
    conceptMap: [
      { name: 'HTTP 요청', related: ['메서드', 'URL', '헤더'] },
      { name: 'HTTP 응답', related: ['상태 코드', '헤더', '바디'] },
      { name: '웹 통신 흐름', related: ['클라이언트', '서버', '프로토콜'] },
    ],
  },
};

const buildGenericConcepts = (lecture: Lecture): ConceptResponse[] => [
  conceptEntry(1, lecture.id, lecture.topic, lecture.learning_goal, 0.45),
  conceptEntry(2, lecture.id, `${lecture.subject} 핵심 개념`, `${lecture.subject} 수업에서 다룬 핵심 내용을 바탕으로 정리한 mock 개념 카드입니다.`, 0.3),
];

const buildGenericQuiz = (lecture: Lecture): QuizResponse =>
  quizEntry(lecture.id, `${lecture.topic} 복습 퀴즈`, [
    {
      id: 1,
      quiz_id: lecture.id,
      question_text: `${lecture.topic} 수업의 핵심 목표로 가장 적절한 것은 무엇인가요?`,
      options: [lecture.learning_goal, '데이터베이스 튜닝을 자동화한다', '배포 파이프라인만 학습한다', '디자인 시스템을 완전히 대체한다'],
      correct_answer: lecture.learning_goal,
      explanation: '커리큘럼의 학습 목표를 기준으로 mock 퀴즈를 구성했습니다.',
    },
  ]);

const buildGenericGuide = (lecture: Lecture): StudyGuideMock => ({
  summary: `${lecture.topic} 수업에서는 ${lecture.learning_goal}를 중심으로 핵심 개념을 정리합니다.`,
  keyPoints: [
    `${lecture.topic}의 핵심 개념을 먼저 구조적으로 이해한다.`,
    '수업 목표를 실제 예시나 코드와 연결해 복습한다.',
    '반복 학습이 필요한 용어와 흐름을 체크리스트로 점검한다.',
  ],
  reviewPoints: [
    '학습 목표를 자신의 말로 다시 설명할 수 있는가?',
    '핵심 개념을 실제 예시와 연결할 수 있는가?',
    '다음 수업과 이어지는 맥락을 이해하고 있는가?',
  ],
  conceptMap: [
    { name: lecture.topic, related: [lecture.subject, '핵심 개념', '복습 포인트'] },
  ],
});

export const getMockConceptsByLectureId = (lectureId: string): ConceptResponse[] => {
  const lecture = getLectureById(lectureId);
  return MOCK_CONCEPTS[lectureId] ?? (lecture ? buildGenericConcepts(lecture) : MOCK_CONCEPTS['2026-02-02']);
};

export const getMockQuizByLectureId = (lectureId: string): QuizResponse | undefined => {
  const lecture = getLectureById(lectureId);
  if (!lecture) return undefined;
  return MOCK_QUIZZES[lectureId] ?? buildGenericQuiz(lecture);
};

export const getMockStudyGuideByLectureId = (lectureId: string): StudyGuideMock => {
  const lecture = getLectureById(lectureId);
  return MOCK_GUIDES[lectureId] ?? (lecture ? buildGenericGuide(lecture) : MOCK_GUIDES['2026-02-02']);
};
