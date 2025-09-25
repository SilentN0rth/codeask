import { UserInterface } from '@/types/users.types';
import Divider from '../../Divider';
import BadgeIcon from '../../badges/BadgeIcon';

export default function ProfileCardBadges({
  user,
  className,
}: {
  user: UserInterface | null;
  className?: string;
}) {
  const badges = user?.badges;
  if (!badges) return null;

  const hasLegacyBadges =
    (badges.gold ?? 0) > 0 ||
    (badges.silver ?? 0) > 0 ||
    (badges.bronze ?? 0) > 0;
  const hasSpecialBadges =
    (badges.first_question ?? false) ||
    (badges.first_answer ?? false) ||
    (badges.helpful_answer ?? false) ||
    (badges.popular_question ?? false) ||
    (badges.active_user ?? false) ||
    (badges.expert ?? false) ||
    (badges.community_companion ?? false) ||
    (badges.community_helper ?? false);

  if (!hasLegacyBadges && !hasSpecialBadges) return null;

  return (
    <>
      <Divider position="left" className="!my-0" text="Odznaki" />

      <div className={`px-6 ${className}`}>
        {hasLegacyBadges && (
          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
            {(badges.gold ?? 0) > 0 && (
              <BadgeIcon type="gold" count={badges.gold ?? 0} />
            )}
            {(badges.silver ?? 0) > 0 && (
              <BadgeIcon type="silver" count={badges.silver ?? 0} />
            )}
            {(badges.bronze ?? 0) > 0 && (
              <BadgeIcon type="bronze" count={badges.bronze ?? 0} />
            )}
          </div>
        )}

        {hasSpecialBadges && (
          <div className="flex flex-wrap items-center gap-2">
            {badges.first_question && <BadgeIcon type="first_question" />}
            {badges.first_answer && <BadgeIcon type="first_answer" />}
            {badges.helpful_answer && <BadgeIcon type="helpful_answer" />}
            {badges.popular_question && <BadgeIcon type="popular_question" />}
            {badges.active_user && <BadgeIcon type="active_user" />}
            {badges.expert && <BadgeIcon type="expert" />}
            {badges.community_companion && (
              <BadgeIcon type="community_companion" />
            )}
            {badges.community_helper && <BadgeIcon type="community_helper" />}
          </div>
        )}
      </div>
    </>
  );
}
