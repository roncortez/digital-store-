import { useEffect, useState } from "react";
import { SearchBar } from "../components/marketplace/SearchBar";
import ProductCard from "../components/marketplace/ProductCard";
import CategoryFilter from "../components/marketplace/CategoryFilter";
import ConditionFilter from "../components/marketplace/ConditionFilter";
import BrandFilter from "../components/marketplace/BrandFilter";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSearch('');
  }
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedBrands, selectedConditions, search]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products' + '?search=' + search + '&categories='
        + selectedCategories + '&conditions=' + selectedConditions + '&brands=' + selectedBrands);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };



  console.log(products);

  console.log(selectedCategories);
  console.log(selectedBrands);
  console.log(selectedConditions);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-6">
        <div className="flex gap-6">
          {/* Overlay para móvil */}
          {isFilterOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
          )}

          {/* Sidebar de filtros - Responsive Drawer */}
          <aside className={`
            fixed lg:sticky lg:top-6
            top-0 left-0 h-full lg:h-fit
            w-72 bg-white rounded-none lg:rounded-lg shadow-lg 
            z-50 lg:z-0
            transform transition-transform duration-300 ease-in-out
            ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-hidden
          `}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl text-gray-800">Filtros</h2>
                <div className="flex items-center gap-3">
                  <button
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200"
                    onClick={handleClearFilters}
                  >
                    Limpiar todo
                  </button>
                  {/* Botón cerrar solo en móvil */}
                  <button
                    className="lg:hidden text-gray-600 hover:text-gray-800"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Container */}
            <div className="px-6 py-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <CategoryFilter
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
              />
              <div className="border-t border-gray-100"></div>
              <ConditionFilter
                selectedConditions={selectedConditions}
                onConditionChange={setSelectedConditions}
              />
              <div className="border-t border-gray-100"></div>
              <BrandFilter
                selectedBrands={selectedBrands}
                onBrandChange={setSelectedBrands}
              />
            </div>

          </aside>

          {/* Contenido principal - Derecha */}
          <main className="flex-1">
            {/* Botón de filtros para móvil */}
            <div className="mb-4 lg:hidden">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-medium">Filtros</span>
              </button>
            </div>

            {/* Búsqueda alineada a la derecha */}
            <div className="mb-6 flex justify-end">
              <div className="w-full">
                <SearchBar
                  value={search}
                  onChange={(value) => setSearch(value)}
                  placeholder="Buscar productos..."
                />
              </div>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
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
          </main>
        </div>
      </div>
    </div>
  );
}