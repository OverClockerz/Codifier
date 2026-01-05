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
    }, [player.currentDay, player.username, player.activeQuests]);

    const performAutoQuestGeneration = async (triggerType: string) => {
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

            // Process zones that need quests
            for (const zone of zonesToGenerate) {
                try {
                    const response = await generateQuests(player.username, zone, 20);
                    console.log(response);
                    const quests = Array.isArray(response)? response: [];
                    if (quests.length === 0) return;

                    allGeneratedQuests.push(...quests);
                    generatedZoneNames.push(zone);
                    console.log(`✅ Auto-generated ${quests.length} quests for ${zone}`);
                } catch (error) {
                    console.error(`Failed to auto-generate quests for zone ${zone}:`, error);
                    // Silent failure - don't show error notifications
                }
            }

            // Update player with new quests
            if (allGeneratedQuests.length > 0) {
                const updatedPlayer = {
                    ...player,
                    activeQuests: [...(player.activeQuests || []), ...allGeneratedQuests],
                };
                setPlayer(updatedPlayer);

                saveQuestGenerationState(player.currentDay, triggerType as any, generatedZoneNames);

                // Send success notification with zone names
                const zoneDisplayNames = generatedZoneNames.map(z => {
                    const zoneNames: Record<string, string> = {
                        'workspace': 'Workspace',
                        'game-lounge': 'Game Lounge',
                        'meeting-room': 'Meeting Room',
                    };
                    return zoneNames[z] || z;
                }).join(', ');

                addNotification({
                    type: 'quest',
                    title: 'New Quests Added',
                    message: `New quests have been added to ${zoneDisplayNames}!`,
                });
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
