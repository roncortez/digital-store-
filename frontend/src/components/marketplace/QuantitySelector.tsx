interface QuantitySelectorProps {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    className?: string; // Opcional para agregar clases personalizadas
}

export default function QuantitySelector({ quantity, onIncrement, onDecrement, className = '' }: QuantitySelectorProps) {


    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={onDecrement}
                className="border border-gray-300 text-gray-700 font-bold text-xs rounded-full transition-all duration-200 px-3 py-1.5 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
            >
                -
            </button>
            <span className="font-semibold text-base w-4 text-center text-gray-900">
                {quantity}
            </span>
            <button
                onClick={onIncrement}
                className="border border-gray-300 text-gray-700 font-bold text-xs rounded-full transition-all duration-200 px-3 py-1.5 hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
            >
                +
            </button>
        </div>
    )
}