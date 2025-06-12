import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { Tooltip, Button, cn } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const LeftSidebarSignedInLoginButtons = ({ isCompact }: { isCompact: boolean }) => {
    return (
        <SignedIn>
            <Tooltip content="Wyloguj się" isDisabled={!isCompact} placement="right">
                <SignOutButton>
                    <Button
                        fullWidth
                        className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                            "justify-center": isCompact,
                        })}
                        isIconOnly={isCompact}
                        startContent={
                            isCompact ? null : (
                                <Icon
                                    className="flex-none rotate-180 text-default-500"
                                    icon="solar:minus-circle-linear"
                                    width={24}
                                />
                            )
                        }
                        variant="light">
                        {isCompact ? (
                            <Icon className="rotate-180 text-default-500" icon="solar:minus-circle-linear" width={24} />
                        ) : (
                            "Wyloguj się"
                        )}
                    </Button>
                </SignOutButton>
            </Tooltip>
        </SignedIn>
    );
};

export default LeftSidebarSignedInLoginButtons;
