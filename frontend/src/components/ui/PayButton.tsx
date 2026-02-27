import { useEffect, useRef, useState, useCallback } from 'react';

// Declare global Payphone type
declare global {
    interface Window {
        PPaymentButtonBox: any;
    }
}

interface PayButtonProps {
    amount: number; // Total amount in cents
    amountWithTax?: number; // Amount with tax in cents
    amountWithoutTax?: number; // Amount without tax in cents
    tax?: number; // Tax amount in cents
    userEmail?: string;
    userPhone?: string;
    userDocumentId?: string;
    clientTransactionId: string;
    reference?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
    disabled?: boolean;
}

export default function PayButton({
    amount,
    amountWithTax = 0,
    amountWithoutTax = 0,
    tax = 0,
    userEmail,
    userPhone,
    userDocumentId,
    clientTransactionId,
    reference = 'Compra maitech',
    onSuccess,
    onError,
    disabled = false
}: PayButtonProps) {
    console.log('🟢 PayButton rendering with:', { disabled, amount, clientTransactionId });

    const isInitialized = useRef(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Start as false so ref can mount

    // Use callback ref instead of useRef
    const setButtonRef = useCallback((node: HTMLDivElement | null) => {
        if (!node || disabled || isInitialized.current) {
            return;
        }

        console.log('✅ Button ref set, initializing Payphone...');

        // Wait for Payphone SDK to load
        const initializePayphone = () => {
            if (typeof window.PPaymentButtonBox === 'undefined') {
                console.log('⏳ Waiting for Payphone SDK...');
                setTimeout(initializePayphone, 100);
                return;
            }

            console.log('✅ Payphone SDK loaded!');

            try {
                const token = import.meta.env.VITE_PAYPHONE_TOKEN || 'YOUR_TOKEN_HERE';

                if (token === 'YOUR_TOKEN_HERE') {
                    const errorMsg = 'Token de Payphone no configurado. Agrega VITE_PAYPHONE_TOKEN en frontend/.env';
                    console.error('❌', errorMsg);
                    setError(errorMsg);
                    setIsLoading(false);
                    return;
                }

                // Validate phone number format
                if (userPhone && userPhone.length < 12) {
                    const errorMsg = `Número de teléfono inválido: "${userPhone}".Debe ser + 593XXXXXXXXX(al menos 12 caracteres)`;
                    console.error('❌', errorMsg);
                    setError(errorMsg);
                    setIsLoading(false);
                    return;
                }

                const config: any = {
                    token,
                    clientTransactionId,
                    amount,
                    currency: 'USD',
                    reference,
                    lang: 'es',
                    defaultMethod: 'card',
                };

                // Add amounts if provided
                if (amountWithoutTax > 0) config.amountWithoutTax = amountWithoutTax;
                if (amountWithTax > 0) config.amountWithTax = amountWithTax;
                if (tax > 0) config.tax = tax;


                // Add user data if provided
                if (userEmail) config.email = userEmail;
                if (userPhone) config.phoneNumber = userPhone;
                if (userDocumentId) {
                    config.documentId = userDocumentId;
                    config.identificationType = 1; // Cédula by default
                }

                // Add store ID if available
                const storeId = import.meta.env.VITE_PAYPHONE_STORE_ID;
                if (storeId) config.storeId = storeId;

                console.log('🔧 Payphone config:', config);

                // Initialize and render the button
                const ppb = new window.PPaymentButtonBox(config);
                ppb.render('pp-button');

                // Handle success/error events
                window.addEventListener('payphone-payment-success', (event: any) => {
                    console.log('✅ Payment success:', event.detail);
                    if (onSuccess) onSuccess();
                });

                window.addEventListener('payphone-payment-error', (event: any) => {
                    console.error('❌ Payment error:', event.detail);
                    if (onError) onError(event.detail.message || 'Error desconocido');
                });

                isInitialized.current = true;
                setIsLoading(false);
                setError(null);

                console.log('✅ Payphone button initialized successfully!');
            } catch (err: any) {
                console.error('Error initializing Payphone:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
                setIsLoading(false);
            }
        };

        initializePayphone();
    }, [disabled, clientTransactionId, amount, reference, userEmail, userPhone, userDocumentId, amountWithoutTax, amountWithTax, tax, onSuccess, onError]);

    // Reset on disabled state change
    useEffect(() => {
        if (disabled) {
            console.log('⛔ PayButton disabled, resetting...');
            isInitialized.current = false;
            setIsLoading(false);
            setError(null);
        }
    }, [disabled]);


    if (disabled) {
        return (
            <div className="w-full p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-semibold text-yellow-800 mb-1">Completa los datos requeridos</p>
                        <p className="text-sm text-yellow-700">
                            Por favor completa todos los campos del formulario (nombre, email, teléfono, documento y método de entrega) antes de proceder al pago.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                    <strong>Error:</strong> {error}
                </p>
                <p className="text-xs text-red-500 mt-1">
                    Revisa la consola del navegador (F12) para más detalles
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full px-4 py-2 bg-gray-100 rounded-lg animate-pulse">
                <p className="text-sm text-gray-500 text-center">Cargando Payphone...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div ref={setButtonRef} id="pp-button"></div>
        </div>
    );
}
