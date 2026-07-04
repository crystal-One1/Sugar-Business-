import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../lib/api';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  adminPhone: string | undefined;
  placeholder?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label,
  adminPhone,
  placeholder = "اختر صورة للرفع...",
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>(value && !value.startsWith('/uploads/') ? 'url' : 'upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    
    // Simple client-side validation for image files
    if (!file.type.startsWith('image/')) {
      setError("فضلاً، اختر ملف صورة صالح فقط (PNG, JPG, JPEG, WEBP)");
      return;
    }

    // Limit to 10MB on client side
    if (file.size > 10 * 1024 * 1024) {
      setError("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 10 ميجابايت.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string;
          
          const res = await fetch(getApiUrl('/api/upload'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              adminPhone,
              filename: file.name,
              base64Data
            })
          });

          const data = await res.json();
          if (data.success && data.url) {
            onChange(data.url);
          } else {
            setError(data.message || "فشل رفع الملف إلى الخادم.");
          }
        } catch (err) {
          setError("حدث خطأ أثناء الاتصال بالخادم لرفع الصورة.");
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        setError("فشل قراءة الملف المختار.");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError("خطأ غير متوقع أثناء المعالجة.");
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
  };

  return (
    <div className={`space-y-1.5 font-sans ${className}`} dir="rtl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-neutral-300 block">{label}</label>
        
        {/* Toggle Mode */}
        <div className="flex items-center gap-1.5 bg-neutral-950/80 p-0.5 rounded-lg border border-neutral-800">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 text-[10px] rounded-md transition-all font-semibold cursor-pointer ${
              mode === 'upload' 
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            رفع صورة ملف
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 text-[10px] rounded-md transition-all font-semibold cursor-pointer ${
              mode === 'url' 
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            رابط إنترنت
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="relative">
          {value ? (
            /* Selected Image Preview Box */
            <div className="relative group border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/60 p-2.5 flex items-center gap-3.5 transition-all hover:bg-neutral-900 hover:border-indigo-500/30">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-neutral-700/50 bg-neutral-950 flex-shrink-0 relative">
                <img 
                  src={value} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">✓ تم الرفع والاستضافة بنجاح</span>
                <span className="text-[10px] text-neutral-400 font-mono truncate block text-left" dir="ltr">{value}</span>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all border border-rose-500/15 shrink-0 cursor-pointer"
                title="إزالة الصورة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Upload Drop Area */
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 text-center select-none ${
                dragActive
                  ? 'border-indigo-400 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-400/30'
                  : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onFileChange}
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                  <span className="text-[11px] font-black text-indigo-400 animate-pulse">جاري رفع ومعالجة الصورة...</span>
                </div>
              ) : (
                <>
                  <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800/80 text-neutral-400 group-hover:text-indigo-400 transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black text-neutral-200 block">{placeholder}</span>
                    <span className="text-[10px] text-neutral-500 block">اسحب وأفلت هنا أو انقر لتصفح جهازك</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Manual URL mode */
        <div className="relative flex items-center">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-xs p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-left pl-9 focus:outline-none focus:border-indigo-500/60"
            placeholder="https://example.com/image.jpg"
            dir="ltr"
          />
          <span className="absolute left-3 text-neutral-500">
            <LinkIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-2 bg-rose-500/10 border border-rose-500/15 rounded-lg flex items-center gap-1.5 text-rose-400 text-[10px] leading-relaxed animate-in fade-in-50">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
