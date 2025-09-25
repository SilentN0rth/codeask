import { SvgIcon } from '@/lib/utils/icons';
import { TagChipProps } from '@/types/tags.types';
import { Chip, Button } from '@heroui/react';
import { useState } from 'react';

export const TagChip = ({ tag, removeTag }: TagChipProps) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Chip
      key={tag}
      radius="sm"
      size="md"
      className={`border bg-transparent text-sm transition-colors ${
        isHover ? 'border-danger bg-danger/10 text-danger' : 'border-divider'
      }`}
      endContent={
        <Button
          onPress={() => removeTag(tag)}
          isIconOnly
          className="ml-0.5 mr-1.5 flex h-fit w-full min-w-fit items-center justify-center bg-transparent hover:bg-red-500"
          startContent={<SvgIcon icon="mdi:close" className="size-4" />}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        />
      }
    >
      {tag}
    </Chip>
  );
};
