'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { motion } from 'framer-motion';
import MobileNavButtonLinks from '../Navbar/MobileNavButtonLinks';
import NewestQuestions from '../Navbar/NewestQuestions';
import { QuestionCardProps } from '@/types/questions.types';
import { Tag } from '@/types/tags.types';
import PopularTags from './PopularTags';
import PageTitle from '@/components/ui/PageTitle';
import { useFadeIn } from '@/lib/animations/useFadeIn';

type Props = {
  questions: QuestionCardProps[];
  tags: Tag[];
  onClose?: () => void;
};

const ClientRightSidebarContent = ({ questions, tags, onClose }: Props) => {
  const questionsAnimation = useFadeIn(20, 0.1);
  const tagsAnimation = useFadeIn(20, 0.2);

  return (
    <>
      <MobileNavButtonLinks onClose={onClose} />

      <motion.div {...questionsAnimation} className="mt-0 md:mt-8 3xl:mt-0">
        <PageTitle
          title="Najnowsze pytania"
          icon="mdi:help-circle-outline"
          description="Ostatnio dodane pytania w społeczności"
          parentClasses="mb-5 flex-row"
          className="text-lg"
          as="h2"
        />
        <Card
          shadow="none"
          className="rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm"
        >
          <CardBody className="p-4">
            <NewestQuestions questions={questions} onClose={onClose} />
          </CardBody>
        </Card>
      </motion.div>

      <motion.div {...tagsAnimation} className="mt-8">
        <PageTitle
          title="Popularne tagi"
          icon="solar:tag-outline"
          description="Najczęściej używane kategorie"
          parentClasses="mb-5"
          className="text-lg"
          as="h2"
        />
        <Card
          shadow="none"
          className="rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm"
        >
          <CardBody className="p-4">
            <PopularTags tags={tags} onClose={onClose} />
          </CardBody>
        </Card>
      </motion.div>
    </>
  );
};

export default ClientRightSidebarContent;
