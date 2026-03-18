interface Props {
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  className?: string;
  /** 어두운 배경(dark hero 등)에서 orange.png 사용, 기본은 white.png */
  variant?: "white" | "orange";
}

const SIZE_MAP = {
  sm: "h-7",
  md: "h-10",
  lg: "h-14",
};

export const LikelionLogo = ({
  size = "md",
  className = "",
  variant = "white",
}: Props) => {
  const src = variant === "orange" ? "/orange.png" : "/white.png";
  const heightClass = SIZE_MAP[size];

  return (
    <img
      src={src}
      alt="멋쟁이사자처럼 로고"
      className={`${heightClass} w-auto object-contain ${className}`}
    />
  );
};
