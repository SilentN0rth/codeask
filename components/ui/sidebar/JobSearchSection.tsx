"use client";

import { Card, CardBody, Button } from "@heroui/react";
import { motion } from "framer-motion";
import React, { useState } from "react";

const AnimatedWaveFill = ({ isHovered }: { isHovered: boolean }) => (
    <motion.div
        initial={{ height: 0 }}
        animate={isHovered ? { height: "200%" } : { height: 0 }}
        transition={{
            duration: 1,
            ease: "easeInOut",
        }}
        className="absolute  bottom-0 left-0 z-0 hidden w-full rounded-lg can-hover:flex">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 left-0 h-full w-[200%]">
            <path
                fill="currentColor"
                d="M0,160L60,154.7C120,149,240,139,360,138.7C480,139,600,149,720,144C840,139,960,117,1080,106.7C1200,96,1320,96,1380,96L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                className="text-cCta-500"
            />
        </svg>
    </motion.div>
);

const JobSearchSection = () => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="relative h-[210px]">
            {/* Karta i zawartość */}
            <Card
                className="relative overflow-hidden bg-cBgDark-800 transition-all duration-300"
                shadow="sm"
                style={{ height: "100%" }}>
                <CardBody
                    className="relative flex flex-col items-center justify-center overflow-hidden py-4 text-center"
                    style={{ height: "100%" }}>
                    <h2 className=" z-10 flex items-center justify-center gap-2 text-medium font-medium text-cTextDark-100">
                        Szukaj pracy
                    </h2>
                    <p className="z-10 p-4 text-small text-default-600">
                        Przeglądaj oferty pracy dla developerów. Znajdź idealną rolę dopasowaną do Twoich umiejętności i
                        doświadczenia - od juniora po seniora, zdalnie lub stacjonarnie.
                    </p>
                    <AnimatedWaveFill isHovered={hovered} />
                </CardBody>
            </Card>

            {/* Główny przycisk */}
            <Button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                data-hover={false}
                className="absolute inset-x-1/2 -bottom-5 mx-auto w-fit -translate-x-1/2 overflow-hidden border-2 border-cCta-700 bg-cCta-500 px-10 text-white shadow-sm shadow-cCta-900 can-hover:hover:border-default-50 can-hover:hover:bg-cBgDark-800 can-hover:hover:shadow-default-50"
                radius="lg"
                variant="shadow">
                Przeglądaj oferty
            </Button>
        </div>
    );
};

export default JobSearchSection;
