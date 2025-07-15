'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { 
  Bold, 
  Italic, 
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  AlignLeft
} from 'lucide-react';

interface ModernRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ModernRichTextEditor: React.FC<ModernRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Yazmaya başlayın...',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageUrlModal, setShowImageUrlModal] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');

  // Debounced onChange
  const debouncedOnChange = useCallback(
    React.useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      return (content: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onChange(content);
        }, 100);
      };
    }, [onChange]),
    [onChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md my-4',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      debouncedOnChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] max-w-none prose-headings:text-slate-900 prose-h1:text-3xl prose-h1:font-bold prose-h1:border-b prose-h1:border-slate-200 prose-h1:pb-2 prose-h2:text-2xl prose-h2:font-semibold prose-h2:text-blue-800 prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-medium prose-h3:text-slate-700 prose-h3:mt-6 prose-h3:mb-3',
        style: 'white-space: pre-wrap;',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer) {
          const files = Array.from(event.dataTransfer.files);
          const imageFiles = files.filter((file: File) => file.type.startsWith('image/'));
          
          if (imageFiles.length > 0) {
            event.preventDefault();
            handleImageUpload(imageFiles[0] as File);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              event.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                handleImageUpload(file);
              }
              return true;
            }
          }
        }
        return false;
      },
    },
  });

  // Value prop değiştiğinde editörü güncelle
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Component unmount olduğunda editörü temizle
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handleImageUpload = useCallback((file: File) => {
    if (!editor) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
  }, [editor]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
    // Input'u temizle
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleImageUpload]);

  const addImageFromUrl = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageUrlModal(false);
    }
  }, [editor, imageUrl]);

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const addNonBreakingSpace = useCallback(() => {
    editor?.chain().focus().insertContent('&nbsp;').run();
  }, [editor]);

  if (!editor) {
    return <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700 border border-blue-300'
          : 'hover:bg-gray-100 text-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Başlıklar - SEO için önemli, önce göster */}
        <div className="flex items-center gap-1 bg-blue-50 rounded-md p-1 border border-blue-200">
          <span className="text-xs font-medium text-blue-700 px-1">SEO Başlıklar:</span>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Ana Başlık (H2) - SEO için önerilen"
          >
            <Heading2 size={16} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Alt Başlık (H3) - İçerik organizasyonu için"
          >
            <Heading3 size={16} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Ana Sayfa Başlığı (H1) - Dikkatli kullanın"
          >
            <Heading1 size={16} />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Temel formatting - Bold'u daha az belirgin yap */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="⚠️ Kalın Text (Ctrl+B) - Başlık için H2/H3 kullanın!"
        >
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="İtalik (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Üstü Çizili"
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Kod"
        >
          <Code size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Listeler */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Madde İşaretli Liste"
        >
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numaralı Liste"
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Alıntı"
        >
          <Quote size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Resim ekleme */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Dosyadan Resim Ekle"
        >
          <Upload size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => setShowImageUrlModal(true)}
          title="URL'den Resim Ekle"
        >
          <ImageIcon size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Tablo */}
        <ToolbarButton
          onClick={addTable}
          title="Tablo Ekle"
        >
          <TableIcon size={16} />
        </ToolbarButton>

        {/* Çoklu boşluk */}
        <ToolbarButton
          onClick={addNonBreakingSpace}
          title="Çoklu Boşluk Ekle"
        >
          <span className="text-xs font-mono">░░░</span>
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Geri al / İleri al */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Geri Al (Ctrl+Z)"
        >
          <Undo size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="İleri Al (Ctrl+Y)"
        >
          <Redo size={16} />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <div className="p-4 min-h-[300px] max-h-[600px] overflow-y-auto">
        <EditorContent 
          editor={editor} 
          className="outline-none"
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image URL Modal */}
      {showImageUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Resim URL'si Ekle</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowImageUrlModal(false);
                  setImageUrl('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                İptal
              </button>
              <button
                onClick={addImageFromUrl}
                disabled={!imageUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEO Rehberliği */}
     
    </div>
  );
};

export default ModernRichTextEditor; 