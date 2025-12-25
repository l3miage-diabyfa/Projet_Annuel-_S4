import PlanBadge, { PlanType } from './PlanBadge';
import Button from './Button';
import FeatureList, { Feature } from './FeatureList';

interface PricingCardProps {
  planType: PlanType;
  price: string;
  priceLabel: string;
  buttonText: string;
  features: Feature[];
  additionalContent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

export default function PricingCard({
  planType,
  price,
  priceLabel,
  buttonText,
  features,
  additionalContent,
  backgroundColor = 'bg-white',
  textColor = 'text-black',
}: PricingCardProps) {
  return (
    <div className={`rounded-lg shadow-sm p-8 ${backgroundColor} ${textColor} relative overflow-hidden`}>
      <div className="mb-4">
        <PlanBadge planType={planType} />
      </div>

      {additionalContent && <div className="mb-6">{additionalContent}</div>}

      <div className="text-5xl font-bold mb-6">
        {price}
        <span className="text-lg font-normal opacity-80">{priceLabel}</span>
      </div>

      <Button href="/auth/signup" fullWidth icon="↗" className="mb-8">
        {buttonText}
      </Button>

      <FeatureList features={features} />

      <Button href="#" variant="outline" fullWidth icon="↗" className="mt-8">
        Voir les détails du plan
      </Button>
    </div>
  );
}
