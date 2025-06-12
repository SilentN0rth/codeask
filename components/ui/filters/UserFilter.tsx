"use client";

import { Avatar } from "@heroui/react";
import UniversalFilter from "./UniversalLocalFilter";
import { USERS } from "@/constants/SearchAndFilters";
import { ClassName } from "@/types/index.types";

const UserFilter = ({
    className,
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
} & ClassName) => {
    return (
        <UniversalFilter
            items={USERS}
            className={className}
            value={value}
            onChange={onChange}
            ariaLabel="Użytkownik"
            renderItem={(item) => (
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2 transition-transform group-hover:translate-x-[10%]">
                        <Avatar alt={item.name} className="shrink-0" size="sm" src={item.avatarUrl} />
                        <div className="flex flex-col">
                            <span className="text-small">{item.name}</span>
                            <span className="text-tiny text-default-400">{item.role}</span>
                        </div>
                    </div>
                </div>
            )}
        />
    );
};

export default UserFilter;
