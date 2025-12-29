import React, { useMemo } from 'react';
import { Calendar, Plus, RefreshCw, ChevronDown } from 'lucide-react';
import { GameEvent } from '../../types';
import EventCard from '../events/EventCard';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme, COLORS } from '../../constants';

interface EventsViewProps {
  events: GameEvent[];
  onEventClick: (event: GameEvent) => void;
  onCreateEvent: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  onEventClick,
  onCreateEvent,
  onRefresh,
  isLoading = false,
}) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const [showPastEvents, setShowPastEvents] = React.useState(false);

  // Separar y ordenar eventos
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Inicio del día actual

    const upcoming: GameEvent[] = [];
    const past: GameEvent[] = [];

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate >= now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    // Ordenar próximos: más cercano primero (ascendente)
    upcoming.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Ordenar pasados: más reciente primero (descendente)
    past.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1
              className="text-3xl font-bold"
              style={{ color: theme.text.primary }}
            >
              Eventos
            </h1>
            <Tooltip content="Un evento es una reunión de jugadores en un lugar y fecha específicos. Dentro de cada evento puedes crear mesas de juego o compartir tu ludoteca." />
          </div>
          <p className="mt-1" style={{ color: theme.text.secondary }}>
            {upcomingEvents.length > 0
              ? `${upcomingEvents.length} próximo${upcomingEvents.length !== 1 ? 's' : ''}`
              : 'No hay eventos programados'}
            {pastEvents.length > 0 &&
              ` • ${pastEvents.length} pasado${pastEvents.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 hover:bg-opacity-10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: theme.text.secondary,
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.color = COLORS.accent.DEFAULT;
                e.currentTarget.style.backgroundColor = theme.state.hover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.text.secondary;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Actualizar eventos"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <Button onClick={onCreateEvent} disabled={isLoading}>
            <Plus size={20} />
            <span className="hidden sm:inline">Nuevo Evento</span>
          </Button>
        </div>
      </div>

      {/* Eventos Próximos */}
      {upcomingEvents.length > 0 && (
        <div className="mb-12">
          <h2
            className="text-xl font-semibold mb-4 flex items-center gap-2"
            style={{ color: theme.text.primary }}
          >
            <Calendar size={20} style={{ color: COLORS.primary.DEFAULT }} />
            Próximos Eventos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Eventos Pasados */}
      {pastEvents.length > 0 && (
        <div className="mt-12">
          <button
            onClick={() => setShowPastEvents(!showPastEvents)}
            className="w-full flex items-center justify-between p-4 rounded-lg transition-all mb-4 border"
            style={{
              backgroundColor: theme.bg.elevated,
              borderColor: theme.border.light,
              color: theme.text.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.state.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.bg.elevated;
            }}
          >
            <div className="flex items-center gap-2">
              <Calendar size={20} style={{ color: theme.text.secondary }} />
              <span className="font-semibold">
                Eventos Pasados ({pastEvents.length})
              </span>
            </div>
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${
                showPastEvents ? 'rotate-180' : ''
              }`}
              style={{ color: theme.text.secondary }}
            />
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              showPastEvents ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <div key={event.id} className="opacity-75 hover:opacity-100 transition-opacity">
                  <EventCard event={event} onClick={() => onEventClick(event)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {upcomingEvents.length === 0 && pastEvents.length === 0 && !isLoading && (
        <div
          className="col-span-full py-20 text-center"
          style={{ color: theme.text.tertiary }}
        >
          <Calendar size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg mb-2">No hay eventos programados aún.</p>
          <p className="text-sm">¡Crea el primer evento y comienza a jugar!</p>
        </div>
      )}

      {/* Estado de carga */}
      {isLoading && (
        <div
          className="col-span-full py-20 text-center"
          style={{ color: theme.text.tertiary }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: theme.primary }}
          />
          <p>Cargando eventos...</p>
        </div>
      )}
    </div>
  );
};

export default EventsView;
