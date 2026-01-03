/**
 * Quest Generation Utilities
 * ==========================
 * Utilities for determining when quests should be generated
 * and tracking quest generation state
 */

import { PlayerState } from '../types/game';

export type QuestGenerationTrigger = 'new-player' | 'new-day' | 'fired' | 'low-quests' | 'none';

/**
 * Check if player is a new player (first login)
 * A new player will have no career history and just started the game
 */
export function isNewPlayer(player: PlayerState): boolean {
  return (
    !player.careerHistory || 
    player.careerHistory.length === 0
  );
}

/**
 * Check if it's a new game day (based on currentDay changing)
 * This should be called after day advancement
 */
export function isNewDay(player: PlayerState, lastCheckedDay?: number): boolean {
  if (lastCheckedDay === undefined) return false;
  return player.currentDay > lastCheckedDay;
}

/**
 * Check if player just restarted after being fired
 * Will have a new run with reasonForEnd as 'fired' in previous career
 */
export function isPlayerFiredRestart(player: PlayerState): boolean {
  if (!player.careerHistory || player.careerHistory.length === 0) {
    return false;
  }
  
  const lastRun = player.careerHistory[player.careerHistory.length - 1];
  return lastRun.reasonForEnd === 'fired';
}

/**
 * Check if quest count is low - per zone check
 * Returns true if ANY zone has less than 10 quests
 */
export function isQuestCountLow(player: PlayerState): boolean {
  const activeQuests = player.activeQuests || [];
  const QUESTS_PER_ZONE = 20; // Target quests per zone
  const LOW_THRESHOLD = 10;  // Show popup if any zone has less than this
  
  // Count quests by zone
  const questsByZone = {
    'workspace': 0,
    'game-lounge': 0,
    'meeting-room': 0,
    'cafeteria': 0,
  };
  
  activeQuests.forEach(quest => {
    const zone = quest.zone as keyof typeof questsByZone;
    if (zone in questsByZone) {
      questsByZone[zone]++;
    }
  });
  
  // Check if any zone has less than the threshold
  return Object.values(questsByZone).some(count => count < LOW_THRESHOLD);
}

/**
 * Determine the quest generation trigger
 * Returns the type of trigger or 'none' if no generation needed
 */
export function getQuestGenerationTrigger(
  player: PlayerState,
  lastCheckedDay?: number,
  lastGeneratedTrigger?: QuestGenerationTrigger,
): QuestGenerationTrigger {
  // Check new player (only once at the very beginning)
  if (isNewPlayer(player) && lastGeneratedTrigger !== 'new-player') {
    return 'new-player';
  }

  // Check if player just restarted after being fired
  if (isPlayerFiredRestart(player) && lastGeneratedTrigger !== 'fired') {
    return 'fired';
  }

  // Check for new day (only after player has been created)
  if (!isNewPlayer(player) && isNewDay(player, lastCheckedDay) && lastGeneratedTrigger !== 'new-day') {
    return 'new-day';
  }

  // Check if quests are low (can trigger multiple times)
  if (!isNewPlayer(player) && isQuestCountLow(player) && lastCheckedDay === player.currentDay) {
    return 'low-quests';
  }

  return 'none';
}

/**
 * Get zones for quest generation based on trigger type
 * Returns array of zones to generate quests for
 */
export function getZonesForQuestGeneration(trigger: QuestGenerationTrigger): ('workspace' | 'game-lounge' | 'meeting-room' | 'cafeteria')[] {
  if (trigger === 'new-player' || trigger === 'fired') {
    // Generate for all zones on new player or fired restart
    return ['workspace', 'game-lounge', 'meeting-room', 'cafeteria'];
  }

  if (trigger === 'new-day' || trigger === 'low-quests') {
    // Generate for all zones daily
    return ['workspace', 'game-lounge', 'meeting-room', 'cafeteria'];
  }

  return [];
}

/**
 * Track quest generation state
 * Store this in localStorage to prevent duplicate generation
 */
interface QuestGenerationState {
  lastGeneratedDay: number;
  lastGeneratedTrigger: QuestGenerationTrigger;
  lastGeneratedTimestamp: number;
}

const STORAGE_KEY = 'quest_generation_state';

export function saveQuestGenerationState(
  day: number,
  trigger: QuestGenerationTrigger,
): void {
  const state: QuestGenerationState = {
    lastGeneratedDay: day,
    lastGeneratedTrigger: trigger,
    lastGeneratedTimestamp: Date.now(),
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
