import React from 'react';

export type LegalTab = 'terms' | 'privacy' | 'security' | 'kvkk' | 'disclaimer';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

const TABS: { id: LegalTab; label: string }[] = [
  { id: 'terms', label: 'Kullanıcı Sözleşmesi' },
  { id: 'privacy', label: 'Gizlilik Politikası' },
  { id: 'security', label: 'Veri Güvenliği' },
  { id: 'kvkk', label: 'KVKK Metni' },
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
                Gizliliğiniz ve güvenliğiniz bizim için en temel ilkedir. Bu politika, platformu kullanırken paylaştığınız verilerin kapsamını, eşleşme mekanizmasının işleyişini ve silinme sürecini açıklar.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">1. Toplanan Bilgiler</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs sm:text-sm">
                    <li>Gönüllü İletişim Bilgileri: Kullanıcının kendi rızasıyla girdiği Telegram, Instagram kullanıcı adı veya telefon numarası.</li>
                    <li>Yurt ve Oda Tercihleri: Mevcut ve hedeflenen yurt, kampüs, oda tipi ve tercihler.</li>
                    <li>Teknik Veri: İlanınızı cihazınız üzerinden yönetebilmeniz için tarayıcınızın yerel depolama (localStorage) alanında tutulan anonim kimlik belirteci.</li>
                  </ul>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">2. Eşleşme Mekanizması ve Geçici Veri İşleme</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Sistemimizin yurt takas veya oda arkadaşı eşleşmelerini tespit edebilmesi için, paylaştığınız oda kriterleri ve iletişim bilginiz <strong>yalnızca ilanınız yayında kaldığı süre boyunca geçici olarak</strong> veri tabanında tutulur ve eşleşme algoritması tarafından karşılaştırılır. Bilgileriniz profil çıkarma, reklam, pazarlama veya veri madenciliği amacıyla asla kullanılmaz; üçüncü kişilere devredilmez ya da satılmaz.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">3. Verilerin Kalıcı Olarak Silinmesi ve İmha</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Verileriniz kalıcı bir arşivde saklanmaz. İlan sahibi arayüzdeki <strong>&quot;İlanı Sil&quot;</strong> veya <strong>&quot;Aramayı Sil&quot;</strong> butonuna bastığı anda ya da ilgili akademik dönem sona erdiğinde tüm iletişim ve oda verileri sunuculardan ve veri tabanından <strong>anında ve kalıcı olarak</strong> silinir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Güvenlik İlkeleri</span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Veri Güvenliği ve Gizlilik Protokolü</h3>
              </div>

              <p className="text-gray-600">
                FindRoom, öğrencilerin gizliliğini ve veri güvenliğini korumak üzere tasarlanmış bağımsız bir öğrenci girişimidir. Platformda kullanıcıların güvenliği için aşağıdaki teknik ve idari ilkeler uygulanır:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">1. Geçici Saklama ve Veri Minimizasyonu</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Sistemde yalnızca eşleşme için zorunlu olan oda ve iletişim bilgisi tutulur. T.C. kimlik numarası, şifre, öğrenci numarası veya hassas kişisel veriler asla talep edilmez veya işlenmez.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">2. Kalıcı İmha İlkesi</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    İlanınızı veya oda arkadaşı aramanızı sildiğiniz an verileriniz veritabanından kalıcı olarak yok edilir. Ayrıca dönem sonunda eski tüm veriler toplu olarak silinir.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">3. Şifreli İletim (SSL / HTTPS)</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Platform üzerindeki tüm veri transferi HTTPS / TLS şifreleme protokolü üzerinden gerçekleştirilir. Veritabanı altyapısı güvenli Firebase altyapısında barındırılır.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">4. Ticari Olmayan Bağımsız Yapı</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Verileriniz reklam verenlerle, üçüncü şahıslarla veya kurumlarla kesinlikle paylaşılmaz, satılmaz veya ticarileştirilmez.
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
                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verilerinizin işlenme şartları, süre sınırları ve haklarınız aşağıda özetlenmiştir.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">1. Veri Sorumlusu ve Açık Rıza Dayanağı</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    FindRoom bağımsız bir öğrenci bilgilendirme ve eşleşme panosudur. Sunduğunuz veriler, KVKK Madde 5/1 uyarınca tamamen sizin <strong>&quot;Açık Rızanız&quot;</strong> hukuki sebebine dayanarak işlenir.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">2. Amaca Bağlılık ve Süreyle Sınırlılık (KVKK Madde 4)</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Kişisel verileriniz, Kanun&apos;un 4. maddesindeki temel ilkeler gereğince yalnızca <em>&quot;öğrenciler arası yurt takas ve oda arkadaşı eşleştirmesi&quot;</em> açık ve meşru amacıyla ve <strong>sadece bu amacın gerektirdiği süreyle (ilanınız aktif olduğu müddetçe)</strong> sınırlı olarak işlenir. Amacın dışına çıkacak hiçbir ikincil işlem gerçekleştirilmez.
                  </p>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-1">3. Veri Sahibi Olarak Haklarınız (KVKK Madde 11)</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-xs sm:text-sm">
                    <li>Verilerinizin yalnızca eşleşme amacıyla işlenip işlenmediğini öğrenme,</li>
                    <li>İlanınızı istediğiniz an &quot;Düzenle&quot; butonuyla güncelleme,</li>
                    <li>İlanınızı dilediğiniz an &quot;İlanı Sil&quot; butonuna basarak açık rızanızı geri çekme ve tüm verilerinizin derhal kalıcı olarak silinmesini sağlama hakkına sahipsiniz.</li>
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

