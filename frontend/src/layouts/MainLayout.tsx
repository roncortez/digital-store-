import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlowBackground from '../components/GlowBackground';
import { useCart } from '../contexts/CartContext';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useState } from 'react';
import logo from '../images/maitech.webp';
import Header from './Header';

export default function MainLayout() {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { cart } = useCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/about", label: "Sobre nosotros" },
    { to: "/marketplace", label: "Productos" },
    { to: "/services", label: "Servicios" },
    { to: "/sales", label: "Ventas" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <GlowBackground className="min-h-screen flex flex-col bg-brand-dark">
      <div className="min-h-screen flex flex-col relative">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <img src={logo} alt="Logo" className="h-12" />
                </div>
                <p className="text-gray-400 text-sm">
                  Tu destino confiable para tecnología de segunda mano verificada y garantizada.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">Comprar</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/marketplace" className="hover:text-brand-yellow transition-colors">Laptops</Link></li>
                  <li><Link to="/marketplace" className="hover:text-brand-yellow transition-colors">Smartphones</Link></li>
                  <li><Link to="/marketplace" className="hover:text-brand-yellow transition-colors">Tablets</Link></li>
                  <li><Link to="/marketplace" className="hover:text-brand-yellow transition-colors">Accesorios</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">Soporte</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/help" className="hover:text-brand-yellow transition-colors">Centro de Ayuda</Link></li>
                  <li><Link to="/terms" className="hover:text-brand-yellow transition-colors">Términos y Condiciones</Link></li>
                  <li><Link to="/privacy" className="hover:text-brand-yellow transition-colors">Política de Privacidad</Link></li>
                  <li><Link to="/contact" className="hover:text-brand-yellow transition-colors">Contáctanos</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">Síguenos</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 text-3xl hover:text-brand-yellow transition-colors">
                    <FaFacebook />
                  </a>
                  <a href="#" className="text-gray-400 text-3xl hover:text-brand-yellow transition-colors">
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 maitech. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </GlowBackground>
  );
}
