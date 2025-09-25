'use server';

import { supabase } from 'supabase/supabaseClient';
import { BadgeType, BADGE_DEFINITIONS } from '@/types/badges.types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BadgeAwardResult {
  badgeType: string;
  success: boolean;
  message?: string;
}

type BadgeAction =
  | 'question_created'
  | 'answer_created'
  | 'answer_liked'
  | 'daily_active'
  | 'user_followed'
  | 'reputation_changed';

// ============================================================================
// MAIN BADGE CHECKING FUNCTION
// ============================================================================

export async function checkAndAwardBadges(
  userId: string,
  action: BadgeAction
): Promise<BadgeAwardResult[]> {
  const results: BadgeAwardResult[] = [];

  try {
    const user = await fetchUserData(userId);
    if (!user) return results;

    const currentBadges = getUserBadges(user);

    // Check action-specific badges
    await checkActionSpecificBadges(
      action,
      userId,
      user,
      currentBadges,
      results
    );

    // Check universal badges (always checked)
    await checkUniversalBadges(userId, user, currentBadges, results);
  } catch (error) {
    console.error('Error checking badges:', error);
  }

  return results;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function fetchUserData(userId: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) {
    console.error('Error fetching user:', error);
    return null;
  }

  return user;
}

function getUserBadges(user: any) {
  return (
    user.badges || {
      gold: 0,
      silver: 0,
      bronze: 0,
      first_question: false,
      first_answer: false,
      helpful_answer: false,
      popular_question: false,
      active_user: false,
      expert: false,
      community_companion: false,
      community_helper: false,
    }
  );
}

async function checkActionSpecificBadges(
  action: BadgeAction,
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  switch (action) {
    case 'question_created':
      await checkQuestionBadges(userId, user, currentBadges, results);
      break;
    case 'answer_created':
      await checkAnswerBadges(userId, user, currentBadges, results);
      break;
    case 'answer_liked':
      await checkLikeBadges(userId, user, currentBadges, results);
      break;
    case 'daily_active':
      await checkActivityBadges(userId, user, currentBadges, results);
      break;
    case 'user_followed':
      // Community badges are checked in checkUniversalBadges
      break;
    case 'reputation_changed':
      await checkReputationBadges(userId, user, currentBadges, results);
      break;
  }
}

async function checkUniversalBadges(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  await checkCommunityBadges(userId, user, currentBadges, results);
  await checkExpertBadges(userId, user, currentBadges, results);
}

// ============================================================================
// BADGE CHECKING FUNCTIONS
// ============================================================================

async function checkQuestionBadges(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  // 🎯 First Question Badge
  if (!currentBadges.first_question && user.questions_count >= 1) {
    await awardBadge(userId, 'first_question', results);
  }

  // 🔥 Popular Question Badge
  await checkSingleThresholdBadge(
    userId,
    currentBadges,
    'popular_question',
    'questions',
    'answers_count',
    results
  );
}

async function checkAnswerBadges(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  // 💬 First Answer Badge
  if (!currentBadges.first_answer && user.answers_count >= 1) {
    await awardBadge(userId, 'first_answer', results);
  }
}

async function checkLikeBadges(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  logBadgeCheck('helpful_answer', userId, currentBadges);

  // 👍 Helpful Answer Badge
  await checkSingleThresholdBadge(
    userId,
    currentBadges,
    'helpful_answer',
    'answers',
    'likes_count',
    results
  );
}

async function checkActivityBadges(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  if (currentBadges.active_user) {
    console.log('✅ User already has active_user badge');
    return;
  }

  const activeUserDef = BADGE_DEFINITIONS.active_user;
  const requiredDays = activeUserDef.requirements.value || 14;

  logBadgeCheck('active_user', userId, { requiredDays });

  const uniqueDays = await getUserUniqueActivityDays(userId);

  logActivityCheck(uniqueDays, requiredDays);

  if (uniqueDays.size >= requiredDays) {
    await awardBadge(userId, 'active_user', results);
  }
}

