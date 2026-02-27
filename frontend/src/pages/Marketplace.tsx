import { useEffect, useState } from "react";
import { SearchBar } from "../components/marketplace/SearchBar";
import ProductCard from "../components/marketplace/ProductCard";
import CategoryFilter from "../components/marketplace/CategoryFilter";
import ConditionFilter from "../components/marketplace/ConditionFilter";
import BrandFilter from "../components/marketplace/BrandFilter";
import { FaWhatsapp, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { api } from "../api/api";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  stock?: number;
  category_name?: string;
  brand_name?: string;
  condition_name?: string;
}

const PRODUCTS_PER_PAGE = 20;

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);


  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSearch('');
    setCurrentPage(1);
  }
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedBrands, selectedConditions, search, currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: {
          search,
          categories: selectedCategories.join(','),
          conditions: selectedConditions.join(','),
          brands: selectedBrands.join(','),
          page: currentPage,
          limit: PRODUCTS_PER_PAGE
        }
      });
      const data = response.data;
      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="flex w-full min-h-screen">
        {/* Overlay para móvil */}
        {isFilterOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        {/* Columna de Filtros - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0 bg-white border-r border-gray-200">
          <aside className="sticky top-20 h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
            {/* Header Filtros */}
            <div className="px-6 py-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-lg shadow-brand-yellow/10">
                  <FaFilter className="text-brand-dark text-lg" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-brand-dark tracking-tight font-display">Filtros</h2>
                  <p className="text-brand-dark text-[10px] font-bold uppercase tracking-widest">{totalProducts} disponibles</p>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex items-center justify-center">
              <button
                className="btn btn-ghost flex items-center justify-center"
                onClick={handleClearFilters}
              >
                <FaTimes className="w-3 h-3" />
                Limpiar filtros
              </button>
            </div>
            {/* Contenedor de Filtros Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <div className="space-y-2">
                <CategoryFilter
                  selectedCategories={selectedCategories}
                  onCategoryChange={(cats) => { setSelectedCategories(cats); setCurrentPage(1); }}
                />
                <div className="h-px bg-gray-100 my-2"></div>
                <ConditionFilter
                  selectedConditions={selectedConditions}
                  onConditionChange={(conds) => { setSelectedConditions(conds); setCurrentPage(1); }}
                />
                <div className="h-px bg-gray-100 my-2"></div>
                <BrandFilter
                  selectedBrands={selectedBrands}
                  onBrandChange={(brands) => { setSelectedBrands(brands); setCurrentPage(1); }}
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Sidebar Móvil */}
        <aside className={`
          fixed inset-y-0 left-0 w-80 bg-white z-[60]
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col shadow-2xl
        `}>
          <div className="px-6 py-8 bg-brand-dark text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
                <FaFilter className="text-brand-dark text-lg" />
              </div>
              <h2 className="font-bold text-xl tracking-tight font-display">Filtros</h2>
            </div>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <CategoryFilter
              selectedCategories={selectedCategories}
              onCategoryChange={(cats) => { setSelectedCategories(cats); setCurrentPage(1); }}
            />
            <div className="h-px bg-gray-100 my-4"></div>
            <ConditionFilter
              selectedConditions={selectedConditions}
              onConditionChange={(conds) => { setSelectedConditions(conds); setCurrentPage(1); }}
            />
            <div className="h-px bg-gray-100 my-4"></div>
            <BrandFilter
              selectedBrands={selectedBrands}
              onBrandChange={(brands) => { setSelectedBrands(brands); setCurrentPage(1); }}
            />
          </div>
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleClearFilters}
              className="btn btn-ghost w-full py-3"
            >
              Limpiar Filtros
            </button>
          </div>
        </aside>

        {/* Contenido principal - Derecha */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
          {/* Header con botón filtros y búsqueda */}
          <div className="mb-10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-black text-brand-dark mb-2 tracking-tight font-display">Productos</h1>
              <p className="text-gray-500 hidden md:block font-medium">
                Mostrando <span className="font-semibold text-brand-dark">{products.length}</span> de <span className="font-semibold text-brand-dark">{totalProducts}</span> productos
              </p>
            </div>

            {/* Botón de filtros para móvil */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-xl shadow-lg hover:shadow-brand-dark/20 transition-all active:scale-95"
            >
              <FaFilter className="w-4 h-4 text-brand-yellow" />
              <span className="font-bold">Filtros</span>
              {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedConditions.length > 0) && (
                <span className="bg-brand-yellow text-brand-dark text-xs font-bold px-2 py-0.5 rounded-full">
                  {selectedCategories.length + selectedBrands.length + selectedConditions.length}
                </span>
              )}
            </button>
          </div>

          {/* Búsqueda */}
          <div className="mb-6">
            <SearchBar
              value={search}
              onChange={(value) => { setSearch(value); setCurrentPage(1); }}
              placeholder="Buscar productos..."
            />
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-8">
            {products.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                description={product.description}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-16 mb-10 flex flex-col sm:flex-row justify-center items-center gap-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-yellow hover:text-brand-dark transition-all active:scale-95"
              >
                <FaChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Anterior
              </button>

              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-12 h-12 rounded-xl font-bold transition-all active:scale-90 ${currentPage === pageNum
                        ? 'bg-gradient-to-br from-brand-yellow to-primary text-brand-dark shadow-lg shadow-brand-yellow/30'
                        : 'bg-white border border-gray-100 text-gray-600 hover:border-brand-yellow hover:text-brand-dark'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-yellow hover:text-brand-dark transition-all active:scale-95"
              >
                Siguiente
                <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* WhatsApp CTA */}
          <a
            className="fixed bottom-8 right-8 z-50 h-14 w-14 inline-flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all hover:scale-110"
            href="https://wa.me/593979229318?text=Hola%20tengo%20una%20consulta%20sobre%20mi%20compra">
            <FaWhatsapp className="h-7 w-7" />
          </a>
        </main>
      </div>
    </div>
  );
}
