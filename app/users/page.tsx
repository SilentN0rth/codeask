import { getUsers } from "@/services/server/users";
import PageClient from "./page.client";
import { SortUserOption } from "@/types/searchAndFilters.types";

type Props = {
    searchParams?: {
        search?: string;
        sort?: string;
    };
};

export default async function Page({ searchParams }: Props) {
    const users = await getUsers({
        search: searchParams?.search,
        sort: searchParams?.sort as SortUserOption,
    });

    if (!users) {
        return <div>Nie udało się załadować użytkowników.</div>;
    }

    return <PageClient users={users} />;
}
