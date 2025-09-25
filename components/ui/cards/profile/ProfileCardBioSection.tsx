import ExpandableText from '../../ExpandableText';
import { ProfileMeta } from './ProfileCardFull';
import { UserInterface } from '@/types/users.types';
import { SvgIcon } from '@/lib/utils/icons';
import { getRelativeTimeFromNow } from '@/lib/utils/getRelativeTimeFromNow';
import { cn } from '@heroui/react';
export default function ProfileCardBioSection({
  user,
}: {
  user: UserInterface | null;
}) {
  const hasBio = !!user?.bio;
  const hasLocation = !!user?.location;
  const hasActivity = !!user?.last_sign_in_at;
  const isOnline = user?.is_online ?? false;

  const renderMeta = (extraClass = '') => (
    <>
      {hasLocation && (
        <ProfileMeta
          icon="mdi:map-marker-outline"
          text={user?.location as string}
          className={extraClass}
        />
      )}
      {hasActivity && (
        <ProfileMeta
          icon="mdi:clock-outline"
          text={
            isOnline
              ? 'Online'
              : `Ostatnio aktywny: ${getRelativeTimeFromNow(user?.last_sign_in_at ?? '')}`
          }
          className={cn(extraClass, {
            'text-success-500': isOnline,
          })}
        />
      )}
    </>
  );

  if (!hasBio && !hasLocation && !hasActivity) return null;

  return (
    <div className="z-10 mt-4 space-y-2 text-sm text-cMuted-500">
      {hasBio && user?.bio && user.bio.length > 150 ? (
        <ExpandableText
          className="z-[300] w-full"
          icon={
            <SvgIcon width={18} icon="codicon:book" className="mr-1.5 inline" />
          }
          as="p"
          clamp="line-clamp-3"
        >
          {user.bio}
          {renderMeta()}
        </ExpandableText>
      ) : (
        <>
          {hasBio && user?.bio && (
            <p className="">
              <SvgIcon
                width={18}
                icon="codicon:book"
                className="mr-1.5 inline"
              />
              {user.bio}
            </p>
          )}
          {renderMeta(hasBio ? 'mt-2' : '')}
        </>
      )}
    </div>
  );
}
