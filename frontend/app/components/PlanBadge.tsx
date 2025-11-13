import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faHands } from '@fortawesome/free-solid-svg-icons';

export type PlanType = 'izzzi' | 'super';

interface PlanBadgeProps {
  planType: PlanType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PlanBadge({ planType, size = 'md', className = '' }: PlanBadgeProps) {
  const icon = planType === 'izzzi' ? faThumbsUp : faHands;
  const label = planType === 'izzzi' ? 'Izzzi' : 'Super Izzzi';
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <span 
      className={`bg-gray-100 text-gray-800 rounded-full font-medium inline-flex items-center gap-2 ${sizeClasses[size]} ${className}`}
    >
      <FontAwesomeIcon icon={icon} />
      {label}
    </span>
  );
}
