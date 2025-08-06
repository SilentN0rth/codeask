"use client";

import { Avatar } from "@heroui/react";
import UniversalFilter from "./UniversalLocalFilter";
import { ClassName } from "@/types/index.types";
import { useState, useEffect } from "react";
import { UserInterface } from "@/types/users.types";
import { getUsers } from "@/services/server/users";

const UserFilter = ({
    className,
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
} & ClassName) => {
    const [users, setUsers] = useState<UserInterface[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        };

        fetchTags();
    }, []);
    return (
        <UniversalFilter
            items={users}
            className={className}
            value={value}
            onChange={onChange}
            ariaLabel="Użytkownik"
            renderItem={(item) => (
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2 transition-transform group-hover:translate-x-[7%]">
                        <Avatar alt={item.name} className="shrink-0" size="sm" src={item.avatar_url} />
                        <div className="flex flex-col">
                            <span className="text-small">{item.name}</span>
                            <span className="text-tiny text-default-400">{item.specialization}</span>
                        </div>
                    </div>
                </div>
            )}
        />
    );
};

export default UserFilter;
