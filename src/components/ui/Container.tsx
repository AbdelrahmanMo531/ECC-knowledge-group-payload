import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** `wide` is for full-bleed section content; `narrow` for long-form reading. */
  size?: 'default' | 'wide' | 'narrow';
};

const SIZES = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
} as const;

export function Container({
  children,
  className = '',
  size = 'default',
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-5 sm:px-8 ${SIZES[size]} ${className}`}>
      {children}
    </div>
  );
}
