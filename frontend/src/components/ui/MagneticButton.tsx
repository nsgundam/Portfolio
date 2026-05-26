import { useMagneticHover } from "../../hooks/useMagneticHover";

const STRENGTH = 0.3;
const TRIGGER_PAD = 40;

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
}

export function MagneticButton({
  children,
  href,
  onClick,
  className,
  style,
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useMagneticHover<HTMLElement>(STRENGTH, TRIGGER_PAD);

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={className}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
