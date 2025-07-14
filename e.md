<main className="min-h-screen">
{/* Hero Section with Background Image */}
<div className="relative h-screen w-full overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src={images.hero}
      alt="Kıbrıs Luxury Living"
      fill
      priority
      quality={90}
      sizes="100vw"
      className="object-cover"
    />
    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/50" />
  </div>

  {/* Hero Content */}
  <div className="relative z-10 h-full flex  items-center justify-center">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal md:font-light mb-6 md:mb-8 leading-tight ${GeistSans.className}`}>
        İstanbul'dan Kıbrıs'a<br />
        <span className="text-yellow-400 font-medium md:font-medium">TL ile Ev Sahibi Olun</span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal md:font-light max-w-5xl mx-auto leading-relaxed text-white/95 mb-8 md:mb-12 px-2">
        İstanbul'daki yüksek konut fiyatlarına alternatif arayanlar için Kıbrıs'ta sabit Türk Lirası taksitlerle yatırım yapma zamanı. <span className="text-yellow-400">Döveç Group güvencesiyle</span>, sadece 1,5 saat uzağınızda.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4">
        <a 
          href="#bilgi-al" 
          className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-yellow-400 hover:bg-yellow-500 text-[#061E4F] font-semibold rounded-none transition-all duration-500 text-lg md:text-xl shadow-2xl hover:shadow-yellow-400/20 transform hover:-translate-y-1"
        >
          Hemen Bilgi Alın
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <a 
          href="tel:+905488370015" 
          className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-transparent border-2 border-white hover:bg-white hover:text-[#061E4F] text-white font-semibold rounded-none transition-all duration-500 text-lg md:text-xl"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Hemen Ara
        </a>
      </div>
    </div>
  </div>
  
  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </div>
</div>

{/* Stats Section */}
<div className="bg-[#D8D6CD] text-[#061E4F] py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="text-center">
        <div className={`text-4xl lg:text-5xl font-light text-[#061E4F] mb-2 ${GeistSans.className}`}>65K</div>
        <p className="text-[#061E4F]">İstanbul m² Fiyatı</p>
      </div>
      <div className="text-center">
        <div className={`text-4xl lg:text-5xl font-light text-[#061E4F] mb-2 ${GeistSans.className}`}>28K</div>
        <p className="text-[#061E4F]">Kıbrıs m² Fiyatı</p>
      </div>
      <div className="text-center">
        <div className={`text-4xl lg:text-5xl font-light text-[#061E4F] mb-2 ${GeistSans.className}`}>%7</div>
        <p className="text-[#061E4F]">Kira Getirisi</p>
      </div>
      <div className="text-center">
        <div className={`text-4xl lg:text-5xl font-light text-[#061E4F] mb-2 ${GeistSans.className}`}>30</div>
        <p className="text-[#061E4F]">Gün Tapu Teslim</p>
      </div>
    </div>
  </div>
</div>

{/* Premium Content Section with Image */}
<div className="relative py-32 overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src={images.section1}
      alt="Cyprus Night View"
      fill
      className="object-cover"
      quality={85}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/10 to-black/20" />
  </div>
  
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="text-white bg-black/40 backdrop-blur-sm p-8 lg:p-12 rounded-none border border-white/10">
        <h2 className={`text-4xl lg:text-5xl font-light mb-8 leading-tight ${GeistSans.className}`}>
          Neden Şimdi <span className="text-yellow-400">Kıbrıs'ta</span> Ev Alınmalı?
        </h2>
        <div className="prose prose-lg prose-invert max-w-none font-light leading-relaxed space-y-6">
          <p className="text-xl text-white font-medium leading-relaxed">
            Konut yatırımı yapmak isteyen birçok İstanbullu, şehirde artan fiyatlar ve yüksek yaşam maliyetleri nedeniyle alternatif bölgeleri araştırıyor.
          </p>
          <p className="text-lg text-white/95 leading-relaxed">
            Bu noktada Kıbrıs, hem ekonomik avantajları hem de yaşam kalitesiyle öne çıkıyor. Kıbrıs'ta TL ile ev sahibi olma imkânı, özellikle döviz kurunun sürekli dalgalandığı bir dönemde ciddi bir güvenlik sunuyor.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-yellow-400/20 backdrop-blur-sm p-6 rounded-none border border-yellow-400/30">
              <h3 className="text-yellow-400 font-semibold mb-2 text-lg">Sabit TL Taksitler</h3>
              <p className="text-sm text-white/90">Döviz riskinden koruma</p>
            </div>
            <div className="bg-yellow-400/20 backdrop-blur-sm p-6 rounded-none border border-yellow-400/30">
              <h3 className="text-yellow-400 font-semibold mb-2 text-lg">Hızlı Teslim</h3>
              <p className="text-sm text-white/90">30 gün içinde tapu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Comparison Table - Enhanced */}
