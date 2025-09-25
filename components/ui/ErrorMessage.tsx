import { SvgIcon } from '@/lib/utils/icons';

interface ErrorMessageProps {
  message: string;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

export default function ErrorMessage({
  message,
  className = '',
  iconSize = 'md',
}: ErrorMessageProps) {
  const sizeClasses = {
    sm: 'size-5',
    md: 'size-6',
    lg: 'size-8',
  };

  const paddingClasses = {
    sm: 'px-2 py-1',
    md: 'px-3 py-2',
    lg: 'px-4 py-3',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-small',
    lg: 'text-base',
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-lg bg-danger/10 ${paddingClasses[iconSize]} ${className}`}
    >
      <SvgIcon
        icon="solar:danger-triangle-bold"
        className={`flex items-center justify-center ${sizeClasses[iconSize]} rounded-full bg-danger/20 p-1 text-danger`}
      />
      <span className={`font-medium text-danger ${textClasses[iconSize]}`}>
        {message}
      </span>
    </div>
  );
}
