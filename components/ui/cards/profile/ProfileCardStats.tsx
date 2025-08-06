import { CardBody } from "@heroui/react";
import { UserInterface } from "@/types/users.types";
import { SvgIcon } from "@/lib/utils/icons";

export default function ProfileCardStats({
    author,
}: {
    author: UserInterface | null;
}) {
    const stats = [
        { icon: "mdi:help-circle", label: "Pytania", value: author?.questions_count },
        { icon: "mdi:comment-text-multiple", label: "Odpowiedzi", value: author?.answers_count },
        { icon: "mdi:star-circle", label: "Reputacja", value: author?.reputation },
    ];

    return (
        <CardBody className="border-t border-divider bg-cBgDark-700 !p-0">
            <div className="grid grid-cols-3 text-center">
                {stats.map((stat, index) => (
                    <div key={index} className="cursor-default px-3 py-5 transition-colors hover:bg-cBgDark-800">
                        <p className="flex items-center justify-center gap-2 text-lg font-bold lg:text-xl">
                            <SvgIcon icon={stat.icon} className="mr-0.5" />
                            {stat.value}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>
        </CardBody>
    );
}
