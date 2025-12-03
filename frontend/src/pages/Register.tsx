import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import BenefitsBadges from '../components/BenefitsBadges';

interface PasswordStrength {
  score: number;
  message: string;
  color: string;
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, message: '', color: '' });
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const checkPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return { score: 0, message: '', color: '' };
    if (password.length < 6) return { score: 1, message: 'Muy débil', color: 'red' };
    
    let score = 0;
    const checks = [
      /[a-z]/.test(password), // lowercase
      /[A-Z]/.test(password), // uppercase
      /[0-9]/.test(password), // numbers
      /[^A-Za-z0-9]/.test(password), // special chars
      password.length >= 8 // length
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score <= 2) return { score, message: 'Débil', color: 'orange' };
    if (score <= 3) return { score, message: 'Media', color: 'yellow' };
    if (score <= 4) return { score, message: 'Fuerte', color: 'lime' };
    return { score, message: 'Muy fuerte', color: 'green' };
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (passwordStrength.score < 3) {
      setError('La contraseña debe ser al menos de fuerza media');
      return;
    }
    
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await register(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Error al registrarse: ' + err.message);
    }
    
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding & Benefits */}
      <div className="hidden lg:flex lg:w-1/3 p-20  flex-col gap-10">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-brand-yellow border-2 border-brand-yellow flex items-center justify-center">
              <span className="text-brand-dark font-bold text-xl">mt</span>
            </div>
            <span className="text-white text-2xl font-semibold">maitech</span>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-white leading-tight">
                Crea tu cuenta gratis y <span className="text-brand-yellow">empieza a comprar. </span>
              </h1>
              
            </div>
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg">Beneficios de unirte:</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Gana puntos de lealtad en cada compra</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Verificación de identidad gratuita</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">Acceso a ofertas exclusivas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-brand-yellow border-2 border-brand-yellow flex items-center justify-center">
                <span className="text-brand-dark font-bold text-xl">mt</span>
              </div>
              <span className="text-brand-dark text-2xl font-semibold">maitech</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Crea tu cuenta
            </h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
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
                  className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-colors"
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
                    className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-colors pr-12"
                    placeholder="Crea una contraseña segura"
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
                
                {password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Fortaleza de la contraseña</span>
                      <span className={`font-medium ${passwordStrength.color === 'red' ? 'text-red-500' : passwordStrength.color === 'orange' ? 'text-orange-500' : passwordStrength.color === 'yellow' ? 'text-yellow-500' : passwordStrength.color === 'lime' ? 'text-lime-500' : 'text-green-500'}`}>
                        {passwordStrength.message}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${passwordStrength.color === 'red' ? 'bg-red-500' : passwordStrength.color === 'orange' ? 'bg-orange-500' : passwordStrength.color === 'yellow' ? 'bg-yellow-500' : passwordStrength.color === 'lime' ? 'bg-lime-500' : 'bg-green-500'}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="w-full px-4 py-3 rounded bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent transition-colors pr-12"
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
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
                {confirmPassword && password && (
                  <p className={`mt-1 text-xs ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                    {password === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="accept-terms"
                name="accept-terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="h-4 w-4 text-brand-yellow focus:ring-brand-yellow border-gray-300"
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-600">
                Acepto los{' '}
                <Link to="/terms" className="text-brand-yellow hover:text-yellow-600 hover:underline">
                  términos y condiciones
                </Link>
                {' '}y la{' '}
                <Link to="/privacy" className="text-brand-yellow hover:text-yellow-600 hover:underline">
                  política de privacidad
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !acceptTerms}
                className="w-full flex justify-center py-3 px-4 border-2 border-brand-yellow shadow-sm text-sm font-bold text-brand-dark bg-brand-yellow hover:bg-yellow-500 hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </span>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O regístrate con</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-medium text-brand-yellow hover:text-yellow-600">
                  Inicia sesión
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
