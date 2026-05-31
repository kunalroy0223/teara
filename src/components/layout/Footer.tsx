import Link from "next/link";

const footerSections = [
    {
        title: "Shop",
        links: [
            { name: "Natural Oils", href: "/collections#oils" },
            { name: "Sustainable Packaging", href: "/collections#packaging" },
            { name: "Wellness Kits", href: "/collections#kits" },
            { name: "Limited Edition", href: "/collections#limited" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "Our Story", href: "/philosophy" },
            { name: "Sustainability", href: "/sustainability" },
            { name: "Journal", href: "/journal" },
            { name: "Contact", href: "/contact" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-surface-container border-t border-outline/5 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div>
                        <h2 className="text-3xl font-headline mb-6 lowercase">teara</h2>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-6 max-w-xs">
                            Refining nature&apos;s finest wellness secrets from the Himalayan peaks for a sustainable global future.
                        </p>
                    </div>

                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-on-surface">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-on-surface">
                            Newsletter
                        </h4>
                        <p className="text-sm text-on-surface-variant mb-6">
                            Join our journal for quiet reflections on self-care.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-transparent border-b border-outline/20 py-2 text-sm focus:outline-none focus:border-primary transition-colors flex-1"
                            />
                            <button
                                type="submit"
                                className="text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-outline/5">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                        © 2024 Teara Skincare. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/legal" className="text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary">
                            Legal
                        </Link>
                        <Link href="/privacy" className="text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary">
                            Privacy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
