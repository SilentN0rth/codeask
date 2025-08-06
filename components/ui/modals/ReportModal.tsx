"use client";

import React, { useEffect } from "react";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    Form,
    addToast,
} from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema } from "@/lib/schemas/report.schema";
import { ReportTargetType, ReportForm } from "@/types/modals.types";
import { SvgIcon } from "@/lib/utils/icons";
import { useAuthContext } from "context/useAuthContext";
import { useToastActionCooldown } from "hooks/useToastActionCooldown";

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

type ReportModalProps = {
    type: ReportTargetType;
    targetId: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export const ReportModal: React.FC<ReportModalProps> = ({ type, targetId, isOpen, onOpenChange }) => {
    const { user } = useAuthContext();

    const { isActive: isReported, handleClick: handleReportToast } = useToastActionCooldown({
        addToast,
        disableButton: true,
        cooldownMs: 5000,
        onSuccessMessage: {
            title: "Zgłoszenie wysłane",
            description: "Dziękujemy za zgłoszenie. Zostanie ono niezwłocznie przeanalizowane.",
            icon: <SvgIcon icon="solar:shield-check-bold" />,
        },
        onFailMessage: {
            title: "Zgłoszenie już było wysłane",
            description: "To zgłoszenie zostało już przyjęte.",
            icon: <SvgIcon icon="solar:shield-check-outline" />,
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

    useEffect(() => {
        if (user?.email) {
            reset((prev) => ({ ...prev, email: user.email }));
        }
    }, [user?.email, reset]);

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
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="lg" backdrop="opaque" shadow="lg">
            <ModalContent className="bg-cBgDark-800">
                {(onClose) => (
                    <Form onSubmit={handleSubmit((data) => onSubmit(data, onClose))}>
                        <ModalHeader className="flex flex-col gap-1 pb-0 pt-4">{getTitle(type)}</ModalHeader>
                        <ModalBody className="w-full">
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
                                        isDisabled={!!user}
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
                            <Button color="primary" type="submit" isDisabled={isReported}>
                                Zgłoś
                            </Button>
                        </ModalFooter>
                    </Form>
                )}
            </ModalContent>
        </Modal>
    );
};
