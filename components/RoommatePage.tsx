import React, { useState, useEffect, useMemo } from 'react';
import { Campus, type RoommateSearch, type RoommateSearchForm } from '../types';
import { UserGroupIcon, PlusCircleIcon } from './icons';
import { FaEdit, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import { ContactDisplay } from './ContactDisplay';

interface RoommatePageProps {
  roommateSearches: RoommateSearch[];
  onAddRoommateSearch: (search: RoommateSearch) => Promise<void>;
  onDeleteRoommateSearch?: (searchId: string) => void;
  myRoommateSearchId: string | null;
  onOpenLegal?: (tab: 'terms' | 'privacy' | 'kvkk' | 'disclaimer') => void;
}

const WEST_BUILDINGS = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B'];
const MAIN_BUILDINGS = ['Henry Ford A', 'Henry Ford B', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))]; // Henry Ford A/B + A-Z

export const RoommatePage: React.FC<RoommatePageProps> = ({ 
  roommateSearches, 
  onAddRoommateSearch, 
  onDeleteRoommateSearch,
  myRoommateSearchId,
  onOpenLegal
}) => {
  const [formData, setFormData] = useState<RoommateSearchForm>({
    name: '',
    campus: '',
    building: '',
    roomNumber: '',
    contactInfo: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(!!myRoommateSearchId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(!myRoommateSearchId);

  const myRoommateSearch = useMemo(() => 
    roommateSearches.find(s => s.id === myRoommateSearchId), 
    [roommateSearches, myRoommateSearchId]
  );

  useEffect(() => {
    if (myRoommateSearch) {
      setFormData({
        name: myRoommateSearch.name || '',
        campus: myRoommateSearch.campus || '',
        building: myRoommateSearch.building || '',
        roomNumber: myRoommateSearch.roomNumber || '',
        contactInfo: myRoommateSearch.contactInfo || ''
      });
      setAcceptedTerms(true);
    }
  }, [myRoommateSearch]);

  // Find exact room matches
  const roomMatches = useMemo(() => {
    if (!myRoommateSearch) return [];
    
    return roommateSearches.filter(search => {
      const sameCampus = search.campus === myRoommateSearch.campus;
      const sameBuilding = search.building.trim().toUpperCase() === myRoommateSearch.building.trim().toUpperCase();
      const sameRoom = search.roomNumber.trim() === myRoommateSearch.roomNumber.trim();
      return search.id !== myRoommateSearch.id && sameCampus && sameBuilding && sameRoom;
    });
  }, [roommateSearches, myRoommateSearch]);

  const handleInputChange = (field: keyof RoommateSearchForm, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when campus changes
      if (field === 'campus') {
        newData.building = '';
        newData.roomNumber = '';
      }
      // Reset room number when building changes
      if (field === 'building') {
        newData.roomNumber = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.campus || !formData.building || !formData.roomNumber || !formData.contactInfo.trim()) {
      alert('Lütfen kampüs, bina, oda numarası ve iletişim adresini doldurun.');
      return;
    }

    if (!acceptedTerms) {
      alert('Lütfen Kullanıcı Sözleşmesi ve Gizlilik Politikası onay kutusunu işaretleyin.');
      return;
    }

    setIsSubmitting(true);
    
    const newSearch: RoommateSearch = {
      id: myRoommateSearch?.id || `roommate-${Date.now()}`,
      name: formData.name.trim() || 'İsimsiz Öğrenci',
      contactInfo: formData.contactInfo.trim(),
      campus: formData.campus as Campus,
      building: normalize(formData.building),
      roomNumber: formData.roomNumber.trim(),
      createdAt: myRoommateSearch?.createdAt || new Date().toISOString(),
    };

    try {
      await onAddRoommateSearch(newSearch);
      setShowForm(false);
      setFormData({ name: '', campus: '', building: '', roomNumber: '', contactInfo: '' });
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Arama kaydedilemedi. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBuildingOptions = () => {
    return formData.campus === Campus.West ? WEST_BUILDINGS : MAIN_BUILDINGS;
  };


  // Normalize before submit to avoid casing/whitespace mismatches
  const normalize = (v: string) => v.trim().toUpperCase();

  return (
    <div className="space-y-8">
      {/* Bilgilendirme */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <div className="flex items-start">
          <div className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0">💡</div>
          <div>
            <h3 className="text-sm font-medium text-indigo-900 mb-1">Oda Arkadaşı Bulma Rehberi</h3>
            <p className="text-sm text-indigo-700">
              Aynı kampüs, bina ve oda numarasına sahip diğer öğrencilerle otomatik olarak eşleşirsiniz. Arama oluşturduktan sonra eşleşen oda arkadaşlarınız bu sayfada listelenir.
            </p>
          </div>
        </div>
      </div>

      {/* Veri Güvencesi & Geçici Saklama */}
      <div className="bg-white border border-emerald-200/90 rounded-xl p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-base">
            🔒
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span>Veri Güvencesi & Geçici Eşleşme İlkesi</span>
              <span className="text-[10px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">KVKK m.4 Uyumlu</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Oda ve iletişim bilgileriniz; <strong>yalnızca aramanız aktif olduğu sürece</strong> eşleşme algoritmasının çalışması ve oda arkadaşınızın sizinle iletişim kurabilmesi amacıyla geçici olarak işlenir. Bilgileriniz profil çıkarma veya reklam amacıyla tutulmaz. Aramanızı sildiğinizde verileriniz sistemden <strong>kalıcı olarak imha edilir</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Roommate Search Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <PlusCircleIcon className="w-6 h-6 text-indigo-600 mr-3"/>
            <h2 className="text-xl font-bold text-gray-900">Oda Arkadaşı Arama</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İsim / Rumuz (İsteğe Bağlı)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="İsminiz, rumuz veya boş bırakabilirsiniz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kampüs</label>
                <select
                  value={formData.campus}
                  onChange={(e) => handleInputChange('campus', e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Kampüs seçin</option>
                  <option value={Campus.Main}>Ana Kampüs</option>
                  <option value={Campus.West}>Batı Kampüsü</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bina</label>
                <select
                  value={formData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={!formData.campus}
                  required
                >
                  <option value="">Bina seçin</option>
                  {getBuildingOptions().map(building => (
                    <option key={building} value={building}>{building}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Oda Numarası</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Örn: 205, 101"
                  disabled={!formData.building}
                  required
                >
                </input>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İletişim Adresi (Zorunlu)</label>
                <input
                  type="text"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                  className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Örn: Instagram: @kullaniciadi, Tel veya E-posta"
                  required
                />
              </div>

              {/* Legal Consent Checkbox */}
              <div className="pt-3 border-t border-gray-200">
                <label className="flex items-start cursor-pointer text-xs sm:text-sm text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded flex-shrink-0"
                    required
                  />
                  <span className="ml-2 leading-snug">
                    <button
                      type="button"
                      onClick={() => onOpenLegal?.('terms')}
                      className="text-indigo-600 font-semibold underline hover:text-indigo-800"
                    >
                      Kullanıcı Sözleşmesi
                    </button>
                    {', '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal?.('privacy')}
                      className="text-indigo-600 font-semibold underline hover:text-indigo-800"
                    >
                      Gizlilik Politikası
                    </button>
                    {' ve '}
                    <button
                      type="button"
                      onClick={() => onOpenLegal?.('disclaimer')}
                      className="text-indigo-600 font-semibold underline hover:text-indigo-800"
                    >
                      Sorumluluk Reddi
                    </button>
                    'ni okudum. Ad-soyad ve iletişim bilgilerimin oda arkadaşı arama listesinde görünmesini kendi rızamla onaylıyorum.
                  </span>
                </label>
                <p className="text-[11px] text-gray-500 mt-2 ml-6 leading-normal">
                  * Bilgileriniz kalıcı arşivlenmez; yalnızca aramanız süresince eşleşme amacıyla geçici işlenir. &quot;Aramayı Sil&quot; butonuyla istediğiniz an silebilirsiniz.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              {myRoommateSearch && (
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
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Kaydediliyor...' : (myRoommateSearch ? 'Aramayı Güncelle' : 'Arama Oluştur')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Search Display */}
      {myRoommateSearch && !showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <UserGroupIcon className="w-5 h-5 text-indigo-600 mr-2"/>
              <h2 className="text-lg font-bold text-gray-900">Aramam</h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowForm(true)} 
                className="px-2.5 py-1 text-xs bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 flex items-center gap-1 transition-colors"
              >
                <FaEdit size={12} />
                Düzenle
              </button>
              {onDeleteRoommateSearch && (
                <button
                  onClick={() => {
                    if (window.confirm('Oda arkadaşı aramanızı silmek istediğinizden emin misiniz?')) {
                      onDeleteRoommateSearch(myRoommateSearch.id);
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-red-600 text-white font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 flex items-center gap-1 transition-colors"
                >
                  <FaTimes size={12} />
                  Aramayı Sil
                </button>
              )}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">İsim:</span> {myRoommateSearch.name || 'Belirtilmemiş'}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Kampüs:</span> {myRoommateSearch.campus}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Bina:</span> {myRoommateSearch.building}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Oda Numarası:</span> {myRoommateSearch.roomNumber}
              </p>
              <div className="text-sm text-gray-600 sm:col-span-2 pt-1 border-t border-gray-100">
                <span className="font-medium block mb-1.5">İletişim Adresi:</span>
                <ContactDisplay contactInfo={myRoommateSearch.contactInfo} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Matches */}
      {myRoommateSearch && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-6">
            <UserGroupIcon className="w-6 h-6 text-pink-500 mr-3"/>
            <h2 className="text-xl font-bold text-gray-900">Oda Arkadaşlarım</h2>
          </div>
          
          {roomMatches.length > 0 ? (
            <div className="space-y-4">
              {roomMatches.map(match => (
                <div key={match.id} className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {match.name || 'İsim Belirtilmemiş'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {match.campus} - {match.building} - Oda {match.roomNumber}
                      </p>
                      <div className="mt-2">
                        <span className="font-medium text-xs text-gray-500 block mb-1">İletişim Adresi:</span>
                        <ContactDisplay contactInfo={match.contactInfo} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(match.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-pink-600">
                      <UserGroupIcon className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 bg-gray-50 rounded-lg">
              <div className="flex justify-center items-center mx-auto w-16 h-16 bg-pink-100 rounded-full">
                <UserGroupIcon className="w-8 h-8 text-pink-600"/>
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-800">Henüz Oda Arkadaşı Bulunamadı</h3>
              <p className="mt-2 text-gray-500">
                Aynı odada arama yapan başka kişiler olduğunda burada görünecek.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Instructions when no search exists */}
      {!myRoommateSearch && !showForm && (
        <div className="text-center py-12 px-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-center items-center mx-auto w-16 h-16 bg-indigo-100 rounded-full">
            <UserGroupIcon className="w-8 h-8 text-indigo-600"/>
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-800">Oda Arkadaşını Bulmak İçin Arama Oluşturun</h2>
          <p className="mt-2 text-gray-500">
            Aynı odada kalan diğer öğrencileri bulmak için yukarıdaki formu doldurun.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-auto"
          >
            Arama Oluştur
          </button>
        </div>
      )}
    </div>
  );
};
