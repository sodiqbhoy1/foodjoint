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

    // NOTE: The menu data structure is assumed to be a flat array for this component.
    // In a real-world scenario like the image, the menu would be grouped by category (e.g., 'COMBO DEALS').
    // Since your current data structure is a flat `menu` array, I'll group the displayed items under a single 'COMBO DEALS' heading
    // to match the screenshot's visual appearance.

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
        <Navbar/>

                {/* Full-page loader overlay (kept as is) */}
                {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div role="status" className="p-6 bg-white/90 rounded-lg flex flex-col items-center gap-4">
                            <svg className="w-12 h-12 text-[var(--brand)] animate-spin" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" strokeOpacity="0.2" />
                                <path d="M45 25a20 20 0 00-20-20" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                            </svg>
                            <span className="text-sm text-[var(--foreground)]">Loading menu…</span>
                        </div>
                    </div>
                )}

                {/* Changed max-width and margins to match the left-aligned look of the screenshot */}
                <main className="max-w-4xl mx-auto md:ml-20 px-4 py-8">
                        {/* We will hide the generic "Our Menu" heading to use the custom 'COMBO DEALS' heading */}
                        {/* <h2 className="text-2xl font-bold mb-4 text-[var(--foreground)]">Our Menu</h2> */}

                        {menu?.length === 0 ? (
                                <p className="text-[var(--foreground)]">No menu items found.</p>
                        ) : (
                            <section className="flex flex-col gap-4">
                                {/* CUSTOM HEADING for 'COMBO DEALS' to match the screenshot's style */}
                                <h2 className="text-3xl font-bold mb-4 text-[var(--brand-dark)] border-b-4 border-[var(--brand)] inline-block">COMBO DEALS</h2>

                                <div className="flex flex-col gap-4">
                                    {menu.map((item) => {
                                        // Use _id from MongoDB or fallback
                                        const key = item._id ?? item.id ?? item.name ?? item.title
                                        const title = item.name ?? item.title ?? 'Untitled'
                                        // Use actual description from the item
                                        const description = item.description ?? item.desc ?? 'Delicious food item'
                                        const price = formatPrice(item.price ?? item.cost)
                                        const img = item.image ?? item.imageUrl ?? item.img ?? null
                                        const qty = quantities[key] ?? 1
                                        // Check if item is available based on status
                                        const inStock = item.status !== 'unavailable';

                                        const addToCart = () => {
                                            if (add && inStock) {
                                                add({ 
                                                    key, 
                                                    title, 
                                                    price: item.price ?? item.cost ?? 0,
                                                    image: img
                                                }, qty);
                                            }
                                        }

                                        return (
                                            // The key styling change: remove the border-b, use flex to align children
                                            <article key={key} className="w-full flex items-start py-4 border-b border-gray-200" style={{ color: 'var(--foreground)' }}>
                                                
                                                {/* 1. Left: Image (fixed size 150px) */}
                                                <div className="w-[150px] h-[100px] flex-shrink-0 overflow-hidden rounded-md mr-4">
                                                    {img ? (
                                                        // Using 'cover' to ensure the image fills the space without distortion
                                                        <Image 
                                                            src={img} 
                                                            alt={title} 
                                                            width={150} 
                                                            height={100} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">No Image</div>
                                                    )}
                                                </div>

                                                {/* 2. Center: Title and Description (grows to fill space) */}
                                                <div className="flex-1 min-w-0 mr-4">
                                                    {/* Font changes for the title to be bold, black, and slightly larger */}
                                                    <h3 className="text-lg font-bold text-black mb-1">{title}</h3>
                                                    {/* Styling for the description text */}
                                                    <p className="text-sm text-gray-600 max-w-lg mb-4">{description}</p>
                                                    
                                                    {/* Action button on the left, under the description (visible only in stock) */}
                                                    {inStock ? (
                                                        <button onClick={addToCart} className="text-sm bg-red-600 text-white px-4 py-2 font-semibold hover:bg-red-700 transition-colors" style={{ borderRadius: '4px', cursor: 'pointer' }}>
                                                            Add to Cart
                                                        </button>
                                                    ) : (
                                                        <span className="text-sm bg-gray-400 text-white px-4 py-2 font-semibold rounded-md">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>

                                                {/* 3. Right: Quantity and Price (aligned to the right) */}
                                                {/* Use flex-col and align-end to stack and right-align content */}
                                                <div className="flex flex-col items-end gap-2 pl-4">
                                                    
                                                    {/* Quantity Control (only visible if in stock) */}
                                                    {inStock && (
                                                        <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden bg-white" role="group" aria-label={`Quantity controls for ${title}`}>
                                                            {/* Minus Button */}
                                                            <button 
                                                                onClick={() => changeQty(key, -1)} 
                                                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50" 
                                                                style={{ cursor: 'pointer' }} 
                                                                disabled={qty <= 1}
                                                            >
                                                                <FiMinus size={14} />
                                                            </button>
                                                            {/* Quantity Display */}
                                                            <div className="px-3 py-1 text-center font-medium text-black text-sm border-l border-r border-gray-300">
                                                                {qty}
                                                            </div>
                                                            {/* Plus Button */}
                                                            <button 
                                                                onClick={() => changeQty(key, 1)} 
                                                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors" 
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <FiPlus size={14} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Price Display (styled to match the bold, large, right-aligned look) */}
                                                    <span className="text-xl font-bold text-red-600">{price}</span>
                                                    
                                                    {/* Placeholder for the Add button if not using the one under the description, but we'll use the one under the description */}
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>
                            </section>
                        )}
                </main>

        <CartPanel />

        </>
    )
}