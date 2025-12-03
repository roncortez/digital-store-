import { useState, useEffect } from "react";
import Checkbox from "../ui/Checkbox";

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
            const response = await fetch('http://localhost:3000/api/brands');
            const data = await response.json();
            setBrands(data.brands);
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
        <div>
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="w-full justify-between flex"
            >
                <span className="font-bold">Marcas</span>
                <span
                    className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"
                        }`}
                >
                    ▼
                </span>
            </button>
            {open && (
                <ul className="mt-3">
                    {brands && brands.map(brand => (
                        <li key={brand.id}>
                            <div className="flex justify-between">
                                <span className="text-sm">{brand.name}</span>
                                <Checkbox
                                    checked={selectedBrands.includes(brand.id)}
                                    onChange={() => handleOnChange(brand.id)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}