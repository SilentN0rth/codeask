import React from "react";

const Divider = ({ text }: { text: string }) => {
    return (
        <div className="relative my-6 w-full">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-divider" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-cBgDark-800 px-3 text-sm text-default-500">{text}</span>
            </div>
        </div>
    );
};

export default Divider;
