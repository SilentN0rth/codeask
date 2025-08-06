"use client";

import React from "react";
import ProfileStatCard from "@/components/ui/cards/profile/ProfileStatCard";
import { UserInterface } from "@/types/users.types";

const ProfileStatistics = ({ user }: { user: UserInterface | null }) => {
    if (!user) return null;

    const stats = [
        {
            title: "Pytania",
            color: "primary" as const,
            total: user.questions_count,
            chartData: [
                {
                    name: "Zadane pytania",
                    value: user.questions_count,
                },
            ],
        },
        {
            title: "Odpowiedzi",
            color: "secondary" as const,
            total: user.answers_count,
            chartData: [
                {
                    name: "Udzielone odpowiedzi",
                    value: user.answers_count,
                },
            ],
        },
        {
            title: "Obserwujący",
            color: "success" as const,
            total: user.followers_count,
            chartData: [
                {
                    name: "Obserwujący",
                    value: user.followers_count,
                },
            ],
        },
        {
            title: "Obserwowani",
            color: "warning" as const,
            total: user.following_count,
            chartData: [
                {
                    name: "Obserwowani",
                    value: user.following_count,
                },
            ],
        },
    ];

    return (
        <dl className="col-span-full grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
                <ProfileStatCard key={index} {...item} />
            ))}
        </dl>
    );
};

export default ProfileStatistics;
