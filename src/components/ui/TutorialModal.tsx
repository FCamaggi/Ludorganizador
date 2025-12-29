import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  HelpCircle, 
  Users, 
  Calendar, 
  Table, 
  Award, 
  Share2, 
  Settings,
  Plus,
  Lock,
  MapPin,
  RefreshCw,
  Trash2,
  Edit3,
  Archive,
  ChevronDown,
  Gamepad2,
  UserPlus,
  Shield,
  Box
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface TutorialSlide {
  title: string;
  description: string;
  icon: React.ReactNode;
  mockup: React.ReactNode;
  tips?: string[];
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: 'events' | 'eventDetail' | 'admin';
}

// ============== MOCKUPS PARA VISTA DE EVENTOS ==============

const EventCardMockup: React.FC<{ isPrivate?: boolean }> = ({ isPrivate }) => (
  <div className="bg-white rounded-xl shadow-lg p-4 max-w-[280px] mx-auto border border-gray-200 hover:shadow-xl transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-4 w-28 bg-gradient-to-r from-gray-700 to-gray-800 rounded"></div>
          {isPrivate && <Lock size={12} className="text-amber-500" />}
        </div>
        {isPrivate ? (
          <div className="text-xs text-amber-600 italic">Evento Privado</div>
        ) : (
          <div className="h-2 w-36 bg-gray-200 rounded mt-1"></div>
        )}
      </div>
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
        <Calendar size={18} className="text-orange-500" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPin size={12} className="text-gray-400" />
        <div className="h-2 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={12} className="text-gray-400" />
        <div className="h-2 w-32 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-5 h-5 rounded-full bg-indigo-200"></div>
        <div className="h-2 w-16 bg-gray-200 rounded"></div>
        <div className="ml-auto flex gap-1">
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-600">VIP</span>
        </div>
      </div>
    </div>
  </div>
);

const EventsHeaderMockup: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-3 max-w-[300px] mx-auto">
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 bg-gray-800 rounded"></div>
          <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-[8px]">?</span>
          </div>
        </div>
        <div className="h-2 w-32 bg-gray-200 rounded mt-1"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <RefreshCw size={14} className="text-gray-400" />
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center gap-1">
          <Plus size={12} className="text-white" />
          <span className="text-[10px] text-white font-medium">Nuevo</span>
        </div>
      </div>
    </div>
  </div>
);

const PastEventsSectionMockup: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-3 max-w-[280px] mx-auto space-y-2">
    <div className="flex items-center gap-2 text-gray-500">
      <ChevronDown size={14} />
      <span className="text-xs font-medium">Eventos Pasados (3)</span>
    </div>
    <div className="pl-4 space-y-1">
      <div className="flex items-center gap-2 opacity-60">
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="h-2 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center gap-2 opacity-60">
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="h-2 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

// ============== MOCKUPS PARA DETALLE DE EVENTO ==============

