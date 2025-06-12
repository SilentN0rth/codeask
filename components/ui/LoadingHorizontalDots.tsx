"use client";

import { motion } from "framer-motion";

export default function LoadingHorizontalDots() {
    const dotVariants = {
        pulse: {
            scale: [1, 1.5, 1],
            transition: {
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.div
            animate="pulse"
            transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
            className="flex items-center justify-center gap-4">
            <motion.div variants={dotVariants} className="size-3 rounded-full bg-cCta-500" />
            <motion.div variants={dotVariants} className="size-3 rounded-full bg-cCta-500" />
            <motion.div variants={dotVariants} className="size-3 rounded-full bg-cCta-500" />
        </motion.div>
    );
}
