import { useCart } from "../contexts/CartContext";

export default function Checkout() {
    const { clearCart, cart } = useCart();

    const subtotal = cart.reduce((acc, item) => { return acc + (item.price * item.quantity) }, 0);
    const descuento = subtotal * 0.1;
    const total = subtotal - descuento;

    const formatNumber = (value: any) => {
        const num = Number(value);
        return num.toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 mt-2">Revisa tu pedido y completa la compra</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Cart Items */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Cart Items Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-gray-100 px-6 py-4">
                                <div className="grid grid-cols-4 gap-4 font-bold text-sm text-gray-700">
                                    <div>Producto</div>
                                    <div className="text-center">Precio</div>
                                    <div className="text-center">Cantidad</div>
                                    <div className="text-right">Total</div>
                                </div>
                            </div>

                            {/* Cart Items */}
                            <div className="divide-y divide-gray-200">
                                {cart && cart.length > 0 ? (
                                    cart.map(item => (
                                        <div className="px-6 py-4 hover:bg-gray-50 transition-colors" key={item.id}>
                                            <div className="grid grid-cols-4 gap-4 items-center">
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                <div className="text-center text-gray-600">${formatNumber(item.price)}</div>
                                                <div className="text-center">
                                                    <span className="inline-flex items-center justify-center bg-gray-100 text-gray-800 font-semibold px-3 py-1 rounded-full text-sm">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div className="text-right font-semibold text-gray-900">
                                                    ${formatNumber(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-12 text-center text-gray-500">
                                        <p className="text-lg">Tu carrito está vacío</p>
                                        <p className="text-sm mt-2">Agrega productos desde el marketplace</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Coupon Section */}
                        {cart && cart.length > 0 &&
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="font-semibold text-lg text-gray-900 mb-4">¿Tienes un cupón?</h3>
                                <div className="flex gap-3">
                                    <input
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                        type="text"
                                        placeholder="Ingresa tu cupón"
                                    />
                                    <button className="bg-brand-yellow text-brand-dark font-bold px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors whitespace-nowrap">
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        }
                    </div>

                    {/* Sidebar - Order Summary */}
                    {cart && cart.length > 0 &&
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h2>

                                {/* Price Breakdown */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-900">${formatNumber(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Descuento</span>
                                        <span className="font-semibold text-green-600">-${formatNumber(descuento)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-gray-900">${formatNumber(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rewards Points */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <p className="text-sm text-blue-800 font-medium">
                                            Con esta compra acumulas <span className="font-bold">{Math.floor(total * 10)}</span> puntos
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Forma de pago</h3>
                                    <div className="border border-gray-300 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <div>
                                                <p className="font-medium text-gray-900">Tarjeta de crédito/débito</p>
                                                <p className="text-sm text-gray-500">Pago seguro</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        className="w-full bg-brand-yellow text-brand-dark font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors shadow-md"
                                        disabled={cart.length === 0}
                                    >
                                        Proceder al pago
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        className="w-full bg-white text-red-600 font-medium py-2 rounded-lg border border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={cart.length === 0}
                                    >
                                        Vaciar carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}