import React, { useState } from "react";
import {
    Avatar,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    cn,
    Badge,
} from "@heroui/react";
import { formatUserName } from "@/lib/utils/formatUserName";
import Link from "next/link";
import { UserInterface } from "@/types/users.types";
import LoginModal from "@/components/layout/Login/LoginModal";
import { SvgIcon } from "@/lib/utils/icons";

export const YourAccountUserCard = ({ user }: { user: UserInterface | null }) => {
    const [isFollowed, setIsFollowed] = useState(false);
    return (
        <Card className="max-w-[340px] border-none bg-transparent" shadow="none">
            <CardHeader className="justify-between">
                <div className="flex gap-3">
                    {user?.is_online ? (
                        <Badge color="success" content="" placement="bottom-right" shape="circle">
                            <Avatar isBordered radius="full" size="md" src={user!.avatar_url} />
                        </Badge>
                    ) : (
                        <Avatar isBordered radius="full" size="md" src={user!.avatar_url} />
                    )}
                    <div className={"flex flex-col items-start justify-center"}>
                        <h4 className="text-small font-semibold leading-none text-default-600">
                            {formatUserName(user!.name, { maxLength: 20 })}
                        </h4>
                        <h5 className="text-small tracking-tight text-default-500">
                            {formatUserName(`@${user!.username}`, { maxLength: 26 })}
                        </h5>
                    </div>
                </div>
                <Button
                    as={Link}
                    href={`/users/${user!.id}/${user!.profile_slug}`}
                    className={"border-default-200 bg-transparent text-foreground"}
                    color="primary"
                    radius="full"
                    isIconOnly
                    size="sm"
                    startContent={<SvgIcon icon="mdi:gear" width={16} />}
                    variant={"bordered"}
                    onPress={() => setIsFollowed(!isFollowed)}
                />
            </CardHeader>
            <CardBody className="px-3 py-0">
                <p className="line-clamp-3 pl-px text-small text-default-500">{user!.bio}</p>
            </CardBody>
            <CardFooter className="invisible-scroll gap-3 overflow-x-auto">
                <div className="flex gap-1">
                    <p className="text-small font-semibold text-default-600">{user!.questions_count}</p>
                    <p className=" text-small text-default-500">Pytań</p>
                </div>
                <div className="flex gap-1">
                    <p className="text-small font-semibold text-default-600">{user!.following_count}</p>
                    <p className=" text-small text-default-500">Obserwowanych</p>
                </div>
                <div className="flex gap-1">
                    <p className="text-small font-semibold text-default-600">{user!.followers_count}</p>
                    <p className=" text-small text-default-500">Obserwujących</p>
                </div>
            </CardFooter>
        </Card>
    );
};

export default function UserTriggerPopoverCard({
    isCompact = false,
    user,
}: {
    user: UserInterface | null;
    isCompact?: boolean;
}) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    return !user ? (
        <>
            <Button
                onPress={() => setModalOpen(!modalOpen)}
                className="h-full !w-fit gap-x-3 bg-transparent px-1 py-2  text-start"
                disableRipple>
                <Avatar isBordered className="flex-none" size="sm" src="" />
                <div className={cn("flex max-w-full flex-col", { hidden: isCompact })}>
                    <p className="truncate text-small font-medium text-default-600">Zaloguj się</p>
                    <p className="truncate text-tiny text-default-400">Aby uzyskać dostęp do treści forum.</p>
                </div>
            </Button>

            <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(!modalOpen)} />
        </>
    ) : (
        <Popover showArrow placement="bottom">
            <PopoverTrigger>
                <Button
                    fullWidth
                    className={`flex h-full gap-x-3 bg-transparent px-1 py-2 text-start ${isCompact ? "" : "justify-start"}`}
                    disableRipple>
                    {user.is_online ? (
                        <Badge color="success" content="" placement="bottom-right" shape="circle">
                            <Avatar isBordered className="flex-none" size="sm" src={user.avatar_url} />
                        </Badge>
                    ) : (
                        <Avatar isBordered className="flex-none" size="sm" src={user.avatar_url} />
                    )}

                    <div className={cn("flex w-full flex-col", { hidden: isCompact })}>
                        <p className="w-full text-small font-medium text-default-600">
                            {formatUserName(user.name, { maxLength: 26 })}
                        </p>
                        <p className="truncate text-tiny text-default-400">
                            {user.specialization ? user.specialization : "Uzupełnij profil..."}
                        </p>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1">
                <YourAccountUserCard user={user} />
            </PopoverContent>
        </Popover>
    );
}
