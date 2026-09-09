import React from 'react';
import type { LegalTab } from './LegalModal';

interface FooterProps {
  onOpenLegal: (tab: LegalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="mt-auto w-full py-6 pb-28 sm:pb-8 text-center text-xs text-gray-500 border-t border-gray-200 bg-white/80 backdrop-blur-xs">
      <div className="container mx-auto px-4 max-w-2xl space-y-3.5">
        {/* Yasal Belgeler & Bağlantılar */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-gray-600">
          <button
            onClick={() => onOpenLegal('terms')}
            className="hover:text-indigo-600 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>📄</span>
            <span>Kullanıcı Sözleşmesi</span>
          </button>
          <button
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-indigo-600 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>🔒</span>
            <span>Gizlilik Politikası</span>
          </button>
          <button
            onClick={() => onOpenLegal('kvkk')}
            className="hover:text-indigo-600 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>📋</span>
            <span>KVKK Aydınlatma Metni</span>
          </button>
          <button
            onClick={() => onOpenLegal('disclaimer')}
            className="hover:text-indigo-600 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>⚖️</span>
            <span>Sorumluluk Reddi</span>
          </button>
        </div>

        {/* Veri Güvencesi Notu (Footera Yaslı) */}
        <div className="px-4 py-2 bg-gray-50 border border-gray-200/80 rounded-lg text-[11px] text-gray-500 leading-relaxed text-center">
          <span className="font-semibold text-gray-700">🔒 Veri Güvencesi:</span> Paylaşılan oda ve iletişim bilgileri yalnızca eşleşme amacıyla geçici olarak işlenir; ticari amaçla tutulmaz ve ilanınız silindiğinde kalıcı olarak imha edilir.
        </div>

        {/* Telif Satırı */}
        <p className="text-[11px] text-gray-400">
          © {new Date().getFullYear()} FindRoom • Koç Üniversitesi Öğrenci Platformu
        </p>
      </div>
    </footer>
  );
};
