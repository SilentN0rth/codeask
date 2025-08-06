import { getUserById } from "@/services/server/users";
import { redirect } from "next/navigation";

interface Props {
    params: { id: string };
}

export default async function ProfileByIdPage({ params }: Props) {
    const user = await getUserById(params.id);

    if (!user) {
        redirect("/404");
    }

    redirect(`/users/${params.id}/${user.profile_slug as string}`);
}
