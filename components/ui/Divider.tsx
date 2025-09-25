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
  const Component = as as keyof React.JSX.IntrinsicElements;

  if (orientation === 'vertical') {
    return (
      <div className={`relative h-full ${className} `} aria-hidden={ariaHidden}>
        <div className="absolute inset-0 flex justify-center">
          <div className="border-divider h-full border-l" />
        </div>
        <div
          className={`relative flex h-full flex-col justify-center ${verticalPositionMap[position]}`}
        >
          <Component
            className={`${bgColor} text-default-500 px-3 text-sm`}
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
        <div className="border-divider w-full border-t" />
      </div>
      <div className={`relative flex ${horizontalPositionMap[position]} px-3`}>
        <Component className={`${bgColor} text-default-500 px-3 text-sm`}>
          {text}
        </Component>
      </div>
    </div>
  );
};

export default Divider;
