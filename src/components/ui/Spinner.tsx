type SpinnerProps = {
  size?: "sm" | "md";
  className?: string;
};

const sizeMap = {
  sm: "h-3.5 w-3.5 border-[1.5px]",
  md: "h-4 w-4 border-2",
};

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin-slow rounded-full border-friday-muted border-t-friday-accent ${sizeMap[size]} ${className}`}
      aria-hidden
    />
  );
}