const EventHeaderMockup: React.FC = () => (
  <div className="rounded-xl overflow-hidden max-w-[300px] mx-auto shadow-lg">
    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-5 w-32 bg-white/30 rounded mb-2"></div>
          <div className="h-2 w-full bg-white/20 rounded mb-1"></div>
          <div className="h-2 w-3/4 bg-white/20 rounded mb-3"></div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={12} />
            <div className="h-2 w-20 bg-white/20 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <div className="h-2 w-24 bg-white/20 rounded"></div>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-7 h-7 rounded bg-blue-500/30 flex items-center justify-center">
            <Share2 size={12} />
          </div>
          <div className="w-7 h-7 rounded bg-yellow-500/30 flex items-center justify-center">
            <Archive size={12} />
          </div>
          <div className="w-7 h-7 rounded bg-red-500/30 flex items-center justify-center">
            <Trash2 size={12} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TabsMockup: React.FC = () => (
  <div className="bg-white rounded-lg shadow p-2 max-w-[280px] mx-auto">
    <div className="flex border-b">
      <div className="px-4 py-2 border-b-2 border-orange-500">
        <span className="text-xs font-medium text-orange-500">Mesas (4)</span>
      </div>
      <div className="px-4 py-2">
        <span className="text-xs font-medium text-gray-400">Juegos Libres (2)</span>
      </div>
    </div>
  </div>
);

const TableCardMockup: React.FC<{ showActions?: boolean }> = ({ showActions }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-[260px] mx-auto border border-gray-200">
    <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-3 text-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="h-4 w-24 bg-white/30 rounded mb-1"></div>
          <div className="h-2 w-16 bg-white/20 rounded"></div>
        </div>
        <div className="text-[10px] px-2 py-0.5 bg-white/20 rounded-full">2-4 Jug.</div>
      </div>
    </div>
    <div className="p-3 space-y-2">
      <div className="text-[10px] italic text-gray-500">"Descripción del juego..."</div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-green-50 rounded p-1 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <div className="h-1.5 w-10 bg-green-200 rounded"></div>
        </div>
        <div className="bg-green-50 rounded p-1 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <div className="h-1.5 w-8 bg-green-200 rounded"></div>
        </div>
        <div className="border border-dashed border-gray-300 rounded p-1 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <span className="text-[8px] text-gray-400">Libre</span>
        </div>
        <div className="border border-dashed border-gray-300 rounded p-1 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <span className="text-[8px] text-gray-400">Libre</span>
        </div>
      </div>
      <div className="h-7 bg-indigo-500 rounded flex items-center justify-center">
        <span className="text-white text-[10px] font-medium">Inscribirse</span>
      </div>
      {showActions && (
        <div className="flex gap-1.5 pt-1">
          <div className="flex-1 h-6 rounded border-2 border-green-300 flex items-center justify-center">
            <Share2 size={10} className="text-green-600" />
          </div>
          <div className="flex-1 h-6 rounded border-2 border-blue-300 flex items-center justify-center">
            <Edit3 size={10} className="text-blue-600" />
          </div>
          <div className="flex-1 h-6 rounded border-2 border-red-300 flex items-center justify-center">
            <Trash2 size={10} className="text-red-600" />
          </div>
        </div>
      )}
    </div>
  </div>
);

const FreeGamesMockup: React.FC = () => (
  <div className="bg-white rounded-xl shadow-lg p-3 max-w-[280px] mx-auto border border-gray-200">
    <div className="flex items-center gap-2 mb-2">
      <Gamepad2 size={14} className="text-purple-500" />
      <div className="h-3 w-24 bg-gray-300 rounded"></div>
    </div>
    <div className="space-y-1.5">
      <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
        <div className="flex items-center gap-2">
          <Box size={12} className="text-purple-400" />
          <div className="h-2 w-20 bg-purple-200 rounded"></div>
        </div>
        <span className="text-[8px] text-purple-500 italic">Sin nota</span>
      </div>
      <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
        <div className="flex items-center gap-2">
          <Box size={12} className="text-purple-400" />
          <div className="h-2 w-16 bg-purple-200 rounded"></div>
        </div>
        <span className="text-[8px] text-purple-500 italic">"Muy divertido"</span>
      </div>
    </div>
    <div className="mt-2 text-[9px] text-gray-500 flex items-center gap-1">
      <Users size={10} />
      Colección de Juan
    </div>
  </div>
);

// ============== MOCKUPS PARA ADMIN ==============

const AdminUsersMockup: React.FC = () => (
  <div className="bg-white rounded-lg shadow-lg p-3 max-w-[300px] mx-auto border border-gray-200">
    <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
      <Users size={14} />
      Gestión de Usuarios
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-yellow-200 flex items-center justify-center text-xs">👤</div>
          <div>
            <div className="text-xs font-medium">Nuevo Usuario</div>
            <div className="text-[10px] text-yellow-600">Pendiente de aprobación</div>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center">✓</button>
          <button className="w-6 h-6 bg-red-500 rounded text-white text-xs flex items-center justify-center">✗</button>
        </div>
      </div>
      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-200 flex items-center justify-center text-xs">👤</div>
          <div>
            <div className="text-xs font-medium">Usuario Activo</div>
            <div className="text-[10px] text-green-600 flex items-center gap-1">
              <Award size={8} /> Veterano
            </div>
          </div>
        </div>
        <select className="text-[10px] border rounded px-1 py-0.5">
          <option>user</option>
          <option>admin</option>
        </select>
      </div>
    </div>
  </div>
);

const AdminBadgesMockup: React.FC = () => (
  <div className="bg-white rounded-lg shadow-lg p-3 max-w-[280px] mx-auto border border-gray-200">
    <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
      <Award size={14} />
      Asignar Badges
    </div>
    <div className="flex flex-wrap gap-1.5">
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px]">
        <input type="checkbox" className="w-2.5 h-2.5" defaultChecked />
        Veterano
      </div>
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px]">
        <input type="checkbox" className="w-2.5 h-2.5" />
        VIP
      </div>
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px]">
        <input type="checkbox" className="w-2.5 h-2.5" />
        Organizador
      </div>
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-[10px]">
        <input type="checkbox" className="w-2.5 h-2.5" />
        Fundador
      </div>
    </div>
  </div>
);

