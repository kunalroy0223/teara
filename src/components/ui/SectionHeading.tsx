interface SectionHeadingProps {
    label?: string;
    title: string;
    description?: string;
    centered?: boolean;
    className?: string;
}

export default function SectionHeading({
    label,
    title,
    description,
    centered = false,
    className = "",
}: SectionHeadingProps) {
    return (
        <div className={`${centered ? "text-center mx-auto" : ""} max-w-2xl ${className}`}>
            {label && (
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mb-4 block">
                    {label}
                </span>
            )}
            <h2 className="text-4xl md:text-5xl font-headline mb-6 leading-tight">
                {title}
            </h2>
            {description && (
                <p className="text-on-surface-variant text-lg leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
}
