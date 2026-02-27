import AddToCartButton from "./AddToCartButton";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import QuantitySelector from "./QuantitySelector";

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    description: string;
}


export default function ProductCard({ id, name, price, description }: ProductCardProps) {
    const { cart, addToCart, decrementQuantity } = useCart();

    const handleAddToCart = () => {
        addToCart({ id, name, price });
    }

    const handleIncrement = () => {
        addToCart({ id, name, price });
    }

    const handleDecrement = () => {
        decrementQuantity(id);
    }

    const quantity = cart.find(item => item.id === id)?.quantity ?? 0;

    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-brand-dark/5 border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full active:scale-[0.98]">

            {/* Imagen con badge de condición */}
            <div className="relative h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                <Link to={`/product/${id}`} className="w-full h-full">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/50 group-hover:scale-110 transition-transform duration-700 ease-out">
                        <span className="text-5xl text-gray-200 font-bold tracking-widest opacity-40 group-hover:opacity-60 transition-opacity">IMAGE</span>
                    </div>
                </Link>

            </div>

            {/* Contenido con padding */}
            <div className="p-4 flex flex-col flex-1">

                {/* Título - hasta 3 líneas */}
                <h3 className="font-semibold text-gray-900 line-clamp-3 text-base leading-tight">
                    {name}
                </h3>

                {/* Descripción - hasta 2 líneas */}
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {description}
                </p>

                {/* Rating estrellas */}
                <div className="flex items-center gap-1.5 mt-3">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < 4 ? 'text-brand-yellow shadow-sm' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">4.8 (124 reseñas)</span>
                </div>

                {/* Precio con diseño mejorado */}
                <div className="mt-auto flex flex-col gap-4 pt-3">
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">
                            ${price ? price.toLocaleString('es-ES') : '0'}
                        </p>
                        {price && (
                            <p className="text-sm text-gray-400 line-through">
                                ${(price * 1.15).toLocaleString('es-ES')}
                            </p>
                        )}
                    </div>

                    {quantity === 0 ?
                        (<AddToCartButton onClick={handleAddToCart} />) :
                        (<QuantitySelector quantity={quantity} onIncrement={handleIncrement} onDecrement={handleDecrement} />)
                    }
                </div>

            </div>
        </div>
    );
}