const AdminArchivedMockup: React.FC = () => (
  <div className="bg-white rounded-lg shadow-lg p-3 max-w-[280px] mx-auto border border-gray-200">
    <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
      <Archive size={14} />
      Eventos Archivados
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
        <div>
          <div className="text-xs font-medium text-gray-600">Juntada Diciembre</div>
          <div className="text-[10px] text-gray-400">Archivado hace 2 días</div>
        </div>
        <div className="flex gap-1">
          <button className="px-2 py-1 bg-blue-500 rounded text-white text-[10px]">Restaurar</button>
          <button className="px-2 py-1 bg-red-500 rounded text-white text-[10px]">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
);

// ============== SLIDES DEFINITIONS ==============

const eventsSlides: TutorialSlide[] = [
  {
    title: '¡Bienvenido a Ludorganizador!',
    description: 'Esta es tu pantalla principal donde verás todos los eventos de juegos de mesa disponibles. Aquí podrás explorar, crear y participar en eventos.',
    icon: <Calendar size={32} className="text-orange-500" />,
    mockup: (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
            <span className="text-3xl">🎲</span>
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Ludorganizador
          </div>
          <div className="text-xs text-gray-500 mt-1">Organiza tus eventos de mesa</div>
        </div>
      </div>
    ),
    tips: ['Puedes cambiar entre modo claro y oscuro con el ícono de sol/luna', 'El botón de ayuda (?) siempre está disponible'],
  },
  {
    title: 'Tarjetas de Eventos',
    description: 'Cada evento se muestra como una tarjeta con su información clave. Haz clic en cualquier tarjeta para ver los detalles y las mesas de juego disponibles.',
    icon: <Calendar size={32} className="text-indigo-500" />,
    mockup: (
      <div className="space-y-3">
        <EventCardMockup />
        <EventCardMockup isPrivate />
      </div>
    ),
    tips: [
      '🔒 El candado indica un evento privado que requiere contraseña',
      'Los badges del creador aparecen junto a su nombre',
      'La descripción se corta si es muy larga - haz clic para ver más',
    ],
  },
  {
    title: 'Controles Principales',
    description: 'En la parte superior encontrarás los controles para gestionar la vista de eventos.',
    icon: <Settings size={32} className="text-blue-500" />,
    mockup: <EventsHeaderMockup />,
    tips: [
      '🔄 Usa el botón de refrescar para actualizar la lista',
      '➕ Crea nuevos eventos con el botón "Nuevo Evento"',
      '❓ El ícono de ayuda te da información sobre la sección',
    ],
  },
  {
    title: 'Eventos Próximos y Pasados',
    description: 'Los eventos se organizan automáticamente. Los próximos aparecen primero ordenados por fecha. Los pasados se agrupan en una sección colapsable.',
    icon: <ChevronDown size={32} className="text-purple-500" />,
    mockup: (
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-xs font-medium text-green-600 mb-2">📅 Próximos eventos (más cercano primero)</div>
          <EventCardMockup />
        </div>
        <PastEventsSectionMockup />
      </div>
    ),
    tips: [
      'Los eventos pasados no se eliminan automáticamente',
      'Haz clic en "Eventos Pasados" para expandir/colapsar',
      'Los administradores pueden archivar eventos antiguos',
    ],
  },
  {
    title: 'Crear un Evento',
    description: 'Al crear un evento podrás definir título, descripción, ubicación, fecha y hora. También puedes agregar una contraseña para hacerlo privado.',
    icon: <Plus size={32} className="text-green-500" />,
    mockup: (
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-[280px] mx-auto border border-gray-200">
        <div className="text-sm font-semibold mb-3">Nuevo Evento</div>
        <div className="space-y-2">
          <div className="p-2 rounded border border-gray-200 text-xs text-gray-400">Título del evento</div>
          <div className="p-2 rounded border border-gray-200 text-xs text-gray-400 h-12">Descripción...</div>
          <div className="flex gap-2">
            <div className="flex-1 p-2 rounded border border-gray-200 text-xs text-gray-400">📍 Ubicación</div>
            <div className="flex-1 p-2 rounded border border-gray-200 text-xs text-gray-400">📅 Fecha</div>
          </div>
          <div className="p-2 rounded border border-dashed border-amber-300 text-xs text-amber-600">🔒 Contraseña (opcional)</div>
          <div className="h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-medium">Crear Evento</span>
          </div>
        </div>
      </div>
    ),
    tips: [
      'La contraseña es opcional - déjala vacía para eventos públicos',
      'Se mostrará un mapa de Google Maps con la ubicación',
      'La fecha y hora determinan cuándo aparece el evento',
    ],
  },
];

