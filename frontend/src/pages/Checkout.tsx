import { useCart } from "../contexts/CartContext";
import QuantitySelector from "../components/marketplace/QuantitySelector";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { HiPencil } from "react-icons/hi2";
import { BsFillEraserFill } from "react-icons/bs";
import { HiSave } from "react-icons/hi";
import { IoCashOutline } from "react-icons/io5";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { BsBank } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import PayButton from "../components/ui/PayButton";
import { createOrder } from '../services/orderService';
import { FaWhatsapp } from "react-icons/fa";
import { api } from "../api/api";
import { Link } from "react-router-dom";

interface User {
    firebase_uid: string;
    first_name: string;
    last_name: string;
    doc_id: string | null;
    email: string;
    phone: string | null;
}

export default function Checkout() {
    const { clearCart, cart, addToCart, decrementQuantity } = useCart();
    const { currentUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);

    // ==================== Estados del Formulario ====================
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [doc_id, setDocId] = useState("");
    const [idType, setIdType] = useState<'cedula' | 'pasaporte'>('cedula');
    const [companyName, setCompanyName] = useState("");
    const [companyRuc, setRuc] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryCity, setDeliveryCity] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [prefixPhone, setPrefixPhone] = useState("+593");


    // ==================== Estados de UI ====================
    const [requiereFactura, setRequiereFactura] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery' | ''>('');
    const [paymentMethod, setPaymentMethod] = useState<'transferencia' | 'tarjeta' | ''>('');
    const [envio, setEnvio] = useState(4.5);
    const [couponStatus, setCouponStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
    const [paymentMethodModal, setPaymentMethodModal] = useState(false);

    // ==================== Estados de Error ====================
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [idError, setIdError] = useState("");
    const [companyNameError, setCompanyNameError] = useState("");
    const [companyRucError, setCompanyRucError] = useState("");
    const [companyAddressError, setCompanyAddressError] = useState("");
    const [deliveryAddressError, setDeliveryAddressError] = useState("");
    const [deliveryCityError, setDeliveryCityError] = useState("");
    const [couponCodeError, setCouponCodeError] = useState("");

    const hasAnyError =
        nameError !== '' ||
        emailError !== '' ||
        phoneError !== '' ||
        idError !== '' ||
        (requiereFactura && (companyNameError !== '' || companyRucError !== '' || companyAddressError !== '')) ||
        (deliveryMethod === 'delivery' && (deliveryAddressError !== '' || deliveryCityError !== ''));

    const isPaymentDisabled = !name || !email || !phone || !doc_id || !deliveryMethod ||
        (requiereFactura && (!companyName || !companyRuc || !companyAddress)) ||
        (deliveryMethod === 'delivery' && (!deliveryAddress || !deliveryCity)) ||
        hasAnyError || cart.length === 0;
    // ==================== Valores Calculados ====================
    const subtotal = cart.reduce((acc, item) => { return acc + (item.price * item.quantity) }, 0);
    const shippingCost = deliveryMethod === 'delivery' ? (subtotal > 100 ? 0 : envio) : 0;
    const discount = 0;
    const total = subtotal - discount + shippingCost;

    // ==================== Efectos ====================

    const getUser = async () => {
        try {
            const response = await api.get(`/users/${currentUser?.uid}`);
            console.log('API Response:', response.data);

            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    useEffect(() => {
        if (currentUser) {
            getUser();
        }
    }, [currentUser]);

    // Inicializar los campos del formulario cuando se carga el usuario
    useEffect(() => {
        if (user) {
            setName(`${user.first_name} ${user.last_name}`);
            setPhone(user.phone ? user.phone.trim().replace(/^\+\d{1,3}\s?/, '') : '');
            setDocId(user.doc_id ? user.doc_id : '');
            setEmail(user.email);
        }
    }, [user]);

    // ==================== Funciones de Utilidad ====================
    const formatNumber = (value: any) => {
        const num = Number(value);
        return num.toFixed(2);
    };

    // ==================== Funciones de Validación ====================
    const validateEcuadorianID = (cedula: string): boolean => {
        if (cedula.length !== 10) return false;
        if (!/^\d+$/.test(cedula)) return false;

        const provincia = parseInt(cedula.substring(0, 2));
        if (provincia < 1 || provincia > 24) return false;

        const tercerDigito = parseInt(cedula.charAt(2));
        if (tercerDigito > 5) return false;

        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let suma = 0;

        for (let i = 0; i < 9; i++) {
            let valor = parseInt(cedula.charAt(i)) * coeficientes[i];
            if (valor >= 10) valor -= 9;
            suma += valor;
        }

        const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
        const ultimoDigito = parseInt(cedula.charAt(9));

        return digitoVerificador === ultimoDigito;
    };

    // ==================== Handlers de Cambio ====================

    const handleDelete = () => {
        setName('');
        setEmail('');
        setPhone('');
        setDocId('');
        setIsEditing(!isEditing);
    }

    const handleNameChange = (value: string) => {
        let formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ -]/g, '');
        setName(formattedValue);

        if (formattedValue.length === 0) {
            setNameError("El nombre es obligatorio");
        } else {
            setNameError("");
        }
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);

        if (value.length === 0) {
            setEmailError("El correo es obligatorio");
        } else if (value.length < 5 || !value.includes("@")) {
            setEmailError("El correo debe ser válido");
        } else {
            setEmailError("");
        }
    };

    const handlePhoneChange = (value: string) => {

        let formattedValue = value.replace(/\D/g, '');

        setPhone(formattedValue);

        if (formattedValue.length < 9) {
            setPhoneError("Número de teléfono inválido");
        } else if (!formattedValue.startsWith('9')) {
            setPhoneError("El número debe empezar con 9");
        }
        else {
            setPhoneError("");
        }
    };

    const handleIdChange = (value: string) => {
        if (idType === 'cedula') {
            let formattedValue = value.replace(/[^0-9]/g, '');
            setDocId(formattedValue);

            if (formattedValue.length === 0) {
                setIdError("La cédula es obligatoria");
            } else if (formattedValue.length < 10) {
                setIdError("La cédula debe tener 10 dígitos");
            } else if (!validateEcuadorianID(formattedValue)) {
                setIdError("Cédula inválida");
            } else {
                setIdError("");
            }
        } else {
            let formattedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            setDocId(formattedValue);

            if (formattedValue.length === 0) {
                setIdError("El pasaporte es obligatorio");
            } else if (formattedValue.length < 6) {
                setIdError("El pasaporte debe tener al menos 6 caracteres");
            } else {
                setIdError("");
            }
        }
    };

    const handleCompanyNameChange = (value: string) => {
        setCompanyName(value);

        if (value.length === 0) {
            setCompanyNameError("La razón social es obligatoria");
        } else {
            setCompanyNameError('');
        }
    }

    const handleRucChange = (value: string) => {
        let formattedValue = value.replace(/[^0-9]/g, '');
        setRuc(formattedValue);

        if (formattedValue.length === 0) {
            setCompanyRucError('El R.U.C es obligatorio');
        } else if (formattedValue.length < 13) {
            setCompanyRucError('El R.U.C debe tener 13 dígitos');
        } else if (!validateEcuadorianID(formattedValue.slice(0, 10))) {
            setCompanyRucError('R.U.C inválido');
        } else if (formattedValue.slice(-3) !== '001') {
            setCompanyRucError('R.U.C inválido');
        } else {
            setCompanyRucError('');
        }
    };


    const handleCompanyAddressChange = (value: string) => {
        setCompanyAddress(value);

        if (value.length === 0) {
            setCompanyAddressError("La dirección es obligatoria");
        } else {
            setCompanyAddressError("");
        }
    };

    const handleDeliveryAddressChange = (value: string) => {
        setDeliveryAddress(value);

        if (value.length === 0) {
            setDeliveryAddressError("La dirección es obligatoria");
        } else {
            setDeliveryAddressError("");
        }
    };

    const handleDeliveryCityChange = (value: string) => {
        setDeliveryCity(value);

        if (value.length === 0) {
            setDeliveryCityError("La ciudad es obligatoria");
        } else {
            setDeliveryCityError("");
        }
    };

    const handleCouponCodeChange = (value: string) => {
        let formattedValue = value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
        setCouponCode(formattedValue);
    };

    const handleApplyCoupon = () => {
        console.log(couponCode);
        setCouponStatus('valid');
    }

    const handleClosePaymentMethodModal = () => {
        setPaymentMethodModal(false);
        setPaymentMethod('');
    }

    const handleProceedToPayment = async () => {
        console.log('Orden creada');
        const orderData = {
            user_id: user?.firebase_uid,
            payment_method: paymentMethod,
            delivery_method: deliveryMethod,
            shipping_cost: shippingCost,
            subtotal: subtotal,
            discount: discount,
            total: total,
            coupon_code: couponCode,
            billing_info: requiereFactura ? {
                companyName,
                companyRuc,
                companyAddress,
            } : null,
            delivery_address: deliveryMethod === 'delivery' ? {
                address: deliveryAddress,
                city: deliveryCity,
            } : null,
        }

        const response = await createOrder(orderData);
        console.log(response);
        setPaymentMethodModal(true);
    }



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
                                                    <QuantitySelector
                                                        className="justify-center"
                                                        quantity={item.quantity}
                                                        onIncrement={() => addToCart({ id: item.id, name: item.name, price: item.price })}
                                                        onDecrement={() => decrementQuantity(item.id)}
                                                    />
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
                        {/* Coupon Section - Moved to Summary Sidebar */}
                        {cart && cart.length > 0 &&
                            <>
                                {/* Datos de entrega */}
                                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-brand-yellow text-brand-dark font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-yellow-500 transition-colors">
                                            1
                                        </span>
                                        <h2 className="text-xl font-bold text-gray-900">Datos de entrega</h2>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-gray-700 font-semibold">Revisa tus datos</h3>
                                                {!isEditing && (
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => setIsEditing(!isEditing)}
                                                            className="btn btn-ghost btn-sm">
                                                            <HiPencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={handleDelete}
                                                            className="btn btn-ghost btn-sm">
                                                            <BsFillEraserFill className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Nombre
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                        placeholder="Ronny Cortez"
                                                        value={name}
                                                        onChange={(e) => handleNameChange(e.target.value)}
                                                        onBlur={() => setName(v => v.replace(/\s+/g, ' ').trim())}
                                                        disabled={!isEditing}
                                                        style={{ textTransform: 'capitalize' }}
                                                    />
                                                    <span className="text-danger text-xs">{nameError}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Identificación
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => { setIdType('cedula'); setDocId(''); setIdError(''); }}
                                                                className={`px-3 py-0.5 rounded text-xs font-medium transition-colors ${idType === 'cedula'
                                                                    ? 'bg-brand-yellow text-brand-dark'
                                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                    }`}
                                                            >
                                                                Cédula
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => { setIdType('pasaporte'); setDocId(''); setIdError(''); }}
                                                                className={`px-3 py-0.5 rounded text-xs font-medium transition-colors ${idType === 'pasaporte'
                                                                    ? 'bg-brand-yellow text-brand-dark'
                                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                    }`}
                                                            >
                                                                Pasaporte
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={doc_id}
                                                        maxLength={idType === 'cedula' ? 10 : 20}
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                        placeholder={idType === 'cedula' ? '1712345678' : 'AB123456'}
                                                        onChange={(e) => handleIdChange(e.target.value)}
                                                        disabled={!isEditing}

                                                    />
                                                    <span className="text-xs text-danger">{idError}</span>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Teléfono
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={prefixPhone}
                                                            disabled={true}
                                                            className="w-20 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                        />
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                            placeholder="XXXXXXXXX"
                                                            maxLength={9}
                                                            value={phone}
                                                            onChange={(e) => handlePhoneChange(e.target.value)}
                                                            disabled={!isEditing}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-danger">{phoneError}</span>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                        placeholder="email"
                                                        value={email}
                                                        onChange={(e) => handleEmailChange(e.target.value)}
                                                        disabled={!isEditing}
                                                    />
                                                    <span className="text-xs text-danger">{emailError}</span>
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        disabled={!name || !doc_id || !phone || !email || nameError !== '' || idError !== '' || phoneError !== '' || emailError !== ''}
                                                        onClick={() => setIsEditing(false)}
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        disabled={!name || !doc_id || !phone || !email || nameError !== '' || idError !== '' || phoneError !== '' || emailError !== ''}
                                                        onClick={() => setIsEditing(false)}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        <HiSave className="w-4 h-4" />
                                                        Guardar
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Datos de facturación */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={requiereFactura}
                                                    onChange={(e) => setRequiereFactura(e.target.checked)}
                                                    className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow border-gray-300 rounded"
                                                />
                                                <label htmlFor="requiereFactura" className="font-medium text-gray-700">
                                                    ¿Deseas factura?
                                                </label>
                                            </div>
                                            {requiereFactura && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Razón social
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                            placeholder="Empresa S.A."
                                                            value={companyName}
                                                            onChange={(e) => handleCompanyNameChange(e.target.value)}
                                                        />
                                                        <span className="text-xs text-danger">{companyNameError}</span>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            R.U.C
                                                        </label>
                                                        <input
                                                            maxLength={13}
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                            placeholder="17123456789001"
                                                            value={companyRuc}
                                                            onChange={(e) => handleRucChange(e.target.value)}
                                                        />
                                                        <span className="text-xs text-danger">{companyRucError}</span>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Dirección
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                            placeholder="Av. 10 de Agosto N23-529 y Mercadillo"
                                                            value={companyAddress}
                                                            onChange={(e) => handleCompanyAddressChange(e.target.value)}
                                                        />
                                                        <span className="text-xs text-danger">{companyAddressError}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Medio de entrega */}
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-gray-700 font-semibold">Medio de entrega</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setDeliveryMethod('pickup')}
                                                className={`btn w-full ${deliveryMethod === 'pickup'
                                                    ? 'btn-primary'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                Coordinar entrega
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setDeliveryMethod('delivery')}
                                                className={`btn w-full ${deliveryMethod === 'delivery'
                                                    ? 'btn-primary'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                Envío
                                            </button>
                                        </div>

                                        {/* Campos adicionales para envío a domicilio */}

                                        {deliveryMethod === 'pickup' && (
                                            <p className="text-sm text-gray-600">
                                                Al finalizar la compra, uno de nuestros asesores
                                                se contactará contigo para coordinar la entrega.
                                            </p>
                                        )}
                                        {deliveryMethod === 'delivery' && (
                                            <div className="flex flex-col gap-4 pt-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Dirección
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                        placeholder="Calle, número, depto/piso"
                                                        value={deliveryAddress}
                                                        onChange={(e) => handleDeliveryAddressChange(e.target.value)}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Ciudad
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                                            placeholder="Quito"
                                                            value={deliveryCity}
                                                            onChange={(e) => handleDeliveryCityChange(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                            </>
                        }
                    </div>

                    {/* Sidebar - Order Summary */}
                    {cart && cart.length > 0 &&
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 flex flex-col gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="bg-brand-yellow text-brand-dark font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-yellow-500 transition-colors">
                                        2
                                    </span>
                                    <h2 className="text-xl font-bold text-gray-900">Resumen</h2>
                                </div>

                                {/* Coupon Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ¿Tienes un cupón de descuento?
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent"
                                            type="text"
                                            maxLength={12}
                                            disabled={couponStatus === 'valid'}
                                            placeholder="Código de cupón"
                                            value={couponCode}
                                            onChange={(e) => handleCouponCodeChange(e.target.value)}
                                        />

                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={couponStatus === 'valid'}
                                            className="btn btn-primary btn-sm">
                                            {couponStatus === 'valid' ? 'Aplicado ✔' : 'Aplicar'}
                                        </button>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold text-gray-900">${formatNumber(subtotal)}</span>
                                    </div>
                                    {deliveryMethod === 'delivery' && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Envío</span>
                                            <span className="font-semibold text-gray-900">
                                                {subtotal > 100 ? (
                                                    <span className="text-green-600">GRATIS</span>
                                                ) : (
                                                    `$${formatNumber(envio)}`
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {couponStatus === 'valid' && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Cupón</span>
                                            <span className="font-semibold text-green-600">-${formatNumber(0)}</span>
                                        </div>
                                    )}
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Descuento</span>
                                            <span className="font-semibold text-green-600">-${formatNumber(discount)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-gray-900">${formatNumber(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rewards Points */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <p className="text-xs text-blue-800 font-medium">
                                            Con esta compra acumulas <span className="text-sm font-bold">{Math.floor(total * 10)}</span> puntos
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h3 className="font-semibold text-gray-900">Forma de pago</h3>
                                    {isPaymentDisabled && (
                                        <span className="text-gray-600 text-sm">Completa los datos de entrega para continuar</span>
                                    )}
                                    <div className="space-y-4 mt-4">
                                        <div className={`border border-gray-300 rounded-lg p-4 px-6 py-3 rounded-lg transition-colors shadow-sm has-[button:disabled]:opacity-50 has-[button:disabled]:bg-white ${paymentMethod === 'tarjeta' && 'bg-brand-yellow text-brand-dark'}`}>
                                            <div className="flex items-center gap-3">
                                                <HiOutlineCreditCard className="w-6 h-6 text-gray-600" />
                                                <div>
                                                    <button
                                                        onClick={() => setPaymentMethod('tarjeta')}
                                                        disabled={isPaymentDisabled}
                                                    >
                                                        Tarjeta de crédito/débito
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`border border-gray-300 rounded-lg p-4 px-6 py-3 rounded-lg transition-colors shadow-sm has-[button:disabled]:opacity-50 has-[button:disabled]:bg-white ${paymentMethod === 'transferencia' && 'bg-brand-yellow text-brand-dark'}`}>
                                            <div className="flex items-center gap-3">
                                                <IoCashOutline className="w-6 h-6 text-gray-600" />
                                                <div>
                                                    <button
                                                        onClick={() => setPaymentMethod('transferencia')}
                                                        disabled={isPaymentDisabled}
                                                    >
                                                        Transferencia bancaria
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {currentUser ? (
                                        <button
                                            className="btn btn-success w-full btn-lg shadow-md hover:shadow-green-600/15"
                                            disabled={cart.length === 0 || isPaymentDisabled || !paymentMethod || !deliveryMethod}
                                            onClick={handleProceedToPayment}
                                        >
                                            Proceder al pago
                                        </button>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="btn btn-primary w-full btn-lg text-xs shadow-md hover:shadow-green-600/15"
                                        >
                                            Inicia sesión para pagar
                                        </Link>
                                    )}


                                    <button
                                        onClick={clearCart}
                                        className="btn btn-ghost w-full"
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
            {paymentMethod === 'tarjeta' && paymentMethodModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="bg-brand-yellow text-brand-dark font-bold px-3 py-1 rounded-full hover:bg-yellow-500 transition-colors whitespace-nowrap">
                                    3
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">Completar el pago</h2>
                            </div>
                            <button onClick={handleClosePaymentMethodModal}><IoMdClose className="w-6 h-6 text-gray-600" /></button>
                        </div>
                        <PayButton
                            amount={Math.round(total * 100)} // Total in cents
                            amountWithTax={Math.round((subtotal / 1.15) * 100)} // Base amount in cents
                            tax={Math.round((subtotal - (subtotal / 1.15)) * 100)} // Tax (15% IVA) in cents
                            userEmail={email}
                            userPhone={prefixPhone + phone}
                            userDocumentId={doc_id}
                            clientTransactionId={`MAITECH-${Date.now()}`}
                            reference={`Compra maitech - ${cart.length} productos`}
                            disabled={
                                !name ||
                                !email ||
                                !phone ||
                                !doc_id ||
                                !deliveryMethod ||
                                cart.length === 0
                            }
                            onSuccess={() => {
                                alert('¡Pago exitoso! Gracias por tu compra.');
                                clearCart();
                            }}
                            onError={(error) => {
                                alert(`Error en el pago: ${error}`);
                            }}
                        />
                    </div>
                </div>
            )}

            {paymentMethod === 'transferencia' && paymentMethodModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="bg-brand-yellow text-brand-dark font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-yellow-500 transition-colors">
                                    3
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">Completar el pago</h2>
                            </div>
                            <button onClick={handleClosePaymentMethodModal}><IoMdClose className="w-6 h-6 text-gray-600" /></button>
                        </div>
                        <div className="mt-5 space-y-4">
                            <p className="text-gray-700 font-medium">Realiza una transferencia de ${total.toFixed(2)} a una de las siguientes cuentas:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BsBank className="w-5 h-5 text-blue-600" />
                                        <h4 className="font-semibold text-gray-900">Banco Pichincha</h4>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cuenta:</span>
                                            <span className="font-medium text-gray-900">2203828035</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nombre:</span>
                                            <span className="font-medium text-gray-900">Maitech</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 mt-2">
                                            <span className="text-gray-600">Referencia:</span>
                                            <span className="font-medium text-gray-900">Compra Maitech</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BsBank className="w-5 h-5 text-red-600" />
                                        <h4 className="font-semibold text-gray-900">Banco del Pacífico</h4>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cuenta:</span>
                                            <span className="font-medium text-gray-900">3301234567</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nombre:</span>
                                            <span className="font-medium text-gray-900">Maitech</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 mt-2">
                                            <span className="text-gray-600">Referencia:</span>
                                            <span className="font-medium text-gray-900">Compra Maitech</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BsBank className="w-5 h-5 text-red-600" />
                                        <h4 className="font-semibold text-gray-900">Banco Produbanco</h4>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Cuenta:</span>
                                            <span className="font-medium text-gray-900">3301234567</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Nombre:</span>
                                            <span className="font-medium text-gray-900">Maitech</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 mt-2">
                                            <span className="text-gray-600">Referencia:</span>
                                            <span className="font-medium text-gray-900">Compra Maitech</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p>Una vez realizada envía tu comprobante vía Whatsapp o correo electrónico y verificaremos el pago.</p>
                            <a
                                className="h-12 w-12 inline-flex items-center justify-center rounded-full bg-green-500 text-white"
                                href="https://wa.me/593979229318?text=Hola%20tengo%20una%20consulta%20sobre%20mi%20compra">
                                <FaWhatsapp className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}