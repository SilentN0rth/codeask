"use client";
import { sectionItems } from "@/constants/SidebarItems";
import { cn, ScrollShadow, Spacer } from "@heroui/react";
import { useSidebarContext } from "context/LeftSidebarContext";
import { usePathname } from "next/navigation";
import React from "react";
import LeftSidebarAccountSection from "./LeftSidebarAccountSection";
import LeftSidebarContent from "./LeftSidebarContent";
import LeftSidebarUserPopoverCard from "./LeftSidebarUserPopoverCard";

/**
 *  This example requires installing the `usehooks-ts` package:
 * `npm install usehooks-ts`
 *
 * import {useMediaQuery} from "usehooks-ts";
 *
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */
export default function LeftSidebar() {
    const { isCompact, toggleCompact } = useSidebarContext();
    const pathname = usePathname();
    const currentPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;

    const [selectedKey, setSelectedKey] = React.useState(currentPath);

    React.useEffect(() => {
        setSelectedKey(currentPath);
    }, [currentPath]);

    return (
        <nav
            className={cn("sidebar w-[350px] overflow-x-hidden border-divider border-r", {
                "!w-fit !px-0 !pr-4": isCompact,
            })}>
            <LeftSidebarUserPopoverCard isCompact={isCompact} />
            <ScrollShadow className="invisible-scroll -mr-6 h-full max-h-full py-6 pr-6">
                <LeftSidebarContent
                    defaultSelectedKey={"tags"}
                    selectedKeys={[selectedKey]}
                    selectionMode="single"
                    isCompact={isCompact}
                    items={sectionItems}
                />
            </ScrollShadow>
            <Spacer y={2} />
            <LeftSidebarAccountSection toggleCompact={toggleCompact} isCompact={isCompact} />
        </nav>
    );
}
