import FeatureItem from './FeatureItem';

export interface Feature {
  title: string;
  description?: string;
}

interface FeatureListProps {
  features: Feature[];
  iconColor?: string;
  className?: string;
}

export default function FeatureList({ features, iconColor = 'text-black', className = '' }: FeatureListProps) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {features.map((feature, index) => (
        <FeatureItem
          key={index}
          title={feature.title}
          description={feature.description}
          iconColor={iconColor}
        />
      ))}
    </ul>
  );
}
