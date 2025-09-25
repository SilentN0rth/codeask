import React from 'react';
import { SvgIcon } from '@/lib/utils/icons';

interface FeatureBadgeProps {
  icon: string;
  label: string;
  variant?: 'default' | 'accent';
  className?: string;
}

const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  icon,
  label,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = 'flex items-center gap-1 px-3 py-1 rounded-full text-xs';

  const variantClasses = {
    default: 'bg-white/5 text-white',
    accent: 'bg-cCta-500/10 text-cCta-500',
  };

  const iconClasses = variant === 'default' ? 'w-4 h-4 text-white' : 'size-4';
  const separatorClasses =
    variant === 'default' ? 'text-white/70' : 'text-cCta-500/70';

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <SvgIcon icon={icon} className={iconClasses} />
      <span className={`${separatorClasses} select-none text-base`}>•</span>
      <span>{label}</span>
    </div>
  );
};

export default FeatureBadge;
