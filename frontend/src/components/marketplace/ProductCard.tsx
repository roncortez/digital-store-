import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
    name: string;
    price: number;
    description: string;
}


export default function ProductCard({ name, price, description }: ProductCardProps) {
    return (
        <div className="border border-gray-200 rounded-md">
            {/* Imagen placeholder */}
            <div className="aspect-square bg-gray-100 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-4xl">img</span>
            </div>
            {/* Contenido */}
            <div className="p-4 flex flex-col h-40">
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-yellow 
                       transition-colors line-clamp-2">
                    {name}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2 flex-grow">
                    {description}
                </p>

                <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold mt-2">
                        ${price}
                    </p>
                    <AddToCartButton />
                </div>

            </div>
        </div>
    );
}