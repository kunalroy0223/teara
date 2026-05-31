import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { products } from "@/lib/data";

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = products.find((p) => p.slug === slug);

    if (!product) {
        notFound();
    }

    const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

    return (
        <main>
            <Navbar />

            <section className="pt-32 pb-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
                    {/* Image Gallery */}
                    <FadeIn direction="left">
                        <div className="aspect-[4/5] relative bg-surface-container overflow-hidden rounded-sm">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </FadeIn>

                    {/* Product Info */}
                    <div className="lg:sticky lg:top-32">
                        <FadeIn direction="right" delay={0.2}>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-4">
                                {product.category}
                            </p>
                            <h1 className="text-5xl md:text-7xl font-headline mb-6 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-medium mb-10 text-on-surface">
                                ${product.price}
                            </p>
                            <p className="text-on-surface-variant text-lg leading-relaxed mb-12 max-w-lg">
                                {product.description}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-16">
                                <Button className="flex-1">Add to Ritual — ${product.price}</Button>
                                <Button variant="ghost">Find in Store</Button>
                            </div>

                            {/* Product Details Accrodion (Simplified) */}
                            <div className="space-y-8 border-t border-outline/10 pt-12 text-sm uppercase tracking-widest font-bold">
                                <div className="group">
                                    <div className="flex justify-between items-center mb-4 cursor-pointer">
                                        <span>The Ritual</span>
                                        <span className="text-xl">+</span>
                                    </div>
                                    <p className="normal-case font-normal text-on-surface-variant leading-relaxed tracking-normal hidden group-hover:block pb-4 animate-in fade-in duration-500">
                                        {product.ritual}
                                    </p>
                                </div>
                                <div className="group">
                                    <div className="flex justify-between items-center mb-4 cursor-pointer border-t border-outline/10 pt-8">
                                        <span>Botanical Actives</span>
                                        <span className="text-xl">+</span>
                                    </div>
                                    <div className="hidden group-hover:block pb-4 animate-in fade-in duration-500">
                                        <ul className="normal-case font-normal text-on-surface-variant leading-relaxed tracking-normal space-y-2 list-disc list-inside">
                                            {product.ingredients.map((ing) => (
                                                <li key={ing}>{ing}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Ingredient Spotlight */}
            <section className="py-section-gap bg-surface-container">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <FadeIn>
                        <SectionHeading
                            centered
                            label="Ingredients"
                            title="Honest botanicals."
                            description="A formulation focused on the resilience of sea buckthorn and reishi mushrooms. Sustainably sourced, ethically harvested."
                        />
                    </FadeIn>
                </div>
            </section>

            {/* Cross-Sell */}
            <section className="py-section-gap px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <SectionHeading
                            title="Complete the Ritual"
                            className="mb-12"
                        />
                    </FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedProducts.map((p, i) => (
                            <FadeIn key={p.id} delay={0.1 * i}>
                                <ProductCard product={p} />
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
