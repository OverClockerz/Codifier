/**
 * QuestGenerationManager Component
 * ================================
 * Manages automatic quest generation based on game events
 * IMPORTANT: Backend now handles initial quests for new players
 * Frontend only auto-generates quests when a zone has ≤10 active quests (on day change)
 * No manual quest generation prompts/popups
 */

import { useEffect, useRef } from 'react';
import { useGame } from '../../contexts/GameContext';
import { generateQuests } from '../../services/api';
import {
    getQuestGenerationTrigger,
    getZonesNeedingQuests,
    saveQuestGenerationState,
    getQuestGenerationState,
} from '../../utils/questGenerationUtils';

export function QuestGenerationManager() {
    const { player, addNotification, setPlayer } = useGame();
    const lastCheckedDayRef = useRef<number>(player.currentDay);
    const generationInProgressRef = useRef(false);
    const playerRef = useRef(player);

    // Keep playerRef updated with the latest player state to avoid stale closures in async operations
    useEffect(() => { playerRef.current = player; }, [player]);

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
        performAutoQuestGeneration(trigger);

        lastCheckedDayRef.current = player.currentDay;
    }, [player.currentDay, player.username, player.activeQuests?.length]); // eslint-disable-line react-hooks/exhaustive-deps

    // Check for pending notifications after a sync reload
    useEffect(() => {
        const wasReloadedForSync = localStorage.getItem('quest_sync_reload');
        if (wasReloadedForSync) {
            localStorage.removeItem('quest_sync_reload');
            const pendingNotification = localStorage.getItem('latest_generated_quests_notification');
            if (pendingNotification) {
                try {
                    const parsed = JSON.parse(pendingNotification);
                    addNotification(parsed);
                    localStorage.removeItem('latest_generated_quests_notification');
                } catch (e) { console.error("Failed to parse pending notification", e); }
            }
        }
    }, []);

    const performAutoQuestGeneration = async (triggerType: string) => {
        if (generationInProgressRef.current) return;
        generationInProgressRef.current = true;

        try {
            // Get only zones that need quests (≤10 active)
            const zonesToGenerate = getZonesNeedingQuests(playerRef.current);

            if (zonesToGenerate.length === 0) {
                generationInProgressRef.current = false;
                return;
            }

            const allGeneratedQuests: any[] = [];
            const generatedZoneNames: string[] = [];

            // Process zones that need quests
            for (const zone of zonesToGenerate) {
                try {
                    const quests = await generateQuests(zone, 20);
                    const zoneQuests = Array.isArray(quests) ? quests : (quests as any)?.activeQuests || [];
                    if (zoneQuests.length > 0) {
                        allGeneratedQuests.push(...zoneQuests);
                        generatedZoneNames.push(zone);
                    }
                    console.log(`✅ Auto-generated ${zoneQuests.length} quests for ${zone}`);
                } catch (error) {
                    console.error(`Failed to auto-generate quests for zone ${zone}:`, error);
                    // Silent failure - don't show error notifications
                }
            }

            // Update player with new quests
            if (allGeneratedQuests.length > 0) {
                const currentPlayer = playerRef.current;
                const updatedActiveQuests = [...(currentPlayer.activeQuests || []), ...allGeneratedQuests];
                const updatedPlayer = {
                    ...currentPlayer,
                    activeQuests: updatedActiveQuests,
                };
                console.log("Updated Player", updatedPlayer);
                console.log("All Generated Quests", allGeneratedQuests);
                setPlayer(updatedPlayer);
                localStorage.setItem(`office_game_active_quests_${currentPlayer.username}`, JSON.stringify(updatedActiveQuests));
                saveQuestGenerationState(currentPlayer.currentDay, triggerType as any, generatedZoneNames);

                // Send success notification with zone names
                const zoneDisplayNames = generatedZoneNames.map(z => {
                    const zoneNames: Record<string, string> = {
                        'workspace': 'Workspace',
                        'game-lounge': 'Game Lounge',
                        'meeting-room': 'Meeting Room',
                    };
                    return zoneNames[z] || z;
                }).join(', ');

                const notificationData = {
                    type: 'quest',
                    title: 'New Quests Added',
                    message: `New quests have been added to ${zoneDisplayNames}!`,
                    metadata: { questIds: allGeneratedQuests.map(q => q.id) } // Include generated quest IDs for tracking
                };

                localStorage.setItem('latest_generated_quests_notification', JSON.stringify(notificationData));
                addNotification(notificationData as any);
            }
        } catch (error: any) {
            console.error('Quest auto-generation error:', error);
            // Silent failure - no error notifications
        } finally {
            generationInProgressRef.current = false;
        }
    };

    // This component doesn't render anything - it just manages background quest generation
    return null;
}
