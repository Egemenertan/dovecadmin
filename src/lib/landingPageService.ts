import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { LandingPage, LandingPageFormData, LandingPageListItem } from '../types/landingPage';

const LP_COLLECTION = 'lp';

// Slug oluşturma fonksiyonu
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Tüm landing page'leri getir
export const getAllLandingPages = async (): Promise<LandingPageListItem[]> => {
  try {
    console.log('🔥 getAllLandingPages: Starting to fetch landing pages...');
    const lpCollection = collection(db, LP_COLLECTION);
    
    // Basit query - sadece collection'ı al
    const querySnapshot = await getDocs(lpCollection);
    console.log('📊 getAllLandingPages: Query snapshot size:', querySnapshot.size);
    
    const landingPages = querySnapshot.docs.map(doc => {
      console.log('📄 getAllLandingPages: LP document:', doc.id, doc.data());
      return {
        id: doc.id,
        ...doc.data()
      };
    }) as LandingPageListItem[];
    
    // Client-side'da sıralama yap
    const sortedLPs = landingPages.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Desc order
    });
    
    console.log('✅ getAllLandingPages: Returning', sortedLPs.length, 'landing pages');
    return sortedLPs;
  } catch (error) {
    console.error('❌ getAllLandingPages: Error fetching landing pages:', error);
    throw error;
  }
};

// Real-time listener for all landing pages
export const subscribeToLandingPages = (callback: (lps: LandingPageListItem[]) => void): Unsubscribe => {
  console.log('🔥 subscribeToLandingPages: Starting real-time listener...');
  const lpCollection = collection(db, LP_COLLECTION);
  
  return onSnapshot(lpCollection, (querySnapshot) => {
    console.log('📊 subscribeToLandingPages: Snapshot size:', querySnapshot.size);
    
    const landingPages = querySnapshot.docs.map(doc => {
      console.log('📄 subscribeToLandingPages: LP document:', doc.id, doc.data());
      return {
        id: doc.id,
        ...doc.data()
      };
    }) as LandingPageListItem[];
    
    // Client-side'da sıralama yap
    const sortedLPs = landingPages.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Desc order
    });
    
    console.log('✅ subscribeToLandingPages: Calling callback with', sortedLPs.length, 'landing pages');
    callback(sortedLPs);
  }, (error) => {
    console.error('❌ subscribeToLandingPages: Error in subscription:', error);
  });
};

// Yayınlanmış landing page'leri getir
export const getPublishedLandingPages = async (): Promise<LandingPageListItem[]> => {
  try {
    const lpCollection = collection(db, LP_COLLECTION);
    const q = query(lpCollection, where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    
    const landingPages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LandingPageListItem[];
    
    // Client-side'da sıralama yap
    const sortedLPs = landingPages.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Desc order
    });
    
    return sortedLPs;
  } catch (error) {
    console.error('Error fetching published landing pages:', error);
    throw error;
  }
};

// ID ile landing page getir
export const getLandingPageById = async (id: string): Promise<LandingPage | null> => {
  try {
    const lpDoc = doc(db, LP_COLLECTION, id);
    const docSnap = await getDoc(lpDoc);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as LandingPage;
    }
    return null;
  } catch (error) {
    console.error('Error fetching landing page by ID:', error);
    throw error;
  }
};

