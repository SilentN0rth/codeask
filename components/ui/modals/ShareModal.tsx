"use client";

import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
    Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import Divider from "../Divider";
import { ShareModalProps } from "@/types/modals.types";

const ShareModal: React.FC<ShareModalProps> = ({ questionId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [copied, setCopied] = useState(false);

    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/questions/${questionId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const openInNewTab = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <Tooltip content="Udostępnij">
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={onOpen}
                    className="text-default-500 hover:text-foreground">
                    <Icon icon="solar:share-line-duotone" className="text-xl" />
                </Button>
            </Tooltip>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                size="md"
                backdrop="opaque"
                shadow="lg">
                <ModalContent className="bg-cBgDark-800">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 pb-0 pt-4">Udostępnij pytanie</ModalHeader>
                            <ModalBody className="w-full space-y-4">
                                <p className="text-sm text-default-500">
                                    Skopiuj link lub udostępnij pytanie w serwisach społecznościowych.
                                </p>

                                <Input
                                    readOnly
                                    value={shareUrl}
                                    classNames={{
                                        base: "group",
                                        inputWrapper:
                                            "bg-cBgDark-700 group-hover:bg-cBgDark-700/50 border border-divider pr-[2.5px]",
                                    }}
                                    endContent={
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            className="transition-colors group-hover:bg-cCta-500"
                                            onPress={handleCopy}>
                                            {copied ? "Skopiowano!" : "Kopiuj"}
                                        </Button>
                                    }
                                />

                                <Divider text="ALBO" />

                                <div className="!mt-0 flex justify-center gap-2">
                                    <Tooltip content="Udostępnij na X (Twitter)">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onPress={() =>
                                                openInNewTab(
                                                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`
                                                )
                                            }>
                                            <Icon icon="prime:twitter" className="text-base" />
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="Udostępnij na Facebooku">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onPress={() =>
                                                openInNewTab(
                                                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
                                                )
                                            }>
                                            <Icon icon="ic:baseline-facebook" className="text-xl text-[#1877F2]" />
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="Udostępnij na LinkedIn">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onPress={() =>
                                                openInNewTab(
                                                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
                                                )
                                            }>
                                            <Icon icon="mdi:linkedin" className="text-xl text-[#0A66C2]" />
                                        </Button>
                                    </Tooltip>

                                    <Tooltip content="Wyślij e-mailem">
                                        <Button
                                            isIconOnly
                                            variant="light"
                                            onPress={() =>
                                                openInNewTab(
                                                    `mailto:?subject=Zobacz to pytanie&body=${encodeURIComponent(shareUrl)}`
                                                )
                                            }>
                                            <Icon icon="mdi:email-outline" className="text-xl text-[#F97316] " />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="solid" className="bg-cBgDark-700" onPress={onClose}>
                                    Zamknij
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ShareModal;
