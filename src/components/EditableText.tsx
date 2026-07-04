import React, { useState, useEffect } from 'react';
import { useCMS } from '../CMSContext';
import { Check, Edit3, X } from 'lucide-react';

interface EditableTextProps {
  translationKey: string;
  defaultText: string;
  className?: string;
  elementType?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  isMultiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  translationKey,
  defaultText,
  className = '',
  elementType = 'span',
  isMultiline = false,
}) => {
  const { t, updateTranslation, isEditModeEnabled } = useCMS();
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState('');

  const currentTranslation = t(translationKey, defaultText);

  useEffect(() => {
    setVal(currentTranslation);
  }, [currentTranslation]);

  const handleSave = async () => {
    setIsEditing(false);
    if (val.trim() !== currentTranslation.trim()) {
      await updateTranslation(translationKey, val);
    }
  };

  const handleCancel = () => {
    setVal(currentTranslation);
    setIsEditing(false);
  };

  const renderHighlightedText = (text: string) => {
    if (typeof text === 'string' && text.includes('شوجر بيزنس')) {
      const parts = text.split('شوجر بيزنس');
      return (
        <>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < parts.length - 1 && <span className="text-[#25C1F2] font-black tracking-wide">شوجر بيزنس</span>}
            </React.Fragment>
          ))}
        </>
      );
    }
    return text;
  };

  if (!isEditModeEnabled) {
    const Tag = elementType;
    return (
      <Tag className={className}>
        {renderHighlightedText(currentTranslation)}
      </Tag>
    );
  }

  if (isEditing) {
    return (
      <div className="inline-block w-full max-w-full text-right my-1 relative z-[100]" dir="rtl" onClick={e => e.stopPropagation()}>
        {isMultiline ? (
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full min-h-[150px] bg-neutral-900 text-white border-2 border-indigo-500 rounded-xl p-3 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-2xl transition-all font-sans leading-relaxed text-right block placeholder-neutral-600"
            autoFocus
            dir="rtl"
            placeholder="اكتب المحتوى هنا..."
          />
        ) : (
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full min-w-[150px] lg:min-w-[250px] bg-neutral-950 text-white border-2 border-indigo-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-xl font-sans text-right block placeholder-neutral-600"
            autoFocus
            dir="rtl"
            placeholder="اكتب النص هنا..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        )}
        <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px]">
          <button
            type="button"
            onClick={handleSave}
            className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-400 hover:text-white rounded flex items-center gap-1 transition-all cursor-pointer font-bold border border-emerald-500/20"
          >
            <Check className="w-3 h-3" />
            <span>حفظ</span>
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded flex items-center gap-1 transition-all cursor-pointer font-bold"
          >
            <X className="w-3 h-3" />
            <span>إلغاء</span>
          </button>
        </div>
      </div>
    );
  }

  const Tag = elementType;
  
  // Check if text might be transparent (e.g. from parent bg-clip-text)
  const isPossiblyTransparent = className.includes('text-transparent');

  return (
    <Tag
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`${className} cursor-pointer hover:outline hover:outline-1 hover:outline-dashed hover:outline-indigo-500/50 hover:bg-indigo-500/10 transition-all rounded px-1.5 py-0.5 inline-block text-right group relative min-w-[20px] min-h-[1.5em]`}
      title="انقر للتعديل المباشر"
    >
      <span className="relative z-10">{renderHighlightedText(currentTranslation)}</span>
      <span className="inline-flex mr-1.5 opacity-0 group-hover:opacity-100 bg-indigo-500/20 p-0.5 rounded text-indigo-400 align-middle transition-opacity relative z-20">
        <Edit3 className="w-3 h-3" />
      </span>
      {/* Visual indicator of edit mode that doesn't break backgrounds */}
      <span className="absolute inset-0 border border-dashed border-indigo-500/30 rounded pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
    </Tag>
  );
};
