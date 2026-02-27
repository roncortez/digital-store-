export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-light">
            {/* Hero Section with Team Photo */}
            <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-gray-900 to-brand-dark py-20 md:py-32">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-brand-yellow rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                            Sobre Nosotros
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-delay-1">
                            Conoce al equipo detrás de tu tienda digital de confianza
                        </p>
                    </div>

                    {/* Team Photo Placeholder */}
                    <div className="max-w-4xl mx-auto animate-fade-in-delay-2">
                        <div className="relative group">
                            {/* Placeholder - Aquí irá tu foto */}
                            <div className="relative h-96 bg-gradient-to-br from-brand-yellow/20 to-primary/20 rounded-2xl overflow-hidden border-4 border-brand-yellow/30 backdrop-blur-sm">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
                                    <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="text-lg font-semibold">Espacio para tu foto del equipo</p>
                                    <p className="text-sm opacity-75 mt-2">Recomendado: 1200x600px</p>
                                </div>
                                {/* Para agregar tu foto, usa:
                <img 
                  src="/ruta/a/tu/foto.jpg" 
                  alt="Equipo Digital Store" 
                  className="w-full h-full object-cover"
                />
                */}
                            </div>

                            {/* Decorative Frame Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-yellow to-primary rounded-2xl opacity-20 blur group-hover:opacity-40 transition-opacity -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                            Nuestra Historia
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-brand-yellow to-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed mb-6">
                                Todo comenzó con una idea simple: <strong className="text-brand-dark">crear un espacio digital donde las personas pudieran encontrar productos de calidad a precios justos</strong>, con la confianza de estar tratando con personas reales que se preocupan por su experiencia.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                Somos un equipo apasionado por la tecnología y el comercio electrónico. Creemos que comprar en línea debería ser una experiencia <strong className="text-brand-dark">segura, transparente y agradable</strong>. Por eso, cada producto en nuestra plataforma es cuidadosamente seleccionado y verificado.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Nuestra misión es conectar a vendedores confiables con compradores que buscan calidad, mientras construimos una comunidad basada en la <strong className="text-brand-dark">confianza y el servicio excepcional</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-16 md:py-24 px-6 lg:px-8 bg-gradient-to-br from-white to-brand-light/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                            Nuestros Valores
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Los principios que guían cada decisión que tomamos
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Value 1 */}
                        <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/10 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-brand-yellow to-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">Confianza</h3>
                                <p className="text-gray-600">Construimos relaciones basadas en la transparencia y la honestidad</p>
                            </div>
                        </div>

                        {/* Value 2 */}
                        <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">Calidad</h3>
                                <p className="text-gray-600">Verificamos cada producto para garantizar los más altos estándares</p>
                            </div>
                        </div>

                        {/* Value 3 */}
                        <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-warning/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-warning rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">Rapidez</h3>
                                <p className="text-gray-600">Procesamos pedidos de forma eficiente para entregas rápidas</p>
                            </div>
                        </div>

                        {/* Value 4 */}
                        <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-brand-yellow/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-warning to-brand-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-3">Pasión</h3>
                                <p className="text-gray-600">Amamos lo que hacemos y se refleja en cada detalle</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 md:py-24 px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                            Nuestro Equipo
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Las personas que hacen posible esta experiencia
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Team Member 1 */}
                        <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="relative h-80 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                    <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm opacity-90">Tu foto aquí</p>
                                    <p className="text-xs opacity-75 mt-1">400x400px</p>
                                </div>
                                {/* Para agregar foto individual:
                <img 
                  src="/ruta/a/foto-miembro-1.jpg" 
                  alt="Nombre" 
                  className="w-full h-full object-cover"
                />
                */}
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-bold text-brand-dark mb-2">Tu Nombre</h3>
                                <p className="text-brand-yellow font-semibold mb-3">Co-Fundador & CEO</p>
                                <p className="text-gray-600">
                                    Apasionado por la tecnología y el emprendimiento. Enfocado en crear experiencias excepcionales para nuestros clientes.
                                </p>
                            </div>
                        </div>

                        {/* Team Member 2 */}
                        <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="relative h-80 bg-gradient-to-br from-green-400 via-teal-400 to-blue-400">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                    <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm opacity-90">Foto de tu amigo</p>
                                    <p className="text-xs opacity-75 mt-1">400x400px</p>
                                </div>
                                {/* Para agregar foto individual:
                <img 
                  src="/ruta/a/foto-miembro-2.jpg" 
                  alt="Nombre" 
                  className="w-full h-full object-cover"
                />
                */}
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-2xl font-bold text-brand-dark mb-2">Nombre del Amigo</h3>
                                <p className="text-brand-yellow font-semibold mb-3">Co-Fundador & CTO</p>
                                <p className="text-gray-600">
                                    Experto en desarrollo y tecnología. Responsable de mantener nuestra plataforma segura y eficiente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 px-6 lg:px-8 bg-gradient-to-br from-brand-dark via-gray-900 to-brand-dark relative overflow-hidden">
                {/* Background Effect */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-yellow rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"></div>
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        ¿Tienes alguna pregunta?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Estamos aquí para ayudarte. No dudes en contactarnos o explorar nuestros productos
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="mailto:contacto@tudominio.com"
                            className="group relative px-8 py-4 bg-gradient-to-r from-brand-yellow to-primary text-brand-dark font-bold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-yellow/50 hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contáctanos
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-warning opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                        <a
                            href="/marketplace"
                            className="px-8 py-4 border-2 border-white text-white font-bold rounded-lg transition-all duration-300 hover:bg-white hover:text-brand-dark hover:scale-105"
                        >
                            Ver Productos
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}