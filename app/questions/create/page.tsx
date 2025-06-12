import { getUserById } from "@/lib/actions/getUser.action";

import { redirect } from "next/navigation";
import CreateQuestion from "./page.client";

export default async function Page() {
    //   const { userId } = auth();
    const userId = "user_abc123xyz";
    if (!userId) redirect("/login");

    const mongoUser = await getUserById({ userId });
    if (!mongoUser) redirect("/login"); // dodatkowa ochrona

    return <CreateQuestion mongoUserId={JSON.stringify(mongoUser._id)} />;
}
