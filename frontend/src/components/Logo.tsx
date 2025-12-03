import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  href?: string;
}

export function Logo({ size = 'md', showText = true, href = '/' }: LogoProps) {
  const sizes = {
    sm: { img: 160, text: 'text-3xl' },
    md: { img: 200, text: 'text-4xl' },
    lg: { img: 280, text: 'text-5xl' },
  };

  const content = (
    <div className="flex items-center gap-3">
      <Image
        src="/images/cat-logo.png"
        alt="LANA AI"
        width={sizes[size].img}
        height={sizes[size].img}
        className="object-contain dark:hidden"
      />
      <Image
        src="/images/cat-logo-dark.png"
        alt="LANA AI"
        width={sizes[size].img}
        height={sizes[size].img}
        className="object-contain hidden dark:block"
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
