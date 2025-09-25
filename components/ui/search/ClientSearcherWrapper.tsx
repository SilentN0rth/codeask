'use client';
import LocalQuestionSearcher from '@/components/ui/search/LocalQuestionSearcher';
import { forwardRef } from 'react';
import { UserInterface } from '@/types/users.types';

const ClientSearcherWrapper = forwardRef<
  { resetAllFilters: () => void },
  {
    className?: string;
    users?: UserInterface[];
  }
>(({ className, users = [] }, ref) => {
  return (
    <LocalQuestionSearcher ref={ref} className={className} users={users} />
  );
});

ClientSearcherWrapper.displayName = 'ClientSearcherWrapper';

export default ClientSearcherWrapper;
