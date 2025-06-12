"use client";

import { useDisclosure } from "@heroui/react";
import HamburgerMenu from "./HamburgerMenu";
import HamburgerMenuBtn from "./HamburgerMenuBtn";
import NavbarLogo from "./NavbarLogo";

export default function Navbar() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <nav className="fixed inset-x-0 z-50 flex items-center justify-between gap-6 bg-cBgDark-800 px-6 py-4 text-background shadow-md backdrop-blur-sm">
            {/* Logo + Subtext */}
            <NavbarLogo />
            {/* Hamburger Menu */}
            <HamburgerMenuBtn onOpen={onOpen} />
            <HamburgerMenu isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
        </nav>
    );
}
