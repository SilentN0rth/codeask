import { SvgIcon } from "@/lib/utils/icons";
import { Button, CardFooter, Link } from "@heroui/react";
import { useSidebarContext } from "context/LeftSidebarContext";

export default function ProfileCardTabs({
    tabs,
}: {
    tabs: { key: string; label: string; href: string; icon: string }[];
}) {
    const { isCompact } = useSidebarContext();

    return (
        tabs.length > 0 && (
            <CardFooter className="grid grid-cols-3 gap-px border-t border-divider bg-cBgDark-900 p-0">
                {tabs.map((tab) => (
                    <Button
                        key={tab.key}
                        as={Link}
                        href={tab.href}
                        variant="light"
                        className="flex gap-1 rounded-none py-6 text-sm hover:bg-cBgDark-800">
                        <SvgIcon
                            icon={tab.icon}
                            className={`hidden text-xl sm:flex ${isCompact ? " " : "!hidden lg:!inline"}`}
                        />
                        {tab.label}
                    </Button>
                ))}
            </CardFooter>
        )
    );
}
