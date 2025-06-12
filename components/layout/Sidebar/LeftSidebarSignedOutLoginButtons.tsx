import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Tooltip, Button, cn } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const LeftSidebarSignedOutLoginButtons = ({ isCompact }: { isCompact: boolean }) => {

    return (
        <SignedOut>
            <div className={isCompact ? "flex-column" : "gap-xsmall flex "}>
                <Tooltip content="Zaloguj" isDisabled={!isCompact} placement="right">
                    <SignInButton fallbackRedirectUrl={null} forceRedirectUrl={null} mode="modal">
                        <Button
                            fullWidth
                            className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                "justify-center": isCompact,
                            })}
                            isIconOnly={isCompact}
                            startContent={
                                isCompact ? null : (
                                    <Icon
                                        className="flex-none text-default-500"
                                        icon="solar:login-2-linear"
                                        width={24}
                                    />
                                )
                            }
                            variant="light">
                            {isCompact ? (
                                <Icon className="text-default-500" icon="solar:login-2-linear" width={24} />
                            ) : (
                                "Zaloguj"
                            )}
                        </Button>
                    </SignInButton>
                </Tooltip>

                <Tooltip content="Zarejestruj" isDisabled={!isCompact} placement="right">
                    <SignUpButton mode="modal">
                        <Button
                            fullWidth
                            className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                                "justify-center": isCompact,
                            })}
                            isIconOnly={isCompact}
                            startContent={
                                isCompact ? null : (
                                    <Icon
                                        className="flex-none text-default-500"
                                        icon="solar:user-plus-linear"
                                        width={24}
                                    />
                                )
                            }
                            variant="light">
                            {isCompact ? (
                                <Icon className="text-default-500" icon="solar:user-plus-linear" width={24} />
                            ) : (
                                "Zarejestruj"
                            )}
                        </Button>
                    </SignUpButton>
                </Tooltip>
            </div>
        </SignedOut>
    );
};

export default LeftSidebarSignedOutLoginButtons;
