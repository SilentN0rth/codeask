'use client';

import { useState, useEffect } from 'react';
import { Button, Tooltip, addToast } from '@heroui/react';
import { motion, useAnimation } from 'framer-motion';
import { VoteType } from '@/types/vote.types';
import { LikeDislikeButtonsProps } from '@/types/components.types';
import { SvgIcon } from '@/lib/utils/icons';
import {
  voteQuestion,
  getUserVoteForQuestion,
} from '@/services/client/questions';
import { voteAnswer, getUserVoteForAnswer } from '@/services/client/answers';
import { useAuthContext } from '../../context/useAuthContext';
import { showLoginRequiredToast } from '@/components/ui/toasts/LoginRequiredToast';

const LikeDislikeButtons = ({
  initialLikes,
  initialDislikes,
  questionId,
  answerId,
  onVoteChange,
}: LikeDislikeButtonsProps) => {
  const { user } = useAuthContext();
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [dislikeCount, setDislikeCount] = useState(initialDislikes);
  const [userVote, setUserVote] = useState<VoteType>(null);

  const likeControls = useAnimation();
  const dislikeControls = useAnimation();

  useEffect(() => {
    const loadUserVote = async () => {
      if (questionId) {
        const vote = await getUserVoteForQuestion(questionId);
        setUserVote(vote);
      } else if (answerId) {
        const vote = await getUserVoteForAnswer(answerId);
        setUserVote(vote);
      }
    };

    void loadUserVote();
  }, [questionId, answerId]);

  const handleLike = async () => {
    if (!user) {
      showLoginRequiredToast({ action: 'polubić pytanie' });
      return;
    }

    await likeControls.start({
      y: [0, 6, 0],
      transition: { duration: 0.3, ease: 'easeInOut' },
    });

    let newVoteType: VoteType;
    let newLikeCount = likeCount;
    let newDislikeCount = dislikeCount;

    if (userVote === 'liked') {
      newVoteType = null;
      newLikeCount = likeCount - 1;
      addToast({
        title: 'Usunięto polubienie',
        description: '',
        icon: <SvgIcon icon="mdi:like-outline" />,
        color: 'default',
      });
    } else if (userVote === 'disliked') {
      newVoteType = 'liked';
      newLikeCount = likeCount + 1;
      newDislikeCount = dislikeCount - 1;
      addToast({
        title: 'Polubiono',
        description: '',
        icon: <SvgIcon icon="mdi:like" />,
        color: 'success',
      });
    } else {
      newVoteType = 'liked';
      newLikeCount = likeCount + 1;
      addToast({
        title: 'Polubiono',
        description: '',
        icon: <SvgIcon icon="mdi:like" />,
        color: 'success',
      });
    }

    setLikeCount(newLikeCount);
    setDislikeCount(newDislikeCount);
    setUserVote(newVoteType);

    if (onVoteChange) {
      onVoteChange(newLikeCount, newDislikeCount);
    }

    try {
      let result;
      if (questionId) {
        result = await voteQuestion({ questionId, voteType: newVoteType });
      } else if (answerId) {
        result = await voteAnswer({ answerId, voteType: newVoteType });
      } else {
        throw new Error('Brak ID pytania lub odpowiedzi');
      }

      if (
        result.success &&
        result.newLikesCount !== undefined &&
        result.newDislikesCount !== undefined
      ) {
        setLikeCount(result.newLikesCount);
        setDislikeCount(result.newDislikesCount);

        if (onVoteChange) {
          onVoteChange(result.newLikesCount, result.newDislikesCount);
        }
      }
    } catch {
      setLikeCount(likeCount);
      setDislikeCount(dislikeCount);
      setUserVote(userVote);

      addToast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować głosu',
        color: 'danger',
      });
    }
  };

  const handleDislike = async () => {
    if (!user) {
      showLoginRequiredToast({ action: 'ocenić negatywnie pytanie' });
      return;
    }

    await dislikeControls.start({
      y: [0, 6, 0],
      transition: { duration: 0.3, ease: 'easeInOut' },
    });

    let newVoteType: VoteType;
    let newLikeCount = likeCount;
    let newDislikeCount = dislikeCount;

    if (userVote === 'disliked') {
      newVoteType = null;
      newDislikeCount = dislikeCount - 1;
      addToast({
        title: 'Usunięto negatywną ocenę',
        description: '',
        icon: <SvgIcon icon="mdi:dislike-outline" />,
        color: 'default',
      });
    } else if (userVote === 'liked') {
      newVoteType = 'disliked';
      newLikeCount = likeCount - 1;
      newDislikeCount = dislikeCount + 1;
      addToast({
        title: 'Nie podoba mi się',
        description: '',
        icon: <SvgIcon icon="mdi:dislike" />,
        color: 'danger',
      });
    } else {
      newVoteType = 'disliked';
      newDislikeCount = dislikeCount + 1;
      addToast({
        title: 'Nie podoba mi się',
        description: '',
        icon: <SvgIcon icon="mdi:dislike" />,
        color: 'danger',
      });
    }

    setLikeCount(newLikeCount);
    setDislikeCount(newDislikeCount);
    setUserVote(newVoteType);

    if (onVoteChange) {
      onVoteChange(newLikeCount, newDislikeCount);
    }

    try {
      let result;
      if (questionId) {
        result = await voteQuestion({ questionId, voteType: newVoteType });
      } else if (answerId) {
        result = await voteAnswer({ answerId, voteType: newVoteType });
      } else {
        throw new Error('Brak ID pytania lub odpowiedzi');
      }

      if (
        result.success &&
        result.newLikesCount !== undefined &&
        result.newDislikesCount !== undefined
      ) {
        setLikeCount(result.newLikesCount);
        setDislikeCount(result.newDislikesCount);

        if (onVoteChange) {
          onVoteChange(result.newLikesCount, result.newDislikesCount);
        }
      }
    } catch {
      setLikeCount(likeCount);
      setDislikeCount(dislikeCount);
      setUserVote(userVote);

      addToast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować głosu',
        color: 'danger',
      });
    }
  };

  return (
    <div className="flex gap-x-1">
      <Tooltip content="Polub">
        <Button
          size="sm"
          variant="light"
          className={`min-w-fit gap-1 px-2.5 ${userVote === 'liked' ? '!bg-success-500 text-white' : 'text-success'}`}
          onPress={() => {
            void handleLike();
          }}
        >
          <motion.span animate={likeControls} className="inline-flex">
            <SvgIcon
              icon={`${userVote === 'liked' ? 'mdi:like' : 'mdi:like-outline'}`}
              width={20}
            />
          </motion.span>
          {likeCount}
        </Button>
      </Tooltip>

      <Tooltip content="Nie lubię">
        <Button
          size="sm"
          variant="light"
          className={`min-w-fit gap-1 px-2.5 ${userVote === 'disliked' ? '!bg-red-500 text-white' : 'text-red-500'}`}
          onPress={() => {
            void handleDislike();
          }}
        >
          <motion.span animate={dislikeControls} className="inline-flex">
            <SvgIcon
              icon={`${userVote === 'disliked' ? 'mdi:dislike' : 'mdi:dislike-outline'}`}
              width={20}
            />
          </motion.span>
          {dislikeCount}
        </Button>
      </Tooltip>
    </div>
  );
};

export default LikeDislikeButtons;
