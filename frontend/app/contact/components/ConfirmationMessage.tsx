import Link from 'next/link';

interface ConfirmationMessageProps {
  returnPath?: string;
  returnLabel?: string;
}

export default function ConfirmationMessage({ 
  returnPath = '/', 
  returnLabel = "Retourner à l'accueil" 
}: ConfirmationMessageProps) {
  return (
    <div className="max-w-2xl w-full text-center mx-auto py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Merci pour votre<br />message
      </h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
        Nous vous recontacterons sous 24h ouvrées pour<br className="hidden md:block" />
        échanger sur vos besoins et vous proposer une<br className="hidden md:block" />
        offre adaptée.
      </p>

      <Link 
        href={returnPath}
        className="inline-flex items-center gap-2 text-black px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg"
        style={{backgroundColor: '#FFE552'}}
      >
        {returnLabel}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transform rotate-45"
        >
          <path 
            d="M5 10H15M15 10L10 5M15 10L10 15" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}
