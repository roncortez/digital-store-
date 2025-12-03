import { useState, useEffect } from "react";
import Checkbox from "../ui/Checkbox";

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

    useEffect(() => {
        fetchConditions();
    }, []);

    const fetchConditions = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/conditions');
            // data -> JSON parseado que viene dentro del body
            const data = await response.json();
            console.log(response);
            console.log(data);
            setConditions(data.conditions);
        } catch (error) {
            console.error('Error fetching conditions:', error);
        }

    }

    const [open, setOpen] = useState(false);

    const handleOnChange = (id: number) => {
        if (selectedConditions.includes(id)) {
            onConditionChange(selectedConditions.filter(item => item !== id));
        } else {
            onConditionChange([...selectedConditions, id]);
        }
    }
    console.log(selectedConditions);

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="flex justify-between w-full"
            >
                <span className="font-bold">Condición</span>

                <span
                    className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"
                        }`}
                >
                    ▼
                </span>
            </button>
            {open && (
                <ul className="mt-3">
                    {conditions && conditions.map(condition => (
                        <li key={condition.id}>
                            <div className="flex justify-between">
                                <span className="text-sm">{condition.name}</span>
                                <Checkbox
                                    checked={selectedConditions.includes(condition.id)}
                                    onChange={() => handleOnChange(condition.id)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}