// Real-time listener for a single landing page
export const subscribeToLandingPage = (id: string, callback: (lp: LandingPage | null) => void): Unsubscribe => {
  const lpDoc = doc(db, LP_COLLECTION, id);
  
  return onSnapshot(lpDoc, (docSnap) => {
    if (docSnap.exists()) {
      const landingPage = {
        id: docSnap.id,
        ...docSnap.data()
      } as LandingPage;
      callback(landingPage);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error in landing page subscription:', error);
    callback(null);
  });
};

// Slug ile landing page getir
export const getLandingPageBySlug = async (slug: string): Promise<LandingPage | null> => {
  try {
    const lpCollection = collection(db, LP_COLLECTION);
    const q = query(lpCollection, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as LandingPage;
    }
    return null;
  } catch (error) {
    console.error('Error fetching landing page by slug:', error);
    throw error;
  }
};

// Yeni landing page oluştur
export const createLandingPage = async (lpData: LandingPageFormData): Promise<string> => {
  try {
    // Kullanıcının girdiği slug varsa onu kullan, yoksa isimden generate et
    const slug = lpData.slug && lpData.slug.trim() 
      ? lpData.slug.trim() 
      : generateSlug(lpData.name);
    
    const now = serverTimestamp();
    const nowMillis = Date.now();
    
    const newLP = {
      ...lpData,
      slug,
      createdAt: now,
      updatedAt: nowMillis,
      viewCount: 0,
      conversionCount: 0
    };

    const docRef = await addDoc(collection(db, LP_COLLECTION), newLP);
    console.log('✅ Landing Page Firebase\'e kaydedildi, ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Landing Page oluşturma hatası:', error);
    throw error;
  }
};

// Landing page güncelle
export const updateLandingPage = async (id: string, lpData: Partial<LandingPageFormData>): Promise<void> => {
  try {
    const lpDoc = doc(db, LP_COLLECTION, id);
    const updateData: any = {
      ...lpData,
      updatedAt: Date.now()
    };

    // Eğer slug explicitly gönderilmişse onu kullan
    // Sadece name değişip slug gönderilmemişse, slug'ı name'den generate et
    if (lpData.slug !== undefined) {
      // Slug explicitly set edilmiş (boş string dahil)
      updateData.slug = lpData.slug.trim() || generateSlug(lpData.name || '');
    } else if (lpData.name && !lpData.slug) {
      // Sadece name değişmiş, slug dokunulmamış - bu durumda slug'ı güncelleme
      // Mevcut slug'ı koru
    }

    await updateDoc(lpDoc, updateData);
  } catch (error) {
    console.error('Error updating landing page:', error);
    throw error;
  }
};

// Landing page sil
export const deleteLandingPage = async (id: string): Promise<void> => {
  try {
    const lpDoc = doc(db, LP_COLLECTION, id);
    await deleteDoc(lpDoc);
  } catch (error) {
    console.error('Error deleting landing page:', error);
    throw error;
  }
};

// Landing page görüntülenme sayısını artır
export const incrementViewCount = async (id: string): Promise<void> => {
  try {
    const lpDoc = doc(db, LP_COLLECTION, id);
    await updateDoc(lpDoc, {
      viewCount: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
};

// Landing page conversion sayısını artır
export const incrementConversionCount = async (id: string): Promise<void> => {
  try {
    const lpDoc = doc(db, LP_COLLECTION, id);
    await updateDoc(lpDoc, {
      conversionCount: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing conversion count:', error);
    throw error;
  }
};

// Default template data - e.md'den alınan içerik
export const getDefaultLandingPageData = (): Omit<LandingPageFormData, 'name' | 'slug'> => {
  return {
    status: 'draft',
    hero: {
      title: "İstanbul'dan Kıbrıs'a",
      subtitle: "TL ile Ev Sahibi Olun",
      description: "İstanbul'daki yüksek konut fiyatlarına alternatif arayanlar için Kıbrıs'ta sabit Türk Lirası taksitlerle yatırım yapma zamanı. Döveç Group güvencesiyle, sadece 1.5 saat uzağınızda.",
      primaryButtonText: "Hemen Bilgi Alın",
      primaryButtonLink: "#bilgi-al",
      secondaryButtonText: "Hemen Ara",
      secondaryButtonLink: "tel:+905488370015",
      backgroundImage: "/images/hero-bg.jpg"
    },
    stats: {
      stats: [
        { value: "65K", label: "İstanbul m² Fiyatı" },
        { value: "28K", label: "Kıbrıs m² Fiyatı" },
        { value: "%7", label: "Kira Getirisi" },
        { value: "30", label: "Gün Tapu Teslim" }
      ],
      backgroundColor: "#D8D6CD",
      textColor: "#061E4F"
    },
    premium: {
      title: "Neden Şimdi Kıbrıs'ta Ev Alınmalı?",
      description: "Konut yatırımı yapmak isteyen birçok İstanbullu, şehirde artan fiyatlar ve yüksek yaşam maliyetleri nedeniyle alternatif bölgeleri araştırıyor.",
      features: [
        { title: "Sabit TL Taksitler", description: "Döviz riskinden koruma" },
        { title: "Hızlı Teslim", description: "30 gün içinde tapu" }
      ],
      backgroundImage: "/images/premium-bg.jpg"
    },
    comparison: {
      title: "Fiyat & Getiri Karşılaştırması",
      subtitle: "",
      tableHeaders: {
        criterion: "Kriter",
        istanbul: "İstanbul",
        cyprus: "Kıbrıs"
      },
      tableRows: [
        { criterion: "Ortalama m² Fiyatı", istanbul: "65.000 TL", cyprus: "28.000 TL" },
        { criterion: "Tapu Teslim Süresi", istanbul: "90+ gün", cyprus: "30 gün" },
        { criterion: "Kira Getirisi Oranı", istanbul: "%3–4", cyprus: "%6–7" },
        { criterion: "Kredi Gerekliliği", istanbul: "Gerekli", cyprus: "Gereksiz" }
      ],
      footerNote: "Kıbrıs'ın yatırım geri dönüş oranı İstanbul'dan neredeyse 2 kat fazla"
    },
    company: {
      title: "Döveç Group Güvencesiyle",
      subtitle: "",
      description: "1989'dan bu yana Kuzey Kıbrıs'ta inşaat ve gayrimenkul sektöründe binlerce kişiyi ev sahibi yaptık.",
      features: [
        "Tapu garantili projeler",
        "Türk Lirası ile sabit ödeme planları",
        "30 gün içinde anahtar teslim süreçleri",
        "Kredi gerektirmeyen sistem",
        "İstanbul'dan online satış danışmanlığı"
      ],
      backgroundImage: "/images/company-bg.jpg"
    },
    faq: {
      title: "Sık Sorulan Sorular",
      subtitle: "",
      faqs: [
        {
          question: "Kıbrıs'ta TL ile ev almak mümkün mü?",
          answer: "Evet, Döveç Group projelerinde Türk Lirası ile sabit taksitli ödeme yapılabilir."
        },
        {
          question: "Tapu işlemleri ne kadar sürüyor?",
          answer: "Tapu işlemleri maksimum 30 gün içinde tamamlanmaktadır."
        },
        {
          question: "İstanbul'dan Kıbrıs'a yatırım süreci nasıl işler?",
          answer: "Uçakla gelip projeyi gezebilir, aynı gün içinde sözleşme yapabilirsiniz."
        },
        {
          question: "Kira getirisi ne kadar?",
          answer: "Kıbrıs'ta yıllık kira getirisi %6–7 arasındadır."
        },
        {
          question: "Kredi kullanmak zorunda mıyım?",
          answer: "Hayır, Döveç Group kredi gerektirmeyen ödeme planları sunmaktadır."
        },
        {
          question: "Hangi projeler TL ile satılıyor?",
          answer: "Döveç Group'un güncel projeleri sabit TL ile satışa sunulmaktadır."
        }
      ]
    },
    cta: {
      title: "Fırsatı Kaçırmayın!",
      subtitle: "",
      description: "İstanbul'daki konut sıkıntısına karşı, sadece 1,5 saatlik uçuş mesafesinde, TL ile ödeme imkânı ve yüksek kira getirisi sunan Kıbrıs sizin için eşsiz bir fırsat.",
      primaryButtonText: "Hemen Ara",
      primaryButtonLink: "tel:+905488370015",
      secondaryButtonText: "WhatsApp",
      secondaryButtonLink: "https://wa.me/905488370015",
      footerText: "1989 yılından bu yana güvenilir inşaat deneyimi"
    },
    familyFeatures: {
      title: "Aileler İçin",
      subtitle: "Güvenli ve Sosyal Yaşam Alanları",
      features: [
        {
          title: "Yüzme Havuzları",
          description: "Site içi çocuk ve yetişkin havuzları"
        },
        {
          title: "Oyun Alanları",
          description: "Kapalı ve açık çocuk oyun alanları"
        },
        {
          title: "24/7 Güvenlik",
          description: "Güvenlik sistemi ve kapalı otopark"
        },
        {
          title: "Kreş Hizmeti",
          description: "Bazı sitelerde kreş/anaokulu hizmeti"
        },
        {
          title: "Spor Alanları",
          description: "Spor salonları ve açık hava aktiviteleri"
        },
        {
          title: "Sosyal Yaşam",
          description: "Komşuluk ilişkilerinin kuvvetli olduğu butik yaşam"
        }
      ],
      bottomQuote: "Bu sosyal alanlar sayesinde çocuklar özgürce oynarken, ebeveynler de güven içinde yaşamlarını sürdürebiliyor."
    },
    education: {
      title: "Kıbrıs'ta",
      subtitle: "Eğitim Olanakları",
      description: "Kıbrıs, yalnızca yatırım değil, eğitim açısından da ailelerin tercih ettiği bir destinasyon haline gelmiştir. Özellikle uluslararası düzeyde eğitim veren özel okullar ve üniversiteler sayesinde çocuklar kaliteli eğitim alma şansına sahip oluyor.",
      benefits: [
        "İngilizce ve Türkçe eğitim veren okullar",
        "Üniversite hazırlık programları ve çift diploma imkânı",
        "Modern kampüsler ve STEM odaklı eğitim sistemleri",
        "İstanbul'a kıyasla %40-50 daha ekonomik okul masrafları"
      ],
      advantages: [
        {
          title: "Eğitim Avantajları",
          items: [
            "✓ Devlet okulları ücretsiz",
            "✓ Uluslararası müfredatlar",
            "✓ Küçük sınıf mevcutları",
            "✓ İngilizce ortamda eğitim"
          ],
          quote: "İstanbul'daki okul maliyetleri ile kıyaslandığında, Kıbrıs'ta çocuk yetiştirmek çok daha ekonomik ve konforlu bir seçenek sunar."
        }
      ]
    },
    paymentSystem: {
      title: "TL ile Sabit Ödeme –",
      subtitle: "Kredi Gerektirmeyen Sistem",
      paymentOptions: [
        {
          title: "12-24 Ay Taksit",
          description: "Sabit TL taksitlerle aile bütçesine uygun ödeme",
          borderColor: "yellow-400"
        },
        {
          title: "Peşinat Sistemi",
          description: "Makul peşinatla başlayan ödeme planı",
          borderColor: "[#061E4F]"
        },
        {
          title: "Kur Güvencesi",
          description: "Kur riski ve faiz baskısı olmadan ödeme",
          borderColor: "yellow-400"
        }
      ],
      bottomQuote: "Bu model sayesinde çocuklarının geleceğini güvence altına almak isteyen ebeveynler, yatırım stresinden uzak bir yol izliyor."
    },
    customerStory: {
      title: "Müşteri Hikâyesi:",
      subtitle: "İstanbul'dan Kıbrıs'a Taşınan Aile",
      quote: "İki çocuklu bir aileyiz. İstanbul'da yaşamak maddi ve manevi olarak çok zordu. Döveç Group sayesinde Kıbrıs'ta TL ile ev sahibi olduk. Okul, sağlık, güvenlik her açıdan içimiz rahat. Çocuklarımız artık bahçede oynayabiliyor.",
      author: "— Ayşe & Murat K. / Bahçelievler, İstanbul",
      backgroundImage: "/images/section2.jpg"
    },
    seoTitle: "Kıbrıs'ta TL ile Ev Sahibi Olun - Döveç Group",
    seoDescription: "İstanbul'daki yüksek konut fiyatlarına alternatif! Kıbrıs'ta sabit TL taksitlerle ev sahibi olun. %7 kira getirisi, 30 gün tapu teslim.",
    tags: ["gayrimenkul", "kıbrıs", "yatırım", "ev", "tapu"]
  };
}; 