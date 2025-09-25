import { ClassName } from '@/types/index.types';
import React from 'react';
import { SvgIcon } from '@/lib/utils/icons';

type Element = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

interface PageTitleProps extends ClassName {
  title: string;
  as?: Element;
  icon?: string;
  description?: string;
  parentClasses?: string;
  children?: React.ReactNode;
  iconClasses?: string;
  innerClasses?: string;
}

const PageTitle = ({
  title,
  className = 'items-center',
  as = 'h1',
  icon,
  description,
  iconClasses = '',
  parentClasses = '',
  innerClasses = 'flex flex-row gap-x-3',
  children,
}: PageTitleProps) => {
  const baseClasses =
    'relative pl-3 text-3xl font-semibold before:absolute before:inset-0 before:h-full before:w-0.5 before:bg-cCta-500 before:content-[""] place-self-center';

  const Component = as as keyof React.JSX.IntrinsicElements;

  return (
    <div className={`flex items-start gap-3 ${parentClasses ?? ''} `}>
      <div className="flex flex-col gap-1.5">
        <div className={`${innerClasses ?? ''} `}>
          {icon && (
            <div
              className={`bg-cCta-500/20 place-self-start rounded-lg p-2 ${iconClasses}`}
            >
              <SvgIcon icon={icon} className="text-cCta-500 text-lg" />
            </div>
          )}
          <Component className={`${baseClasses} ${className ?? ''}`}>
            {title}
          </Component>
        </div>
        {description && (
          <p className="text-cMuted-500 mt-1 text-sm">{description}</p>
        )}
      </div>
      {children && children}
    </div>
  );
};

export default PageTitle;
