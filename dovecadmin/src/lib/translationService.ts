import OpenAI from 'openai';

// OpenAI istemcisini oluştur
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Client-side kullanım için
});

// HTML etiketlerini koruyarak çeviri yapan yardımcı fonksiyon
const preserveHtmlTags = (text: string): { cleanText: string; tags: Array<{ placeholder: string; original: string }> } => {
  const tags: Array<{ placeholder: string; original: string }> = [];
  let cleanText = text;
  
  // HTML etiketlerini bul ve placeholder ile değiştir
  const htmlTagRegex = /<[^>]+>/g;
  let match;
  let counter = 0;
  
  while ((match = htmlTagRegex.exec(text)) !== null) {
    const placeholder = `__HTML_TAG_${counter}__`;
    tags.push({ placeholder, original: match[0] });
    cleanText = cleanText.replace(match[0], placeholder);
    counter++;
  }
  
  return { cleanText, tags };
};

// Placeholder'ları geri HTML etiketleri ile değiştir
const restoreHtmlTags = (translatedText: string, tags: Array<{ placeholder: string; original: string }>): string => {
  let result = translatedText;
  tags.forEach(({ placeholder, original }) => {
    result = result.replace(placeholder, original);
  });
  return result;
};

// Tekil metin çevirisi
export const translateText = async (text: string): Promise<string> => {
  if (!text || text.trim() === '') return '';
  
  try {
    // HTML etiketlerini koru
    const { cleanText, tags } = preserveHtmlTags(text);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Sen profesyonel bir çevirmensin. Türkçe metinleri İngilizce'ye çevir. Sadece çeviriyi döndür, ek açıklama yapma. HTML etiketleri varsa onları olduğu gibi koru. Çeviride doğal ve akıcı bir dil kullan."
        },
        {
          role: "user",
          content: `Bu Türkçe metni İngilizce'ye çevir:\n\n${cleanText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const translatedText = completion.choices[0]?.message?.content || '';
    
    // HTML etiketlerini geri yerleştir
    return restoreHtmlTags(translatedText, tags);
  } catch (error) {
    console.error('Çeviri hatası:', error);
    throw new Error('Çeviri işlemi başarısız oldu. Lütfen API anahtarınızı kontrol edin.');
  }
};

// Blog verilerini çevir
export interface BlogTranslationData {
  title: string;
  excerpt: string;
  content: string;
}

export const translateBlogData = async (data: BlogTranslationData): Promise<{
  en_title: string;
  en_excerpt: string;
  en_content: string;
}> => {
  try {
    // Paralel çeviri için promise'leri oluştur
    const [titlePromise, excerptPromise, contentPromise] = [
      translateText(data.title),
      translateText(data.excerpt),
      translateText(data.content)
    ];

    // Tüm çevirileri paralel olarak bekle
    const [en_title, en_excerpt, en_content] = await Promise.all([
      titlePromise,
      excerptPromise,
      contentPromise
    ]);

    return {
      en_title,
      en_excerpt,
      en_content
    };
  } catch (error) {
    console.error('Blog çevirisi hatası:', error);
    throw error;
  }
};

// API anahtarı kontrolü
export const checkOpenAIApiKey = (): boolean => {
  return !!(process.env.NEXT_PUBLIC_OPENAI_API_KEY && process.env.NEXT_PUBLIC_OPENAI_API_KEY.trim() !== '');
}; 