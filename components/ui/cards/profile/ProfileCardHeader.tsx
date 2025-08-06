import { CardHeader } from "@heroui/react";
import { UserInterface } from "@/types/users.types";
import ProfileCardBackgroundImage from "./ProfileCardBackgroundImage";
import ProfileCardHeaderActions from "./ProfileCardHeaderActions";
import ProfileCardMainInfo from "./ProfileCardMainInfo";
import ProfileCardBioSection from "./ProfileCardBioSection";
import ProfileCardLinksSection from "./ProfileCardLinksSections";

export default function ProfileCardHeader({
    author,
    onFollowChanged,
}: {
    onFollowChanged: () => void;
    author: UserInterface | null;
    isLoading: boolean;
}) {
    return (
        <CardHeader className="relative z-10 flex flex-col items-start px-6 ">
            {author?.background_url && <ProfileCardBackgroundImage backgroundUrl={author?.background_url} />}
            <ProfileCardHeaderActions
                author={author}
                onFollowChanged={onFollowChanged}
                // setAuthor={setAuthor}
            />
            <ProfileCardMainInfo user={author} />
            <ProfileCardBioSection user={author} />
            <ProfileCardLinksSection user={author} />
        </CardHeader>
    );
}
