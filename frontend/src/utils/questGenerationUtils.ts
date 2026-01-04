/**
 * Quest Generation Utilities
 * ==========================
 * Utilities for determining when quests should be generated
 * and tracking quest generation state
 */

import { PlayerState } from '../types/game';

export type QuestGenerationTrigger = 'new-day' | 'low-quests' | 'none';

/**
 * Check if it's a new game day (based on currentDay changing)
 * This should be called after day advancement
 */
export function isNewDay(player: PlayerState, lastCheckedDay?: number): boolean {
  if (lastCheckedDay === undefined) return false;
  return player.currentDay > lastCheckedDay;
}

/**
 * Check if a specific zone has low quests (≤10 active quests)
 * Returns the zones that need quest generation
 */
export function getZonesNeedingQuests(player: PlayerState): ('workspace' | 'game-lounge' | 'meeting-room')[] {
  const activeQuests = player.activeQuests || [];
  const LOW_THRESHOLD = 10;
  
  // Count quests by zone (only considering workspace, meeting-room, game-lounge)
  const questsByZone = {
    'workspace': 0,
    'game-lounge': 0,
    'meeting-room': 0,
  };
  
  activeQuests.forEach(quest => {
    const zone = quest.zone as keyof typeof questsByZone;
    if (zone in questsByZone) {
      questsByZone[zone]++;
    }
  });
  
  // Return zones that have less than or equal to threshold
  const zonesNeedingQuests: ('workspace' | 'game-lounge' | 'meeting-room')[] = [];
  if (questsByZone['workspace'] <= LOW_THRESHOLD) zonesNeedingQuests.push('workspace');
  if (questsByZone['game-lounge'] <= LOW_THRESHOLD) zonesNeedingQuests.push('game-lounge');
  if (questsByZone['meeting-room'] <= LOW_THRESHOLD) zonesNeedingQuests.push('meeting-room');
  
  return zonesNeedingQuests;
}

/**
 * Determine the quest generation trigger
 * Returns the type of trigger or 'none' if no generation needed
 * IMPORTANT: No generation for new players - backend handles initial quests
 */
export function getQuestGenerationTrigger(
  player: PlayerState,
  lastCheckedDay?: number,
  lastGeneratedTrigger?: QuestGenerationTrigger,
): QuestGenerationTrigger {
  // Check for new day (to auto-generate low quests)
  if (isNewDay(player, lastCheckedDay)) {
    // Check if any zone needs quests
    const zonesNeedingQuests = getZonesNeedingQuests(player);
    if (zonesNeedingQuests.length > 0) {
      return 'new-day';
    }
  }

  return 'none';
}

/**
 * Track quest generation state
 * Store this in localStorage to prevent duplicate generation
 */
interface QuestGenerationState {
  lastGeneratedDay: number;
  lastGeneratedTrigger: QuestGenerationTrigger;
  lastGeneratedTimestamp: number;
  generatedZones: string[]; // Track which zones were generated
}

const STORAGE_KEY = 'quest_generation_state';

export function saveQuestGenerationState(
  day: number,
  trigger: QuestGenerationTrigger,
  generatedZones: string[] = [],
): void {
  const state: QuestGenerationState = {
    lastGeneratedDay: day,
    lastGeneratedTrigger: trigger,
    lastGeneratedTimestamp: Date.now(),
    generatedZones,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save quest generation state:', e);
  }
}

export function getQuestGenerationState(): QuestGenerationState | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error('Failed to get quest generation state:', e);
    return null;
  }
}

export function clearQuestGenerationState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear quest generation state:', e);
  }
}
