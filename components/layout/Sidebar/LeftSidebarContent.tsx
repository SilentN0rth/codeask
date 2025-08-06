"use client";

import { cn, ListboxItem, Tooltip, Accordion, AccordionItem, Listbox, ListboxSection } from "@heroui/react";
import React, { useEffect } from "react";
import { SidebarProps, SidebarItem, SidebarItemType } from "@/types/sidebar.types";
import Link from "next/link";
import type { Key } from "@react-types/shared"; // najczęściej Key = string | number
import { SvgIcon } from "@/lib/utils/icons";

const LeftSidebarContent = React.forwardRef<HTMLElement, SidebarProps>(
    (
        {
            selectedKeys,
            items,
            isCompact,
            defaultSelectedKey,
            onSelect,
            hideEndContent,
            sectionClasses: sectionClassesProp = {},
            itemClasses: itemClassesProp = {},
            iconClassName,
            classNames,
            className,
            ...props
        },
        ref
    ) => {
        const [internalSelected, setInternalSelected] = React.useState<React.Key | undefined>(
            selectedKeys && selectedKeys !== "all" ? Array.from(selectedKeys)[0] : undefined
        );

        useEffect(() => {
            if (selectedKeys && selectedKeys !== "all") {
                const firstKey = Array.from(selectedKeys)[0];
                setInternalSelected(firstKey);
            }
            if (selectedKeys === "allQuestions") setInternalSelected("allQuestions");
        }, [selectedKeys]);

        const sectionClasses = {
            ...sectionClassesProp,
            base: cn(sectionClassesProp?.base, "w-full", {
                "p-0 max-w-[44px]": isCompact,
            }),
            group: cn(sectionClassesProp?.group, {
                "flex flex-col gap-1": isCompact,
            }),
            heading: cn(sectionClassesProp?.heading, {
                "sidebar-compact-headings": isCompact,
            }),
        };

        const itemClasses = {
            ...itemClassesProp,
            base: cn(itemClassesProp?.base, {
                "w-11 h-11 gap-0 p-0": isCompact,
            }),
        };

        const renderNestItem = React.useCallback(
            (item: SidebarItem) => {
                const isNestType = item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

                if (isNestType) {
                    // Is a nest type item , so we need to remove the href
                    delete item.href;
                }

                return (
                    <ListboxItem
                        {...item}
                        key={item.key}
                        classNames={{
                            base: cn(
                                {
                                    "h-auto p-0": !isCompact && isNestType,
                                },
                                {
                                    "inline-block w-11": isCompact && isNestType,
                                }
                            ),
                        }}
                        endContent={isCompact || isNestType || hideEndContent ? null : (item.endContent ?? null)}
                        startContent={
                            isCompact || isNestType ? null : item.icon ? (
                                <SvgIcon
                                    className={cn(
                                        "text-default-500 group-data-[selected=true]:text-foreground",
                                        iconClassName
                                    )}
                                    icon={item.icon}
                                    width={24}
                                />
                            ) : (
                                (item.startContent ?? null)
                            )
                        }
                        title={isCompact || isNestType ? null : item.title}>
                        {isCompact ? (
                            <Tooltip content={item.title} placement="right" key={item.key}>
                                <div className="flex w-full items-center justify-center">
                                    {item.icon ? (
                                        <SvgIcon
                                            className={cn(
                                                "text-default-500 group-data-[selected=true]:text-foreground",
                                                iconClassName
                                            )}
                                            icon={item.icon}
                                            width={24}
                                        />
                                    ) : (
                                        (item.startContent ?? null)
                                    )}
                                </div>
                            </Tooltip>
                        ) : null}
                        {!isCompact && isNestType ? (
                            <Accordion
                                className={"p-0"}
                                key={item.key}
                                selectionMode="single"
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys)[0];
                                    setInternalSelected(key);
                                    onSelect?.(key as string);
                                }}>
                                <AccordionItem
                                    key={item.key}
                                    // aria-label={item.title}
                                    classNames={{
                                        heading: "pr-3",
                                        trigger: "p-0",
                                        content: "py-0 pl-4",
                                    }}
                                    title={
                                        item.icon ? (
                                            <div className={"flex h-11 items-center gap-2 px-2 py-1.5"}>
                                                <SvgIcon
                                                    className={cn(
                                                        "text-default-500 group-data-[selected=true]:text-foreground",
                                                        iconClassName
                                                    )}
                                                    icon={item.icon}
                                                    width={24}
                                                />
                                                <span className="text-small font-medium text-default-500 group-data-[selected=true]:text-foreground">
                                                    {item.title}
                                                </span>
                                            </div>
                                        ) : (
                                            (item.startContent ?? null)
                                        )
                                    }>
                                    {item.items && item.items?.length > 0 ? (
                                        <Listbox
                                            className={"mt-0.5"}
                                            classNames={{
                                                list: cn("border-l border-default-200 pl-4"),
                                                base: " group-data-[selected=true]:text-red-500",
                                                emptyContent: " group-data-[selected=true]:text-red-500",
                                            }}
                                            items={item.items}
                                            selectionMode="single"
                                            selectedKeys={
                                                selectedKeys ??
                                                (internalSelected ? new Set([internalSelected as Key]) : undefined)
                                            }
                                            onSelectionChange={(keys) => {
                                                const key = Array.from(keys)[0];
                                                setInternalSelected(key);
                                                onSelect?.(key as string);
                                            }}
                                            variant="flat">
                                            {item.items.map(renderItem)}
                                        </Listbox>
                                    ) : (
                                        renderItem(item)
                                    )}
                                </AccordionItem>
                            </Accordion>
                        ) : null}
                    </ListboxItem>
                );
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [isCompact, hideEndContent, iconClassName, items]
        );

        const renderItem = React.useCallback(
            (item: SidebarItem) => {
                const isNestType = item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

                if (isNestType) {
                    return renderNestItem(item);
                }

                return (
                    <ListboxItem
                        {...item}
                        as={Link}
                        // aria-label={item?.ariaLabel}
                        key={item.key}
                        endContent={isCompact || hideEndContent ? null : (item.endContent ?? null)}
                        startContent={
                            isCompact ? null : item.icon ? (
                                <SvgIcon
                                    className={cn(
                                        "text-default-500 group-data-[selected=true]:text-foreground",
                                        iconClassName
                                    )}
                                    icon={item.icon}
                                    width={24}
                                />
                            ) : (
                                (item.startContent ?? null)
                            )
                        }
                        // textValue={item.title} // NextJS nie pozwala. Nie umieszczaj.
                        title={isCompact ? null : item.title}>
                        {isCompact ? (
                            <Tooltip content={item.title} placement="right" key={item.key}>
                                <div className="flex w-full items-center justify-center">
                                    {item.icon ? (
                                        <SvgIcon
                                            className={cn(
                                                "text-default-500 group-data-[selected=true]:text-foreground",
                                                iconClassName
                                            )}
                                            icon={item.icon}
                                            width={24}
                                        />
                                    ) : (
                                        (item.startContent ?? null)
                                    )}
                                </div>
                            </Tooltip>
                        ) : null}
                    </ListboxItem>
                );
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [isCompact, hideEndContent, iconClassName, itemClasses?.base]
        );

        return (
            <Listbox
                key={isCompact ? "compact" : "default"}
                ref={ref}
                hideSelectedIcon
                as="ul"
                className={cn("list-none", className)}
                classNames={{
                    ...classNames,
                    list: cn("items-center", classNames?.list),
                }}
                color="default"
                itemClasses={{
                    ...itemClasses,
                    base: cn(
                        "px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100",
                        itemClasses?.base
                    ),
                    title: cn(
                        "text-small font-medium text-default-500 group-data-[selected=true]:text-foreground",
                        itemClasses?.title
                    ),
                }}
                items={items}
                selectionMode="single"
                variant="flat"
                selectedKeys={selectedKeys ?? (internalSelected ? new Set([internalSelected as Key]) : undefined)}
                onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0];
                    setInternalSelected(key);
                    onSelect?.(key as string);
                }}
                {...props}>
                {(item) => {
                    return item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest ? (
                        renderNestItem(item)
                    ) : item.items && item.items?.length > 0 ? (
                        <ListboxSection
                            as={"li"}
                            role="listitem"
                            key={item.key}
                            classNames={sectionClasses}
                            showDivider={isCompact}
                            title={item.title}>
                            {item.items.map(renderItem)}
                        </ListboxSection>
                    ) : (
                        renderItem(item)
                    );
                }}
            </Listbox>
        );
    }
);

LeftSidebarContent.displayName = "LeftSidebarContent";

export default LeftSidebarContent;
