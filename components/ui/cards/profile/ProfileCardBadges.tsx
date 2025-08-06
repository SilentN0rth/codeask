import { Tooltip } from "@heroui/react";
import { UserInterface } from "@/types/users.types";
import { SvgIcon } from "@/lib/utils/icons";
import Divider from "../../Divider";

export default function ProfileCardBadges({ user, className }: { user: UserInterface | null; className?: string }) {
    const badges = user?.badges;
    if (!badges || (!badges.gold && !badges.silver && !badges.bronze)) return null;

    return (
        <>
            <Divider position="left" className="!my-0" text="Odznaki" />

            <div className={`flex flex-wrap items-center gap-3 px-6 text-sm ${className}`}>
                {badges.gold > 0 && (
                    <BadgeIcon
                        icon="mdi:medal"
                        tooltip="Złote odznaki"
                        colorClass="text-yellow-400"
                        count={badges.gold}
                    />
                )}
                {badges.silver > 0 && (
                    <BadgeIcon
                        icon="mdi:medal"
                        tooltip="Srebrne odznaki"
                        colorClass="text-gray-400"
                        count={badges.silver}
                    />
                )}
                {badges.bronze > 0 && (
                    <BadgeIcon
                        icon="mdi:medal"
                        tooltip="Brązowe odznaki"
                        colorClass="text-amber-600"
                        count={badges.bronze}
                    />
                )}
            </div>
        </>
    );
}

function BadgeIcon({
    icon,
    tooltip,
    colorClass,
    count,
}: {
    icon: string;
    tooltip: string;
    colorClass: string;
    count: number;
}) {
    return (
        <Tooltip content={tooltip}>
            <div className="flex cursor-default items-center gap-1">
                <SvgIcon icon={icon} className={`text-xl ${colorClass}`} />
                <span className="text-white">{count}</span>
            </div>
        </Tooltip>
    );
}
