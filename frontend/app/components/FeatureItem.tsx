import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface FeatureItemProps {
  title: string;
  description?: string;
  iconColor?: string;
}

export default function FeatureItem({ title, description, iconColor = 'text-black' }: FeatureItemProps) {
  return (
    <li className="flex items-start">
      <FontAwesomeIcon icon={faCheck} className={`${iconColor} mr-3 mt-0.5`} />
      {description ? (
        <div className="text-sm text-black">
          <span className="font-medium">{title}</span>
          <br />
          <span className="text-black opacity-80">{description}</span>
        </div>
      ) : (
        <span className="text-sm font-medium text-black">{title}</span>
      )}
    </li>
  );
}
