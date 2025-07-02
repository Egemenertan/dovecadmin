# Blog Çeviri Sistemi

Bu proje, Next.js tabanlı blog sisteminde Türkçe içerikleri otomatik olarak İngilizce'ye çeviren bir sistem içerir.

## Özellikler

### 🚀 Otomatik Çeviri
- **OpenAI GPT-3.5-turbo** ile profesyonel çeviri
- **Paralel işleme**: Başlık, özet ve içerik aynı anda çevrilir
- **HTML koruması**: Rich text editörde HTML etiketleri korunur
- **Tek tık çeviri**: Sağ üst köşedeki buton ile instant çeviri

### 📝 Modern Rich Text Editor
- **TipTap tabanlı** modern editör
- **4 farklı resim ekleme yöntemi**:
  - 📁 Dosya upload
  - 🔗 URL girişi
  - 🖱️ Drag & Drop
  - 📋 Clipboard paste (Ctrl+V)
- **Tablo editörü**: Dinamik tablo ekleme ve düzenleme
- **Çoklu boşluk desteği**: `░░░` butonu ile non-breaking space
- **Keyboard shortcuts**: Ctrl+B, Ctrl+I, vb.

### 🎨 User Experience
- **Debounced operations**: 100ms gecikme ile performans
- **Loading states**: Visual feedback
- **Error handling**: Kullanıcı dostu hata mesajları
- **Responsive design**: Mobile-first tasarım

## Kurulum

### 1. Dependencies
```bash
npm install openai @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-header @tiptap/extension-table-cell lucide-react
```

### 2. Environment Variables
`.env.local` dosyasına ekleyin:
```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

**⚠️ Güvenlik Notu**: `NEXT_PUBLIC_` prefix'i API key'i client-side'da erişilebilir yapar. Production'da server-side kullanım önerilir.

### 3. TypeScript Konfigürasyonu
`tsconfig.json`'da path mapping ekleyin:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Kullanım

### Blog Form Component
```tsx
import BlogForm from '@/components/blog/BlogForm';

<BlogForm
  initialData={blogData}
  onSubmit={handleSubmit}
  isLoading={saving}
/>
```

### Çeviri Servisi
```tsx
import { translateBlogData } from '@/lib/translationService';

const result = await translateBlogData({
  title: "Türkçe başlık",
  excerpt: "Türkçe özet",
  content: "Türkçe içerik"
});

console.log(result.en_title); // İngilizce başlık
```

### Modern Rich Text Editor
```tsx
import ModernRichTextEditor from '@/components/blog/ModernRichTextEditor';

<ModernRichTextEditor
  value={content}
  onChange={(value) => setContent(value)}
  placeholder="Yazmaya başlayın..."
/>
```

## API Endpoints

### Blog CRUD Operations
```
GET    /api/blogs/[id]     - Blog detayı
PUT    /api/blogs/[id]     - Blog güncelleme
POST   /api/blogs          - Yeni blog
DELETE /api/blogs/[id]     - Blog silme
```

## File Structure

```
src/
├── app/
│   └── blogs/
│       ├── edit/[id]/page.tsx    # Blog düzenleme sayfası
│       └── [id]/page.tsx         # Blog görüntüleme sayfası
├── components/
│   └── blog/
│       ├── BlogForm.tsx          # Ana blog formu
│       └── ModernRichTextEditor.tsx # Rich text editör
├── lib/
│   └── translationService.ts    # Çeviri servisi
└── types/
    └── blog.ts                  # TypeScript tipleri
```

## Özellik Detayları

### Çeviri Sistemi
- **Model**: GPT-3.5-turbo (maliyet optimizasyonu)
- **Temperature**: 0.3 (tutarlı çeviri)
- **Max tokens**: 2000
- **HTML preservation**: Placeholder sistemi ile
- **Error handling**: Comprehensive error management

### Rich Text Editor
- **Extensions**: 
  - StarterKit (temel işlevler)
  - Link (bağlantı yönetimi)
  - Image (resim ekleme)
  - Table (tablo işlemleri)
  - Placeholder (placeholder metni)
- **Custom features**:
  - Multi-image upload methods
  - Table management
  - Non-breaking space insertion
  - Debounced onChange

### Performance Optimizations
- **Debounced onChange**: 100ms delay
- **Conditional updates**: Gereksiz re-render önleme
- **Memory leak prevention**: Component cleanup
- **Parallel translation**: Simultaneous API calls

## Best Practices

### 1. Çeviri Kullanımı
```tsx
// ✅ Doğru kullanım
const handleTranslate = async () => {
  if (!checkOpenAIApiKey()) {
    setError('API key bulunamadı');
    return;
  }
  
  try {
    const result = await translateBlogData(data);
    setFormData(prev => ({ ...prev, ...result }));
  } catch (error) {
    setError(error.message);
  }
};

// ❌ Yanlış kullanım
const result = await translateBlogData(data); // Error handling yok
```

### 2. Editor Performance
```tsx
// ✅ Debounced onChange
const debouncedOnChange = useCallback(
  debounce((content) => onChange(content), 100),
  [onChange]
);

// ❌ Direct onChange
onChange(editor.getHTML()); // Her karakter için çağrılır
```

### 3. Memory Management
```tsx
// ✅ Cleanup
useEffect(() => {
  return () => {
    if (editor) {
      editor.destroy();
    }
  };
}, [editor]);
```

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**
   ```
   Error: Çeviri işlemi başarısız oldu. Lütfen API anahtarınızı kontrol edin.
   ```
   **Çözüm**: `.env.local` dosyasında `NEXT_PUBLIC_OPENAI_API_KEY` ayarını kontrol edin.

2. **TipTap Dependencies Error**
   ```
   Cannot find module '@tiptap/react'
   ```
   **Çözüm**: Tüm TipTap paketlerini yükleyin: `npm install @tiptap/react @tiptap/starter-kit ...`

3. **Editor Not Loading**
   **Çözüm**: Client component olduğundan emin olun (`'use client'` directive).

4. **Image Upload Issues**
   **Çözüm**: Base64 encoding limitlerini kontrol edin, büyük dosyalar için server upload kullanın.

### Performance Issues

1. **Slow Editor Response**
   - Debounce değerini artırın (100ms → 200ms)
   - Editor content size'ı kontrol edin

2. **Translation Timeout**
   - API timeout değerini artırın
   - Content boyutunu küçültün

## Contributing

1. Feature branch oluşturun
2. TypeScript strict mode'da geliştirin
3. Error handling ekleyin
4. Performance testleri yapın
5. Dokümantasyonu güncelleyin

## License

MIT License - Kendi projenizde özgürce kullanabilirsiniz.

## Support

Sorunlar için GitHub Issues açın veya dokümantasyonu inceleyin. 