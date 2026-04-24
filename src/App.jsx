import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '14px',
            background: '#fffdf8',
            color: '#000000',
            border: '1px solid rgba(221, 202, 138, 0.28)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12)',
            fontFamily: 'Instrument Sans, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#2e7d32',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#c83d0b',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </CartProvider>
  );
}
