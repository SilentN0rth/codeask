import { Image } from "@heroui/react";

export default function ProfileCardBackgroundImage({ backgroundUrl }: { backgroundUrl: string }) {
    return (
        <div className="pointer-events-none absolute inset-0 z-0 hidden max-sm:flex">
            <Image
                alt="Tło użytkownika"
                radius="sm"
                src={backgroundUrl}
                classNames={{
                    img: "w-full h-full object-cover",
                    wrapper: "!max-w-full w-full h-full opacity-20",
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cBgDark-800/100 to-cBgDark-800/5" />
        </div>
    );
}
