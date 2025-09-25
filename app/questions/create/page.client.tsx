'use client';

import PageTitle from '@/components/ui/PageTitle';
import QuestionForm from '@/components/layout/Questions/QuestionForm';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';

export default function CreateQuestion({ userId }: { userId: string }) {
  const titleAnimation = useFadeIn(30, 0.4);
  const formAnimation = useFadeIn(40, 0.6);

  return (
    <motion.div
      className="wrapper flex-column gap-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div {...titleAnimation}>
        <PageTitle
          title="Utwórz pytanie"
          icon="solar:add-square-broken"
          description="Zadaj nowe pytanie społeczności"
          className="mb-3"
        />
      </motion.div>

      <motion.div {...formAnimation}>
        <QuestionForm userId={userId} />
      </motion.div>
    </motion.div>
  );
}
