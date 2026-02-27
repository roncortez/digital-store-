export default function Sales() {
    return (
        <div>
            <h1>¿Quieres vender tus productos usados o remanufacturados en nuestra tienda?</h1>
            <p>En Maitech valoramos la calidad y el buen funcionamiento de los productos.
                Por eso, si tienes productos usados o remanufacturados que cumplan con nuestros estándares,
                puedes venderlos en nuestra tienda.</p>

            <p>Llena el formulario y nos pondremos en contacto contigo</p>
            <form>
                <input type="text" placeholder="Nombre" />
                <input type="email" placeholder="Email" />
                <input type="text" placeholder="Producto" />
                <input type="text" placeholder="Descripcion" />
                <input type="text" placeholder="Precio" />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}