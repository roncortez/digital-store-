import { useState, useEffect } from "react";
import Checkbox from "../ui/Checkbox";
import { api } from "../../api/api";
import { FaChevronDown } from "react-icons/fa";

interface ConditionFilterProps {
    selectedConditions: number[];
    onConditionChange: (conditions: number[]) => void;
}

interface Condition {
    id: number;
    name: string;
}

export default function ConditionFilter({ selectedConditions, onConditionChange }: ConditionFilterProps) {
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchConditions();
    }, []);

    const fetchConditions = async () => {
        try {
            const response = await api.get('/conditions');
            setConditions(response.data.conditions);
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }
    }

    const handleOnChange = (id: number) => {
        if (selectedConditions.includes(id)) {
            onConditionChange(selectedConditions.filter(item => item !== id));
        } else {
            onConditionChange([...selectedConditions, id]);
        }
    }

    return (
        <div className="py-4">
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex justify-between items-center w-full group transition-colors"
            >
                <span className="font-bold text-gray-800 group-hover:text-brand-dark transition-colors">Condición</span>
                <FaChevronDown
                    className={`text-gray-400 group-hover:text-brand-dark transition-all duration-300 ${open ? "rotate-180" : "rotate-0"
                        }`}
                />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 overflow-hidden"}`}>
                <ul className="min-h-0 space-y-3">
                    {conditions && conditions.map(condition => (
                        <li key={condition.id}>
                            <div className="flex justify-between items-center group cursor-pointer" onClick={() => handleOnChange(condition.id)}>
                                <span className={`text-sm transition-colors ${selectedConditions.includes(condition.id) ? 'text-brand-dark font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    {condition.name}
                                </span>
                                <Checkbox
                                    checked={selectedConditions.includes(condition.id)}
                                    onChange={() => handleOnChange(condition.id)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