const eventDetailSlides: TutorialSlide[] = [
  {
    title: 'Detalle del Evento',
    description: 'Esta es la vista completa de un evento. Aquí verás toda la información y podrás gestionar mesas de juego y la ludoteca.',
    icon: <Calendar size={32} className="text-orange-500" />,
    mockup: <EventHeaderMockup />,
    tips: [
      'El header muestra título, descripción, ubicación y fecha',
      'Los botones de acción aparecen si tienes permisos',
      '⬅️ "Volver a Eventos" te regresa a la lista principal',
    ],
  },
  {
    title: 'Acciones del Evento',
    description: 'Dependiendo de tus permisos (creador o admin) verás diferentes botones de acción en el header del evento.',
    icon: <Settings size={32} className="text-blue-500" />,
    mockup: (
      <div className="flex justify-center gap-3">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-1">
            <Share2 size={18} className="text-blue-600" />
          </div>
          <div className="text-[10px] text-gray-600">Compartir</div>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mb-1">
            <Archive size={18} className="text-yellow-600" />
          </div>
          <div className="text-[10px] text-gray-600">Archivar</div>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-1">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div className="text-[10px] text-gray-600">Eliminar</div>
        </div>
      </div>
    ),
    tips: [
      '📤 Compartir genera un folleto visual para WhatsApp',
      '📦 Archivar oculta el evento pero no lo elimina',
      '🗑️ Eliminar es permanente - ¡cuidado!',
      'Solo el creador o admins ven archivar/eliminar',
    ],
  },
  {
    title: 'Mesas de Juego',
    description: 'Las mesas son el corazón del evento. Cada mesa tiene un juego específico, un anfitrión y lugares para jugadores.',
    icon: <Table size={32} className="text-pink-500" />,
    mockup: <TableCardMockup />,
    tips: [
      '🟢 Puntos verdes = jugadores inscritos',
      '⚪ Puntos punteados = lugares libres',
      'El rango "2-4 Jug." indica mínimo-máximo de jugadores',
      'Haz clic en "Inscribirse" para unirte',
    ],
  },
  {
    title: 'Gestionar tu Mesa',
    description: 'Si eres el anfitrión de una mesa o eres admin, tendrás botones adicionales para gestionarla.',
    icon: <Edit3 size={32} className="text-blue-500" />,
    mockup: <TableCardMockup showActions />,
    tips: [
      '🟢 Compartir: genera imagen de la mesa para redes',
      '🔵 Editar: modifica nombre, descripción o jugadores',
      '🔴 Eliminar: borra la mesa permanentemente',
      'Puedes salir de una mesa donde estés inscrito',
    ],
  },
  {
    title: 'Juegos Libres (Ludoteca)',
    description: 'La pestaña "Juegos Libres" muestra los juegos que los usuarios traen al evento sin asignar a mesa específica.',
    icon: <Gamepad2 size={32} className="text-purple-500" />,
    mockup: <FreeGamesMockup />,
    tips: [
      'Cada usuario puede traer su propia colección',
      'Puedes agregar notas a cada juego',
      'Ideal para partidas espontáneas',
      'Los juegos se agrupan por dueño',
    ],
  },
  {
    title: 'Crear Mesa de Juego',
    description: 'Al crear una mesa defines el juego, descripción, y cantidad de jugadores. Tú serás el anfitrión.',
    icon: <Plus size={32} className="text-green-500" />,
    mockup: (
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-[260px] mx-auto border border-gray-200">
        <div className="text-sm font-semibold mb-3">Nueva Mesa</div>
        <div className="space-y-2">
          <div className="p-2 rounded border border-gray-200 text-xs text-gray-400">Nombre del juego</div>
          <div className="p-2 rounded border border-gray-200 text-xs text-gray-400 h-10">Descripción...</div>
          <div className="flex gap-2">
            <div className="flex-1 p-2 rounded border border-gray-200 text-xs text-center">
              <div className="text-gray-400">Mín</div>
              <div className="font-bold">2</div>
            </div>
            <div className="flex-1 p-2 rounded border border-gray-200 text-xs text-center">
              <div className="text-gray-400">Máx</div>
              <div className="font-bold">4</div>
            </div>
          </div>
          <div className="h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-medium">Crear Mesa</span>
          </div>
        </div>
      </div>
    ),
    tips: [
      'Tú cuentas como el primer jugador inscrito',
      'Define un mínimo realista para que la partida funcione',
      'La descripción ayuda a otros a entender qué esperar',
    ],
  },
];

