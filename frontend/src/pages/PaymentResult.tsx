import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    const status = searchParams.get('status');
    const transactionId = searchParams.get('transactionId');
    const amount = searchParams.get('amount');
    const authCode = searchParams.get('authCode');
    const reference = searchParams.get('reference');
    const message = searchParams.get('message');

    const isSuccess = status === 'success';
    const isCancelled = status === 'cancelled';
    const isError = status === 'error';

    useEffect(() => {
        // Countdown redirect
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Success */}
                {isSuccess && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
                        <p className="text-gray-600 mb-6">Tu pago ha sido procesado correctamente</p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-left">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Monto:</span>
                                <span className="font-semibold">${amount} USD</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">ID Transacción:</span>
                                <span className="font-mono text-sm">{transactionId}</span>
                            </div>
                            {authCode && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Código Autorización:</span>
                                    <span className="font-mono text-sm">{authCode}</span>
                                </div>
                            )}
                            {reference && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Referencia:</span>
                                    <span className="text-sm">{reference}</span>
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            Redirigiendo en {countdown} segundos...
                        </p>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-brand-yellow hover:bg-yellow-500 text-brand-dark font-semibold py-3 rounded-lg transition-colors"
                        >
                            Volver al inicio
                        </button>
                    </div>
                )}

                {/* Cancelled */}
                {isCancelled && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago Cancelado</h1>
                        <p className="text-gray-600 mb-6">Has cancelado el proceso de pago</p>

                        {transactionId && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ID Transacción:</span>
                                    <span className="font-mono text-sm">{transactionId}</span>
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mb-4">
                            Redirigiendo en {countdown} segundos...
                        </p>

                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-brand-yellow hover:bg-yellow-500 text-brand-dark font-semibold py-3 rounded-lg transition-colors"
                            >
                                Reintentar pago
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error en el Pago</h1>
                        <p className="text-gray-600 mb-6">
                            {message || 'Ocurrió un error al procesar tu pago'}
                        </p>

                        <p className="text-sm text-gray-500 mb-4">
                            Redirigiendo en {countdown} segundos...
                        </p>

                        <div className="space-y-2">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-brand-yellow hover:bg-yellow-500 text-brand-dark font-semibold py-3 rounded-lg transition-colors"
                            >
                                Reintentar pago
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
