import React from 'react';

export type LegalTab = 'terms' | 'privacy' | 'kvkk' | 'disclaimer';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

const TABS: { id: LegalTab; label: string }[] = [
  { id: 'terms', label: 'Kullanıcı Sözleşmesi' },
  { id: 'privacy', label: 'Gizlilik Politikası' },
  { id: 'kvkk', label: 'KVKK Aydınlatma' },
  { id: 'disclaimer', label: 'Sorumluluk Reddi' },
];

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = React.useState<LegalTab>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full h-[90vh] sm:h-auto sm:max-h-[85vh] sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fadeIn">
        
        {/* Header - Sade ve İkonsuz */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-indigo-600 uppercase">FindRoom</span>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">Yasal Metinler ve Sözleşmeler</h2>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors active:scale-95"
            aria-label="Kapat"
          >
            Kapat
          </button>
        </div>

        {/* Tab Navigation - Yatay kaydırılabilir, ikonsuz, sade */}
        <div className="flex items-center gap-1.5 px-3 sm:px-6 py-2.5 bg-gray-50 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body - Mobil uyumlu, ferah, ikonsuz */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-6 text-gray-700 text-xs sm:text-sm leading-relaxed space-y-6">
          
          {activeTab === 'terms' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Kullanım Şartları</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Kullanıcı Sözleşmesi ve Kullanım Koşulları</h3>
              </div>
              
              <p className="text-gray-600">
                Bu platform (FindRoom), yurtlarda kalan öğrencilerin kendi aralarında yurt takas ilanları ve oda arkadaşı arama duyuruları oluşturabilmesini sağlayan bağımsız bir bilgilendirme ve eşleşme panosudur.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">1. Hizmetin Niteliği ve Aracılık</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Platform, kullanıcıların kendi rızalarıyla oluşturdukları ilanları yayınlayan aracı bir hizmet sağlayıcıdır. Herhangi bir üniversite, KYK veya özel yurt idaresinin resmi organı veya temsilcisi değildir.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">2. İlan İçeriği ve Doğruluk</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Kullanıcılar; kampüs, oda tipi, yurt adı ve iletişim bilgilerinin doğruluğundan bizzat sorumludur. Gerçeğe aykırı veya başkalarına ait bilgilerin izinsiz kullanımı durumunda doğacak tüm hukuki sorumluluk ilanı oluşturan kullanıcıya aittir.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">3. İletişim ve Anlaşmalar</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Eşleşmeler sonucunda kullanıcıların birbiriyle iletişime geçmesi, anlaşması veya yurt değişimi yapması tamamen tarafların kendi özgür iradesi ve sorumluluğundadır. Platform, kullanıcılar arasındaki görüşmelere veya maddi süreçlere taraf değildir.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">4. Hizmet Değişikliği ve İptal</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Platform yöneticileri, kurallara aykırı, yanıltıcı veya kişilik haklarını ihlal eden ilanları önceden bildirimde bulunmaksızın silme veya düzenleme hakkını saklı tutar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Veri Güvenliği</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Gizlilik Politikası</h3>
              </div>

              <p className="text-gray-600">
                Gizliliğiniz bizim için önceliklidir. Bu Gizlilik Politikası, platformu kullanırken paylaştığınız verilerin kapsamını ve nasıl işlendiğini özetler.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">1. Toplanan Bilgiler</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs sm:text-sm">
                    <li>Gönüllü İletişim Bilgileri: Telegram kullanıcı adı, telefon numarası veya e-posta adresi.</li>
                    <li>Yurt ve Oda Tercihleri: Mevcut ve hedeflenen yurt/oda detayları.</li>
                    <li>Teknik Veriler: İlanınızı cihazınız üzerinden yönetebilmeniz için localStorage üzerinde tutulan anonim kimlik belirteci.</li>
                  </ul>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">2. Bilgilerin Yayınlanması</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    İlanınıza yazdığınız iletişim ve yurt tercihleri, diğer öğrencilerin sizinle iletişime geçebilmesi adına platformda açık olarak listelenir. Verileriniz hiçbir reklam kuruluşuna veya pazarlama firmasına satılmaz ya da devredilmez.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">3. Veri Silme ve Güncelleme</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    İlanınızı dilediğiniz an &quot;İlanı Sil&quot; veya &quot;Aramayı Sil&quot; butonlarını kullanarak sistemden tamamen kaldırabilirsiniz. İlan silindiğinde ilgili kayıtlar veritabanından kalıcı olarak silinir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kvkk' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Mevzuat</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">6698 Sayılı KVKK Aydınlatma Metni</h3>
              </div>

              <p className="text-gray-600">
                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verilerinizin işlenme şartları ve yasal haklarınız aşağıda bilgilerinize sunulmuştur.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">1. Veri Sorumlusu ve Açık Rıza</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    FindRoom platformu, sunduğunuz iletişim ve tercih verilerini KVKK Madde 5/1 uyarınca &quot;Açık Rızanız&quot; hukuki sebebine dayanarak işler.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">2. Verilerin İşlenme Amacı</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Kişisel verileriniz, yalnızca yurt takas talebinizin ve oda arkadaşı arayışınızın panoda yayınlanması ve uygun eşleşmeler için ilgilenen öğrencilerin sizinle iletişim kurması amacıyla kullanılır.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">3. KVKK Kapsamındaki Haklarınız (Madde 11)</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs sm:text-sm">
                    <li>Verilerinizin işlenip işlenmediğini ve amacına uygunluğunu öğrenme,</li>
                    <li>Eksik veya yanlış işlenmişse düzeltilmesini talep etme,</li>
                    <li>İlanınızı silerek açık rızanızı geri çekme ve verilerinizin silinmesini isteme hakkına sahipsiniz.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Hukuki Bildirim</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Sorumluluk Reddi Beyanı</h3>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border-l-4 border-l-indigo-600 border border-gray-100">
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Önemli Hatırlatma</h4>
                <p className="text-gray-600 text-xs mt-1">
                  Lütfen platformdaki duyuru ve eşleşmeleri değerlendirmeden önce bu şartları dikkatle inceleyiniz.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">1. Yurt İdarelerinden Bağımsızlık</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    FindRoom, üniversiteler veya resmi yurt yönetimleriyle hiçbir kurumsal veya resmi bağlantısı bulunmayan bağımsız bir ilan platformudur. Resmi yurt yönetmelikleri, nakil ve izin prosedürleri tamamen ilgili idarelerin yetkisindedir.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">2. İdari ve Hukuki Sorumluluk</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Resmi yurt idaresinin onayı alınmaksızın gerçekleştirilen oda veya yurt değişikliklerinden kaynaklanabilecek disiplin soruşturması veya idari yaptırımların sorumluluğu tamamen kullanıcılara aittir.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">3. Güvenlik ve İletişim Sorumluluğu</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Platformda paylaştığınız iletişim bilgileri kamuya açıktır. Kullanıcıların tanımadıkları kişilerle görüşürken kendi güvenliklerini gözetmeleri gerekmektedir. Kullanıcılar arası diyaloglardan doğabilecek uyuşmazlıklardan platform sorumlu değildir.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">4. Maddi Kayıplar ve Hasar</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Kullanıcılar arasındaki oda takasları veya oda arkadaşlığı süreçlerinde meydana gelebilecek kişisel eşya kayıpları veya maddi zararlardan FindRoom sorumlu tutulamaz.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer - Sade ve net kapatma butonu */}
        <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500 hidden sm:block">
            FindRoom Öğrenci Bilgilendirme Panosu
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 text-center"
          >
            Okudum, Anladım
          </button>
        </div>

      </div>
    </div>
  );
};

