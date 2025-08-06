"use client";

import ErrorWrapper from "@/components/layout/ErrorWrapper";
import UserCard from "@/components/ui/cards/UserCard";
import PageTitle from "@/components/ui/PageTitle";
import LocalUserSearcher from "@/components/ui/search/LocalUserSearcher";
import { UserInterface } from "@/types/users.types";
import { useSidebarContext } from "context/LeftSidebarContext";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@heroui/react";

const PER_PAGE = 30;

export default function PageClient({ users }: { users: UserInterface[] }) {
    const { isCompact } = useSidebarContext();
    const { paginatedItems, currentPage, totalPages, setPage } = usePagination(users, PER_PAGE);

    return (
        <div className="wrapper">
            {paginatedItems.length > 0 ? (
                <>
                    <PageTitle title="Użytkownicy" />
                    <LocalUserSearcher />
                    <div
                        className={`grid gap-3 ${
                            isCompact ? "lg:grid-cols-2 2xl:grid-cols-3" : "xl:grid-cols-2 4xl:grid-cols-3"
                        }`}>
                        {paginatedItems.map((user) => (
                            <UserCard user={user} key={user.id} />
                        ))}

                        <Pagination
                            classNames={{
                                item: "bg-cBgDark-700",
                                cursor: "rounded-sm bg-cCta-500",
                                prev: "bg-cBgDark-700",
                                next: "bg-cBgDark-700",
                            }}
                            className="col-span-full mx-auto mt-4"
                            isCompact
                            showControls
                            page={currentPage}
                            total={totalPages}
                            onChange={setPage}
                        />
                    </div>
                </>
            ) : (
                <ErrorWrapper />
            )}
        </div>
    );
}
