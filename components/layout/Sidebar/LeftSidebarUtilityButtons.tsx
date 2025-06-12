import { Button, cn } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const LeftSidebarUtilityButtons = ({ isCompact, toggleCompact }: { isCompact: boolean; toggleCompact: () => void }) => {
    return (
        <div className={isCompact ? "flex-column" : "gap-xsmall flex"}>
            <Button
                fullWidth
                className={cn("hidden md:flex justify-start text-default-500 data-[hover=true]:text-foreground", {
                    "justify-center": isCompact,
                    "order-20": !isCompact,
                })}
                isIconOnly={isCompact}
                onPress={toggleCompact}
                startContent={
                    isCompact ? null : (
                        <Icon
                            className="flex-none text-default-500"
                            height={24}
                            icon="solar:sidebar-minimalistic-outline"
                        />
                    )
                }
                variant="light">
                {isCompact ? (
                    <Icon className="text-default-500" height={24} icon="solar:sidebar-minimalistic-outline" />
                ) : (
                    "Zwiń menu"
                )}
            </Button>

            <Button
                fullWidth
                className={cn("justify-start truncate text-default-500 data-[hover=true]:text-foreground", {
                    "justify-center -order-10": isCompact,
                })}
                isIconOnly={isCompact}
                startContent={
                    isCompact ? null : (
                        <Icon className="flex-none text-default-500" icon="solar:info-circle-linear" width={24} />
                    )
                }
                variant="light">
                {isCompact ? <Icon className="text-default-500" icon="solar:info-circle-linear" width={24} /> : "Pomoc"}
            </Button>
        </div>
    );
};

export default LeftSidebarUtilityButtons;
