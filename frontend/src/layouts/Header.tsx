import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import logo from '../images/maitech.webp';
import { api } from '../api/api';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
}

export default function Header() {
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            if (currentUser) {
                try {
                    const response = await api.get(`/users/${currentUser?.uid}`);
                    setUser(response.data.user);
                } catch (error) {
                    console.error("Error fetching user in Header:", error);
                }
            }
        };
        getUser();
    }, [currentUser]);

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
        <header className="w-full shadow-2xl sticky top-0 z-[100] bg-brand-dark/80 backdrop-blur-xl border-b border-white/5">
            <nav className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-12 py-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <img src={logo} alt="Logo" className="h-20" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {currentUser && (
                        <div className="hidden lg:flex items-center space-x-6">
                            {navLinks.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-gray-300 hover:text-brand-yellow px-1 py-1 text-sm font-bold uppercase tracking-widest transition-all border-b-2 border-transparent hover:border-brand-yellow"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right side buttons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {currentUser && (
                            <Link
                                to="/checkout"
                                className="relative text-gray-300 hover:text-brand-yellow p-2 transition-all hover:scale-110"
                            >
                                <FaShoppingCart className="w-6 h-6" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-yellow px-1 text-[10px] font-black text-brand-dark shadow-lg">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {currentUser ? (
                            <div className="hidden md:flex items-center space-x-4 ml-2">
                                <div className="flex items-center space-x-3 text-white">
                                    <Link to="/dashboard" className="w-9 h-9 border-2 border-blue-500/50 bg-blue-600 flex items-center justify-center text-white font-black rounded-lg shadow-lg">
                                        {user?.first_name?.[0]?.toUpperCase()}
                                        {user?.last_name?.[0]?.toUpperCase()}
                                    </Link>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-primary btn-sm"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link
                                    to="/checkout"
                                    className="relative text-gray-300 hover:text-brand-yellow p-2 transition-all hover:scale-110"
                                >
                                    <FaShoppingCart className="w-6 h-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-yellow px-1 text-[10px] font-black text-brand-dark shadow-lg">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    to="/login"
                                    className="text-white hover:text-brand-yellow font-bold px-4 py-2 transition-colors text-sm"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-primary btn-sm shadow-lg shadow-brand-yellow/10"
                                >
                                    Unirse
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-white hover:text-brand-yellow transition-colors"
                        >
                            {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <div className={`
            fixed inset-0 bg-brand-dark/95 backdrop-blur-2xl z-[90] lg:hidden
            transition-all duration-500 ease-in-out
            ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none -translate-y-4'}
          `}>
                <div className="flex flex-col h-full pt-24 px-6 pb-10">
                    <div className="flex-1 space-y-4 overflow-y-auto">
                        <h2 className="text-brand-yellow/50 text-xs font-black uppercase tracking-[0.2em] mb-6 font-display">Navegación</h2>
                        {currentUser && navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMenuOpen(false)}
                                className="block text-3xl font-black text-white hover:text-brand-yellow transition-colors tracking-tighter border-b border-white/5 pb-2 font-display"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {!currentUser && (
                            <div className="space-y-4 pt-4">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-2xl font-black text-white hover:text-brand-yellow"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-2xl font-black text-brand-yellow"
                                >
                                    Crear Cuenta
                                </Link>
                            </div>
                        )}
                    </div>

                    {currentUser && (
                        <div className="mt-auto pt-8 border-t border-white/10 space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-indigo-600 border-2 border-indigo-500/50 flex items-center justify-center text-white font-black rounded-xl text-xl shadow-lg">
                                    {currentUser.email?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-black">{currentUser.email?.split('@')[0]}</p>
                                    <p className="text-gray-500 text-sm">{currentUser.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger w-full"
                            >
                                Salir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}