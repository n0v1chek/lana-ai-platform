import Image from 'next/image';

interface CatLogoProps {
  className?: string;
  size?: number;
}

export function CatLogo({ className = "", size = 80 }: CatLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/cat-logo.png"
        alt="LANA AI"
        width={size}
        height={size}
        className={`${className} dark:hidden`}
        style={{ objectFit: 'contain' }}
      />
      <Image
        src="/images/cat-logo-dark.png"
        alt="LANA AI"
        width={size}
        height={size}
        className={`${className} hidden dark:block`}
        style={{ objectFit: 'contain' }}
      />
      <span className="font-display font-bold text-3xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
        LANA AI
      </span>
    </div>
  );
}
