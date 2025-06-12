import { type ListboxProps, type ListboxSectionProps } from "@heroui/react";
import React from "react";

export enum SidebarItemType {
    // eslint-disable-next-line no-unused-vars
    Nest = "nest",
}

export type SidebarItem = {
    key: string;
    title: string;
    icon?: string;
    href?: string;
    type?: SidebarItemType; // tutaj można mieć różne typy (np. Nest)
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    "aria-label"?: string;
    items?: SidebarItem[];
    className?: string;
};

export type SidebarProps = Omit<ListboxProps<SidebarItem>, "children"> & {
    items: SidebarItem[];
    isCompact?: boolean;
    hideEndContent?: boolean;
    iconClassName?: string;
    sectionClasses?: ListboxSectionProps["classNames"];
    classNames?: ListboxProps<SidebarItem>["classNames"];
    defaultSelectedKey: string;
    onSelect?: (key: string) => void;
};

export type SidebarContextType = {
    isCompact: boolean;
    isCollapsed: boolean;
    toggleCompact: () => void;
    setCollapsed: (value: boolean) => void;
};
