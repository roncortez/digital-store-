import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/api';
import { IoMdClose } from 'react-icons/io';
import { HiSave } from 'react-icons/hi';
import { FaUserEdit } from 'react-icons/fa';
import { FaStar, FaPhone, FaEnvelope, FaBoxOpen, FaChartBar, FaHeart } from 'react-icons/fa';

// Definir tipos para los niveles de usuario
type UserLevel = 'Oro' | 'Plata' | 'Bronce';

interface User {
  firebase_uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  level: UserLevel;
  points?: number;
  doc_id?: string | null;
}

// Tipos para las tarjetas
interface DashboardCardProps {
  title: string;
  icon: string;
  children: ReactNode;
}

// Componente reutilizable de tarjeta
function DashboardCard({ title, icon, children }: DashboardCardProps) {
  return (
    <div className={`bg-brand-dark border border-gray-800 p-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-none`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-4xl">{icon}</span>
      </div>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    doc_id: '',
    phone: '',
    address: '',
  });

  const [prefixPhone, setPrefixPhone] = useState('+593')
  // ==================== Estados de Error ====================
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [docIdError, setDocIdError] = useState("");
  const [addressError, setAddressError] = useState("");

  const hasAnyError =
    firstNameError !== '' ||
    lastNameError !== '' ||
    phoneError !== '' ||
    docIdError !== '';

  const handleFirstNameChange = (value: string) => {
    let formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ -]/g, '');
    setForm((prev) => ({ ...prev, first_name: formattedValue }))

    if (formattedValue.length === 0) {
      setFirstNameError("El nombre es obligatorio");
    }

  }

  const handleLastNameChange = (value: string) => {
    let formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ -]/g, '');
    setForm((prev) => ({ ...prev, last_name: formattedValue }))

    if (formattedValue.length === 0) {
      setLastNameError("El apellido es obligatorio");
    }

  }

  const validateEcuadorianID = (cedula: string): boolean => {
    if (cedula.length !== 10) return false;
    if (!/^\d+$/.test(cedula)) return false;

    const provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;

    const tercerDigito = parseInt(cedula.charAt(2));
    if (tercerDigito > 5) return false;

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula.charAt(i)) * coeficientes[i];
      if (valor >= 10) valor -= 9;
      suma += valor;
    }

    const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
    const ultimoDigito = parseInt(cedula.charAt(9));

    return digitoVerificador === ultimoDigito;
  };

  const handleIdChange = (value: string) => {
    if (idType === 'cedula') {
      let formattedValue = value.replace(/[^0-9]/g, '');
      setForm((prev) => ({ ...prev, doc_id: formattedValue }))

      if (formattedValue.length >= 1 && formattedValue.length < 10) {
        setDocIdError("La cédula debe tener 10 dígitos");
      } else if (!validateEcuadorianID(formattedValue)) {
        setDocIdError("Cédula inválida");
      } else {
        setDocIdError("");
      }
    } else {
      let formattedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      setForm((prev) => ({ ...prev, id: formattedValue }))

      if (formattedValue.length === 0) {
        setDocIdError("El pasaporte es obligatorio");
      } else if (formattedValue.length < 6) {
        setDocIdError("El pasaporte debe tener al menos 6 caracteres");
      } else {
        setDocIdError("");
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    let formattedValue = value.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, phone: formattedValue }));

    if (formattedValue.length === 0) {
      setPhoneError("");
    } else if (formattedValue.length !== 9) {
      setPhoneError("Número de teléfono inválido");
    } else if (!formattedValue.startsWith("9")) {
      setPhoneError("El número debe empezar con 9");
    } else {
      setPhoneError("");
    }

  }

  const handleAddressChange = (value: string) => {
    setForm((prev) => ({ ...prev, address: value }))
  }
  const [openModal, setOpenModal] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const [idType, setIdType] = useState('cedula');

  const handleOpenModal = () => {
    setForm({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      doc_id: user?.doc_id || '',
      phone: user?.phone?.trim().replace(/^\+\d{1,3}\s?/, '') || '',
      address: user?.address || '',
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setStatus('idle');
    setDocIdError('');
    setFirstNameError('');
    setLastNameError('');
    setPhoneError('');
    setAddressError('');
  }

  const updateUser = async () => {
    setStatus('saving');
    try {
      const response = await api.put(`/users/${currentUser?.uid}`, {
        first_name: form.first_name,
        last_name: form.last_name,
        doc_id: form.doc_id,
        phone: form.phone ? prefixPhone + form.phone : '',
        address: form.address
      });
      console.log(response);
      if (response.data.success) {
        setUser(response.data.user);
        setStatus('success');
      }
    } catch (error) {
      setStatus('error');
    }
  }

  const getUser = async () => {
    try {
      const response = await api.get(`/users/${currentUser?.uid}`);

      if (response.data.success) {
        setUser(response.data.user);
      }
      console.log(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  useEffect(() => {
    if (currentUser) {
      getUser();
    }
  }, [currentUser]);

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
      icon: <FaStar className='text-gray-400' />,
      content: (
        <div className="space-y-4">
          {/*<div className={`bg-gradient-to-r ${colors[user?.level || 'Bronce'].gradient} p-4 rounded-lg`}>
            <p className={`text-sm ${colors[user?.level || 'Bronce'].text}`}>Puntos disponibles</p>
            <p className={`text-5xl ${colors[user?.level || 'Bronce'].text} font-bold`}>{user?.points || 0}</p>
          </div>*/}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 p-3 rounded-none border border-gray-600">
              <p className="text-gray-400 text-xs mb-1">Nivel actual</p>
              <p className="text-white font-semibold text-lg">{user?.level}</p>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-none border border-gray-600">
              <p className="text-gray-400 text-xs mb-1">Miembro desde</p>
              <p className="text-white font-semibold text-lg">
                {user ? new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : '-'}
              </p>
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
      icon: <FaBoxOpen className='text-gray-400' />,
      content: (
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-700/50 p-4 rounded-none border border-gray-700 hover:bg-gray-750 transition-all duration-200"
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

          <button className="btn btn-primary w-full mt-4">
            Ver todos los pedidos →
          </button>
        </div>
      )
    },
    {
      id: 'stats',
      title: 'Estadísticas',
      icon: <FaChartBar className='text-gray-400' />,
      hoverColor: 'green',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-gray-700/50 p-4 rounded-none text-white">
              <p className="text-white/80 text-sm mb-1">Total gastado</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700/50 p-3 rounded-none border border-gray-600">
                <p className="text-gray-400 text-xs mb-1">Órdenes totales</p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-none border border-gray-600">
                <p className="text-gray-400 text-xs mb-1">Favorito</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'wishlist',
      title: 'Lista de Deseos',
      icon: <FaHeart className='text-gray-400' />,
      hoverColor: 'red',
      content: (
        <div className="space-y-3">
          <div className="text-center py-8">
            <p className="text-6xl mb-4">🛍️</p>
            <p className="text-gray-300 mb-2">Tu lista está vacía</p>
            <p className="text-gray-500 text-sm">Agrega productos que te gusten</p>
          </div>
          <button className="btn btn-primary w-full">
            Explorar productos →
          </button>
        </div>
      )
    }
  ];



  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Enhanced Header with User Profile */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: User Profile Info */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full border-2 border-blue-500/50 bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
              {`${user.first_name[0]}${user.last_name[0]}`}
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                ¡Bienvenido, {user.first_name} {user.last_name}!
              </h1>
              <div className="flex items-center gap-2 text-gray-600 text-sm mt-1"><FaEnvelope /> {user.email}</div>
              <div className="flex items-center gap-2 text-gray-600 text-sm"><FaPhone /> {user.phone || 'No especificado'}</div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleOpenModal}
              className="btn btn-ghost flex items-center gap-2">
              <FaUserEdit className="w-5 h-5" />
              Editar perfil
            </button>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-6 bg-white p-4 rounded-none border border-gray-200 shadow-sm">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Tu resumen:</span> Tienes {user.points || 0} puntos disponibles • Nivel {user.level} • Miembro desde {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
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

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-10 rounded-none shadow-lg w-full max-w-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {status !== 'success' && <h2 className="text-xl font-bold text-gray-900">Editar</h2>}
              </div>
              <button onClick={handleCloseModal}><IoMdClose className="w-6 h-6 text-gray-600" /></button>
            </div>
            {status === 'success' ?
              (
                <div className="flex items-center justify-center mt-5 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900">Actualización exitosa</h2>
                </div>
              )
              : (
                <div className=" mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                      type="text"
                      value={form.first_name}
                      onChange={(e) => handleFirstNameChange(e.target.value)}
                      style={{ textTransform: 'capitalize' }}
                    />
                    <span className="text-xs text-danger">{firstNameError}</span>

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                      type="text"
                      value={form.last_name}
                      onChange={(e) => handleLastNameChange(e.target.value)}
                      style={{ textTransform: 'capitalize' }}
                    />
                    <span className="text-xs text-danger">{lastNameError}</span>

                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Identificación
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => { setIdType('cedula'); }}
                          className={`px-3 py-0.5 rounded-none text-xs font-medium transition-colors ${idType === 'cedula'
                            ? 'bg-brand-yellow text-brand-dark'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                          Cédula
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIdType('pasaporte'); }}
                          className={`px-3 py-0.5 rounded-none text-xs font-medium transition-colors ${idType === 'pasaporte'
                            ? 'bg-brand-yellow text-brand-dark'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                          Pasaporte
                        </button>

                      </div>

                    </div>
                    <input
                      type="text"
                      value={form.doc_id}
                      maxLength={idType === 'cedula' ? 10 : 20}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                      placeholder={idType === 'cedula' ? '1712345678' : 'AB123456'}
                      onChange={(e) => handleIdChange(e.target.value)}
                    />
                    <span className="text-xs text-danger">{docIdError}</span>

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={prefixPhone}
                        disabled={true}
                        className="w-20 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                      />
                      <input
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                        type="text"
                        maxLength={9}
                        value={form.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                      />
                    </div>
                    <span className="text-xs text-danger">{phoneError}</span>

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                      type="text"
                      value={form.address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleCloseModal}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={hasAnyError || status === 'saving'}
                      onClick={updateUser}
                      className={`btn btn-primary btn-sm flex items-center gap-2`}
                    >
                      <HiSave className="w-4 h-4" />
                      {status === 'saving' ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              )}
          </div>

        </div>
      )}
    </div>
  );
}
