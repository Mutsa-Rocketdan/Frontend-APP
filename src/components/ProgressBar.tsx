interface Props {
  progress: number;
  label?: string;
}

export const ProgressBar = ({ progress, label }: Props) => (
  <div className="w-full">
    {label && (
      <div className="flex justify-between text-sm text-zinc-400 mb-2">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
    )}
    <div className="w-full bg-zinc-800 rounded-full h-2">
      <div
        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);
