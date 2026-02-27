// Componente raíz de la aplicación

// Importa los componentes de enrutamiento
import { Route, Routes } from 'react-router-dom';
// Importa el layout principal
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import PaymentResult from './pages/PaymentResult';
import About from './pages/About';
import Services from './pages/Services';
import Sales from './pages/Sales';
import Admin from './pages/Admin';
import { AuthProvider } from './contexts/AuthContext';
import CartProvider from './contexts/CartContext';

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        {/* Define el conjunto de rutas de la aplicación */}
        {/* Se muestra MainLayout con el contenido de cada página */}
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="services" element={<Services />} />
            <Route path="sales" element={<Sales />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment-result" element={<PaymentResult />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </CartProvider>

  );
}

export default App;
