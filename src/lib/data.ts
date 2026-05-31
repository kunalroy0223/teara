export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    image: string;
    category: string;
    ingredients: string[];
    ritual: string;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    date: string;
    category: string;
}

export const products: Product[] = [
    {
        id: "1",
        name: "Restorative Balm",
        slug: "restorative-balm",
        price: 2499,
        description: "A dense, nutrient-rich botanical salve designed to melt on contact. Formulated to rescue compromised barriers and deeply nourish.",
        image: "/images/brand/product_balm.png",
        category: "Intensive Repair",
        ingredients: ["Sea Buckthorn", "Reishi Mushroom", "Tamanu Oil", "Blue Tansy"],
        ritual: "Warm a pea-sized amount between fingertips. Press gently into face and neck as the final step in your evening ritual.",
    },
    {
        id: "2",
        name: "Botanical Serum",
        slug: "botanical-serum",
        price: 3299,
        description: "Radiance-boosting complex derived from high-altitude resilient flora.",
        image: "/images/brand/product_serum.png",
        category: "Treatment",
        ingredients: ["Edelweiss Extract", "Hyaluronic Acid", "Squalane"],
        ritual: "Apply 2-3 drops after toning.",
    },
    {
        id: "3",
        name: "Balancing Toner",
        slug: "balancing-toner",
        price: 1599,
        description: "Gentle daily tonic to refresh and restore pH balance.",
        image: "/images/brand/discovery.png",
        category: "Essentials",
        ingredients: ["Rose Water", "Witch Hazel", "Aloe Vera"],
        ritual: "Mist onto clean skin.",
    },
    {
        id: "4",
        name: "Moisture Cream",
        slug: "moisture-cream",
        price: 2899,
        description: "Deep hydration with multi-layer barrier support.",
        image: "/images/brand/philosophy.png",
        category: "Essentials",
        ingredients: ["Ceramides", "Squalane", "Centella Asiatica"],
        ritual: "Massage into face and neck morning and evening.",
    },
];

export const articles: Article[] = [
    {
        id: "1",
        title: "The Art of Slow Beauty",
        slug: "art-of-slow-beauty",
        excerpt: "Why conscious simplicity is the key to lasting radiance.",
        image: "/images/brand/rituals.png",
        date: "May 24, 2024",
        category: "Philosophy",
    },
    {
        id: "2",
        title: "High-Altitude Botanicals",
        slug: "high-altitude-botanicals",
        excerpt: "Exploring the resilient flora of the Himalayan peaks.",
        image: "/images/brand/discovery.png",
        date: "June 02, 2024",
        category: "Ingredients",
    },
];
