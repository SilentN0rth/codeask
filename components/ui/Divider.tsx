import React from 'react';

type DividerProps = {
  text: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  position?: 'left' | 'center' | 'right';
  orientation?: 'horizontal' | 'vertical';
  bgColor?: string;
  ariaHidden?: boolean;
};

const horizontalPositionMap = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const verticalPositionMap = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
};

const Divider = ({
  text,
  as = 'span',
  className = '',
  position = 'center',
  orientation = 'horizontal',
  bgColor = 'bg-cBgDark-800',
  ariaHidden = true,
}: DividerProps) => {
  const Component = as as keyof JSX.IntrinsicElements;

  if (orientation === 'vertical') {
    return (
      <div className={`relative h-full ${className} `} aria-hidden={ariaHidden}>
        <div className="absolute inset-0 flex justify-center">
          <div className="h-full border-l border-divider" />
        </div>
        <div
          className={`relative flex h-full flex-col justify-center ${verticalPositionMap[position]}`}
        >
          <Component
            className={`${bgColor} px-3 text-sm text-default-500`}
            style={{
              transform: 'rotate(90deg)',
              transformOrigin: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </Component>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative my-6 w-full ${className}`}
      aria-hidden={ariaHidden}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-divider" />
      </div>
      <div className={`relative flex ${horizontalPositionMap[position]} px-3`}>
        <Component className={`${bgColor} px-3 text-sm text-default-500`}>
          {text}
        </Component>
      </div>
    </div>
  );
};

export default Divider;
