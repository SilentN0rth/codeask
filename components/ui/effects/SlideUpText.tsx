"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SlideUpTextProps } from "@/types/components.types";

const SlideUpText = ({ children, duration = 0.4, delay = 0.3, distance = 20, className = "" }: SlideUpTextProps) => {
    return (
        <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: distance, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration, delay, ease: "easeIn" }}
            className={className}>
            {children}
        </motion.span>
    );
};

export default SlideUpText;
