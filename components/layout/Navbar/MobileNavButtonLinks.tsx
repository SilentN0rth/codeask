"use client";
import { sectionItems } from "@/constants/SidebarItems";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
const MobileNavButtonLinks = () => {
    const pathname = usePathname();

    return (
        <nav className="md:hidden">
            <ul className="flex flex-col gap-4">
                {sectionItems.flatMap((section) => (
                    <li className={section.className} key={section.key}>
                        <p className="pb-1 pl-1 text-tiny text-foreground-500">{section.title}</p>
                        {section.items?.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Button
                                    key={item.key}
                                    as={Link}
                                    href={item.href}
                                    data-active-link={true}
                                    startContent={
                                        item.icon && (
                                            <span className="flex items-center gap-2.5">
                                                <Icon icon={item.icon} width={22} className={isActive ? "" : ""} />
                                                {item.title}
                                            </span>
                                        )
                                    }
                                    endContent={item.endContent}
                                    fullWidth
                                    variant={isActive ? "flat" : "light"}
                                    color={isActive ? "primary" : "default"}
                                    className={`justify-between ${isActive ? "font-semibold" : ""}`}
                                />
                            );
                        })}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default MobileNavButtonLinks;
