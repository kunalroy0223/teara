import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <div className="relative aspect-[4/5] bg-surface-container overflow-hidden mb-6">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                    {product.category}
                </p>
                <h3 className="text-xl font-headline mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-on-surface-variant font-medium">
                    ₹{product.price.toLocaleString('en-IN')}
                </p>
            </div>
        </Link>
    );
}
