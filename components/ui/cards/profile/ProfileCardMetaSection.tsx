import { UserInterface } from "@/types/users.types";
import { ProfileMeta } from "./ProfileCardFull";
import Divider from "../../Divider";

export default function ProfileCardMetaSection({
    author,
}: {
    author: UserInterface | null;
}) {
    return (
        <>
            <Divider position="left" className="!my-0" text="Informacje o koncie" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6">
                <ProfileMeta icon="mdi:star-circle-outline" text={`${author?.reputation} reputacji`} />
                <ProfileMeta
                    icon="mdi:account-clock-outline"
                    text={`Dołączył: ${author ? new Date(author.created_at).toLocaleDateString("pl-PL") : ""}`}
                />
                <ProfileMeta icon="mdi:account-multiple-outline" text={`${author?.followers_count} obserwujących`} />
                <ProfileMeta icon="mdi:account-plus-outline" text={`${author?.following_count} obserwowanych`} />
                {author?.confirmed_at && (
                    <ProfileMeta icon="mdi:check-decagram" className="col-span-full" text={`Konto zweryfikowane`} />
                )}
            </div>
        </>
    );
}
