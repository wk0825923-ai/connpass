import type { CSSProperties } from 'react';

interface IconProps {
  name: string;
  style?: CSSProperties;
  className?: string;
}

export default function Icon({ name, style, className = '' }: IconProps) {
  return <i className={`ti ti-${name} ${className}`} style={style} aria-hidden="true" />;
}