const adminSlides: TutorialSlide[] = [
  {
    title: 'Panel de Administración',
    description: 'Como administrador tienes acceso a herramientas especiales para gestionar usuarios, eventos y la plataforma en general.',
    icon: <Shield size={32} className="text-orange-500" />,
    mockup: (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
            <span className="text-3xl">👑</span>
          </div>
          <div className="text-lg font-bold text-gray-800">Admin Panel</div>
          <div className="text-xs text-gray-500 mt-1">Gestión completa de la plataforma</div>
        </div>
      </div>
    ),
    tips: [
      'El sidebar izquierdo muestra las secciones disponibles',
      'Las notificaciones indican acciones pendientes',
      'En móvil, las secciones aparecen como tabs arriba',
    ],
  },
  {
    title: 'Usuarios Pendientes',
    description: 'Los nuevos usuarios deben ser aprobados antes de poder crear contenido. Aquí gestionas las solicitudes.',
    icon: <UserPlus size={32} className="text-yellow-500" />,
    mockup: (
      <div className="bg-white rounded-lg shadow-lg p-3 max-w-[300px] mx-auto">
        <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">👤</div>
            <div>
              <div className="text-xs font-medium">NuevoJugador123</div>
              <div className="text-[10px] text-yellow-600">Pendiente</div>
            </div>
          </div>
          <div className="flex gap-1">
            <div className="w-7 h-7 bg-green-500 rounded flex items-center justify-center text-white">✓</div>
            <div className="w-7 h-7 bg-red-500 rounded flex items-center justify-center text-white">✗</div>
          </div>
        </div>
        <div className="text-[10px] text-gray-500">
          ✓ Aprobar = rol "user" (puede crear contenido)<br/>
          ✗ Rechazar = elimina la cuenta
        </div>
      </div>
    ),
    tips: [
      'El badge rojo en el menú indica usuarios pendientes',
      'Usuarios aprobados pueden crear eventos y mesas',
      'Usuarios rechazados son eliminados del sistema',
    ],
  },
  {
    title: 'Gestión de Usuarios',
    description: 'Administra todos los usuarios registrados. Cambia roles y asigna badges especiales.',
    icon: <Users size={32} className="text-blue-500" />,
    mockup: <AdminUsersMockup />,
    tips: [
      'Roles: "nuevo" (pendiente), "user" (normal), "admin"',
      'Los admins tienen acceso a todo, incluso eventos privados',
      '⚠️ No puedes cambiar tu propio rol',
    ],
  },
  {
    title: 'Sistema de Badges',
    description: 'Los badges son reconocimientos que aparecen junto al nombre del usuario en la plataforma.',
    icon: <Award size={32} className="text-purple-500" />,
    mockup: <AdminBadgesMockup />,
    tips: [
      '🟣 Veterano: jugadores con experiencia',
      '🟡 VIP: usuarios especiales',
      '🟠 Organizador: frecuentemente crea eventos',
      '🔴 Fundador: miembros originales',
    ],
  },
  {
    title: 'Gestión de Eventos',
    description: 'Visualiza y gestiona todos los eventos de la plataforma. Puedes eliminar eventos problemáticos.',
    icon: <Calendar size={32} className="text-green-500" />,
    mockup: (
      <div className="bg-white rounded-lg shadow p-3 max-w-[280px] mx-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="text-xs font-medium">Juntada Enero</div>
              <div className="text-[10px] text-gray-500">Por: Juan • 3 mesas</div>
            </div>
            <button className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
              <Trash2 size={12} className="text-red-500" />
            </button>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="text-xs font-medium flex items-center gap-1">
                Evento Privado <Lock size={10} className="text-amber-500" />
              </div>
              <div className="text-[10px] text-gray-500">Por: María • 1 mesa</div>
            </div>
            <button className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
              <Trash2 size={12} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    ),
    tips: [
      'Puedes ver todos los eventos, incluso los privados',
      'Eliminar un evento elimina también sus mesas',
      'Considera archivar en lugar de eliminar',
    ],
  },
  {
    title: 'Eventos Archivados',
    description: 'Los eventos archivados no se muestran a usuarios normales, pero pueden restaurarse.',
    icon: <Archive size={32} className="text-gray-500" />,
    mockup: <AdminArchivedMockup />,
    tips: [
      'Archivar es ideal para eventos pasados',
      'Los eventos archivados mantienen toda su información',
      'Restaurar los vuelve a hacer visibles',
      '🗑️ Eliminar es permanente - no se puede deshacer',
    ],
  },
  {
    title: 'Acceso Maestro',
    description: 'Como admin tienes "llave maestra" para acceder a TODOS los eventos, incluso los privados con contraseña.',
    icon: <Shield size={32} className="text-yellow-500" />,
    mockup: (
      <div className="flex flex-col items-center gap-3 p-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
          <span className="text-2xl">🔐</span>
        </div>
        <div className="text-center">
          <div className="font-bold text-gray-800">Acceso Total</div>
          <div className="text-xs text-gray-500 mt-1">
            Eventos públicos y privados<br/>
            Sin necesidad de contraseña
          </div>
        </div>
      </div>
    ),
    tips: [
      'Los eventos privados te dejan entrar directamente',
      'Usa este poder responsablemente',
      'Ideal para moderar contenido problemático',
    ],
  },
];

