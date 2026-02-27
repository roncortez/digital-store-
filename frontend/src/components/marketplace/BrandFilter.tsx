import { useState, useEffect } from "react";
import Checkbox from "../ui/Checkbox";
import { api } from "../../api/api";
import { FaChevronDown } from "react-icons/fa";

interface BrandFilterProps {
    selectedBrands: number[];
    onBrandChange: (brands: number[]) => void;
}

interface Brand {
    id: number;
    name: string;
}

export default function BrandFilter({ selectedBrands, onBrandChange }: BrandFilterProps) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchBrands()
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await api.get('/brands');
            setBrands(response.data.brands);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    }

    const handleOnChange = (id: number) => {
        if (selectedBrands.includes(id)) {
            onBrandChange(selectedBrands.filter(item => item !== id));
        } else {
            onBrandChange([...selectedBrands, id]);
        }
    }

    return (
        <div className="py-4">
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex justify-between items-center w-full group transition-colors"
            >
                <span className="font-bold text-gray-800 group-hover:text-brand-dark transition-colors">Marcas</span>
                <FaChevronDown
                    className={`text-gray-400 group-hover:text-brand-dark transition-all duration-300 ${open ? "rotate-180" : "rotate-0"
                        }`}
                />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
                <ul className="min-h-0 space-y-3">
                    {brands && brands.map(brand => (
                        <li key={brand.id}>
                            <div className="flex justify-between items-center group cursor-pointer" onClick={() => handleOnChange(brand.id)}>
                                <span className={`text-sm transition-colors ${selectedBrands.includes(brand.id) ? 'text-brand-dark font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    {brand.name}
                                </span>
                                <Checkbox
                                    checked={selectedBrands.includes(brand.id)}
                                    onChange={() => handleOnChange(brand.id)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
