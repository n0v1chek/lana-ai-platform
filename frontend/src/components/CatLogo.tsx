import Image from 'next/image';

interface CatLogoProps {
  className?: string;
  size?: number;
}

export function CatLogo({ className = "", size = 32 }: CatLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/images/cat-logo.png"
        alt="LANA AI"
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain' }}
      />
      <span className="font-display font-bold text-xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
        LANA AI
      </span>
    </div>
  );
}
