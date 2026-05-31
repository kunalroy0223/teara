import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { products } from "@/lib/data";

export default function CollectionPage() {
    return (
        <main>
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <SectionHeading
                            label="The Collection"
                            title="Formulas for modern ritual."
                            description="A curated selection of high-performance botanical essentials, crafted with care for your daily wellbeing."
                            className="mb-12"
                        />

                        {/* Simple Category Filter */}
                        <div className="flex gap-8 border-b border-outline/10 pb-6 mb-16 overflow-x-auto no-scrollbar">
                            <button className="text-[10px] uppercase tracking-widest font-bold text-primary border-b border-primary pb-6 -mb-[25px]">
                                All Products
                            </button>
                            <button className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors pb-6">
                                Essentials
                            </button>
                            <button className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors pb-6">
                                Intensive Repair
                            </button>
                            <button className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary transition-colors pb-6">
                                Treatments
                            </button>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {products.map((product, i) => (
                            <FadeIn key={product.id} delay={0.1 * (i % 3)}>
                                <ProductCard product={product} />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
