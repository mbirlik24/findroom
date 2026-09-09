
import React, { useState } from 'react';
import type { Listing } from '../types';
import { SwapIcon, ReactIcons } from './icons';
import { DormInfoCard } from './DormInfoCard';
import { ContactDisplay } from './ContactDisplay';

interface ListingCardProps {
  listing: Listing;
  emphasizeDescription?: boolean;
  isOwnListing?: boolean;
  onDeleteListing?: (listingId: string) => void;
  onEditListing?: () => void;
  onCreateRequest?: () => void;
}

// Pastel renk paleti - her ilan için farklı renk
const getPastelColor = (id: string) => {
  const colors = [
    'bg-pink-50 border-pink-200', // Pembe
    'bg-blue-50 border-blue-200', // Mavi
    'bg-green-50 border-green-200', // Yeşil
    'bg-purple-50 border-purple-200', // Mor
    'bg-yellow-50 border-yellow-200', // Sarı
    'bg-indigo-50 border-indigo-200', // İndigo
    'bg-rose-50 border-rose-200', // Gül
    'bg-teal-50 border-teal-200', // Teal
    'bg-orange-50 border-orange-200', // Turuncu
    'bg-cyan-50 border-cyan-200', // Cyan
  ];
  
  // İlan ID'sinden hash oluştur ve renk seç
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) & 0xffffffff;
  }
  return colors[Math.abs(hash) % colors.length];
};

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  emphasizeDescription = false, 
  isOwnListing = false, 
  onDeleteListing,
  onEditListing,
  onCreateRequest 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pastelColor = getPastelColor(listing.id);
  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cur = `${listing.currentDorm.campus} ${listing.currentDorm.capacity}`;
    const desCampus = listing.desiredDorm.campus === 'multiple'
      ? (listing.desiredDorm.preferredCampuses && listing.desiredDorm.preferredCampuses.length > 0
          ? listing.desiredDorm.preferredCampuses.join('/')
          : 'Ana/Batı Kampüs')
      : (listing.desiredDorm.campus === 'any' ? 'Fark etmez' : listing.desiredDorm.campus);
    const desCapacity = listing.desiredDorm.capacity === 'multiple' 
      ? listing.desiredDorm.preferredCapacities?.join('/') 
      : (listing.desiredDorm.capacity === 'any' ? 'fark etmez' : listing.desiredDorm.capacity);
    const des = `${desCampus} ${desCapacity}`;
    const text = `Selam! FindRoom'da yurt takas ilanı açtım.\n\n📍 Mevcut: ${cur}\n🎯 Aradığım: ${des}\n\nEşleşmek veya detaylara bakmak için: https://www.kudorm.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={`${pastelColor} rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-2 w-full max-w-full min-w-0 box-border ${isOwnListing ? 'ring-2 ring-indigo-300' : ''}`}>
      {isOwnListing && (
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 text-white px-3.5 sm:px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-indigo-500/40">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="font-bold text-xs sm:text-sm tracking-wide">Sizin Talebiniz (Yayında)</span>
          </div>
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 justify-end sm:justify-start">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all shadow-xs"
              title="WhatsApp gruplarında paylaş"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </button>
            {onEditListing && (
              <button
                type="button"
                onClick={onEditListing}
                className="inline-flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all border border-white/30"
                title="Talebi Düzenle"
              >
                <ReactIcons.Edit className="w-3 h-3" />
                <span>Düzenle</span>
              </button>
            )}
            {onDeleteListing && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Talebinizi silmek istediğinizden emin misiniz?')) {
                    onDeleteListing(listing.id);
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 bg-red-500/90 hover:bg-red-600 active:scale-95 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all shadow-xs"
                title="Talebi Sil"
              >
                <ReactIcons.Trash className="w-3 h-3" />
                <span>Sil</span>
              </button>
            )}
          </div>
        </div>
      )}
      <div className="p-4 sm:p-6">
        {/* Oda Detayları - Üstte */}
        {listing.optionalRoomDetails && (listing.optionalRoomDetails.roomNumber || listing.optionalRoomDetails.building || listing.optionalRoomDetails.hasBathroom) && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 text-sm mb-2">Oda Detayları</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              {listing.optionalRoomDetails.building && (
                <span className="bg-white px-2 py-1 rounded border border-green-300 text-green-700">
                  Bina: {listing.optionalRoomDetails.building}
                </span>
              )}
              {listing.optionalRoomDetails.roomNumber && (
                <span className="bg-white px-2 py-1 rounded border border-green-300 text-green-700">
                  Oda: {listing.optionalRoomDetails.roomNumber}
                </span>
              )}
              {listing.optionalRoomDetails.hasBathroom && (
                <span className="bg-white px-2 py-1 rounded border border-green-300 text-green-700 font-medium">
                  ✓ Banyolu
                </span>
              )}
            </div>
          </div>
        )}

        {!!listing.currentDormDetails && (
          <div className="mb-3 sm:mb-4">
            <p className={`${emphasizeDescription ? 'text-black font-bold text-base sm:text-lg' : 'text-gray-700 text-sm sm:text-base'} break-words`}>
              {listing.currentDormDetails}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center">
            <DormInfoCard info={listing.currentDorm} title="Mevcut Yurt" />
            <div className="hidden lg:flex justify-center items-center h-full px-4">
                <SwapIcon className="w-8 h-8 text-gray-400" />
            </div>
            <DormInfoCard info={listing.desiredDorm} title="İstenilen Yurt" />
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-2">
         <div className="border-t border-gray-200">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-left px-0 py-3 sm:py-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm">{isExpanded ? 'Detayları Gizle' : 'Detayları Göster ve İletişime Geç'}</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
         </div>
      </div>

      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 bg-gray-50/70 border-t border-gray-200">
          <div className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
            <div>
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base mb-2">İletişim Adresi</h4>
                <ContactDisplay contactInfo={listing.contactInfo} />
            </div>

            {/* Talebi olmayan kullanıcıya sade yönlendirme */}
            {!isOwnListing && onCreateRequest && (
              <div className="p-3 bg-gray-50 border border-gray-200/70 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <p className="text-xs text-gray-600">
                  Kendi talebinizi oluşturarak aradığınız odaya daha hızlı ulaşabilirsiniz.
                </p>
                <button
                  onClick={onCreateRequest}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline whitespace-nowrap"
                >
                  Talep Oluştur →
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 text-right pt-2">
                İlan Tarihi: {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};