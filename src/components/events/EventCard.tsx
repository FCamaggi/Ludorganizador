/**
 * @file Componente de tarjeta para eventos
 * @module components/events/EventCard
 */

import React from 'react';
import { Calendar, MapPin, Users, Lock, Award } from 'lucide-react';
import { GameEvent } from '../../types';
import { formatEventDate } from '../../utils/dateUtils';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface EventCardProps {
  event: GameEvent;
  onClick: () => void;
}

/**
 * Tarjeta que muestra información de un evento
 * Usa Amber Flame (primary) con acentos en Scarlet Fire (action)
 */
const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const isPrivate = !!event.password;

  // Badges con toda la paleta de colores
  const badgeConfig: Record<
    string,
    { label: string; color: string; darkColor: string }
  > = {
    veterano: {
      label: 'Veterano',
      color: 'bg-[#C200FB]/20 text-[#C200FB]',
      darkColor: 'dark:bg-[#C200FB]/30 dark:text-[#C200FB]',
    },
    vip: {
      label: 'VIP',
      color: 'bg-[#FFBC0A]/20 text-[#FFBC0A]',
      darkColor: 'dark:bg-[#FFBC0A]/30 dark:text-[#FFBC0A]',
    },
    organizador: {
      label: 'Organizador',
      color: 'bg-[#EC7D10]/20 text-[#EC7D10]',
      darkColor: 'dark:bg-[#EC7D10]/30 dark:text-[#EC7D10]',
    },
    fundador: {
      label: 'Fundador',
      color: 'bg-[#EC0868]/20 text-[#EC0868]',
      darkColor: 'dark:bg-[#EC0868]/30 dark:text-[#EC0868]',
    },
  };

  return (
    <div
      onClick={onClick}
      className="rounded-xl shadow-sm hover:shadow-md border p-6 cursor-pointer transition-all group"
      style={{
        backgroundColor: theme.bg.elevated,
        borderColor: theme.border.light,
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="text-xl font-bold transition-colors"
              style={{
                color: theme.text.primary,
              }}
            >
              {event.title}
            </h3>
            {isPrivate && <Lock size={16} style={{ color: theme.primary }} />}
          </div>
          {!isPrivate && (
            <p className="text-sm mt-1" style={{ color: theme.text.secondary }}>
              {event.description}
            </p>
          )}
          {isPrivate && (
            <p className="text-sm mt-1 italic" style={{ color: theme.primary }}>
              Evento Privado
            </p>
          )}
        </div>
        <div
          className="p-2 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}20 0%, ${theme.secondary}20 100%)`,
            color: theme.action,
          }}
        >
          <Calendar size={24} />
        </div>
      </div>
      {!isPrivate ? (
        <div
          className="space-y-2 text-sm"
          style={{ color: theme.text.secondary }}
        >
          <div className="flex items-center gap-2">
            <MapPin size={16} style={{ color: theme.text.tertiary }} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: theme.text.tertiary }} />
            <span>{formatEventDate(event.date)}</span>
          </div>
          {event.creatorName && (
            <div
              className="flex items-center gap-2 pt-2 border-t"
              style={{ borderColor: theme.border.light }}
            >
              <span className="text-xs" style={{ color: theme.text.tertiary }}>
                Creador: {event.creatorName}
              </span>
              {event.creatorRole === 'admin' && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${badgeConfig.fundador.color} ${badgeConfig.fundador.darkColor}`}
                >
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
                      darkColor: 'dark:bg-gray-700 dark:text-gray-300',
                    };
                    return (
                      <span
                        key={badge}
                        className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${config.color} ${config.darkColor}`}
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
        <div className="text-sm italic" style={{ color: theme.text.tertiary }}>
          Introduce la contraseña para ver los detalles
        </div>
      )}
    </div>
  );
};

export default EventCard;
