'use client';

import {
  cn,
  ListboxItem,
  Tooltip,
  Accordion,
  AccordionItem,
  Listbox,
  ListboxSection,
  Chip,
  addToast,
} from '@heroui/react';
import React, { useEffect, useMemo } from 'react';
import {
  SidebarProps,
  SidebarItem,
  SidebarItemType,
} from '@/types/sidebar.types';
import Link from 'next/link';
import type { Key } from '@react-types/shared';
import { SvgIcon } from '@/lib/utils/icons';
import { useAuthContext } from 'context/useAuthContext';
import { PROTECTED_SIDEBAR_KEYS } from '@/constants/ProtectedRoutes';
import LeftSidebarSkeleton from './LeftSidebarSkeleton';
import TeamAvatar from '@/components/ui/sidebar/TeamAvatar';

const LeftSidebarContent = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      selectedKeys,
      items,
      isCompact,
      onSelect,
      hideEndContent,
      sectionClasses: sectionClassesProp = {},
      itemClasses: itemClassesProp = {},
      iconClassName,
      classNames,
      className,
      topUsers,
      ...props
    },
    ref
  ) => {
    const [internalSelected, setInternalSelected] = React.useState<
      React.Key | undefined
    >(
      selectedKeys && selectedKeys !== 'all'
        ? Array.from(selectedKeys)[0]
        : undefined
    );

    const { user, loading } = useAuthContext();

    const processedItems = useMemo(() => {
      return items.map((section) => {
        if (section.key === 'leaders' && topUsers && topUsers.length > 0) {
          const medals = ['🥇', '🥈', '🥉'];
          return {
            ...section,
            items: topUsers.slice(0, 3).map((leaderUser, index) => ({
              key: `top${index + 1}`,
              href: user ? `/users/${leaderUser.profile_slug}` : undefined,
              title: `${medals[index]} ${leaderUser.username}`,
              'aria-label': `${index + 1} miejsce - ${leaderUser.username}`,
              startContent: (
                <TeamAvatar
                  src={leaderUser.avatar_url || undefined}
                  name={leaderUser.username}
                />
              ),
              endContent: (
                <Chip size="sm" variant="flat">
                  {leaderUser.reputation} exp
                </Chip>
              ),
              isClickable: !!user,
              isSelectable: !!user,
            })),
          };
        }

        return {
          ...section,
          items: section.items
            ?.filter((item) => {
              if (
                !user &&
                item.key &&
                PROTECTED_SIDEBAR_KEYS.includes(item.key)
              ) {
                return false;
              }
              return true;
            })
            ?.map((item) => {
              const hasDynamicParams = item.href?.includes('{userSlug}');

              if (hasDynamicParams && user) {
                return {
                  ...item,
                  href: item.href?.replace(
                    '{userSlug}',
                    user.profile_slug ?? ''
                  ),
                };
              }

              return item;
            }),
        };
      });
    }, [items, user, topUsers]);

    useEffect(() => {
      if (selectedKeys && selectedKeys !== 'all') {
        const [firstKey] = Array.from(selectedKeys);
        setInternalSelected(firstKey);
      }
      if (selectedKeys === 'allQuestions') setInternalSelected('allQuestions');
    }, [selectedKeys]);

    const handleSelectionChange = React.useCallback(
      (key: Key) => {
        setInternalSelected(key);
        onSelect?.(key as string);
      },
      [onSelect]
    );

    const sectionClasses = {
      ...sectionClassesProp,
      base: cn(sectionClassesProp?.base, 'w-full', {
        'p-0 max-w-[44px]': isCompact,
      }),
      group: cn(sectionClassesProp?.group, {
        'flex flex-col gap-1': isCompact,
      }),
      heading: cn(sectionClassesProp?.heading, {
        'sidebar-compact-headings': isCompact,
      }),
    };

    const itemClasses = {
      ...itemClassesProp,
      base: cn(itemClassesProp?.base, {
        'w-11 h-11 gap-0 p-0': isCompact,
      }),
    };

    const renderItemRef =
      React.useRef<(item: SidebarItem) => React.ReactNode | undefined>(
        undefined
      );

    const renderItem = React.useCallback(
      (item: SidebarItem) => {
        const isNestType =
          item.items &&
          item.items?.length > 0 &&
          item?.type === SidebarItemType.Nest;

        if (isNestType) {
          return renderItemRef.current?.(item);
        }

        const isClickable = item.isClickable !== false;
        const {
          isClickable: _isClickable,
          isSelectable: _isSelectable,
          ...itemProps
        } = item;
        void _isClickable;
        void _isSelectable;

        return (
          <ListboxItem
            {...itemProps}
            as={isClickable ? Link : 'div'}
            href={isClickable ? (item.href ?? '#') : undefined}
            key={item.key}
            onMouseDown={
              !isClickable
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToast({
                      title: 'Wymagane logowanie',
                      description:
                        'Aby przejść do profilu użytkownika, musisz być zalogowany.',
                      icon: <SvgIcon icon="solar:lock-linear" />,
                      color: 'warning',
                    });
                  }
                : undefined
            }
            endContent={
              isCompact || hideEndContent ? null : (item.endContent ?? null)
            }
            startContent={
              isCompact ? null : item.icon ? (
                <SvgIcon
                  className={cn(
                    'text-default-500 group-data-[selected=true]:text-foreground',
                    iconClassName
                  )}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                (item.startContent ?? null)
              )
            }
            title={isCompact ? null : item.title}
          >
            {isCompact ? (
              <Tooltip content={item.title} placement="right" key={item.key}>
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <SvgIcon
                      className={cn(
                        'text-default-500 group-data-[selected=true]:text-foreground',
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
      [isCompact, hideEndContent, iconClassName]
    );

    const renderNestItem = React.useCallback(
      (item: SidebarItem) => {
        const isNestType =
          item.items &&
          item.items?.length > 0 &&
          item?.type === SidebarItemType.Nest;

        if (isNestType) {
          delete item.href;
        }

        return (
          <ListboxItem
            {...item}
            key={item.key}
            classNames={{
              base: cn(
                {
                  'h-auto p-0': !isCompact && isNestType,
                },
                {
                  'inline-block w-11': isCompact && isNestType,
                }
              ),
            }}
            endContent={
              isCompact || isNestType || hideEndContent
                ? null
                : (item.endContent ?? null)
            }
            startContent={
              isCompact || isNestType ? null : item.icon ? (
                <SvgIcon
                  className={cn(
                    'text-default-500 group-data-[selected=true]:text-foreground',
                    iconClassName
                  )}
                  icon={item.icon}
                  width={24}
                />
              ) : (
                (item.startContent ?? null)
              )
            }
            title={isCompact || isNestType ? null : item.title}
          >
            {isCompact ? (
              <Tooltip content={item.title} placement="right" key={item.key}>
                <div className="flex w-full items-center justify-center">
                  {item.icon ? (
                    <SvgIcon
                      className={cn(
                        'text-default-500 group-data-[selected=true]:text-foreground',
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
                className="p-0"
                key={item.key}
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const [key] = Array.from(keys);
                  handleSelectionChange(key);
                }}
              >
                <AccordionItem
                  key={item.key}
                  classNames={{
                    heading: 'pr-3',
                    trigger: 'p-0',
                    content: 'py-0 pl-4',
                  }}
                  title={
                    item.icon ? (
                      <div className="flex h-11 items-center gap-2 px-2 py-1.5">
                        <SvgIcon
                          className={cn(
                            'text-default-500 group-data-[selected=true]:text-foreground',
                            iconClassName
                          )}
                          icon={item.icon}
                          width={24}
                        />
                        <span className="text-default-500 text-small group-data-[selected=true]:text-foreground font-medium">
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      (item.startContent ?? null)
                    )
                  }
                >
                  {item.items && item.items?.length > 0 ? (
                    <Listbox
                      className="mt-0.5"
                      classNames={{
                        list: cn('border-l border-default-200 pl-4'),
                        base: ' group-data-[selected=true]:text-red-500',
                        emptyContent:
                          ' group-data-[selected=true]:text-red-500',
                      }}
                      items={item.items}
                      selectionMode="single"
                      selectedKeys={
                        selectedKeys ??
                        (internalSelected
                          ? new Set([internalSelected as Key])
                          : undefined)
                      }
                      onSelectionChange={(keys) => {
                        const [key] = Array.from(keys);
                        handleSelectionChange(key);
                      }}
                      variant="flat"
                    >
                      {/* @ts-expect-error - Type mismatch with CollectionChildren */}
                      {item.items.map((subItem) => renderItem(subItem))}
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
      [
        isCompact,
        hideEndContent,
        iconClassName,
        handleSelectionChange,
        internalSelected,
        renderItem,
        selectedKeys,
      ]
    );

    renderItemRef.current = renderNestItem;

    if (loading) {
      return <LeftSidebarSkeleton />;
    }

    return (
      <Listbox
        key={isCompact ? 'compact' : 'default'}
        ref={ref}
        hideSelectedIcon
        as="ul"
        className={cn('list-none', className)}
        classNames={{
          ...classNames,
          list: cn('items-center', classNames?.list),
        }}
        color="default"
        aria-label="Menu nawigacyjne"
        itemClasses={{
          ...itemClasses,
          base: cn(
            'px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100',
            itemClasses?.base
          ),
          title: cn(
            'text-small font-medium text-default-500 group-data-[selected=true]:text-foreground',
            itemClasses?.title
          ),
        }}
        items={processedItems}
        selectionMode="single"
        variant="flat"
        selectedKeys={
          selectedKeys ??
          (internalSelected ? new Set([internalSelected as Key]) : undefined)
        }
        onSelectionChange={(keys) => {
          const [key] = Array.from(keys);
          const selectedItem = processedItems
            .flatMap((section) => section.items ?? [])
            .find((item) => item.key === key);

          if (selectedItem?.isClickable !== false) {
            handleSelectionChange(key);
          }
        }}
        {...props}
      >
        {/* @ts-expect-error - Type mismatch with CollectionChildren */}
        {(item, index) => {
          const hasVisibleItems = item.items && item.items.length > 0;

          if (!hasVisibleItems) {
            return null;
          }

          return item.items &&
            item.items?.length > 0 &&
            item?.type === SidebarItemType.Nest ? (
            renderNestItem(item)
          ) : item.items && item.items?.length > 0 ? (
            <ListboxSection
              as="li"
              key={item.key}
              classNames={{
                ...sectionClasses,
                base: cn(sectionClasses.base, {
                  'mt-2': isCompact && index > 0,
                }),
              }}
              showDivider={isCompact}
              title={item.title}
            >
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

LeftSidebarContent.displayName = 'LeftSidebarContent';

export default LeftSidebarContent;