async function checkCommunityBadges(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  // ❤️ Community Companion Badge
  await checkCommunityCompanionBadge(userId, user, currentBadges, results);

  // 🤝 Community Helper Badge
  await checkCommunityHelperBadge(userId, user, currentBadges, results);
}

async function checkExpertBadges(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  if (currentBadges.expert) {
    console.log('✅ User already has expert badge');
    return;
  }

  const expertDef = BADGE_DEFINITIONS.expert;
  const requiredAnswers = expertDef.requirements.value || 100;

  logBadgeCheck('expert', userId, {
    requiredAnswers,
    currentAnswers: user.answers_count,
  });

  if (user.answers_count >= requiredAnswers) {
    await awardBadge(userId, 'expert', results);
  }
}

// ============================================================================
// REPUTATION BADGE CHECKERS
// ============================================================================

async function checkReputationBadges(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  const reputation = user.reputation || 0;

  logBadgeCheck('reputation_badges', userId, { reputation });

  // Check bronze badges (10+ reputation each)
  await checkReputationBadgeLevel(
    userId,
    currentBadges,
    'bronze',
    10,
    reputation,
    results
  );

  // Check silver badges (50+ reputation each)
  await checkReputationBadgeLevel(
    userId,
    currentBadges,
    'silver',
    50,
    reputation,
    results
  );

  // Check gold badges (100+ reputation each)
  await checkReputationBadgeLevel(
    userId,
    currentBadges,
    'gold',
    100,
    reputation,
    results
  );
}

async function checkReputationBadgeLevel(
  userId: string,
  currentBadges: any,
  badgeType: 'bronze' | 'silver' | 'gold',
  threshold: number,
  reputation: number,
  results: BadgeAwardResult[]
) {
  const currentCount = currentBadges[badgeType] || 0;
  const maxPossibleBadges = Math.floor(reputation / threshold);

  logBadgeCheck(`${badgeType}_badges`, userId, {
    currentCount,
    maxPossible: maxPossibleBadges,
    reputation,
    threshold,
  });

  if (maxPossibleBadges > currentCount) {
    const badgesToAward = maxPossibleBadges - currentCount;

    console.log(`🎉 Awarding ${badgesToAward} ${badgeType} badge(s)!`);

    for (let i = 0; i < badgesToAward; i++) {
      await awardReputationBadge(userId, badgeType, results);
    }
  }
}

// ============================================================================
// SPECIFIC BADGE CHECKERS
// ============================================================================

async function checkCommunityCompanionBadge(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  if (currentBadges.community_companion) {
    console.log('✅ User already has community_companion badge');
    return;
  }

  const communityCompanionDef = BADGE_DEFINITIONS.community_companion;
  const requiredCount = communityCompanionDef.requirements.value || 1;

  logBadgeCheck('community_companion', userId, {
    requiredCount,
    followers: user.followers_count,
    following: user.following_count,
  });

  if (
    user.followers_count >= requiredCount &&
    user.following_count >= requiredCount
  ) {
    await awardBadge(userId, 'community_companion', results);
  }
}

