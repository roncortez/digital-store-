import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import BenefitsBadges from '../components/BenefitsBadges';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Error al iniciar sesión: ' + err.message);
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left side - Branding & Trust */}
      <div className="hidden lg:flex lg:w-1/3 p-20 flex-col justify-between">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-brand-yellow border-2 border-brand-yellow flex items-center justify-center">
              <span className="text-brand-dark font-bold text-xl">mt</span>
            </div>
            <span className="text-white text-2xl font-semibold">maitech</span>
          </div>
          
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-white leading-tight">
                Tu tienda de <br/>
                <span className="text-brand-yellow">equipos tecnológicos</span>
              </h1>
              <p className="text-white font-medium text-lg max-w-md">
                Encuentra laptops, smartphones, tablets y más. 
                La plataforma más confiable para tecnología de calidad.
              </p>
            </div>

            {/* New Action Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/marketplace" 
                className="px-6 py-3 bg-brand-yellow text-brand-dark font-bold border-2 border-brand-yellow hover:bg-yellow-400 hover:border-yellow-400 transition-colors"
              >
                Comprar
              </Link>
              <Link 
                to="/about" 
                className="px-6 py-3 border-2 border-white text-white font-bold hover:bg-white hover:text-brand-dark transition-colors"
              >
                Saber más
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto bg-white">
        <div className="max-w-md w-full space-y-8 animate-slide-up">
          <div className="text-center">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-brand-yellow border-2 border-brand-yellow flex items-center justify-center">
                <span className="text-brand-dark font-bold text-xl">mt</span>
              </div>
              <span className="text-brand-dark text-2xl font-semibold">maitech</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Bienvenido! 
            </h2>
            <p className="text-gray-600">
              Inicia sesión para acceder a tu cuenta
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm animate-slide-up">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`w-full px-4 py-3 rounded bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-colors ${error && email ? 'border-red-500' : ''}`}
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`w-full px-4 py-3 rounded bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-colors pr-12 ${error && password ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-300"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-bold text-brand-dark hover:text-brand-yellow">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border-2 border-brand-yellow shadow-sm text-sm font-bold text-brand-dark bg-brand-yellow hover:bg-yellow-500 hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-brand-dark font-bold hover:text-brand-yellow">
                  Regístrate
                </Link>
              </p>
            </div>
          </form>

          {/* Benefits Section - Moved here for better visibility */}
          <BenefitsBadges />
        </div>
      </div>
    </div>
  );
}
