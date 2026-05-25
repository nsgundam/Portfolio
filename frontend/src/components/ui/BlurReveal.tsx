import { useBlurReveal } from "../../hooks/useBlurReveal";

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  enabled?: boolean;
}

export function BlurReveal({
  children,
  className,
  delay,
  enabled = true,
}: BlurRevealProps) {
  const ref = useBlurReveal<HTMLDivElement>(enabled, { delay });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
