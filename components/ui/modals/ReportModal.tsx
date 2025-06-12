"use client";

import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
    Tooltip,
    Form,
    addToast,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToastActionCooldown } from "hooks/useToastActionCooldown";
import { ReportTargetType, ReportModalProps, ReportForm } from "@/types/modals.types";
import { reportSchema } from "@/lib/schemas/report.schema";

const getTitle = (type: ReportTargetType) => {
    switch (type) {
        case "question":
            return "Zgłoś pytanie";
        case "answer":
            return "Zgłoś odpowiedź";
        case "user":
            return "Zgłoś użytkownika";
        default:
            return "Zgłoszenie";
    }
};

const getDescription = (type: ReportTargetType) => {
    switch (type) {
        case "question":
            return "Chcesz zgłosić pytanie, które narusza regulamin - zawiera spam, treści nieodpowiednie lub jest całkowicie nie na temat? Prosimy o dokładne wyjaśnienie, dlaczego uważasz to pytanie za niewłaściwe. Twoje zgłoszenie pomoże nam utrzymać wysoką jakość treści.";
        case "answer":
            return "Chcesz zgłosić odpowiedź, która łamie zasady - np. jest obraźliwa, wprowadza w błąd albo nie odnosi się do pytania? Opisz dokładnie, dlaczego zgłaszasz tę odpowiedź. Pomóż nam dbać o merytoryczność dyskusji.";
        case "user":
            return "Chcesz zgłosić użytkownika, którego zachowanie jest nieodpowiednie - np. obraża innych, spamuje lub łamie zasady platformy? Podaj konkretne przykłady i uzasadnij swoje zgłoszenie. Pomoże nam to w podjęciu właściwych działań.";
        default:
            return "";
    }
};

const ReportModal: React.FC<ReportModalProps> = ({ type, targetId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isActive: isReported, handleClick: handleReportToast } = useToastActionCooldown({
        addToast,
        disableButton: true,
        cooldownMs: 5000,
        onSuccessMessage: {
            title: "Zgłoszenie wysłane",
            description: "Dziękujemy za zgłoszenie. Zostanie ono niezwłocznie przeanalizowane.",
            icon: <Icon icon="solar:shield-check-bold" />,
        },
        onFailMessage: {
            title: "Zgłoszenie już było wysłane",
            description: "To zgłoszenie zostało już przyjęte.",

            icon: <Icon icon="solar:shield-check-outline" />,
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ReportForm>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            reason: "",
            email: "",
        },
    });

    const onSubmit = (data: ReportForm, onClose: () => void) => {
        console.log("Zgłoszono", { type, targetId, ...data });
        handleReportToast();
        reset();
        onClose();
    };

    const handleClose = (onClose: () => void) => {
        reset();
        onClose();
    };

    return (
        <>
            <Tooltip content={isReported ? "Zgłoszono" : getTitle(type)}>
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={isReported ? undefined : onOpen}
                    className={isReported ? "text-danger-500" : "text-default-500 hover:text-danger"}
                    isDisabled={isReported}>
                    <Icon icon="solar:danger-triangle-outline" className="text-xl" />
                </Button>
            </Tooltip>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                size="lg"
                backdrop="opaque"
                shadow="lg">
                <ModalContent className="bg-cBgDark-800">
                    {(onClose) => (
                        <Form onSubmit={handleSubmit((data) => onSubmit(data, onClose))}>
                            <ModalHeader className="flex flex-col gap-1 pb-0 pt-4 ">{getTitle(type)}</ModalHeader>
                            <ModalBody className="w-full ">
                                <p className="mb-2 text-sm text-default-500">{getDescription(type)}</p>

                                <Controller
                                    name="reason"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            label="Powód zgłoszenia"
                                            classNames={{
                                                inputWrapper:
                                                    "bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider",
                                            }}
                                            isInvalid={!!errors.reason}
                                            errorMessage={errors.reason?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            label="Twój e-mail"
                                            classNames={{
                                                inputWrapper:
                                                    "bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider",
                                            }}
                                            isInvalid={!!errors.email}
                                            errorMessage={errors.email?.message}
                                        />
                                    )}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="solid" className="bg-cBgDark-700" onPress={() => handleClose(onClose)}>
                                    Anuluj
                                </Button>
                                <Button color="primary" type="submit">
                                    Zgłoś
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ReportModal;
