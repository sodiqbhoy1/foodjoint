
import "./globals.css";
import { CartProvider } from '@/context/cart';

export const metadata = {
  title: "Food Joint",
  description: "Your spot to enjoy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
