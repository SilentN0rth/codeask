import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import LikeDislikeButtons from "../LikeDislikeButtons";
import SlideUpText from "../effects/SlideUpText";

const QuestionMeta = () => (
    <div className="flex flex-wrap items-end justify-between text-sm text-default-500">
        <ul className="flex text-sm text-default-600">
            <li>
                <p>
                    Edytowano: <SlideUpText className="text-default-500">dziś, 6 czerwca</SlideUpText>
                </p>
            </li>
            <li className="ml-7 list-disc">
                <p>
                    Wyświetlono: <SlideUpText className="text-default-500">8 razy</SlideUpText>
                </p>
            </li>
        </ul>
        <div className="flex flex-wrap items-center text-default-500">
            <LikeDislikeButtons initialLikes={12} initialDislikes={3} />

            <Button
                as={Link}
                href="#answers"
                size="sm"
                variant="light"
                className="flex items-center gap-1 text-default-600 hover:text-foreground"
                startContent={<Icon icon="solar:chat-dots-linear" className="text-lg" />}>
                18 odpowiedzi
            </Button>
        </div>
    </div>
);

export default QuestionMeta;
