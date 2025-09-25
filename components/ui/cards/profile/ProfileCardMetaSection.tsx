import { UserInterface } from '@/types/users.types';
import { ProfileMeta } from './ProfileCardFull';
import Divider from '../../Divider';
import { formatDateMediumHelper as formatDateMedium } from '@/lib/utils/formatDate';

export default function ProfileCardMetaSection({
  author,
}: {
  author: UserInterface | null;
}) {
  return (
    <>
      <Divider position="left" className="!my-0" text="Informacje o koncie" />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6">
        <ProfileMeta
          icon="mdi:star-circle-outline"
          text={`${author?.reputation ?? 0} reputacji`}
        />
        <ProfileMeta
          icon="mdi:account-clock-outline"
          text={`Dołączył: ${author ? formatDateMedium(author.created_at) : ''}`}
        />
        <ProfileMeta
          icon="mdi:account-multiple-outline"
          text={`${author?.followers_count ?? 0} obserwujących`}
        />
        <ProfileMeta
          icon="mdi:account-plus-outline"
          text={`${author?.following_count ?? 0} obserwowanych`}
        />
        {author?.confirmed_at && (
          <ProfileMeta
            icon="mdi:check-decagram"
            className="col-span-full"
            text="Konto zweryfikowane"
          />
        )}
      </div>
    </>
  );
}
