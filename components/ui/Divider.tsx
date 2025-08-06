import React from "react";

type DividerProps = {
    text: string;
    className?: string;
    position?: "left" | "center" | "right";
    orientation?: "horizontal" | "vertical";
    bgColor?: string;
};

const horizontalPositionMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
};

const verticalPositionMap = {
    left: "items-start",
    center: "items-center",
    right: "items-end",
};

const Divider = ({
    text,
    className = "",
    position = "center",
    orientation = "horizontal",
    bgColor = "bg-cBgDark-800",
}: DividerProps) => {
    if (orientation === "vertical") {
        return (
            <div className={`relative h-full ${className}`}>
                <div className="absolute inset-0 flex justify-center">
                    <div className="h-full border-l border-divider" />
                </div>
                <div className={`relative flex h-full flex-col justify-center ${verticalPositionMap[position]}`}>
                    <span
                        className={`${bgColor} px-3 text-sm text-default-500`}
                        style={{
                            transform: "rotate(90deg)",
                            transformOrigin: "center",
                            whiteSpace: "nowrap",
                        }}>
                        {text}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative my-6 w-full ${className}`}>
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-divider" />
            </div>
            <div className={`relative flex ${horizontalPositionMap[position]} px-3`}>
                <span className={`${bgColor} px-3 text-sm text-default-500`}>{text}</span>
            </div>
        </div>
    );
};

export default Divider;
