import { SvgIcon } from "@/lib/utils/icons";
import { Button, Chip } from "@heroui/react";
import { UserInterface } from "@/types/users.types";
import { useAuthContext } from "context/useAuthContext";
import { useEffect, useState } from "react";
import { isFollowing, followUser, unfollowUser } from "@/services/client/follow";

export default function ProfileCardHeaderActions({
    author,
    onFollowChanged,
}: {
    author: UserInterface | null;
    onFollowChanged?: () => void;
}) {
    const { user: loggedUser, refreshUser } = useAuthContext();
    const isModerator = author?.is_moderator;
    const isYou = loggedUser?.id === author?.id;

    const [isFollowingState, setIsFollowingState] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loggedUser?.id && author?.id && loggedUser.id !== author.id) {
            (async () => {
                const following = await isFollowing(loggedUser.id, author.id);
                setIsFollowingState(following);
            })();
        }
    }, [loggedUser?.id, author?.id]);

    const onToggleFollow = async () => {
        if (!loggedUser?.id || !author?.id) return;

        setLoading(true);

        let updatedUser: UserInterface | null = null;

        if (isFollowingState) {
            updatedUser = await unfollowUser(loggedUser.id, author.id);
            if (updatedUser) setIsFollowingState(false);
        } else {
            updatedUser = await followUser(loggedUser.id, author.id);
            if (updatedUser) setIsFollowingState(true);
        }

        if (updatedUser && onFollowChanged) {
            onFollowChanged();
        }

        refreshUser();
        setLoading(false);
    };

    return (
        <div
            className={`z-30 flex w-full flex-wrap items-center ${
                isModerator ? "mb-5 justify-between" : "justify-end"
            } gap-6 `}>
            {isModerator && (
                <Chip
                    startContent={<SvgIcon icon="mdi:crown" className="ml-1" width={16} />}
                    color="danger"
                    radius="sm"
                    variant="flat">
                    Administrator
                </Chip>
            )}
            {isYou || (
                <Button
                    onPress={onToggleFollow}
                    variant="light"
                    radius="md"
                    aria-label={isFollowingState ? "Nie obserwuj użytkownika" : "Obserwuj użytkownika"}
                    disabled={loading}
                    className={` bg-cBgDark-800 transition-colors sm:bg-cBgDark-700 md:!min-w-fit md:!px-3 ${
                        isFollowingState
                            ? "bg-yellow-500/10 text-yellow-400 hover:!bg-yellow-500/20"
                            : "text-cTextDark-100 hover:bg-white/5"
                    }`}
                    startContent={
                        <SvgIcon icon={isFollowingState ? "mdi:star" : "mdi:star-outline"} className="text-xl" />
                    }>
                    <p className="md:hidden lg:block">{isFollowingState ? "Nie obserwuj" : "Obserwuj"}</p>
                </Button>
            )}
        </div>
    );
}
