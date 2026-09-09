import React, { useState, useMemo } from 'react';
import type { Listing, SpecificDormInfo, DesiredDormInfo, OptionalRoomDetails } from '../types';
import { Gender, Campus, Capacity } from '../types';
import { findDormSwapMatches } from '../matching';
import { DormFieldSet } from './DormFieldSet';
import { ListingCard } from './ListingCard';
import { ExclamationTriangleIcon, HeartIcon, PlusCircleIcon } from './icons';

interface MyListingPageProps {
  onAddListing: (listing: Listing) => Promise<void>;
  myListing: Listing | null;
  allListings: Listing[];
  myListingId: string | null;
  onDeleteListing?: (listingId: string) => void;
  openFormInitially?: boolean;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'kvkk' | 'disclaimer') => void;
}

const initialCurrentDorm: SpecificDormInfo = {
  gender: Gender.Female,
  campus: Campus.Main,
  capacity: Capacity.Four,
  bunkBed: true,
};

const initialDesiredDorm: DesiredDormInfo = {
  gender: 'any',
  campus: 'any',
  capacity: 'any',
  bunkBed: 'any',
};

const initialOptionalRoomDetails: OptionalRoomDetails = {
  roomNumber: '',
  building: '',
  hasBathroom: false,
};

// Building options for different campuses
const WEST_BUILDINGS = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B'];
const MAIN_BUILDINGS = ['Henry Ford A', 'Henry Ford B', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

const getBuildingOptions = (campus: Campus) => {
  return campus === Campus.West ? WEST_BUILDINGS : MAIN_BUILDINGS;
};


export const MyListingPage: React.FC<MyListingPageProps> = ({ 
  onAddListing, 
  myListing, 
  allListings, 
  myListingId,
  onDeleteListing,
  openFormInitially = false,
  onOpenLegal
}) => {
  const [currentDorm, setCurrentDorm] = useState<SpecificDormInfo>(myListing?.currentDorm ?? initialCurrentDorm);
  const [desiredDorm, setDesiredDorm] = useState<DesiredDormInfo>(myListing?.desiredDorm ?? initialDesiredDorm);
  const [currentDormDetails, setCurrentDormDetails] = useState(myListing?.currentDormDetails ?? '');
  const [optionalRoomDetails, setOptionalRoomDetails] = useState<OptionalRoomDetails>(myListing?.optionalRoomDetails ?? initialOptionalRoomDetails);
  const [contactInfo, setContactInfo] = useState(myListing?.contactInfo ?? '');
  const [acceptedTerms, setAcceptedTerms] = useState(!!myListing);
  const [showForm, setShowForm] = useState(!myListing || openFormInitially);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);

  React.useEffect(() => {
    if (openFormInitially) {
      setShowForm(true);
    }
  }, [openFormInitially]);

  React.useEffect(() => {
    if (myListing) {
      setCurrentDorm(myListing.currentDorm);
      setDesiredDorm(myListing.desiredDorm);
      setCurrentDormDetails(myListing.currentDormDetails || '');
      setOptionalRoomDetails(myListing.optionalRoomDetails || initialOptionalRoomDetails);
      setContactInfo(myListing.contactInfo || '');
    }
  }, [myListing]);

  const handleCurrentDormChange = (field: any, value: any) => {
    setCurrentDorm(prev => ({ ...prev, [field]: value }));
    
    // Eğer cinsiyet değişiyorsa, istenilen yurt tipini de aynı yap
    if (field === 'gender') {
      setDesiredDorm(prev => ({ ...prev, gender: value }));
    }
  };

  const handleDesiredDormChange = (field: any, value: any) => {
    setDesiredDorm(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionalRoomDetailsChange = <K extends keyof OptionalRoomDetails>(field: K, value: OptionalRoomDetails[K]) => {
    setOptionalRoomDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.trim()) {
      alert('Lütfen iletişim bilgisi girin.');
      return;
    }

    setIsSubmitting(true);
    const newListing: Listing = {
      id: myListing?.id || `listing-${Date.now()}`,
      contactInfo,
      currentDorm,
      currentDormDetails,
      desiredDorm,
      // optionalRoomDetails sadece anlamlı veri varsa ekle
      ...(optionalRoomDetails.roomNumber || optionalRoomDetails.building || optionalRoomDetails.hasBathroom ? {
        optionalRoomDetails: {
          roomNumber: optionalRoomDetails.roomNumber || '',
          building: optionalRoomDetails.building || '',
          hasBathroom: optionalRoomDetails.hasBathroom || false
        }
      } : {}),
      createdAt: myListing?.createdAt || new Date().toISOString(),
    };
    
    try {
        await onAddListing(newListing);
        setShowForm(false);
    } catch (error) {
        console.error("Submission failed:", error);
        alert("İlan gönderilemedi. Lütfen daha sonra tekrar deneyin.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Calculate matches
  const matches = useMemo(() => {
    if (!myListing) return [];

    return findDormSwapMatches(allListings, myListing);
  }, [allListings, myListing]);

  // Başarım bildirimi göstermiyoruz; kayıttan sonra form kapanır

  return (
    <div className="space-y-6">
      {/* Kompakt Rehber */}
      <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs text-indigo-700">
        <span className="text-sm flex-shrink-0">💡</span>
        <span>Mevcut ve istediğiniz oda kriterlerini girin; uygun öğrenciler <strong>Eşleşmelerim</strong>'de otomatik listelenir.</span>
      </div>

      {/* Talep Oluşturma/Düzenleme Bölümü */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <PlusCircleIcon className="w-6 h-6 text-indigo-600 mr-3"/>
            <h2 className="text-xl font-bold text-gray-900">{myListing ? 'İlanı Düzenle' : 'Talep Oluştur'}</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <DormFieldSet title="Mevcut Yurt Bilgilerim" isDesired={false} values={currentDorm} onChange={handleCurrentDormChange} />
            <DormFieldSet title="İstediğim Yurt Bilgileri" isDesired={true} values={desiredDorm} onChange={handleDesiredDormChange} />
            
            <div className="bg-purple-50 border border-purple-200 p-4 sm:p-6 rounded-xl shadow-sm space-y-6">
              <div>
                <label htmlFor="currentDormDetails" className="block text-sm font-medium text-purple-800">Eklemek İstedikleriniz (İsteğe bağlı)</label>
                <textarea
                  id="currentDormDetails"
                  value={currentDormDetails}
                  onChange={(e) => setCurrentDormDetails(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full p-4 bg-white border border-purple-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Eklemek istediğiniz detayları giriniz."
                />
              </div>
              
              {/* Optional Room Details Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <button
                    type="button"
                    onClick={() => setShowRoomDetails(!showRoomDetails)}
                    className="flex items-center justify-between w-full text-left mb-4"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Bina ve Oda Numarası (İsteğe Bağlı)</h3>
                      <p className="text-xs text-green-600 mt-1">İstersen oda detaylarını da girebilirsin</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-green-500 transition-transform duration-200 ${showRoomDetails ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showRoomDetails && (
                    <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label htmlFor="building" className="block text-sm font-medium text-gray-700">Bina</label>
                      <select
                        id="building"
                        value={optionalRoomDetails.building || ''}
                        onChange={(e) => handleOptionalRoomDetailsChange('building', e.target.value)}
                        className="mt-1 block w-full h-10 sm:h-11 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      >
                        <option value="">Bina seçin</option>
                        {getBuildingOptions(currentDorm.campus).map(building => (
                          <option key={building} value={building}>{building}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Oda Numarası</label>
                      <input
                        type="text"
                        id="roomNumber"
                        value={optionalRoomDetails.roomNumber || ''}
                        onChange={(e) => handleOptionalRoomDetailsChange('roomNumber', e.target.value)}
                        className="mt-1 block w-full h-10 sm:h-11 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        placeholder="Örn: 205, 101"
                      />
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={optionalRoomDetails.hasBathroom || false}
                          onChange={(e) => handleOptionalRoomDetailsChange('hasBathroom', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Banyolu oda</span>
                      </label>
                    </div>
                  </div>
                )}
                </div>
              </div>
              
              <div>
                <label htmlFor="contactInfo" className="block text-sm font-medium text-purple-800">İletişim Adresi (Zorunlu)</label>
                <input
                  type="text"
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="mt-1 block w-full h-11 px-4 bg-white border border-purple-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Örn: Instagram: @kullaniciadi, Tel veya E-posta"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between">
              {myListing && (
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-300"
                >
                  Vazgeç
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Kaydediliyor...' : (myListing ? 'İlanı Güncelle' : 'Talep Oluştur')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Yayındaki İlanım Bölümü - Form kapalıyken en üstte görünür */}
      {myListing && !showForm && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Yayındaki İlanınız
            </h2>
          </div>
          <ListingCard 
            listing={myListing} 
            isOwnListing={true} 
            onDeleteListing={onDeleteListing}
            onEditListing={() => setShowForm(true)}
          />
        </div>
      )}

      {/* Eşleşmeler Bölümü */}
      {myListing && !showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Eşleşmelerim</h2>
            {matches.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                {matches.length} Eşleşme Bulundu
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-5">Aşağıda hem sizin istediğiniz yurda sahip olan hem de sizin yurdunuzu isteyen kişilerin ilanları listelenmiştir.</p>
          
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {matches.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 sm:px-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <div className="flex justify-center items-center mx-auto w-12 h-12 bg-orange-100 rounded-full">
                <ExclamationTriangleIcon className="w-6 h-6 text-orange-600"/>
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-800">Henüz Karşılıklı Eşleşme Bulunamadı</h3>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                Endişelenmeyin! Talebiniz sistemde yayında. Sizin odanızı arayan yeni bir öğrenci talep oluşturduğunda eşleşmeniz burada otomatik görünecektir.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
