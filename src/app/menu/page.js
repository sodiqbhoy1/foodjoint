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
                console.log(data.message);                
            }

            setMenu(data.menuItems)

            // initialize quantities to 1 for each item by key
            if (Array.isArray(data.menuItems)) {
                const initial = {}
                data.menuItems.forEach((it) => {
                    const k = it.id ?? it.name ?? it.title
                    if (k != null) initial[k] = 1
                })
                setQuantities(initial)
            }

            console.log(data);
            setLoading(false)
            
        } catch (error) {
            console.log(error);
            setLoading(false)
        }

    }


    const [quantities, setQuantities] = useState({})

    const formatPrice = (p) => {
        if (p == null) return '—'
        const num = Number(p)
        if (Number.isNaN(num)) return String(p)
        return `$${num.toFixed(2)}`
    }

    const changeQty = (key, delta) => {
        setQuantities((q) => {
            const cur = q[key] ?? 1
            const next = Math.max(1, cur + delta)
            return { ...q, [key]: next }
        })
    }

    return (

        <>
        <Navbar/>

                {/* Full-page loader overlay */}
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

                <main className="max-w-4xl ml-8 px-4 py-8">
                        <h2 className="text-2xl font-bold mb-4 text-[var(--foreground)]">Our Menu</h2>

                        {menu?.length === 0 ? (
                                <p className="text-[var(--foreground)]">No menu items found.</p>
                        ) : (
                <section className="flex flex-col gap-8">
                    {menu.map((item) => {
                        const key = item.id ?? item.name ?? item.title
                        const title = item.name ?? item.title ?? 'Untitled'
                        const price = formatPrice(item.price ?? item.cost ?? item.price)
                        const img = item.image ?? item.imageUrl ?? item.img ?? null
                        const qty = quantities[key] ?? 1

                        const addToCart = () => {
                            if (add) {
                                add({ key, title, price }, qty);
                            }
                        }

                        return (
                            <article key={key} className="w-full flex flex-col sm:flex-row items-stretch bg-[var(--white)] border-b border-black last:border-b-0" style={{ color: 'var(--foreground)' }}>
                                {/* Left: image column (if present) */}
                                <div className="w-full sm:w-40 h-40 sm:h-full flex-shrink-0 overflow-hidden">
                                    {img ? (
                                        <Image src={img} alt={title} width={240} height={192} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full" aria-hidden />
                                    )}
                                </div>

                                {/* Right: content */}
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold text-[var(--foreground)]">{title}</h3>
                                            <p className="mt-2 text-sm text-[var(--foreground)]/80 max-w-xl">{item.description ?? item.desc ?? ''}</p>
                                        </div>

                                        {/* Quantity pill */}
                                        <div className="inline-flex items-center bg-white/90 text-[var(--foreground)] rounded-full overflow-hidden" role="group" aria-label={`Quantity controls for ${title}`}>
                                            <button onClick={() => changeQty(key, -1)} className="px-3 py-2 text-[var(--foreground)]" style={{ cursor: 'pointer' }}>
                                                <FiMinus />
                                            </button>
                                            <div className="px-4 py-2 text-center font-medium">{qty}</div>
                                            <button onClick={() => changeQty(key, 1)} className="px-3 py-2 bg-[var(--brand)] text-white" style={{ cursor: 'pointer' }}>
                                                <FiPlus />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <span className="text-2xl font-extrabold text-[var(--brand)]">{price}</span>
                                        <button onClick={addToCart} className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[var(--brand)] text-white px-4 py-2 text-sm" style={{ borderRadius: '6px', cursor: 'pointer' }} aria-label={`Add ${title} to cart`}>
                                            <FiShoppingCart />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </section>
            )}
        </main>

        <CartPanel />

        </>
    )
}