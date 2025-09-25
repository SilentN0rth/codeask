'use client';

import { useDisclosure } from '@heroui/react';
import HamburgerMenu from './HamburgerMenu';
import HamburgerMenuBtn from './HamburgerMenuBtn';
import NavbarLogo from './NavbarLogo';
import { QuestionCardProps } from '@/types/questions.types';
import { Tag } from '@/types/tags.types';
import ProgressBar from '@/components/ui/ProgressBar';

type Props = {
  questions: QuestionCardProps[];
  tags: Tag[];
};

export default function Navbar({ questions, tags }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <ProgressBar />
      <nav
        className="fixed inset-x-0 z-[100] flex items-center justify-between gap-6 bg-cBgDark-800 px-6 py-4 text-background shadow-md backdrop-blur-sm"
        aria-label="Główna nawigacja"
      >
        <NavbarLogo />
        <HamburgerMenuBtn onOpen={onOpen} />
        <HamburgerMenu
          questions={questions}
          tags={tags}
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
        />
      </nav>
    </>
  );
}
