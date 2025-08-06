import { notFound } from "next/navigation";
import PageProfileClient from "./page.client";
import { getUserById } from "@/services/server/users";

export default async function ProfilePage({ params }: { params: { id: string; slug: string } }) {
    const user = await getUserById(params.id);
    if (!user) return notFound();

    return (
        <div className="flex-column gap-6">
            <PageProfileClient user={user } />
        </div>
    );
}
