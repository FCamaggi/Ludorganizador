import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { GameTable } from '../../types';
import Button from './Button';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface ShareTableModalProps {
  table: GameTable;
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export const ShareTableModal: React.FC<ShareTableModalProps> = ({ 
  table, 
  eventId, 
  eventTitle,
  onClose 
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const [copied, setCopied] = useState<'link' | 'text' | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editableMessage, setEditableMessage] = useState('');
  const folletoRef = useRef<HTMLDivElement>(null);

  const tableUrl = `${window.location.origin}${window.location.pathname}#/event/${eventId}`;
  const spotsLeft = table.maxPlayers - table.registeredPlayers.length;
  const isFull = spotsLeft === 0;
  
  const defaultShareText = `🎮 *${table.gameName}*\n\n📋 Evento: ${eventTitle}\n👥 ${table.registeredPlayers.length}/${table.maxPlayers} jugadores\n${isFull ? '❌ Mesa llena' : `✅ ${spotsLeft} lugar${spotsLeft > 1 ? 'es' : ''} disponible${spotsLeft > 1 ? 's' : ''}`}\n\n📝 ${table.description}\n\n🔗 ${tableUrl}`;

  useEffect(() => {
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
      a.download = `${table.gameName.replace(/[^a-z0-9]/gi, '_')}_mesa.png`;
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
      const file = new File([blob], `${table.gameName}_mesa.png`, { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Mesa de ${table.gameName}`,
          text: editableMessage,
          files: [file],
        });
      } else {
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
        className="rounded-xl overflow-hidden border-2"
        style={{
          borderColor: theme.border.light,
        }}
      >
        {/* Header */}
        <div 
          className="p-4"
          style={{
            background: 'linear-gradient(135deg, #EC7D10 0%, #EC0868 100%)',
            color: '#FFFFFF',
          }}
        >
          <h2 className="text-xl font-bold mb-1">{table.gameName}</h2>
          <p className="text-sm opacity-90">En: {eventTitle}</p>
        </div>

        {/* Contenido */}
        <div 
          className="p-4 space-y-3"
          style={{
            backgroundColor: theme.bg.elevated,
            color: theme.text.primary,
          }}
        >
          {/* Descripción */}
          <p className="text-sm italic" style={{ color: theme.text.secondary }}>
            "{table.description}"
          </p>

          {/* Jugadores */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Jugadores ({table.registeredPlayers.length}/{table.maxPlayers})</span>
              {isFull ? (
                <span className="text-red-600 font-bold">Mesa Llena</span>
              ) : (
                <span className="text-green-600 font-bold">{spotsLeft} libre{spotsLeft > 1 ? 's' : ''}</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {table.registeredPlayers.map((player, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: theme.bg.tertiary,
                    color: theme.text.primary,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="truncate">{player.name}</span>
                </div>
              ))}
              {Array.from({ length: spotsLeft }).map((_, i) => (
                <div 
                  key={`empty-${i}`}
                  className="flex items-center gap-2 text-xs px-2 py-1 rounded border border-dashed"
                  style={{
                    borderColor: theme.border.light,
                    color: theme.text.tertiary,
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.border.medium }}></div>
                  <span>Libre</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host */}
          <p className="text-xs" style={{ color: theme.text.secondary }}>
            Host: <span className="font-medium" style={{ color: theme.text.primary }}>{table.hostName}</span>
          </p>
        </div>
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
              onClick={() => copyToClipboard(tableUrl, 'link')}
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
                value={tableUrl}
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
                onClick={() => copyToClipboard(tableUrl, 'link')}
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

export default ShareTableModal;
