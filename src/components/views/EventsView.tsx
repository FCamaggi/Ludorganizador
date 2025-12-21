import React from 'react';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
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
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 
              className="text-3xl font-bold"
              style={{ color: theme.text.primary }}
            >
              Próximos Eventos
            </h1>
            <Tooltip content="Un evento es una reunión de jugadores en un lugar y fecha específicos. Dentro de cada evento puedes crear mesas de juego o compartir tu ludoteca." />
          </div>
          <p className="mt-1" style={{ color: theme.text.secondary }}>
            Encuentra una reunión y únete a una mesa.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => onEventClick(event)}
          />
        ))}

        {events.length === 0 && !isLoading && (
          <div 
            className="col-span-full py-20 text-center"
            style={{ color: theme.text.tertiary }}
          >
            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
            <p>No hay eventos programados aún.</p>
          </div>
        )}

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
    </div>
  );
};

export default EventsView;
