interface AddToCartButtonProps {
    onClick: () => void;
}

export default function AddToCartButton({ onClick }: AddToCartButtonProps) {
    return (
        <button
            onClick={onClick}
            className="group flex items-center gap-1.5 bg-brand-yellow text-brand-dark 
            font-bold text-xs
            border border-brand-yellow 
            rounded-lg
            transition-all duration-200
            px-3 py-1.5 shadow-sm whitespace-nowrap"
            aria-label="Agregar al carrito"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3.5 h-3.5 transition-transform group-hover:rotate-90"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Agregar</span>
        </button>
    )
}