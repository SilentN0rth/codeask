"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { TextProps, ExpandableTextProps } from "@/types/components.types";

const Text = ({ as: Component, children, className = "" }: TextProps) => {
    return <Component className={className}>{children}</Component>;
};

const ExpandableText = ({
    children,
    icon,
    as = "p",
    clamp = "line-clamp-1",
    className = "",
    textClassName = "",
}: ExpandableTextProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`text-sm ${className} w-96`}>
            <div className={`${isExpanded ? "" : clamp}`}>
                <Text as={as} className={textClassName}>
                    {icon}
                    {children}
                </Text>
            </div>
            <Button
                disableAnimation
                disableRipple
                onPress={() => setIsExpanded((prev) => !prev)}
                type="button"
                radius="none"
                className="link-underline block !h-fit !min-w-fit overflow-visible !bg-transparent !p-0 text-cCta-500">
                {isExpanded ? "Zwiń" : "Rozwiń więcej"}
            </Button>
        </div>
    );
};

export default ExpandableText;
