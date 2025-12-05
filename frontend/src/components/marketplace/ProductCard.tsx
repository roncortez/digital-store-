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

    // Si el producto está en el carrito, mostrar la cantidad, si no, mostrar 0
    // El operador ? es para acceder a la propiedad quantity de un objeto que puede ser undefined
    const quantity = cart.find(item => item.id === id)?.quantity || 0;

    return (
        <div className="border border-gray-200 rounded-md flex flex-col h-[450px]">

            {/* Imagen - altura fija */}
            <Link to={`/product/${id}`}>
                <div className="h-[240px] bg-gray-100 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer hover:opacity-90 transition">
                    <span className="text-4xl">img</span>
                </div>
            </Link>

            {/* Contenido con padding */}
            <div className="p-4 flex flex-col flex-1">

                {/* Título con altura fija de 2 líneas */}
                <h3 className="font-semibold text-gray-900 line-clamp-2 h-[3rem] overflow-hidden">
                    {name}
                </h3>

                {/* Descripción con altura fija de 2 líneas */}
                <p className="text-sm text-gray-600 mt-2 line-clamp-2 h-[2.5rem] overflow-hidden">
                    {description}
                </p>

                {/* Precio + botón con altura fija */}
                <div className="mt-auto flex flex-col md:flex-row items-center justify-between md:h-[44px] gap-2">
                    <p className="text-xl font-bold whitespace-nowrap">${price}</p>
                    {quantity === 0 ?
                        (<AddToCartButton onClick={handleAddToCart} />) :
                        (<QuantitySelector quantity={quantity} onIncrement={handleIncrement} onDecrement={handleDecrement} />)
                    }
                </div>

            </div>
        </div>
    );
}