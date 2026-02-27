import { FaShoppingCart } from "react-icons/fa";

interface AddToCartButtonProps {
    onClick: () => void;
}

export default function AddToCartButton({ onClick }: AddToCartButtonProps) {
    return (
        <button
            onClick={onClick}
            className="btn btn-primary btn-sm group w-full shadow-md hover:shadow-brand-yellow/15"
            aria-label="Agregar al carrito"
        >
            <FaShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Agregar</span>
        </button>
    )
}