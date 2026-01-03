/**
 * useQuestGeneration Hook
 * =======================
 * Handles automatic quest generation based on game events
 */

import { useEffect, useRef } from 'react';
import { PlayerState, Notification } from '../types/game';
import { generateQuests } from '../services/api';
import {
  getQuestGenerationTrigger,
  getZonesForQuestGeneration,
  QuestGenerationTrigger,
  saveQuestGenerationState,
  getQuestGenerationState,
  isNewPlayer,
} from '../utils/questGenerationUtils';

interface UseQuestGenerationProps {
  player: PlayerState;
  onAddNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  onGenerateComplete: (quests: any[]) => void;
  onGenerateError: (error: string) => void;
}

export function useQuestGeneration({
  player,
  onAddNotification,
  onGenerateComplete,
  onGenerateError,
}: UseQuestGenerationProps) {
  const lastCheckedDayRef = useRef<number>(player.currentDay);
  const generationInProgressRef = useRef(false);

  useEffect(() => {
    if (!player.username || generationInProgressRef.current) return;

    const trigger = getQuestGenerationTrigger(
      player,
      lastCheckedDayRef.current,
      getQuestGenerationState()?.lastGeneratedTrigger,
    );

    if (trigger === 'none') {
      lastCheckedDayRef.current = player.currentDay;
      return;
    }

    // Trigger HR mail notification
    triggerHRMailNotification(trigger, player);

    // Perform quest generation
    performQuestGeneration(trigger, player);

    lastCheckedDayRef.current = player.currentDay;
  }, [player.currentDay, player.username]);

  async function performQuestGeneration(
    trigger: QuestGenerationTrigger,
    player: PlayerState,
  ) {
    if (generationInProgressRef.current) return;
    generationInProgressRef.current = true;

    try {
      const zones = getZonesForQuestGeneration(trigger);
      const allGeneratedQuests: any[] = [];

      for (const zone of zones) {
        try {
          const quests = await generateQuests(player.username, zone, 20);
          allGeneratedQuests.push(...quests);
        } catch (error) {
          console.error(`Failed to generate quests for zone ${zone}:`, error);
          // Send fallback error notification
          onAddNotification({
            type: 'warning',
            title: 'Quest Generation Failed',
            message: `Could not generate quests for ${zone}. Please try again later.`,
          });
        }
      }

      if (allGeneratedQuests.length > 0) {
        saveQuestGenerationState(player.currentDay, trigger);
        onGenerateComplete(allGeneratedQuests);

        // Send success notification
        onAddNotification({
          type: 'quest',
          title: 'New Quests Available',
          message: `${allGeneratedQuests.length} new quests have been generated across your zones!`,
        });
      }
    } catch (error: any) {
      console.error('Quest generation error:', error);
      onGenerateError(error.message || 'Failed to generate quests');
    } finally {
      generationInProgressRef.current = false;
    }
  }

  function triggerHRMailNotification(
    trigger: QuestGenerationTrigger,
    player: PlayerState,
  ) {
    const mailTitles = {
      'new-player': '📧 Welcome to the Team!',
      'new-day': '📧 Daily Tasks Available',
      'fired': '📧 Welcome to Your New Company',
      'low-quests': '📧 More Opportunities Available',
    };

    const mailMessages = {
      'new-player': 'HR has prepared initial tasks for you. Click to review.',
      'new-day': 'New tasks are available for today.',
      'fired': 'Welcome to your new workplace! New tasks are ready.',
      'low-quests': 'Additional tasks available to keep you challenged.',
    };

    if (trigger !== 'none') {
      onAddNotification({
        type: 'quest',
        title: mailTitles[trigger],
        message: mailMessages[trigger],
        // Store trigger type in a custom field if needed
        metadata: { hrMailType: trigger },
      } as any);
    }
  }

  return {
    lastCheckedDay: lastCheckedDayRef.current,
  };
}
