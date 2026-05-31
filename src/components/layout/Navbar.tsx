"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Philosophy", href: "/philosophy" },
    { name: "Collections", href: "/collections" },
    { name: "Rituals", href: "/rituals" },
    { name: "Journal", href: "/journal" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "py-4 glassmorphism border-b border-outline/10 shadow-sm" : "py-8 bg-transparent"
                }`}
        >
            {/* Top Gradient Overlay for Navbar Visibility */}
            <div className={`absolute inset-x-0 top-0 h-[120%] pointer-events-none transition-opacity duration-700 bg-gradient-to-b from-black/30 via-black/10 to-transparent ${scrolled ? "opacity-0" : "opacity-100"}`} />

            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between relative z-10">
                <Link
                    href="/"
                    className="text-3xl font-headline tracking-tight lowercase hover:opacity-70 transition-opacity"
                >
                    teara
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs uppercase tracking-[0.2em] font-medium hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle Menu"
                >
                    <span className={`w-6 h-px bg-on-surface transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`w-6 h-px bg-on-surface transition-opacity ${isOpen ? "opacity-0" : ""}`} />
                    <span className={`w-6 h-px bg-on-surface transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-surface border-b border-outline/10 p-8 md:hidden shadow-2xl"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-headline hover:text-primary transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