async function checkCommunityHelperBadge(
  userId: string,
  user: any,
  currentBadges: any,
  results: BadgeAwardResult[]
) {
  if (currentBadges.community_helper) {
    console.log('✅ User already has community_helper badge');
    return;
  }

  const communityHelperDef = BADGE_DEFINITIONS.community_helper;
  const requiredActions = communityHelperDef.requirements.value || 100;

  logBadgeCheck('community_helper', userId, { requiredActions });

  const totalLikes = await getUserTotalLikes(userId);
  const totalActions = user.questions_count + user.answers_count + totalLikes;

  logCommunityHelperCheck(user, totalLikes, totalActions);

  if (totalActions >= requiredActions) {
    await awardBadge(userId, 'community_helper', results);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

async function checkSingleThresholdBadge(
  userId: string,
  currentBadges: any,
  badgeType: BadgeType,
  tableName: string,
  countField: string,
  results: BadgeAwardResult[]
) {
  if (currentBadges[badgeType]) return;

  const badgeDef = BADGE_DEFINITIONS[badgeType];
  const requiredValue = badgeDef.requirements.value || 0;

  const { data: items } = await supabase
    .from(tableName)
    .select('id')
    .eq('author_id', userId)
    .gte(countField, requiredValue);

  if (items && items.length > 0) {
    await awardBadge(userId, badgeType, results);
  }
}

async function getUserUniqueActivityDays(userId: string): Promise<Set<string>> {
  const { data: allActivity, error } = await supabase
    .from('activity_items')
    .select('timestamp')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching activity:', error);
    return new Set();
  }

  return new Set(
    allActivity?.map((activity) =>
      new Date(activity.timestamp).toDateString()
    ) || []
  );
}

async function getUserTotalLikes(userId: string): Promise<number> {
  const { data: answersData, error } = await supabase
    .from('answers')
    .select('likes_count')
    .eq('author_id', userId);

  if (error) {
    console.error('Error fetching answers:', error);
    return 0;
  }

  return (
    answersData?.reduce((sum, answer) => sum + (answer.likes_count || 0), 0) ||
    0
  );
}

async function awardBadge(
  userId: string,
  badgeType: BadgeType,
  results: BadgeAwardResult[]
) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('badges')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('Error fetching user for badge award:', userError);
      return;
    }

    const currentBadges = user.badges || {};
    const updatedBadges = {
      ...currentBadges,
      [badgeType]: true,
    };

    const { error: updateError } = await supabase
      .from('users')
      .update({ badges: updatedBadges })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating badges:', updateError);
      return;
    }

    results.push({
      badgeType,
      success: true,
      message: `Otrzymałeś odznakę: ${BADGE_DEFINITIONS[badgeType].name}`,
    });

    console.log(`🎉 Badge awarded: ${badgeType}`);
  } catch (error) {
    console.error('Error awarding badge:', error);
    results.push({
      badgeType,
      success: false,
      message: 'Wystąpił błąd podczas przyznawania odznaki',
    });
  }
}

async function awardReputationBadge(
  userId: string,
  badgeType: 'bronze' | 'silver' | 'gold',
  results: BadgeAwardResult[]
) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('badges')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error(
        'Error fetching user for reputation badge award:',
        userError
      );
      return;
    }

    const currentBadges = user.badges || {};
    const currentCount = currentBadges[badgeType] || 0;
    const updatedBadges = {
      ...currentBadges,
      [badgeType]: currentCount + 1,
    };

    const { error: updateError } = await supabase
      .from('users')
      .update({ badges: updatedBadges })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating reputation badges:', updateError);
      return;
    }

    results.push({
      badgeType,
      success: true,
      message: `Otrzymałeś odznakę: ${BADGE_DEFINITIONS[badgeType].name} (${currentCount + 1})`,
    });

    console.log(
      `🎉 Reputation badge awarded: ${badgeType} (${currentCount + 1})`
    );
  } catch (error) {
    console.error('Error awarding reputation badge:', error);
    results.push({
      badgeType,
      success: false,
      message: 'Wystąpił błąd podczas przyznawania odznaki reputacji',
    });
  }
}

// ============================================================================
// LOGGING FUNCTIONS
// ============================================================================

function logBadgeCheck(badgeType: string, userId: string, data: any) {
  console.log(`🔍 Checking ${badgeType} badge for user: ${userId}`);
  console.log('🔍 Data:', data);
}

function logActivityCheck(uniqueDays: Set<string>, requiredDays: number) {
  console.log('🔍 Unique activity days:', uniqueDays.size);
  console.log('🔍 Required days:', requiredDays);
  console.log('🔍 Activity days:', Array.from(uniqueDays));
}

function logCommunityHelperCheck(
  user: any,
  totalLikes: number,
  totalActions: number
) {
  console.log('🔍 Questions:', user.questions_count);
  console.log('🔍 Answers:', user.answers_count);
  console.log('🔍 Likes on answers:', totalLikes);
  console.log('🔍 Total actions:', totalActions);
}
