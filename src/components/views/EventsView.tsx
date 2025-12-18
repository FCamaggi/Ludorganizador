import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { GameEvent } from '../../types';
import EventCard from '../events/EventCard';
import Button from '../ui/Button';

interface EventsViewProps {
  events: GameEvent[];
  onEventClick: (event: GameEvent) => void;
  onCreateEvent: () => void;
  isLoading?: boolean;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  onEventClick,
  onCreateEvent,
  isLoading = false,
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Próximos Eventos</h1>
          <p className="text-gray-500 mt-1">
            Encuentra una reunión y únete a una mesa.
          </p>
        </div>
        <Button onClick={onCreateEvent} disabled={isLoading}>
          <Plus size={20} />
          <span className="hidden sm:inline">Nuevo Evento</span>
        </Button>
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
          <div className="col-span-full py-20 text-center text-gray-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
            <p>No hay eventos programados aún.</p>
          </div>
        )}

        {isLoading && (
          <div className="col-span-full py-20 text-center text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p>Cargando eventos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsView;
