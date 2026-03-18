/**
 * AmbientBackground
 * 아주 은은한 오렌지 그라데이션 오브가 천천히 움직이는 배경 효과.
 * "빛이 스며든 공기" 같은 분위기 — 과하지 않고 잔잔하게 살아 있는 느낌.
 */
export const AmbientBackground = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      height: '100dvh',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
    }}
  >
    {/* 우측 상단 — 주광원 */}
    <div
      style={{
        position: 'absolute',
        width: '440px',
        height: '440px',
        top: '-170px',
        right: '-170px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(255,106,0,0.072) 0%, rgba(255,120,30,0.03) 45%, transparent 70%)',
        animation: 'orb-drift-a 22s ease-in-out infinite',
      }}
    />

    {/* 좌측 하단 — 반사광 */}
    <div
      style={{
        position: 'absolute',
        width: '380px',
        height: '380px',
        bottom: '-150px',
        left: '-150px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(255,106,0,0.052) 0%, rgba(255,140,40,0.02) 45%, transparent 70%)',
        animation: 'orb-drift-b 28s ease-in-out infinite',
      }}
    />

    {/* 상단 중앙 — 아주 약한 상단 빛 */}
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '320px',
        top: 0,
        left: 0,
        background:
          'radial-gradient(ellipse 90% 90% at 50% -20%, rgba(255,110,0,0.038) 0%, transparent 70%)',
      }}
    />
  </div>
);
