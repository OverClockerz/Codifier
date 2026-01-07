/**
 * useQuestGeneration Hook
 * =======================
 * Handles automatic quest generation based on game events
 * IMPORTANT: Backend now handles initial quests for new players
 * Frontend only generates quests when a zone has ≤10 active quests
 */

import { useEffect, useRef } from 'react';
import { PlayerState, Notification } from '../types/game';
import { generateQuests } from '../services/api';
import {
  getQuestGenerationTrigger,
  getZonesNeedingQuests,
  QuestGenerationTrigger,
  saveQuestGenerationState,
  getQuestGenerationState,
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

    // Day changed, perform auto-generation for zones with low quests
    performAutoQuestGeneration(trigger, player);

    lastCheckedDayRef.current = player.currentDay;
  }, [player.currentDay, player.username, player.activeQuests]);

  async function performAutoQuestGeneration(
    trigger: QuestGenerationTrigger,
    player: PlayerState,
  ) {
    if (generationInProgressRef.current) return;
    generationInProgressRef.current = true;

    try {
      // Get only zones that need quests (≤10 active)
      const zonesToGenerate = getZonesNeedingQuests(player);
      
      if (zonesToGenerate.length === 0) {
        generationInProgressRef.current = false;
        return;
      }

      const allGeneratedQuests: any[] = [];
      const generatedZoneNames: string[] = [];

      for (const zone of zonesToGenerate) {
        try {
          const quests = await generateQuests(zone, 20);
          allGeneratedQuests.push(...quests);
          generatedZoneNames.push(zone);
        } catch (error) {
          console.error(`Failed to generate quests for zone ${zone}:`, error);
          // Don't show error notifications - silent failure as per requirements
        }
      }

      if (allGeneratedQuests.length > 0) {
        saveQuestGenerationState(player.currentDay, trigger, generatedZoneNames);
        onGenerateComplete(allGeneratedQuests);

        // Send success notification only for successful generation
        const zoneDisplayNames = generatedZoneNames.map(z => {
          const zoneNames: Record<string, string> = {
            'workspace': 'Workspace',
            'game-lounge': 'Game Lounge',
            'meeting-room': 'Meeting Room',
          };
          return zoneNames[z] || z;
        }).join(', ');

        onAddNotification({
          type: 'quest',
          title: 'New Quests Added',
          message: `New quests have been added to ${zoneDisplayNames}!`,
        });
      }
    } catch (error: any) {
      console.error('Quest generation error:', error);
      // Silent failure - no error notifications
    } finally {
      generationInProgressRef.current = false;
    }
  }

  return {
    lastCheckedDay: lastCheckedDayRef.current,
  };
}
