import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlowBackground from '../components/GlowBackground';

export default function MainLayout() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <GlowBackground className="min-h-screen flex flex-col bg-brand-dark">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full shadow-lg sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center space-x-2 group">
                  <div className="w-10 h-10 bg-brand-yellow border-2 border-brand-yellow flex items-center justify-center group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-colors">
                    <span className="text-brand-dark font-bold text-xl">mt</span>
                  </div>
                  <span className="text-white text-2xl font-bold tracking-tight group-hover:text-brand-yellow transition-colors">maitech</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              {currentUser && (
                <div className="hidden md:flex items-center space-x-8">
                  <Link to="/" className="text-gray-300 hover:text-brand-yellow px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-brand-yellow">
                    Inicio
                  </Link>
                  <Link to="/marketplace" className="text-gray-300 hover:text-brand-yellow px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-brand-yellow">
                    Marketplace
                  </Link>
                  <Link to="/dashboard" className="text-gray-300 hover:text-brand-yellow px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-brand-yellow">
                    Dashboard
                  </Link>
                  <Link to="/cart" className="text-gray-300 hover:text-brand-yellow px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-brand-yellow">
                    Carrito
                  </Link>
                </div>
              )}

              {/* Right side buttons */}
              <div className="flex items-center">
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 text-white">
                      <div className="w-8 h-8 border-2 border-brand-yellow bg-brand-yellow flex items-center justify-center text-brand-dark font-bold">
                        {currentUser.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden md:block text-sm font-medium">{currentUser.email?.split('@')[0]}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-white border border-gray-600 hover:border-brand-yellow px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-white hover:text-brand-yellow font-medium px-4 py-2 transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="bg-brand-yellow text-brand-dark hover:bg-yellow-400 border-2 border-brand-yellow hover:border-yellow-400 px-5 py-2.5 font-bold transition-colors"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>

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
                  <div className="w-8 h-8 bg-brand-yellow border-2 border-brand-yellow flex items-center justify-center">
                    <span className="text-brand-dark font-bold text-lg">mt</span>
                  </div>
                  <span className="text-white text-xl font-bold">maitech</span>
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
                  <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.409-.06 3.809-.06h.63zm1.673 5.381c-1.111 0-2.013.901-2.013 2.013 0 1.112.902 2.013 2.013 2.013 1.112 0 2.013-.901 2.013-2.013 0-1.112-.901-2.013-2.013-2.013zm-7.53 2.013c0-4.163 3.375-7.538 7.538-7.538 4.162 0 7.538 3.375 7.538 7.538s-3.376 7.538-7.538 7.538c-4.163 0-7.538-3.375-7.538-7.538z" clipRule="evenodd" /></svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
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
