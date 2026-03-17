interface Props {
  progress: number;
  label?: string;
}

export const ProgressBar = ({ progress, label }: Props) => (
  <div className="w-full">
    {label && (
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
    )}
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className="bg-[#FF6B00] h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);
