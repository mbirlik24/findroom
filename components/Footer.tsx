import React from 'react';
import type { LegalTab } from './LegalModal';

interface FooterProps {
  onOpenLegal: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="mt-auto w-full py-8 pb-28 sm:pb-8 text-center border-t border-gray-100 bg-white/40">
      <div className="container mx-auto px-4 max-w-xl space-y-2.5">
        {/* Aşırı Sade Yasal Belgeler Listesi - Emojisiz, Minimalist */}
        <nav className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-xs text-gray-500 font-normal">
          <button
            onClick={() => onOpenLegal('terms')}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Kullanıcı Sözleşmesi
          </button>
          <span className="text-gray-300 select-none">·</span>
          <button
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Gizlilik Politikası
          </button>
          <span className="text-gray-300 select-none">·</span>
          <button
            onClick={() => onOpenLegal('security')}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Veri Güvenliği
          </button>
          <span className="text-gray-300 select-none">·</span>
          <button
            onClick={() => onOpenLegal('kvkk')}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            KVKK Metni
          </button>
          <span className="text-gray-300 select-none">·</span>
          <button
            onClick={() => onOpenLegal('disclaimer')}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Sorumluluk Reddi
          </button>
        </nav>

        {/* Minimal Telif */}
        <p className="text-[11px] text-gray-400 font-light">
          © {new Date().getFullYear()} FindRoom
        </p>
      </div>
    </footer>
  );
};
