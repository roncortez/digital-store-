import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/marketplace/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products?limit=8');
      const data = await response.json();
      setFeaturedProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-light">

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-gradient-to-br from-brand-dark via-gray-900 to-brand-dark relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-yellow rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Únete a clientes satisfechos y descubre las mejores ofertas en nuestra plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-gradient-to-r from-brand-yellow to-primary text-brand-dark font-bold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-yellow/50 hover:scale-105"
            >
              <span className="relative z-10">Crear cuenta gratis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-warning opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/marketplace"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg transition-all duration-300 hover:bg-white hover:text-brand-dark hover:scale-105"
            >
              Explorar sin cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia de compra con servicios de primera clase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/10 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-yellow to-primary rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">Envío Seguro</h3>
                <p className="text-gray-600">Garantizamos que tus productos lleguen en perfectas condiciones</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-primary rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">Garantía de Calidad</h3>
                <p className="text-gray-600">Todos nuestros productos son verificados antes de enviarse</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-warning/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-warning rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">Pagos Seguros</h3>
                <p className="text-gray-600">Transacciones protegidas con encriptación de última generación</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-brand-yellow/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-brand-yellow rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">Soporte 24/7</h3>
                <p className="text-gray-600">Estamos aquí para ayudarte en cualquier momento que lo necesites</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-gradient-to-br from-white to-brand-light/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                Productos Destacados
              </h2>
              <p className="text-lg text-gray-600">
                Descubre nuestras mejores ofertas y productos más populares
              </p>
            </div>
            <Link
              to="/marketplace"
              className="hidden md:flex items-center gap-2 text-brand-yellow hover:text-primary font-semibold transition-colors group"
            >
              <span>Ver todos</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-yellow border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Cargando productos...</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow text-brand-dark font-semibold rounded-lg hover:bg-primary transition-colors"
            >
              <span>Ver todos los productos</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}