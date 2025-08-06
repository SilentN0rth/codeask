"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
    const circleVariants = {
        rotate: {
            rotate: 360,
            transition: {
                repeat: Infinity,
                duration: 0.6,
                ease: "linear",
            },
        },
    };

    const segmentStyle = {
        fill: "none",
        strokeWidth: 4,
        strokeLinecap: "round" as const,
        strokeDasharray: "80 120",
        strokeDashoffset: 0,
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.9)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}>
            <motion.svg width="64" height="64" viewBox="0 0 64 64" variants={circleVariants} animate="rotate">
                <circle cx="32" cy="32" r="28" style={segmentStyle} className="stroke-cCta-500" />
            </motion.svg>
        </div>
    );
}
