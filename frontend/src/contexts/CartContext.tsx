//src/contexts/CartContext.ts
import { createContext, useContext, useState } from "react";

// Crea un contexto global
// Sirve para compartir datos entre varios componentes sin necesidad de pasar props manualmente

// Define el tipo de los items del carrito
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

// Define el tipo del contexto
interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    decrementQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
};

// Crea el contexto
const CartContext = createContext<CartContextType | null>(null);

// Define el tipo de las props del provider que envuelve la aplicación
// children es el contenido que se va a renderizar dentro del provider
interface CartProviderProps {
    children: React.ReactNode;
}

export default function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Función para agregar un item al carrito
    // Recibe un item sin la propiedad quantity y una cantidad opcional
    const addToCart = (item: Omit<CartItem, "quantity">, quantity?: number) => {

        const existingItem = cart.find(p => p.id === item.id);

        if (existingItem) {
            setCart(prevCart => prevCart.map(item => item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item));
            return;
        }
        setCart(prevCart => [...prevCart, { ...item, quantity: quantity || 1 }]);


        console.log(cart);
    };

    const decrementQuantity = (id: number) => {
        setCart(prevCart => prevCart
            .map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
            .filter(item => item.quantity > 0));
    }

    const removeFromCart = (id: number) => {
        // Actualizado el estado usando el estado anterior (prevCart)
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, decrementQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
};

// Hook para usar el carrito en cualquier componente
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}




