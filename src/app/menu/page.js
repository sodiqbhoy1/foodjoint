"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';
import Image from 'next/image';
import CartPanel from '@/components/CartPanel';
import { useCart } from '@/context/cart';

export default function Menu(){
    const [menu, setMenu] = useState([])
    const [loading, setLoading] = useState(true)
    const { add } = useCart();

    useEffect(()=>{
        fetchMenu()
    },[])

    const fetchMenu = async ()=>{

        try {
            const res = await fetch("/api/public/menu")
            const data = await res.json()
            if(!res.ok){
                // Handle error silently in production
            }

            // Updated to use the correct property from our API response
            setMenu(data.items || [])

            // initialize quantities to 1 for each item by key
            if (Array.isArray(data.items)) {
                const initial = {}
                data.items.forEach((it) => {
                    // Use _id from MongoDB or fallback to name
                    const k = it._id ?? it.id ?? it.name ?? it.title
                    if (k != null) initial[k] = 1
                })
                setQuantities(initial)
            }

            setLoading(false)
            
        } catch (error) {
            setLoading(false)
        }

    }
    const [quantities, setQuantities] = useState({})

    const formatPrice = (p) => {
        if (p == null) return '—'
        const num = Number(p)
        // The screenshot uses Naira sign, but your current formatting uses a simple '#'
        // I will keep your current `#` but make the formatting consistent with the screenshot's whole number display (no .00)
        // You can use Intl.NumberFormat for a real currency
        if (Number.isNaN(num)) return String(p)
        return `₦${Math.round(num).toLocaleString('en-US')}` // Assuming Naira symbol ₦ and rounding to whole number
    }

    const changeQty = (key, delta) => {
        setQuantities((q) => {
            const cur = q[key] ?? 1
            const next = Math.max(1, cur + delta)
            return { ...q, [key]: next }
        })
    }
    
    // Simulating the "Out of Stock" status for demonstration
    // Replace this with a check against your actual `item` data if available (e.g., `item.inStock`)
    const isItemInStock = (item) => {
        // For demonstration, let's assume the item is in stock unless it has a specific flag.
        // In the image, 'Beefy Rice & Breaded Chicken' is out of stock.
        // You'll need to adjust this logic based on your actual data.
        return item.name !== 'Beefy Rice & Breaded Chicken'
    }

    return (

<>
  <Navbar />

  {/* Full-page loader overlay (unchanged) */}
  {loading && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div role="status" className="p-6 bg-white/90 rounded-lg flex flex-col items-center gap-4">
        <svg
          className="w-12 h-12 text-[var(--brand)] animate-spin"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" strokeOpacity="0.2" />
          <path d="M45 25a20 20 0 00-20-20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <span className="text-sm text-[var(--foreground)]">Loading menu…</span>
      </div>
    </div>
  )}

  {/* Main section with simpler card layout */}
  <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6">
    {menu?.length === 0 ? (
      <p className="text-gray-600 text-center">No menu items found.</p>
    ) : (
      <section>
        {/* Simple heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Our Menu
        </h2>

        {/* Single column layout for horizontal cards */}
        <div className="flex flex-col gap-4">
          {menu.map((item) => {
            const key = item._id ?? item.id ?? item.name ?? item.title;
            const title = item.name ?? item.title ?? "Untitled";
            const description = item.description ?? item.desc ?? "Delicious food item";
            const price = formatPrice(item.price ?? item.cost);
            const img = item.image ?? item.imageUrl ?? item.img ?? null;
            const qty = quantities[key] ?? 1;
            const inStock = item.status !== "unavailable";

            const addToCart = () => {
              if (add && inStock) {
                add(
                  {
                    key,
                    title,
                    price: item.price ?? item.cost ?? 0,
                    image: img,
                  },
                  qty
                );
              }
            };

            return (
              <article
                key={key}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-row"
              >
                {/* Image section on the left - fixed width */}
                <div className="relative w-32 sm:w-40 h-32 sm:h-36 flex-shrink-0">
                  {img ? (
                    <Image
                      src={img}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                  {!inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Content section on the right - flexible */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>

                    {/* Description */}
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{description}</p>
                  </div>

                  {/* Price and controls at bottom */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-red-600">{price}</span>

                    {inStock && (
                      <div className="flex items-center gap-2">
                        {/* Quantity Control - compact */}
                        <div
                          className="flex items-center border border-gray-300 rounded"
                          role="group"
                          aria-label={`Quantity controls for ${title}`}
                        >
                          <button
                            onClick={() => changeQty(key, -1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            disabled={qty <= 1}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium text-gray-900 border-x border-gray-300">
                            {qty}
                          </span>
                          <button
                            onClick={() => changeQty(key, 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        {/* Add to Cart Button - icon only on mobile, text on larger screens */}
                        <button
                          onClick={addToCart}
                          aria-label={`Add ${title} to cart`}
                          className="bg-red-600 text-white px-2 py-2 sm:px-3 rounded hover:bg-red-700 flex items-center gap-1"
                        >
                          <FiShoppingCart size={16} />
                          <span className="hidden sm:inline text-sm">Add</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    )}
  </main>

  <CartPanel />
</>
    )
}