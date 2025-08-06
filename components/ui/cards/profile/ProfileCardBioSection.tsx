import { useState, useEffect } from "react";
import ExpandableText from "../../ExpandableText";
import { ProfileMeta } from "./ProfileCardFull";
import { UserInterface } from "@/types/users.types";
import { SvgIcon } from "@/lib/utils/icons";
import { getRelativeTimeFromNow } from "@/lib/utils/getRelativeTimeFromNow";
import { cn } from "@heroui/react";

export default function ProfileCardBioSection({ user }: { user: UserInterface | null }) {
    const hasBio = !!user?.bio;
    const hasLocation = !!user?.location;
    const hasActivity = !!user?.last_sign_in_at;

    // Stan lokalny online, który będzie aktualizowany co 5 sekund
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        // Funkcja do sprawdzania, czy user jest online na podstawie last_sign_in_at (5 minut okna)
        const checkOnlineStatus = () => {
            if (user?.is_online) {
                setIsOnline(true);
                return;
            }
            if (!user?.last_sign_in_at) {
                setIsOnline(false);
                return;
            }
            const lastActive = new Date(user.last_sign_in_at).getTime();
            const now = Date.now();
            const TWO_MINUTES = 2 * 60 * 1000;
            setIsOnline(now - lastActive < TWO_MINUTES);
        };

        checkOnlineStatus();

        const interval = setInterval(() => {
            checkOnlineStatus();
        }, 5000); // co 5 sekund odświeżamy

        return () => clearInterval(interval);
    }, [user]);

    // --- Stan do wymuszenia rerender co 5 sekund już niepotrzebny ---

    const renderMeta = (extraClass = "") => (
        <>
            {hasLocation && (
                <ProfileMeta icon="mdi:map-marker-outline" text={user.location as string} className={extraClass} />
            )}
            {hasActivity && (
                <ProfileMeta
                    icon="mdi:clock-outline"
                    text={isOnline ? "Online" : `Ostatnio aktywny: ${getRelativeTimeFromNow(user.last_sign_in_at!)}`}
                    className={cn(extraClass, {
                        "text-success-500": isOnline,
                    })}
                />
            )}
        </>
    );

    if (!hasBio && !hasLocation && !hasActivity) return null;

    return (
        <div className="z-10 mt-4 space-y-2 text-sm text-cMuted-500">
            {hasBio && user.bio!.length > 150 ? (
                <ExpandableText
                    className="z-[300] w-full "
                    icon={<SvgIcon width={18} icon="codicon:book" className=" mr-1.5 inline" />}
                    as="p"
                    clamp="line-clamp-3">
                    {user.bio}
                    {renderMeta()}
                </ExpandableText>
            ) : (
                <>
                    {hasBio && (
                        <p className="">
                            <SvgIcon width={18} icon="codicon:book" className="mr-1.5 inline" />
                            {user.bio}
                        </p>
                    )}
                    {renderMeta(hasBio ? "mt-2" : "")}
                </>
            )}
        </div>
    );
}
