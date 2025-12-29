import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { GameEvent } from '../../types';
import { formatEventDate } from '../../utils/dateUtils';
import Button from './Button';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface ShareEventModalProps {
  event: GameEvent;
  onClose: () => void;
}

export const ShareEventModal: React.FC<ShareEventModalProps> = ({ event, onClose }) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const [copied, setCopied] = useState<'link' | 'text' | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editableMessage, setEditableMessage] = useState('');
  const folletoRef = useRef<HTMLDivElement>(null);

  // Usar _id si existe, sino id
  const eventId = (event as any)._id || event.id;
  const eventUrl = `${window.location.origin}${window.location.pathname}#/event/${eventId}`;
  
  const defaultShareText = `🎲 *${event.title}*\n\n📍 ${event.location}\n📅 ${formatEventDate(event.date)}${event.description ? `\n\n${event.description}` : ''}\n\n🔗 ${eventUrl}`;

  useEffect(() => {
    // Detectar si es mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    setEditableMessage(defaultShareText);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [defaultShareText]);

  const copyToClipboard = async (text: string, type: 'link' | 'text') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const generateImage = async (): Promise<Blob | null> => {
    if (!folletoRef.current) return null;
    
    try {
      const canvas = await html2canvas(folletoRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });
    } catch (err) {
      console.error('Error al generar imagen:', err);
      return null;
    }
  };

  const handleDownload = async () => {
    setIsGeneratingImage(true);
    const blob = await generateImage();
    setIsGeneratingImage(false);
    
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}_folleto.png`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleNativeShare = async () => {
    setIsGeneratingImage(true);
    const blob = await generateImage();
    setIsGeneratingImage(false);
    
    if (!blob) return;

    try {
      const file = new File([blob], `${event.title}_folleto.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: event.title,
          text: editableMessage,
          files: [file],
        });
      } else {
        // Fallback: copiar el mensaje
        await copyToClipboard(editableMessage, 'text');
        alert('Imagen generada. El mensaje fue copiado al portapapeles.');
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Folleto Visual */}
      <div 
        ref={folletoRef}
        className="rounded-xl p-6 border-2"
        style={{
          background: 'linear-gradient(135deg, #EC7D10 0%, #FC2F00 100%)',
          borderColor: theme.border.light,
          color: '#FFFFFF',
        }}
      >
        <h2 className="text-2xl font-bold mb-3">{event.title}</h2>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span>{event.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span>{formatEventDate(event.date)}</span>
          </p>
          {event.password && (
            <p className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span>Evento Privado (requiere contraseña)</span>
            </p>
          )}
        </div>
        {event.description && (
          <p className="mt-4 text-sm opacity-90 line-clamp-3" style={{ whiteSpace: 'pre-wrap' }}>
            {event.description}
          </p>
        )}
      </div>

      {/* Versión Mobile */}
      {isMobile ? (
        <>
          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: theme.text.primary }}>
              Mensaje para compartir:
            </label>
            <textarea
              value={editableMessage}
              onChange={(e) => setEditableMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
              style={{
                backgroundColor: theme.bg.primary,
                borderColor: theme.border.light,
                color: theme.text.primary,
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleNativeShare}
              disabled={isGeneratingImage}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isGeneratingImage ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>Compartir</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => copyToClipboard(eventUrl, 'link')}
              className="flex items-center gap-2"
            >
              {copied === 'link' ? <Check size={16} /> : <Copy size={16} />}
              <span>Link</span>
            </Button>
          </div>
        </>
      ) : (
        /* Versión Desktop */
        <>
          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: theme.text.primary }}>
              Link del evento:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={eventUrl}
                readOnly
                className="flex-1 px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: theme.bg.primary,
                  borderColor: theme.border.light,
                  color: theme.text.primary,
                }}
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(eventUrl, 'link')}
                className="flex items-center gap-2"
              >
                {copied === 'link' ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: theme.text.primary }}>
              Mensaje para compartir:
            </label>
            <div 
              className="p-4 rounded-lg border text-sm whitespace-pre-wrap"
              style={{
                backgroundColor: theme.bg.tertiary,
                borderColor: theme.border.light,
                color: theme.text.primary,
              }}
            >
              {defaultShareText}
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => copyToClipboard(defaultShareText, 'text')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {copied === 'text' ? (
                  <>
                    <Check size={16} />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copiar mensaje</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={isGeneratingImage}
                className="flex items-center gap-2"
              >
                {isGeneratingImage ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: theme.text.primary }}></div>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Descargar Imagen</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default ShareEventModal;
