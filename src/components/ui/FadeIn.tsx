"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
}

export default function FadeIn({
    children,
    delay = 0,
    duration = 0.8,
    direction = "up",
}: FadeInProps) {
    const directions = {
        up: { y: 20, x: 0 },
        down: { y: -20, x: 0 },
        left: { x: 20, y: 0 },
        right: { x: -20, y: 0 },
        none: { x: 0, y: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: duration,
                delay: delay,
                ease: [0.16, 1, 0.3, 1], // Custom slow ease-out for luxury feel
            }}
        >
            {children}
        </motion.div>
    );
}
