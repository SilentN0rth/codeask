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
} from "@heroui/react";
import { formatUserName } from "@/lib/utils/formatUserName";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";

export const YourAccountUserCard = () => {
    const [isFollowed, setIsFollowed] = useState(false);

    return (
        <Card className="max-w-[340px] border-none bg-transparent" shadow="none">
            <CardHeader className="justify-between">
                <div className="flex gap-3">
                    <Avatar isBordered radius="full" size="md" src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                    <div className={"flex flex-col items-start justify-center"}>
                        <h4 className="text-small font-semibold leading-none text-default-600">
                            {formatUserName("Maksymilian Szewczyk", { maxLength: 20 })}
                        </h4>
                        <h5 className="text-small tracking-tight text-default-500">
                            {formatUserName("@maksymilian.szewczyk0833", { maxLength: 26 })}
                        </h5>
                    </div>
                </div>
                <Button
                    as={Link}
                    href="/tags"
                    className={"border-default-200 bg-transparent text-foreground"}
                    color="primary"
                    radius="full"
                    isIconOnly
                    size="sm"
                    startContent={<Icon icon="mdi:gear" width={16} />}
                    variant={"bordered"}
                    onPress={() => setIsFollowed(!isFollowed)}></Button>
                {/* <Button
                    className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                    color="primary"
                    radius="full"
                    size="sm"
                    variant={isFollowed ? "bordered" : "solid"}
                    onPress={() => setIsFollowed(!isFollowed)}>
                    {isFollowed ? "Unfollow" : "Follow"}
                </Button> */}
            </CardHeader>
            <CardBody className="px-3 py-0">
                <p className="pl-px text-small text-default-500">
                    Full-stack developer, @hero_ui lover she/her
                    <span aria-label="confetti" role="img">
                        🎉
                    </span>
                </p>
            </CardBody>
            <CardFooter className="invisible-scroll gap-3 overflow-x-auto">
                <div className="flex gap-1">
                    <p className="text-small font-semibold text-default-600">410</p>
                    <p className=" text-small text-default-500">Questions</p>
                </div>
                <div className="flex gap-1">
                    <p className="text-small font-semibold text-default-600">4345</p>
                    <p className=" text-small text-default-500">Following</p>
                </div>
                <div className="flex gap-1">
                    <p className="text-small font-semibold text-default-600">421</p>
                    <p className=" text-small text-default-500">Followers</p>
                </div>
            </CardFooter>
        </Card>
    );
};

export default function UserTriggerPopoverCard({
    isCompact = false,
    isLoggedOut = false,
}: {
    isCompact?: boolean;
    isLoggedOut?: boolean;
}) {
    return isLoggedOut ? (
        <SignInButton fallbackRedirectUrl={null} forceRedirectUrl={null} mode="modal">
            <Button className="h-full !w-fit gap-x-3 bg-transparent px-1 py-2  text-start" disableRipple>
                <Avatar isBordered className="flex-none" size="sm" src="" />
                <div className={cn("flex max-w-full flex-col", { hidden: isCompact })}>
                    <p className="truncate text-small font-medium text-default-600">Zaloguj się</p>
                    <p className="truncate text-tiny text-default-400">Aby uzyskać dostęp do treści forum.</p>
                </div>
            </Button>
        </SignInButton>
    ) : (
        <Popover showArrow placement="bottom">
            <PopoverTrigger>
                <Button className=" h-full !w-fit gap-x-3 bg-transparent px-1 py-2  text-start" disableRipple>
                    <Avatar
                        isBordered
                        className="flex-none"
                        size="sm"
                        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                    />
                    <div className={cn("flex max-w-full flex-col", { hidden: isCompact })}>
                        <p className="truncate text-small font-medium text-default-600">
                            {formatUserName("Maksymilian Szewczyk", { maxLength: 26 })}
                        </p>
                        <p className="truncate text-tiny text-default-400">Uzupełnij profil...</p>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1">
                <YourAccountUserCard />
            </PopoverContent>
        </Popover>
    );
}
