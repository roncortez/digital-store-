export default function Cart() {
    return (
        <div className="min-h-screen bg-gray-50">
            <h1>Detalle</h1>
            <div className="flex flex-col items-center gap-2">
                <label>¿Tienes un cupón de descuento?</label>
                <input className="border border-gray-300 rounded-lg p-2" type="text" placeholder="CUPÓN" />
                <button className="bg-brand-yellow text-brand-dark font-bold p-2 rounded-lg">Aplicar</button>
            </div>
            <div>
                <h2>Resumen</h2>
                <div>
                    <p>Subtotal</p>
                    <p>$0</p>
                </div>
                <div>
                    <p>Descuento</p>
                    <p>$0</p>
                </div>
                <div>
                    <p>Total</p>
                    <p>$0</p>
                </div>
            </div>
            <div>Con esta compra acumulas n puntos</div>
            <div>
                Forma de pago
            </div>
            <button className="bg-brand-yellow text-brand-dark font-bold p-2 rounded-lg">Comprar</button>
        </div>
    );
}