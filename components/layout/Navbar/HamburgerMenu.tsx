import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import RightSidebarContent from "../Sidebar/RightSidebarContent";
import { Drawer, Button, DrawerContent, DrawerBody } from "@heroui/react";
import { HamburgerMenuProps } from "@/types/navbar.types";

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onOpenChange, onOpen }) => {
    return (
        <Drawer
            classNames={{
                base: "bg-cBgDark-900 rounded-none 3xl:!hidden",
                closeButton: "text-cTextDark-100 !size-11 !min-w-fit !bg-transparent z-[10] top-6 right-6 rounded-lg",
                body: "pt-24",
                wrapper: "3xl:hidden",
                backdrop: "3xl:hidden",
            }}
            backdrop="opaque"
            closeButton={<Button onPress={onOpen} startContent={<Icon icon="mdi:close" width={28} />} />}
            isOpen={isOpen}
            onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <RightSidebarContent />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default HamburgerMenu;
