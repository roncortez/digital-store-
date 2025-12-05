interface QuantitySelectorProps {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

export default function QuantitySelector({ quantity, onIncrement, onDecrement }: QuantitySelectorProps) {


    return (
        <div className="flex items-center gap-2">
            <button onClick={onDecrement} className="bg-brand-yellow text-brand-dark font-bold text-xs border border-brand-yellow rounded-full transition-all duration-200 px-3 py-1.5 shadow-sm whitespace-nowrap">-</button>
            <span className="font-semibold text-base w-4 text-center">
                {quantity}
            </span>
            <button onClick={onIncrement} className="bg-brand-yellow text-brand-dark font-bold text-xs border border-brand-yellow rounded-full transition-all duration-200 px-3 py-1.5 shadow-sm whitespace-nowrap">+</button>
        </div>
    )
}