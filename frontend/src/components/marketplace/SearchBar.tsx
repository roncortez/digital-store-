interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
    return (
        <div className="relative group max-w-3xl mx-auto md:mx-0">
            {/* Icono de búsqueda a la izquierda */}
            <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-brand-yellow">
                <svg
                    className="w-5 h-5 text-gray-400 group-focus-within:text-brand-yellow transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Input */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Buscar productos premium..."}
                className="w-full rounded-2xl pl-12 pr-12 py-4 border border-gray-200 
                   bg-white/80 backdrop-blur-sm shadow-sm
                   focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/10 focus:outline-none 
                   text-gray-900 placeholder-gray-400 font-medium
                   transition-all duration-300 hover:border-gray-300 shadow-xl shadow-brand-dark/5"
            />

            {/* Botón limpiar (solo si hay texto) */}
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 
                     text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-110 active:scale-90"
                >
                    <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}