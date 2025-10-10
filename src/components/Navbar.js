"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header style={{ backgroundColor: 'var(--brand)', color: 'var(--background)' }}>
            <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
                {/* Logo on the left */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center" aria-hidden>
                        <span className="font-bold text-white">FJ</span>
                    </div>
                    <span className="font-semibold text-white">FoodJoint</span>
                </div>

                {/* Links on the right (desktop) */}
                <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
                    <li className="hover:underline cursor-pointer">
                        <Link href="/">Home</Link>
                    </li>
                    <li className="hover:underline cursor-pointer">
                        <Link href="/menu">Menu</Link>
                    </li>
                    <li className="hover:underline cursor-pointer">
                        <Link href="/about">About</Link>
                    </li>
                </ul>

                {/* Mobile hamburger */}
                <div className="md:hidden">
                    <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="p-2 rounded-md border border-white/20 text-white">
                        {/* simple hamburger icon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile menu panel */}
            {open && (
                <div className="md:hidden bg-[var(--brand)]/95 text-white">
                    <ul className="flex flex-col p-4 gap-3">
                        <li>
                            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
                        </li>
                        <li>
                            <Link href="/menu" onClick={() => setOpen(false)}>Menu</Link>
                        </li>
                        <li>
                            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}