interface QuantitySelectorProps {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    className?: string; // Opcional para agregar clases personalizadas
}

export default function QuantitySelector({ quantity, onIncrement, onDecrement, className = '' }: QuantitySelectorProps) {


    return (
        <div className={`flex items-center justify-between gap-2 bg-gray-50 rounded-xl p-1 ${className}`}>
            <button
                onClick={onDecrement}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-700 font-bold text-lg shadow-sm hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 transition-all duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
            </button>
            <span className="font-bold text-base text-gray-900 min-w-[24px] text-center">
                {quantity}
            </span>
            <button
                onClick={onIncrement}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-yellow border border-brand-yellow text-brand-dark font-bold text-lg shadow-sm hover:bg-yellow-500 hover:border-yellow-500 active:bg-yellow-600 transition-all duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>
    )
}