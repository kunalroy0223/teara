import { ReactNode } from "react";
import Link from "next/link";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "ghost" | "text";
    href?: string;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit";
}

export default function Button({
    children,
    variant = "primary",
    href,
    className = "",
    onClick,
    type = "button",
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center transition-all duration-500 text-xs uppercase tracking-[0.2em] font-bold py-4 px-8 min-w-[160px]";

    const variants = {
        primary: "bg-primary text-surface hover:bg-primary-container",
        ghost: "border border-primary text-primary hover:bg-primary hover:text-surface",
        text: "p-0 min-w-0 tracking-[0.1em] text-primary hover:opacity-70",
    };

    const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedStyles}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={combinedStyles}>
            {children}
        </button>
    );
}
