import React from 'react';
import { FaWhatsapp, FaInstagram, FaEnvelope } from 'react-icons/fa';

interface ContactDisplayProps {
  contactInfo: string;
  className?: string;
  showRawFallback?: boolean;
}

export interface ParsedContact {
  whatsapp: string | null;
  phoneDisplay: string | null;
  instagram: string | null;
  email: string | null;
  raw: string;
}

export function parseContactInfo(text: string): ParsedContact {
  if (!text) {
    return { whatsapp: null, phoneDisplay: null, instagram: null, email: null, raw: '' };
  }

  const raw = text.trim();

  // 1. Email tespiti
  const emailMatch = raw.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  // 2. Telefon / WhatsApp tespiti (Türkiye mobil numaraları 5xx xxx xx xx)
  const phoneMatch = raw.match(/(?:(?:\+?90\s*)|0)?\s*(5\d{2})[\s.-]?(\d{3})[\s.-]?(\d{2})[\s.-]?(\d{2})/);
  let whatsapp: string | null = null;
  let phoneDisplay: string | null = null;

  if (phoneMatch) {
    const rawDigits = phoneMatch[0].replace(/\D/g, '');
    let clean = '';
    if (rawDigits.length === 10 && rawDigits.startsWith('5')) clean = '90' + rawDigits;
    else if (rawDigits.length === 11 && rawDigits.startsWith('05')) clean = '90' + rawDigits.slice(1);
    else if (rawDigits.length === 12 && rawDigits.startsWith('905')) clean = rawDigits;

    if (clean && clean.length === 12) {
      whatsapp = clean;
      phoneDisplay = '0' + clean.slice(2, 5) + ' ' + clean.slice(5, 8) + ' ' + clean.slice(8, 10) + ' ' + clean.slice(10, 12);
    }
  }

  // 3. Instagram tespiti
  let instagram: string | null = null;
  const igPrefixMatch = raw.match(/(?:instagram(?:\.com\/)?|insta(?::)?|ig(?::)?)\s*[:/]?\s*@?([a-zA-Z0-9._]+)/i);
  if (igPrefixMatch && igPrefixMatch[1]) {
    const handle = igPrefixMatch[1].replace(/[/]/g, '').trim();
    if (handle && handle.toLowerCase() !== 'com' && handle.length >= 2) {
      instagram = handle;
    }
  } else if (!email) {
    const atMatch = raw.match(/@([a-zA-Z0-9._]+)/);
    if (atMatch && atMatch[1]) {
      instagram = atMatch[1].trim();
    }
  }

  return { whatsapp, phoneDisplay, instagram, email, raw };
}

export const ContactDisplay: React.FC<ContactDisplayProps> = ({
  contactInfo,
  className = '',
  showRawFallback = true
}) => {
  const parsed = parseContactInfo(contactInfo);
  const hasInteractiveAction = !!(parsed.whatsapp || parsed.instagram || parsed.email);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* WhatsApp Butonu */}
      {parsed.whatsapp && (
        <a
          href={`https://wa.me/${parsed.whatsapp}?text=${encodeURIComponent('Merhaba, kudorm üzerinden ilanınızı gördüm.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all transform hover:scale-105 active:scale-95 select-none"
          title="WhatsApp'tan Mesaj Gönder"
        >
          <FaWhatsapp size={16} />
          <span>WhatsApp'tan Yaz</span>
        </a>
      )}

      {/* Instagram Butonu */}
      {parsed.instagram && (
        <a
          href={`https://instagram.com/${parsed.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-700 hover:via-pink-700 hover:to-rose-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-all transform hover:scale-105 active:scale-95 select-none"
          title="Instagram Profilini Aç"
        >
          <FaInstagram size={16} />
          <span>@{parsed.instagram}</span>
        </a>
      )}

      {/* E-posta Butonu */}
      {parsed.email && (
        <a
          href={`mailto:${parsed.email}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all transform hover:scale-105 active:scale-95 select-none"
          title="E-posta Gönder"
        >
          <FaEnvelope size={14} />
          <span>{parsed.email}</span>
        </a>
      )}

      {/* Orijinal Metin Rozeti */}
      {(!hasInteractiveAction || showRawFallback) && (
        <span className="inline-block px-2.5 py-1 bg-gray-100 border border-gray-200 text-gray-800 rounded-md text-xs font-medium break-all">
          {contactInfo}
        </span>
      )}
    </div>
  );
};
