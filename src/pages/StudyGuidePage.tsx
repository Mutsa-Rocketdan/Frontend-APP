import { useParams, useNavigate } from 'react-router-dom';
import { getLectureById } from '../data/curriculum';

// Mock 학습 가이드 (백엔드 연동 전)
const MOCK_GUIDE = {
  summary: '이번 강의에서는 객체지향 디자인 패턴 중 데코레이터 패턴과 옵저버 패턴을 다뤘습니다. 두 패턴 모두 유연하고 확장 가능한 코드 구조를 만드는 핵심 개념입니다.',
  keyPoints: [
    '데코레이터 패턴은 상속보다 합성(Composition)을 선호하는 대표적 예시',
    '옵저버 패턴은 이벤트 기반 프로그래밍의 기초 — React의 상태 관리와 연결됨',
    '파사드 패턴으로 복잡한 서브시스템을 단순화 → 코드 가독성 향상',
    '전략 패턴으로 알고리즘을 런타임에 교체 가능하게 설계',
  ],
  reviewPoints: [
    '데코레이터 vs 상속의 차이점을 설명할 수 있는가?',
    '옵저버 패턴에서 Subject와 Observer의 역할은?',
    '실제 Java 코드에서 데코레이터 패턴의 예시는? (InputStream, BufferedReader 등)',
    '각 패턴을 언제 사용하는지 판단 기준을 알고 있는가?',
  ],
  conceptMap: [
    { name: '데코레이터 패턴', related: ['합성', '래퍼(Wrapper)', '동적 기능 추가'] },
    { name: '옵저버 패턴', related: ['이벤트', 'Subject/Observer', '느슨한 결합'] },
    { name: '파사드 패턴', related: ['단순화', '서브시스템', '결합도 감소'] },
  ],
};

export const StudyGuidePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lecture = getLectureById(id ?? '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-5">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(`/lectures/${id}`)}
            className="text-gray-400 hover:text-[#FF6B00] text-sm mb-3 flex items-center gap-1 transition-colors"
          >
            ← 강의로 돌아가기
          </button>
          {lecture && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded-full">
                  {lecture.week}주차 학습 가이드
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{lecture.topic}</h1>
            </>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* 핵심 요약 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📝</span>
            <h2 className="font-bold text-gray-900">핵심 요약</h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{MOCK_GUIDE.summary}</p>
        </div>

        {/* 핵심 포인트 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">⭐</span>
            <h2 className="font-bold text-gray-900">핵심 포인트</h2>
          </div>
          <ul className="space-y-2.5">
            {MOCK_GUIDE.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 개념 맵 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🗺️</span>
            <h2 className="font-bold text-gray-900">개념 맵</h2>
          </div>
          <div className="space-y-3">
            {MOCK_GUIDE.conceptMap.map((item) => (
              <div key={item.name} className="flex flex-wrap items-center gap-2">
                <span className="bg-[#FF6B00] text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0">
                  {item.name}
                </span>
                <span className="text-gray-300 text-sm">→</span>
                {item.related.map((r) => (
                  <span key={r} className="bg-orange-50 border border-orange-200 text-orange-700 text-xs px-2.5 py-1 rounded-lg">
                    {r}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 복습 체크리스트 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✅</span>
            <h2 className="font-bold text-gray-900">복습 체크리스트</h2>
          </div>
          <ul className="space-y-2.5">
            {MOCK_GUIDE.reviewPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <input type="checkbox" className="mt-0.5 accent-[#FF6B00] w-4 h-4 shrink-0" />
                <span className="text-gray-600 text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 퀴즈로 이동 */}
        <button
          onClick={() => navigate(`/lectures/${id}`)}
          className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors"
        >
          ⚡ 퀴즈로 실력 확인하기
        </button>
      </div>
    </div>
  );
};
