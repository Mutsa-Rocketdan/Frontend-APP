interface Props {
  className?: string;
  iconOnly?: boolean;
}

export const LikelionLogo = ({ className = '', iconOnly = false }: Props) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {/* 멋쟁이사자처럼 스타일 아이콘 (ㄴ 형태) */}
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="10" height="28" fill="#FF6B00" />
      <rect x="0" y="20" width="32" height="8" fill="#FF6B00" />
      <rect x="22" y="0" width="10" height="12" fill="#FF6B00" />
    </svg>
    {!iconOnly && (
      <span className="font-black text-lg text-[#FF6B00] tracking-tight leading-none">
        AI Quiz
      </span>
    )}
  </div>
);
