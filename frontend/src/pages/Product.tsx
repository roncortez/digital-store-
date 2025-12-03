import { useParams } from 'react-router-dom';


// Recibe el id del producto desde la URL
export default function Product() {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen bg-gray-50">
            <h1>Product {id}</h1>
        </div>
    );
}