import { Avatar, Tooltip, Badge } from "@heroui/react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { formatUserName } from "@/lib/utils/formatUserName";
import ProfileCardBadges from "./ProfileCardBadges";
import { UserInterface } from "@/types/users.types";
import { SvgIcon } from "@/lib/utils/icons";

export default function ProfileCardMainInfo({ user }: { user: UserInterface | null }) {
    return (
        <div className="z-30 flex w-full items-start justify-between gap-4 ">
            <div className="flex w-full justify-between gap-5">
                <div className={`flex flex-wrap gap-5`}>
                    {user?.is_online ? (
                        <Badge color="success" content="" placement="bottom-right" shape="circle" size="lg">
                            <Avatar size="lg" src={user.avatar_url} isBordered />
                        </Badge>
                    ) : (
                        <Avatar size="lg" src={user?.avatar_url} isBordered />
                    )}

                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            {user?.confirmed_at && (
                                <Tooltip
                                    content={
                                        <div className="flex items-center">
                                            <SvgIcon icon="mdi:check-decagram" className="mr-1" />
                                            {`Konto zweryfikowane: ${format(
                                                new Date(user.confirmed_at),
                                                "d MMMM yyyy, HH:mm",
                                                { locale: pl }
                                            )}`}
                                        </div>
                                    }>
                                    <SvgIcon icon="mdi:check-decagram" />
                                </Tooltip>
                            )}
                            <h4 className="text-xl font-semibold">{formatUserName(user?.name as string)}</h4>
                            <ProfileCardBadges className="hidden" user={user} />
                        </div>
                        <p className="text-sm text-default-400">
                            @{formatUserName(user?.username as string)}{" "}
                            {user?.specialization && <span className="text-xs">| {user.specialization}</span>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
