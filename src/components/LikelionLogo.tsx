interface Props {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  iconOnly?: boolean;
  maxChars?: number;
}

/**
 * 멋쟁이사자처럼 로고 재현
 *
 * 아이콘 구조 (400x400 기준):
 *  ┌──────────────┐   ┌───────┐
 *  │  ◤ (왼쪽 큰 삼각형)│   │◥작은△│
 *  ├──────────────┘   └───────┤
 *  │ (세로 바)                  │
 *  ├────────────────────────────┤
 *  │         (가로 바)           │
 *  └────────────────────────────┘
 */
export const LikelionLogo = ({
  size = 'md',
  text = '멋쟁이사자처럼',
  iconOnly = false,
  maxChars,
}: Props) => {
  // 아이콘 기준 크기
  const BASE = 400;
  const SCALE = size === 'sm' ? 0.18 : size === 'md' ? 0.28 : 0.42;
  const iw = BASE * SCALE;
  const ih = BASE * SCALE;

  const FONT = size === 'sm' ? 16 : size === 'md' ? 24 : 38;
  const GAP = size === 'sm' ? 8 : size === 'md' ? 12 : 16;
  const charLimit = maxChars ?? (size === 'sm' ? 5 : undefined);
  const displayText = charLimit && text.length > charLimit ? text.slice(0, charLimit) : text;
  const totalW = iconOnly ? iw : iw + GAP + FONT * displayText.length * 0.9;
  const totalH = ih;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalW} ${totalH}`}
      width={totalW}
      height={totalH}
      role="img"
      aria-label={text}
    >
      {/* 아이콘 (멋쟁이사자처럼 스타일) */}
      <g transform={`scale(${SCALE})`}>
        {/*
          왼쪽 큰 삼각형
          꼭짓점: (50,50) - (175,50) - (50,230)
          → 왼쪽 수직 + 위 수평 + 오른쪽-아래 대각선 빗변
        */}
        <polygon points="50,50 175,50 50,230" fill="#FF6B00" />

        {/*
          오른쪽 작은 삼각형
          꼭짓점: (255,50) - (345,50) - (345,150)
          → 위 수평 + 오른쪽 수직 + 왼쪽-아래 대각선 빗변
        */}
        <polygon points="255,50 345,50 345,150" fill="#FF6B00" />

        {/* 세로 바 (L의 수직 부분) */}
        <rect x="50" y="230" width="85" height="80" fill="#FF6B00" />

        {/* 가로 바 (L의 수평 부분) */}
        <rect x="50" y="285" width="295" height="70" fill="#FF6B00" />
      </g>

      {/* 텍스트 */}
      {!iconOnly && (
        <text
          x={iw + GAP}
          y={ih * 0.72}
          fontFamily="'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
          fontWeight="900"
          fontSize={FONT}
          fill="#FF6B00"
          letterSpacing="-0.5"
        >
          {displayText}
        </text>
      )}
    </svg>
  );
};
