import Link from 'next/link';
import { CatLogo } from './CatLogo';

export function Footer() {
  return (
    <footer className="py-12 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <CatLogo size={20} />
          </div>
          <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/contacts" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Контакты
            </Link>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Оферта
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Конфиденциальность
            </Link>
            <Link href="/cookies" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Cookies
            </Link>
          </nav>
          <p className="text-sm text-slate-600">
            © 2025 LANA AI Helper. ИНН 263109568337
          </p>
        </div>
      </div>
    </footer>
  );
}
