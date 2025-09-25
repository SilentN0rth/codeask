'use client';

import LocalTagSearcher from '@/components/ui/search/LocalTagSearcher';
import { forwardRef } from 'react';

const TagsPageClient = forwardRef<{ resetAllFilters: () => void }, object>(
  (props, ref) => {
    return <LocalTagSearcher ref={ref} />;
  }
);

TagsPageClient.displayName = 'TagsPageClient';

export default TagsPageClient;
