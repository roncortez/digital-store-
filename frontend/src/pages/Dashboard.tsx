import { ReactNode } from 'react';

// Definir tipos para los niveles de usuario
type UserLevel = 'Oro' | 'Plata' | 'Bronce';

// Tipos para las tarjetas
interface DashboardCardProps {
  title: string;
  icon: string;
  children: ReactNode;
}

// Componente reutilizable de tarjeta
function DashboardCard({ title, icon, children }: DashboardCardProps) {
  return (
    <div className={`bg-brand-dark border border-gray-800 p-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-4xl">{icon}</span>
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  // Datos de ejemplo (mock data)
  const userData = {
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+1 (809) 555-1234",
    points: 1250,
    level: "Plata" as UserLevel,
    memberSince: "Enero 2024",
    totalSpent: "$2,450.00",
    totalOrders: 12,
    favoriteCategory: "Laptops"
  };

  const recentOrders = [
    { id: "#1234", date: "28 Nov 2024", status: "Entregado", total: "$299.99" },
    { id: "#1233", date: "15 Nov 2024", status: "En tránsito", total: "$149.50" },
    { id: "#1232", date: "05 Nov 2024", status: "Entregado", total: "$89.99" }
  ];
  const colors: Record<UserLevel, { gradient: string; text: string }> = {
    'Oro': {
      gradient: "from-[#F6E27A] via-[#E3C75F] to-[#CBA135]",
      text: "text-[#5A441A]",
    },
    'Plata': {
      gradient: "from-[#E5E5E5] via-[#BFBFBF] to-[#8F8F8F]",
      text: "text-gray-900",
    },
    'Bronce': {
      gradient: "from-[#CD7F32] via-[#B96B28] to-[#8A4B14]",
      text: "text-white",
    }
  };

  // Configuración de tarjetas - Agregar o quitar tarjetas aquí
  const dashboardCards = [
    {
      id: 'points',
      title: 'Mis Puntos',
      icon: '⭐',
      content: (
        <div className="space-y-4">
          <div className={`bg-gradient-to-r ${colors[userData.level].gradient} p-4 rounded-lg`}>
            <p className={`text-sm ${colors[userData.level].text}`}>Puntos disponibles</p>
            <p className={`text-5xl ${colors[userData.level].text} font-bold`}>{userData.points}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
              <p className="text-gray-400 text-xs mb-1">Nivel actual</p>
              <p className="text-white font-semibold text-lg">{userData.level}</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
              <p className="text-gray-400 text-xs mb-1">Miembro desde</p>
              <p className="text-white font-semibold text-lg">{userData.memberSince}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-gray-400 text-sm mb-2">
              <span>Progreso a Oro</span>
              <span>1250/2000</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-500`}
                style={{ width: '62.5%' }}
              ></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'orders',
      title: 'Pedidos recientes',
      icon: '📦',
      content: (
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-700/50 p-4 rounded-lg border border-gray-700 hover:bg-gray-750 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-semibold">{order.id}</p>
                  <p className="text-gray-400 text-sm">{order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Entregado'
                  ? 'bg-green-300 text-green-800 border border-green-800'
                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-white font-bold text-lg">{order.total}</p>
              </div>
            </div>
          ))}

          <button className="w-full mt-4 bg-brand-yellow text-brand-dark font-semibold py-3 px-6 hover:bg-yellow-500 transition-all duration-300 rounded-lg">
            Ver todos los pedidos →
          </button>
        </div>
      )
    },
    {
      id: 'stats',
      title: 'Estadísticas',
      icon: '📊',
      hoverColor: 'green',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gray-700/50 p-4 rounded-lg text-white">
              <p className="text-white/80 text-sm mb-1">Total gastado</p>
              <p className="text-3xl font-bold">{userData.totalSpent}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                <p className="text-gray-400 text-xs mb-1">Órdenes totales</p>
                <p className="text-white font-bold text-2xl">{userData.totalOrders}</p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                <p className="text-gray-400 text-xs mb-1">Favorito</p>
                <p className="text-white font-bold text-lg">{userData.favoriteCategory}</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wishlist',
      title: 'Lista de Deseos',
      icon: '❤️',
      hoverColor: 'red',
      content: (
        <div className="space-y-3">
          <div className="text-center py-8">
            <p className="text-6xl mb-4">🛍️</p>
            <p className="text-gray-300 mb-2">Tu lista está vacía</p>
            <p className="text-gray-500 text-sm">Agrega productos que te gusten</p>
          </div>
          <button className="w-full bg-brand-yellow text-brand-dark font-semibold py-3 px-6 hover:bg-yellow-500 transition-all duration-300 rounded-lg">
            Explorar productos →
          </button>
        </div>
      )
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Enhanced Header with User Profile */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: User Profile Info */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-yellow to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                ¡Bienvenido, {userData.name}!
              </h1>
              <p className="text-gray-600 text-sm mt-1">📧 {userData.email}</p>
              <p className="text-gray-600 text-sm">📱 {userData.phone}</p>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-brand-dark text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Tu resumen:</span> Tienes {userData.points} puntos disponibles • Nivel {userData.level} • Miembro desde {userData.memberSince}
          </p>
        </div>
      </div>

      {/* Dashboard Cards Grid - Renderiza N tarjetas automáticamente */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {dashboardCards.map((card) => (
          <DashboardCard
            key={card.id}
            title={card.title}
            icon={card.icon}
          >
            {card.content}
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
