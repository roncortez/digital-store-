export default function AddToCartButton() {
    return (
        <button
            className="group flex items-center gap-2 bg-brand-yellow text-brand-dark 
            font-bold text-sm
            border border-brand-yellow 
            rounded-lg
            transition-all duration-200
            px-4 py-2 shadow-sm"
            aria-label="Agregar al carrito"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 transition-transform group-hover:rotate-90"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Agregar</span>
        </button>
    )
}