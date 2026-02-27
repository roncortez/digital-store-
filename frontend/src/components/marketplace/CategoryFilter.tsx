import { useState, useEffect } from "react";
import Checkbox from "../ui/Checkbox";
import { api } from "../../api/api";
import { FaChevronDown } from "react-icons/fa";

interface CategoryFilterProps {
    selectedCategories: number[];
    onCategoryChange: (categories: number[]) => void;
}

interface Category {
    id: number;
    name: string;
}

export default function CategoryFilter({ selectedCategories, onCategoryChange }: CategoryFilterProps) {

    // 1. Estados
    const [categories, setCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);

    // 2. Efectos
    useEffect(() => {
        fetchCategories();
    }, []);

    // 3. Funciones 
    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleOnChange = (id: number) => {
        if (selectedCategories.includes(id)) {
            // Si ya está seleccionado, lo removemos
            onCategoryChange(selectedCategories.filter(item => item !== id));
        } else {
            // Si no está seleccionado, lo agregamos
            onCategoryChange([...selectedCategories, id]);
        }
    };

    return (
        <div className="py-4">
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex justify-between items-center w-full group transition-colors"
            >
                <span className="font-bold text-gray-800 group-hover:text-brand-dark transition-colors">Categorías</span>
                <FaChevronDown
                    className={`text-gray-400 group-hover:text-brand-dark transition-all duration-300 ${open ? "rotate-180" : "rotate-0"
                        }`}
                />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
                <ul className="min-h-0 space-y-3">
                    {categories && categories.map(category => (
                        <li key={category.id}>
                            <div className="flex justify-between items-center group cursor-pointer" onClick={() => handleOnChange(category.id)}>
                                <span className={`text-sm transition-colors ${selectedCategories.includes(category.id) ? 'text-brand-dark font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    {category.name}
                                </span>
                                <Checkbox
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleOnChange(category.id)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}