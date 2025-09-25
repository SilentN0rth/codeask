import { UserInterface } from '@/types/users.types';
import { ProfileLink } from './ProfileCardFull';
import Divider from '../../Divider';

export default function ProfileCardLinksSection({
  user,
}: {
  user: UserInterface | null;
}) {
  const hasAnyLink = user?.website_url ?? user?.twitter_url ?? user?.github_url;

  if (!hasAnyLink) return null;

  return (
    <div className="flex-column w-full gap-y-4">
      <Divider position="left" className="!my-0 !mt-6" text="Linki" />
      <div className="flex flex-col gap-2 px-6">
        {user?.website_url && <ProfileLink href={user.website_url} />}
        {user?.twitter_url && <ProfileLink href={user.twitter_url} />}
        {user?.github_url && <ProfileLink href={user.github_url} />}
      </div>
    </div>
  );
}
