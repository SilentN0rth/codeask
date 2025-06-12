import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const NavbarLogo = () => {
    const params = useParams();
    const lang = params?.lang || "pl";
    return (
        <div className="flex flex-col gap-1">
            <Image src={"/Logo.svg"} width={220} height={0} alt="Logo CodeASK" />

            <div className="relative h-[15px] w-[220px] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={lang as string}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute">
                        <Image
                            src={lang === "pl" ? "/SubTextPL.svg" : "/SubTextEN.svg"}
                            width={220}
                            height={15}
                            alt="Forum programistyczne"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NavbarLogo;
