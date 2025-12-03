import { useState, useEffect } from "react";
import Checkbox from "../ui/Checkbox";

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
            const response = await fetch('http://localhost:3000/api/categories');
            const data = await response.json();
            setCategories(data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }

    }

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
        <div>
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex justify-between w-full">
                <span className="font-bold">Categorías</span>
                <span
                    className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"
                        }`}
                >
                    ▼
                </span>
            </button>
            {open && (
                <ul className="mt-3">
                    {categories && categories.map(category => (
                        <li key={category.id}>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">{category.name}</span>
                                <Checkbox
                                    checked={selectedCategories.includes(category.id)}
                                    onChange={() => handleOnChange(category.id)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}