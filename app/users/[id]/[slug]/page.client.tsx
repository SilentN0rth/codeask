"use client";
import EditProfileForm from "@/components/layout/Profile/EditProfileForm";
import ProfileBackground from "@/components/layout/Profile/ProfileBackground";
import ProfileLatestActivity from "@/components/layout/Profile/ProfileLatestActivity";
// import ProfileStatistics from "@/components/layout/Profile/ProfileStatistics";
import ProfileCardFull from "@/components/ui/cards/profile/ProfileCardFull";
import Divider from "@/components/ui/Divider";
import { updateUserById } from "@/services/client/users";
import { UserInterface } from "@/types/users.types";
import { useAuthContext } from "context/useAuthContext";
import React, { useState } from "react";

const PageProfileClient = ({ user: initialUser }: { user: UserInterface | null }) => {
    const [user, setUser] = useState<UserInterface | null>(initialUser);
    const { refreshUser } = useAuthContext();
    const handleSubmit = async (formData: Partial<UserInterface>, onClose: () => void) => {
        if (!user) return;

        const { error } = await updateUserById(user.id, formData);

        if (!error) {
            setUser((prev) => (prev ? { ...prev, ...formData } : prev));
            await refreshUser();
            onClose();
        } else {
            console.error("Błąd podczas zapisu", error);
        }
    };

    return (
        user && (
            <div className="wrapper">
                <ProfileBackground user={user} />
                <div className="grid grid-cols-[1fr,50px,1fr] items-start gap-5 lg:mx-12 xl:mx-4 xl:mt-8">
                    <ProfileCardFull
                        enabledTabs={["activity", "profile", "stats"]}
                        className="z-20 col-span-full sm:mx-6 sm:-mt-28 xl:col-span-1 xl:mx-0"
                        author={user}
                    />
                    <Divider
                        text="EDYTUJ PROFIL"
                        orientation="vertical"
                        position="center"
                        bgColor="bg-cBgDark-900"
                        className="hidden h-full xl:col-span-1 xl:block"
                    />
                    <Divider
                        text="EDYTUJ PROFIL"
                        orientation="horizontal"
                        position="center"
                        bgColor="bg-cBgDark-900"
                        className="col-span-full w-full xl:hidden"
                    />
                    <EditProfileForm
                        defaultValues={{
                            name: user.name,
                            username: user.username,
                            avatar_url: user.avatar_url,
                            background_url: user.background_url,
                            bio: user.bio || "",
                            location: user.location || "",
                            website_url: user.website_url || "",
                            twitter_url: user.twitter_url || "",
                            github_url: user.github_url || "",
                            specialization: user.specialization,
                        }}
                        onSubmit={handleSubmit}
                        onClose={() => null}
                    />
                    <Divider
                        text="OSTATNIA AKTYWNOŚĆ"
                        position="center"
                        className="col-span-full "
                        orientation="horizontal"
                        bgColor="bg-cBgDark-900"
                    />
                    <ProfileLatestActivity user={user} />
                    <Divider
                        text="STATYSTYKI"
                        position="center"
                        className="col-span-full "
                        orientation="horizontal"
                        bgColor="bg-cBgDark-900"
                    />
                    {/* <ProfileStatistics user={user} /> */}
                </div>
            </div>
        )
    );
};

export default PageProfileClient;
