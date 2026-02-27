import { useParams, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaArrowLeft, FaShoppingCart, FaBox, FaTag, FaArrowDown } from 'react-icons/fa';
import { IoIosArrowForward, IoMdClose } from "react-icons/io";
import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useCart } from "../contexts/CartContext";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url?: string;
    stock?: number;
    category_name?: string;
    brand_name?: string;
    condition_name?: string;
}

export default function Product() {
    const { cart, addToCart } = useCart();

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
        }
    };

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [drawerType, setDrawerType] = useState<'details' | 'reviews' | null>(null);

    useEffect(() => {
        const getProduct = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/products/${id}`);
                setProduct(response.data.product);
                console.log(response.data.product);
            } catch (error) {
                console.error('Error loading product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }
        getProduct();
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Cargando producto...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
                    <p className="text-gray-600 mb-6">Lo sentimos, no pudimos cargar este producto.</p>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaArrowLeft />
                        Volver al Marketplace
                    </button>
                </div>
            </div>
        );
    }

    const handleWhatsApp = () => {
        const message = `Hola! Estoy interesado en: ${product.name}`;
        const url = `https://wa.me/593979229318?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };
    // Render drawer content based on type
    const renderDrawerContent = () => {
        switch (drawerType) {
            case 'details':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {product?.description}
                            </p>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Especificaciones</h3>
                            <dl className="space-y-2">
                                {product?.brand_name && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <dt className="font-medium text-gray-700">Marca:</dt>
                                        <dd className="text-gray-600">{product.brand_name}</dd>
                                    </div>
                                )}
                                {product?.category_name && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <dt className="font-medium text-gray-700">Categoría:</dt>
                                        <dd className="text-gray-600">{product.category_name}</dd>
                                    </div>
                                )}
                                {product?.condition_name && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <dt className="font-medium text-gray-700">Condición:</dt>
                                        <dd className="text-gray-600">{product.condition_name}</dd>
                                    </div>
                                )}
                                {typeof product?.stock !== 'undefined' && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <dt className="font-medium text-gray-700">Stock disponible:</dt>
                                        <dd className="text-gray-600">{product.stock} unidades</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                );

            case 'reviews':
                return (
                    <div className="space-y-4">
                        <p className="text-gray-500 text-center py-8">
                            Aún no hay reseñas para este producto.
                        </p>
                        <div className="text-center">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Sé el primero en dejar una reseña
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Get drawer title based on type
    const getDrawerTitle = () => {
        switch (drawerType) {
            case 'details':
                return 'Detalles del Producto';
            case 'reviews':
                return 'Reseñas';
            default:
                return '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <FaArrowLeft />
                    <span>Volver</span>
                </button>

                {/* Product content */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex gap-8 p-6 lg:p-10">
                        {/* Left column - Image */}
                        <div className="w-2/3 aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <FaBox className="text-6xl mb-4" />
                                    <p className="text-lg">Imagen no disponible</p>
                                </div>
                            )}
                        </div>

                        {/* Right column - Details */}
                        <div className="flex flex-col justify-between w-1/3">
                            <div>
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {product.category_name && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                            {product.category_name}
                                        </span>
                                    )}
                                    {product.brand_name && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                                            {product.brand_name}
                                        </span>
                                    )}
                                </div>

                                {/* Product name */}
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-gray-900">
                                            ${product.price}
                                        </span>
                                    </div>
                                </div>

                                {product.condition_name && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                        {product.condition_name}
                                    </span>
                                )}
                                {/* Stock */}
                                {typeof product.stock !== 'undefined' && (
                                    <div className="mb-6">
                                        {product.stock > 0 ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <FaTag />
                                                <span className="font-medium">
                                                    {product.stock} unidades disponibles
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-600">
                                                <FaTag />
                                                <span className="font-medium">Agotado</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                        Descripción
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                            </div>

                            {/* Action buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="
                                    w-full flex items-center justify-center gap-3 px-6 py-4 bg-brand-yellow text-brand-dark 
                                    font-bold
                                    border border-brand-yellow 
                                    rounded-lg
                                    transition-all duration-200
                                    px-3 py-1.5 shadow-sm whitespace-nowrap"
                                >
                                    <span>Agregar al carrito</span>
                                </button>
                                <button
                                    onClick={handleWhatsApp}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <FaWhatsapp className="text-xl" />
                                    <span>Consultar por WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    className="w-full flex gap-8 p-6 lg:p-10 border-b border-gray-200 items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setDrawerType('details')}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Detalles
                    </h2>
                    <IoIosArrowForward className="w-[24px] h-[24px]" />
                </button>
                <button
                    className="w-full flex gap-8 p-6 lg:p-10 border-b border-gray-200 items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setDrawerType('reviews')}>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Reseñas
                    </h2>
                    <IoIosArrowForward className="w-[24px] h-[24px]" />
                </button>
            </div>

            {/* Overlay */}
            {drawerType && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={() => setDrawerType(null)}
                />
            )}

            {/* Side Drawer */}
            <div className={`
                fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50
                transform transition-transform duration-300 ease-in-out
                ${drawerType ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {getDrawerTitle()}
                        </h2>
                        <button
                            onClick={() => setDrawerType(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <IoMdClose className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {renderDrawerContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}