<div className="bg-gradient-to-b from-gray-50 to-white py-32">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className={`text-4xl lg:text-5xl font-light text-center text-[#061E4F] mb-16 ${GeistSans.className}`}>
      Fiyat & Getiri <span className="text-yellow-500">Karşılaştırması</span>
    </h2>
    <div className="bg-white rounded-none shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-[#061E4F] text-white">
              <th className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-left text-base sm:text-lg lg:text-xl font-light">Kriter</th>
              <th className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-base sm:text-lg lg:text-xl font-light">İstanbul</th>
              <th className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-base sm:text-lg lg:text-xl font-light bg-yellow-400 text-[#061E4F]">Kıbrıs</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 font-medium text-sm sm:text-base lg:text-lg">Ortalama m² Fiyatı</td>
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-sm sm:text-base lg:text-lg">65.000 TL</td>
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-green-600 font-bold text-base sm:text-lg lg:text-xl">28.000 TL</td>
          </tr>
          <tr className="bg-gray-50 border-b border-gray-100">
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 font-medium text-sm sm:text-base lg:text-lg">Tapu Teslim Süresi</td>
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-sm sm:text-base lg:text-lg">90+ gün</td>
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-green-600 font-bold text-base sm:text-lg lg:text-xl">30 gün</td>
          </tr>
          <tr className="border-b border-gray-100">
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 font-medium text-sm sm:text-base lg:text-lg">Kira Getirisi Oranı</td>
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-sm sm:text-base lg:text-lg">%3–4</td>
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-green-600 font-bold text-base sm:text-lg lg:text-xl">%6–7</td>
          </tr>
          <tr className="bg-gray-50">
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 font-medium text-sm sm:text-base lg:text-lg">Kredi Gerekliliği</td>
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-sm sm:text-base lg:text-lg">Gerekli</td>
              <td className="px-3 sm:px-6 lg:px-8 py-4 lg:py-6 text-center text-green-600 font-bold text-base sm:text-lg lg:text-xl">Gereksiz</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
    <p className="mt-8 text-center text-gray-600 text-base sm:text-lg italic px-4">
      "Kıbrıs'ın yatırım geri dönüş oranı İstanbul'dan neredeyse 2 kat fazla"
    </p>
  </div>
</div>

{/* Döveç Group Section with Image */}
<div className="relative py-32 overflow-hidden bg-black">
  <div className="absolute inset-0">
    <Image
      src={images.section2}
      alt="Döveç Group Projects"
      fill
      className="object-cover opacity-70"
      quality={85}
    />
  </div>
  
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="text-white">
        <h2 className={`text-4xl lg:text-5xl font-light mb-8 leading-tight ${GeistSans.className}`}>
          <span className="text-yellow-400">Döveç Group</span><br />
          Güvencesiyle
        </h2>
        <p className="text-xl mb-8 opacity-90">
          1989'dan bu yana Kuzey Kıbrıs'ta inşaat ve gayrimenkul sektöründe binlerce kişiyi ev sahibi yaptık.
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {[
            "Tapu garantili projeler",
            "Türk Lirası ile sabit ödeme planları", 
            "30 gün içinde anahtar teslim süreçleri",
            "Kredi gerektirmeyen sistem",
            "İstanbul'dan online satış danışmanlığı"
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 bg-yellow-400/10 backdrop-blur-sm p-4 rounded-none border-l-4 border-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0" />
              <span className="text-lg">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

{/* FAQ Section - Redesigned */}
<div className="bg-gradient-to-b from-white to-gray-50 py-32">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className={`text-4xl lg:text-5xl font-light text-center text-[#061E4F] mb-16 ${GeistSans.className}`}>
      Sık Sorulan <span className="text-yellow-500">Sorular</span>
    </h2>
    <div className="space-y-6">
      {[
        {
          q: "Kıbrıs'ta TL ile ev almak mümkün mü?",
          a: "Evet, Döveç Group projelerinde Türk Lirası ile sabit taksitli ödeme yapılabilir."
        },
        {
          q: "Tapu işlemleri ne kadar sürüyor?",
          a: "Tapu işlemleri maksimum 30 gün içinde tamamlanmaktadır."
        },
        {
          q: "İstanbul'dan Kıbrıs'a yatırım süreci nasıl işler?",
          a: "Uçakla gelip projeyi gezebilir, aynı gün içinde sözleşme yapabilirsiniz."
        },
        {
          q: "Kira getirisi ne kadar?",
          a: "Kıbrıs'ta yıllık kira getirisi %6–7 arasındadır."
        },
        {
          q: "Kredi kullanmak zorunda mıyım?",
          a: "Hayır, Döveç Group kredi gerektirmeyen ödeme planları sunmaktadır."
        },
        {
          q: "Hangi projeler TL ile satılıyor?",
          a: "Döveç Group'un güncel projeleri sabit TL ile satışa sunulmaktadır."
        }
      ].map((faq, index) => (
        <div key={index} className="bg-white rounded-none p-8 shadow-lg border-l-4 border-yellow-400 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-semibold text-[#061E4F] mb-4">{faq.q}</h3>
          <p className="text-gray-700 font-light text-lg leading-relaxed">{faq.a}</p>
        </div>
      ))}
    </div>
  </div>
</div>

{/* Final CTA Section */}
<div id="bilgi-al" className="bg-gradient-to-r from-[#061E4F] to-[#0A2A6A] text-white py-32">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className={`text-4xl lg:text-6xl font-light mb-8 leading-tight ${GeistSans.className}`}>
      Fırsatı <span className="text-yellow-400">Kaçırmayın!</span>
    </h2>
    <p className="text-xl lg:text-2xl font-light mb-12 leading-relaxed max-w-4xl mx-auto opacity-90">
      İstanbul'daki konut sıkıntısına karşı, sadece 1,5 saatlik uçuş mesafesinde, TL ile ödeme imkânı ve yüksek kira getirisi sunan Kıbrıs sizin için eşsiz bir fırsat.
    </p>
    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      <a 
        href="tel:+905488370015" 
        className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-yellow-400 hover:bg-yellow-500 text-[#061E4F] font-semibold rounded-none transition-all duration-500 text-xl shadow-2xl hover:shadow-yellow-400/20 transform hover:-translate-y-1"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Hemen Ara
      </a>
      <a 
        href="https://wa.me/905488370015" 
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 px-12 py-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-none transition-all duration-500 text-xl shadow-2xl hover:shadow-green-600/20 transform hover:-translate-y-1"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.108"/>
        </svg>
        WhatsApp
      </a>
    </div>
    
    <div className="mt-16 pt-8 border-t border-white/20">
      <p className="text-lg opacity-80">
        <span className={`font-light ${GeistSans.className}`}>1989</span> yılından bu yana güvenilir inşaat deneyimi
      </p>
    </div>
  </div>
</div>
</main>
)
} 