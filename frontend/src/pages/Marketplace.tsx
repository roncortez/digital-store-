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
          {/* Sidebar de filtros - Izquierda */}
          <aside className="w-72 bg-white rounded-lg shadow-lg h-fit sticky top-6 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl text-gray-800">Filtros</h2>
                <button
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200"
                  onClick={handleClearFilters}
                >
                  Limpiar todo
                </button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
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