// ============== MAIN COMPONENT ==============

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, variant }) => {
  const { theme: themeMode } = useTheme();
  const theme = getTheme(themeMode === 'dark');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = variant === 'admin' 
    ? adminSlides 
    : variant === 'eventDetail' 
      ? eventDetailSlides 
      : eventsSlides;

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
      setCurrentSlide(0);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleClose = () => {
    onClose();
    setCurrentSlide(0);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className="relative w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col"
        style={{ backgroundColor: theme.bg.primary }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors hover:opacity-70"
          style={{ 
            backgroundColor: theme.bg.tertiary,
            color: theme.text.secondary,
          }}
        >
          <X size={20} />
        </button>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 pb-4">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: theme.bg.tertiary }}
            >
              {currentSlideData.icon}
            </div>
          </div>

          {/* Title */}
          <h2 
            className="text-xl font-bold text-center mb-2"
            style={{ color: theme.text.primary }}
          >
            {currentSlideData.title}
          </h2>

          {/* Description */}
          <p 
            className="text-sm text-center mb-6 leading-relaxed"
            style={{ color: theme.text.secondary }}
          >
            {currentSlideData.description}
          </p>

          {/* Mockup */}
          <div 
            className="rounded-xl p-4 mb-4 min-h-[160px] flex items-center justify-center"
            style={{ backgroundColor: theme.bg.tertiary }}
          >
            {currentSlideData.mockup}
          </div>

          {/* Tips */}
          {currentSlideData.tips && currentSlideData.tips.length > 0 && (
            <div 
              className="rounded-lg p-3 space-y-1"
              style={{ backgroundColor: `${theme.primary}10` }}
            >
              <div className="text-xs font-medium mb-2" style={{ color: theme.primary }}>
                💡 Tips:
              </div>
              {currentSlideData.tips.map((tip, i) => (
                <div 
                  key={i} 
                  className="text-xs flex items-start gap-2"
                  style={{ color: theme.text.secondary }}
                >
                  <span className="mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                aria-label={`Ir a paso ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300`}
                style={{
                  width: index === currentSlide ? '24px' : '8px',
                  backgroundColor: index === currentSlide 
                    ? '#EC7D10' 
                    : theme.border.medium,
                }}
              />
            ))}
          </div>
        </div>

        {/* Navigation - Fixed at bottom */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: theme.border.light, backgroundColor: theme.bg.primary }}
        >
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ 
              color: theme.text.secondary,
              backgroundColor: 'transparent',
            }}
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <span 
            className="text-sm font-medium"
            style={{ color: theme.text.tertiary }}
          >
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: '#EC7D10',
              color: '#FFFFFF',
            }}
          >
            <span className="hidden sm:inline">
              {currentSlide === slides.length - 1 ? '¡Entendido!' : 'Siguiente'}
            </span>
            <span className="sm:hidden">
              {currentSlide === slides.length - 1 ? '¡Listo!' : 'Sig.'}
            </span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
