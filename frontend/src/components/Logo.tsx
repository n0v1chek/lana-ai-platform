import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
}

export function Logo({ size = 'md', showText = true, href = '/' }: LogoProps) {
  const sizes = {
    sm: { img: 32, text: 'text-lg' },
    md: { img: 40, text: 'text-xl' },
    lg: { img: 56, text: 'text-2xl' },
  };

  const content = (
    <div className="flex items-center gap-2">
      <Image
        src="/images/cat-logo.png"
        alt="LANA AI"
        width={sizes[size].img}
        height={sizes[size].img}
        className="object-contain"
      />
      {showText && (
        <span className={"font-display font-bold " + sizes[size].text + " bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"}>
          LANA AI
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="flex items-center">{content}</Link>;
  }

  return content;
}
