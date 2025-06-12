import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { SidebarItem } from "@/types/sidebar.types";
import TeamAvatar from "@/components/ui/sidebar/TeamAvatar";

export const sectionItems: SidebarItem[] = [
    {
        key: "overview",
        title: "Przeglądaj",
        items: [
            {
                key: "questions",
                icon: "solar:home-2-linear",
                href: "/questions",
                title: "Wszystkie pytania",
            },
            {
                key: "questions/create",
                icon: "solar:add-square-broken",
                href: "/questions/create",
                title: "Utwórz pytanie",
                endContent: (
                    <Icon
                        className="text-default-400 group-data-[active-link=true]:text-cTextDark-100"
                        icon="solar:add-circle-line-duotone"
                        width={24}
                    />
                ),
            },
            {
                key: "tags",
                href: "/tags",
                icon: "solar:tag-outline",
                title: "Tagi",
            },
            {
                key: "jobs",
                href: "/jobs",
                icon: "mdi:worker-outline",
                title: "Oferty Pracy",
                endContent: (
                    <Chip size="sm" color="primary" className="animate-pulse" variant="flat">
                        19
                    </Chip>
                ),
            },
            
            {
                key: "users",
                href: "/users",
                icon: "solar:users-group-two-rounded-outline",
                title: "Użytkownicy",
            },
            {
                key: "chat",
                href: "/chat",
                icon: "streamline-flex:user-collaborate-group",
                title: "Czat",
            },
        ],
    },
    {
        key: "your-data",
        title: "Moje centrum",
        items: [
            {
                key: "statistics",
                href: "/account/{yourId}/statistics",
                icon: "solar:chart-outline",
                title: "Statystyki",
                endContent: (
                    <Chip size="sm" color="primary" variant="flat">
                        NOWOŚĆ
                    </Chip>
                ),
            },
            {
                key: "perks",
                href: "/account/{yourId}/perks",
                icon: "solar:gift-linear",
                title: "Bonusy",
                endContent: (
                    <Chip size="sm" color="primary" variant="flat">
                        3
                    </Chip>
                ),
            },
            {
                key: "group",
                href: "/group",
                icon: "iconoir:message",
                title: "Grupa",
            },
            {
                key: "settings",
                href: "/account/{yourId}/settings",
                icon: "solar:settings-outline",
                title: "Ustawienia",
            },
        ],
    },
    {
        key: "leaders",
        title: "Najaktywniejsi",
        className: "hidden sm:flex",
        items: [
            {
                key: "top1",
                href: "/leaderboard/{userTop1}",
                title: "🥇 Andrzej Kus",
                "aria-label": "1 miejsce - Andrzej Kus",
                startContent: <TeamAvatar src="https://i.pravatar.cc/150?img=8" name="Hero UI" />,
                endContent: (
                    <Chip size="sm" variant="flat">
                        3940 exp
                    </Chip>
                ),
            },
            {
                key: "top2",
                href: "/leaderboard/{userTop2}",
                title: "🥈 Agnieszka Biała",
                "aria-label": "2 miejsce - Agnieszka Biała",
                startContent: <TeamAvatar src="https://i.pravatar.cc/150?img=32" name="Agnieszka Biała" />,
                endContent: (
                    <Chip size="sm" variant="flat">
                        3510 exp
                    </Chip>
                ),
            },
            {
                key: "top3",
                href: "/leaderboard/{userTop3}",
                title: "🥉 Bartłomiej Sroka",
                "aria-label": "3 miejsce - Bartłomiej Sroka",
                startContent: <TeamAvatar src="https://i.pravatar.cc/150?img=33" name="Bartłomiej Sroka" />,
                endContent: (
                    <Chip size="sm" variant="flat">
                        2830 exp
                    </Chip>
                ),
            },
        ],
    },
];
