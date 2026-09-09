import React from 'react';
import type { LegalTab } from './LegalModal';

interface FooterProps {
  onOpenLegal: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="mt-12 py-6 pb-24 sm:pb-8 text-center text-xs text-gray-400 border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-xl space-y-3">
        {/* Yasal Bağlantılar */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-gray-500">
          <button
            onClick={() => onOpenLegal('terms')}
            className="hover:text-gray-900 transition-colors"
          >
            Kullanıcı Sözleşmesi
          </button>
          <button
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-gray-900 transition-colors"
          >
            Gizlilik Politikası
          </button>
          <button
            onClick={() => onOpenLegal('kvkk')}
            className="hover:text-gray-900 transition-colors"
          >
            KVKK
          </button>
          <button
            onClick={() => onOpenLegal('disclaimer')}
            className="hover:text-gray-900 transition-colors"
          >
            Sorumluluk Reddi
          </button>
        </div>

        {/* Sade Telif Satırı */}
        <p className="text-[11px] text-gray-400">
          © {new Date().getFullYear()} FindRoom. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};
