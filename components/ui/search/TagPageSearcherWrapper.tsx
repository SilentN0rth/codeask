'use client';
import TagPageSearcher from '@/components/ui/search/TagPageSearcher';
import { forwardRef } from 'react';
import { UserInterface } from '@/types/users.types';

const TagPageSearcherWrapper = forwardRef<
  { resetAllFilters: () => void },
  {
    className?: string;
    users?: UserInterface[];
  }
>(({ className, users = [] }, ref) => {
  return <TagPageSearcher ref={ref} className={className} users={users} />;
});

TagPageSearcherWrapper.displayName = 'TagPageSearcherWrapper';

export default TagPageSearcherWrapper;
