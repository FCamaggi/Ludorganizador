import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Lock,
  Copy,
  Map,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import { CreateEventData, GameEvent } from '../../types';
import { isValidTitle, isValidDescription } from '../../utils/validators';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';
import { COLORS } from '../../constants/colors';

interface EventFormProps {
  onSubmit: (data: CreateEventData) => void;
  onCancel: () => void;
  existingEvents?: GameEvent[]; // Para usar como plantillas
  isLoading?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onCancel,
  existingEvents = [],
  isLoading = false,
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Map preview states
  const [showMapPreview, setShowMapPreview] = useState(false);
  const [mapConfirmed, setMapConfirmed] = useState(false);
  const [includeMap, setIncludeMap] = useState(true);

  // Aplicar plantilla seleccionada
  const applyTemplate = (eventId: string) => {
    const template = existingEvents.find((e) => e.id === eventId);
    if (template) {
      setTitle(template.title);
      setLocation(template.location);
      setDescription(template.description);
      // No copiamos la fecha ni la contraseña por seguridad
    }
  };

  // Obtener la fecha mínima (ahora)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!isValidTitle(title)) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    if (!location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    if (!date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (description && !isValidDescription(description)) {
      newErrors.description =
        'La descripción debe tener al menos 10 caracteres';
    }

    if (password.trim() && password !== confirmPassword) {
      newErrors.password = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Validar que la fecha sea válida
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      setErrors({ ...errors, date: 'Fecha inválida' });
      return;
    }

    const eventData: CreateEventData = {
      title: title.trim(),
      location: location.trim(),
      date: eventDate.toISOString(),
      description: description.trim() || 'Evento organizado por la comunidad.',
      showMap: includeMap && mapConfirmed,
      ...(password.trim() && { password: password.trim() }),
    };

    onSubmit(eventData);

    // Limpiar formulario después de enviar
    setTitle('');
    setLocation('');
    setDate('');
    setDescription('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setShowMapPreview(false);
    setMapConfirmed(false);
    setIncludeMap(true);
  };

  const handleConfirmMap = () => {
    setMapConfirmed(true);
    setShowMapPreview(false);
  };

  const handleRejectMap = () => {
    setShowMapPreview(false);
    setMapConfirmed(false);
  };

  const handleNoMap = () => {
    setIncludeMap(false);
    setShowMapPreview(false);
    setMapConfirmed(true); // Consider it "confirmed" to not show preview
  };

  const handleRetryLocation = () => {
    setShowMapPreview(false);
    setMapConfirmed(false);
    setIncludeMap(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selector de plantilla */}
      {existingEvents.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
            <Copy size={16} className="inline mr-1" />
            Usar Plantilla (Opcional)
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value);
              if (e.target.value) {
                applyTemplate(e.target.value);
              }
            }}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all"
            style={{
              backgroundColor: theme.bg.primary,
              color: theme.text.primary,
              borderColor: theme.border.medium,
            }}
          >
            <option value="">-- Seleccionar evento para copiar --</option>
            {existingEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          <p className="text-xs mt-1" style={{ color: theme.text.tertiary }}>
            Copiar título, ubicación y descripción de un evento existente
          </p>
        </div>
      )}

      <Input
        label="Título del Evento *"
        icon={<Calendar size={16} />}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ej. Noche de Juegos de Mesa"
        error={errors.title}
        required
      />

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
          <MapPin size={16} className="inline mr-1" />
          Ubicación *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setMapConfirmed(false);
            }}
            className={`flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all`}
            style={{
              backgroundColor: theme.bg.primary,
              color: theme.text.primary,
              borderColor: errors.location ? COLORS.accent.DEFAULT : theme.border.medium,
            }}
            placeholder="ej. Casa de Juan, Calle Principal 123"
            required
          />
          {location.trim() && !mapConfirmed && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMapPreview(true)}
              className="whitespace-nowrap"
            >
              <Map size={18} />
              Vista Previa
            </Button>
          )}
          {mapConfirmed && includeMap && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: `${COLORS.primary.DEFAULT}20`, borderColor: COLORS.primary.DEFAULT, borderWidth: 1 }}>
              <Check size={18} style={{ color: COLORS.primary.DEFAULT }} />
              <span className="text-sm" style={{ color: COLORS.primary.dark }}>Mapa confirmado</span>
            </div>
          )}
          {mapConfirmed && !includeMap && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ backgroundColor: theme.bg.elevated, borderColor: theme.border.light }}>
              <X size={18} style={{ color: theme.text.secondary }} />
              <span className="text-sm" style={{ color: theme.text.secondary }}>Sin mapa</span>
            </div>
          )}
        </div>
        {errors.location && (
          <p className="text-sm mt-1" style={{ color: COLORS.accent.DEFAULT }}>{errors.location}</p>
        )}
        {mapConfirmed && (
          <button
            type="button"
            onClick={handleRetryLocation}
            className="text-xs mt-1 flex items-center gap-1 transition-colors"
            style={{ color: COLORS.accent.DEFAULT }}
          >
            <RotateCcw size={12} />
            Cambiar configuración del mapa
          </button>
        )}
      </div>

      {/* Map Preview Modal */}
      {showMapPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" style={{ backgroundColor: theme.bg.primary }}>
            <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: theme.border.light }}>
              <h3 className="text-lg font-bold" style={{ color: theme.text.primary }}>
                Vista Previa del Mapa
              </h3>
              <button
                onClick={() => setShowMapPreview(false)}
                className="p-1 rounded transition-colors"
                style={{ color: theme.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.state.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm mb-2" style={{ color: theme.text.secondary }}>
                  Ubicación:{' '}
                  <span className="font-medium" style={{ color: theme.text.primary }}>{location}</span>
                </p>
                <p className="text-xs" style={{ color: theme.text.tertiary }}>
                  ¿El mapa muestra la ubicación correcta?
                </p>
              </div>

              <div className="aspect-video w-full rounded-lg overflow-hidden border-2 mb-4" style={{ borderColor: theme.border.medium }}>
                <iframe
                  title="Map Preview"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                    location
                  )}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleConfirmMap}
                  className="flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Confirmar ubicación
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRetryLocation}
                  className="flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} />
                  Cambiar ubicación
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleNoMap}
                  className="flex items-center justify-center gap-2"
                  style={{ color: theme.text.secondary }}
                >
                  <X size={18} />
                  No mostrar mapa
                </Button>
              </div>

              <p className="text-xs mt-4 text-center" style={{ color: theme.text.tertiary }}>
                Si el mapa no muestra la ubicación correcta, puedes cambiar la
                descripción de la ubicación o elegir no mostrar el mapa para
                evitar confusiones.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
          Fecha y Hora *
        </label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={getMinDateTime()}
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all"
          style={{
            backgroundColor: theme.bg.primary,
            color: theme.text.primary,
            borderColor: errors.date ? COLORS.accent.DEFAULT : theme.border.medium,
            colorScheme: themeMode === 'dark' ? 'dark' : 'light',
          }}
          required
        />
        {errors.date && (
          <p className="text-sm mt-1" style={{ color: COLORS.accent.DEFAULT }}>{errors.date}</p>
        )}
      </div>

      <TextArea
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción opcional del evento..."
        rows={3}
        error={errors.description}
      />

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
          <Lock size={16} className="inline mr-1" />
          Contraseña (Opcional)
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all"
          style={{
            backgroundColor: theme.bg.primary,
            color: theme.text.primary,
            borderColor: errors.password ? COLORS.accent.DEFAULT : theme.border.medium,
          }}
          placeholder="Dejar vacío para evento público"
        />
        <p className="text-xs mt-1" style={{ color: theme.text.tertiary }}>
          Si defines una contraseña, solo quienes la conozcan podrán ver los
          detalles del evento.
        </p>
      </div>

      {password.trim() && (
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text.primary }}>
            <Lock size={16} className="inline mr-1" />
            Confirmar Contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all"
            style={{
              backgroundColor: theme.bg.primary,
              color: theme.text.primary,
              borderColor: errors.password ? COLORS.accent.DEFAULT : theme.border.medium,
            }}
            placeholder="Repite la contraseña"
          />
          {errors.password && (
            <p className="text-sm mt-1" style={{ color: COLORS.accent.DEFAULT }}>{errors.password}</p>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Creando...' : 'Crear Evento'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
