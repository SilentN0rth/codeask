'use client';

import { sectionItems } from '@/constants/SidebarItems';
import { SvgIcon } from '@/lib/utils/icons';
import { Listbox, ListboxSection, ListboxItem, cn } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const MobileNavButtonLinks = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();
  const currentPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <nav className="mt-4 md:hidden">
      <Listbox
        hideSelectedIcon
        as="ul"
        className="list-none"
        classNames={{}}
        color="default"
        itemClasses={{
          base: cn(
            'px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100'
          ),
          title: cn(
            'text-small font-medium text-default-500 group-data-[selected=true]:text-foreground'
          ),
        }}
        selectionMode="single"
        variant="flat"
        selectedKeys={currentPath ? new Set([currentPath]) : undefined}
      >
        {sectionItems
          .filter((section) => section.key !== 'leaders')
          .map((section) => (
            <ListboxSection
              as="li"
              role="listitem"
              key={section.key}
              classNames={
                section.className ? { base: section.className } : undefined
              }
              showDivider={false}
              title={section.title}
            >
              {section.items?.map((item) => {
                return (
                  <ListboxItem
                    key={item.key}
                    as={Link}
                    href={item.href}
                    onClick={handleLinkClick}
                    startContent={
                      item.icon ? (
                        <SvgIcon
                          className="text-default-500 group-data-[selected=true]:text-foreground"
                          icon={item.icon}
                          width={24}
                        />
                      ) : null
                    }
                    title={item.title}
                    endContent={item.endContent}
                  />
                );
              }) ?? []}
            </ListboxSection>
          ))}
      </Listbox>
    </nav>
  );
};

export default MobileNavButtonLinks;
