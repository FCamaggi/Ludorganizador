/**
 * @file Componente de tarjeta para eventos
 * @module components/events/EventCard
 */

import React from 'react';
import { Calendar, MapPin, Users, Lock, Award } from 'lucide-react';
import { GameEvent } from '../../types';
import { formatEventDate } from '../../utils/dateUtils';

interface EventCardProps {
  event: GameEvent;
  onClick: () => void;
}

/**
 * Tarjeta que muestra información de un evento
 */
const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const isPrivate = !!event.password;

  const badgeConfig: Record<string, { label: string; color: string }> = {
    veterano: { label: 'Veterano', color: 'bg-purple-100 text-purple-800' },
    vip: { label: 'VIP', color: 'bg-yellow-100 text-yellow-800' },
    organizador: { label: 'Organizador', color: 'bg-blue-100 text-blue-800' },
    fundador: { label: 'Fundador', color: 'bg-green-100 text-green-800' },
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 cursor-pointer transition-all hover:border-indigo-200 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h3>
            {isPrivate && <Lock size={16} className="text-amber-600" />}
          </div>
          {!isPrivate && (
            <p className="text-sm text-gray-500 mt-1">{event.description}</p>
          )}
          {isPrivate && (
            <p className="text-sm text-amber-600 mt-1 italic">Evento Privado</p>
          )}
        </div>
        <div className="bg-indigo-50 text-indigo-700 p-2 rounded-lg">
          <Calendar size={24} />
        </div>
      </div>
      {!isPrivate ? (
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          {event.creatorName && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Creador: {event.creatorName}
              </span>
              {event.creatorRole === 'admin' && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 flex items-center gap-1">
                  <Award size={10} />
                  Admin
                </span>
              )}
              {event.creatorBadges && event.creatorBadges.length > 0 && (
                <div className="flex gap-1">
                  {event.creatorBadges.map((badge) => {
                    const config = badgeConfig[badge] || {
                      label: badge,
                      color: 'bg-gray-100 text-gray-800',
                    };
                    return (
                      <span
                        key={badge}
                        className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${config.color}`}
                      >
                        <Award size={10} />
                        {config.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic">
          Introduce la contraseña para ver los detalles
        </div>
      )}
    </div>
  );
};

export default EventCard;
