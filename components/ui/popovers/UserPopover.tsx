"use client";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import ExpandableText from "../ExpandableText";

const UserPopover = ({ subText = "", isAnswer = false }: { subText?: string; isAnswer?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    return (
        <Popover isOpen={isOpen} size="lg" onOpenChange={setIsOpen}>
            <PopoverTrigger>
                <Button
                    disableAnimation
                    disableRipple
                    radius="none"
                    className={`flex !scale-100 items-center gap-3  border-l-3 border-transparent !bg-transparent p-2 pl-0 text-left !transition-all ${isOpen && isAnswer ? "border-cCta-500 !pl-3" : "hover:border-cCta-500 hover:!pl-3"} ${isAnswer ? "!mb-3" : ""}`}
                    aria-expanded={isOpen}>
                    <Avatar size="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="avatar" />
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold text-cTextDark-100">Maksymilian Szewczyk</span>
                        <span className="text-xs text-default-400">{subText}</span>
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className=" border border-divider p-0 shadow-lg">
                <Card>
                    <CardHeader className="flex-column items-start px-6 pb-4 pt-6">
                        <div className="flex items-start justify-between gap-4">
                            {/* Lewa strona: Avatar + info */}
                            <div className="flex gap-4">
                                <Avatar size="lg" src="https://i.pravatar.cc/150?u=a04258114e29026702d" isBordered />
                                <div className="flex flex-col justify-center gap-4 ">
                                    <div className="flex items-end justify-between gap-x-4">
                                        <h4 className="text-xl font-semibold ">Manish Kumar</h4>
                                        <Button
                                            onPress={() => setIsFollowing((prev) => !prev)}
                                            className={`!h-fit px-4 py-2 text-sm ${isFollowing ? "bg-cCta-500 " : ""}`}
                                            startContent={
                                                <Icon
                                                    icon={isFollowing ? "mdi:star" : "mdi:star-outline"}
                                                    className={`text-lg ${isFollowing ? "text-yellow-400" : "text-cTextDark-100"}`}
                                                />
                                            }>
                                            {isFollowing ? "Obserwujesz" : "Obserwuj"}
                                        </Button>
                                    </div>
                                    <ExpandableText
                                        className="text-gray-300"
                                        icon={<Icon icon={"mdi:briefcase-outline"} className="mr-1.5 inline" />}
                                        as={"p"}
                                        clamp="line-clamp-3">
                                        Associate Software Engineer at Western Union Lorem. Lorem ipsum dolor, sit amet
                                        consectetur adipisicing elit. Nemo deserunt, aut dolorum facilis corrupti
                                        laborum facere? Tenetur natus aliquid possimus?
                                    </ExpandableText>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 items-center gap-x-6 gap-y-2 pl-[4.5rem] text-gray-300">
                            <span className=" flex items-center text-sm">
                                <Icon icon="mdi:star-circle-outline" className="mr-1.5" />
                                4,720 reputacji
                            </span>
                            <span className=" flex items-center text-sm">
                                <Icon icon="mdi:account-clock-outline" className="mr-1.5" />
                                Członek od 8 lat
                            </span>
                            <span className="flex items-center text-sm">
                                <Icon icon="mdi:account-multiple-outline" className="mr-1.5" />
                                125 obserwujących
                            </span>

                            <span className="flex items-center text-sm">
                                <Icon icon="mdi:account-plus-outline" className="mr-1.5" />
                                53 obserwowanych
                            </span>
                        </div>
                    </CardHeader>

                    <CardBody className="border-t border-divider px-6 py-4 text-gray-300">
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center">
                                <Icon icon="mdi:clock-outline" className=" mr-3 mt-0.5 shrink-0" />
                                <span className="">Ostatnio widziany więcej niż miesiąc temu</span>
                            </li>
                            <li className="flex items-center">
                                <Icon icon="mdi:web" className="mr-3 mt-0.5 shrink-0" />
                                <Link
                                    href="https://cliffymk.github.io"
                                    className="link-underline text-cCta-500 "
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    cliffymk.github.io
                                </Link>
                            </li>
                            <li className="flex items-center">
                                <Icon icon="mdi:map-marker-outline" className=" mr-3 mt-0.5 shrink-0" />
                                <span className="">Pune, Maharashtra, India</span>
                            </li>
                        </ul>
                    </CardBody>

                    <CardBody className="border-t border-divider bg-cBgDark-700 !p-0">
                        <div className="grid grid-cols-4 text-center">
                            {[
                                {
                                    icon: "mdi:star-circle",
                                    value: "4,720",
                                    label: "Reputacja",
                                },
                                {
                                    icon: "mdi:account-group",
                                    value: "4.9M",
                                    label: "Zasięg",
                                },
                                {
                                    icon: "mdi:comment-text-multiple",
                                    value: "147",
                                    label: "Odpowiedzi",
                                },
                                {
                                    icon: "mdi:help-circle",
                                    value: "32",
                                    label: "Pytania",
                                },
                            ].map((stat, index) => (
                                <div key={index} className="cursor-default p-5 transition-colors hover:bg-cBgDark-800">
                                    <p className="flex items-center justify-center text-xl font-bold ">
                                        <Icon icon={stat.icon} className="mr-1.5" /> {stat.value}
                                    </p>
                                    <p className="mt-1 text-xs uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </CardBody>

                    <CardFooter className="grid grid-cols-3 gap-px border-t border-divider bg-cBgDark-900 p-0">
                        <Button
                            as={Link}
                            href="/profile"
                            variant="light"
                            size="lg"
                            className="flex size-full justify-center rounded-none py-4 text-sm hover:bg-cBgDark-800"
                            startContent={<Icon icon="ph:user-bold" className="text-xl" />}>
                            Profil
                        </Button>
                        <Button
                            as={Link}
                            href="/users/activity"
                            variant="light"
                            size="lg"
                            className="flex size-full justify-center rounded-none py-4 text-sm hover:bg-cBgDark-800"
                            startContent={<Icon icon="mdi:clock-outline" className="text-xl" />}>
                            Aktywność
                        </Button>
                        <Button
                            as={Link}
                            href="/users/stats"
                            variant="light"
                            size="lg"
                            className="flex size-full justify-center rounded-none py-4 text-sm  hover:bg-cBgDark-800"
                            startContent={<Icon icon="mdi:chart-bar" className="text-xl" />}>
                            Statystyki
                        </Button>
                    </CardFooter>
                </Card>
            </PopoverContent>
        </Popover>
    );
};

export default UserPopover;
