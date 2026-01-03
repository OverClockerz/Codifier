/**
 * QuestGenerationManager Component
 * ================================
 * Manages HR mail notifications and quest generation
 * Listens to player state changes and triggers appropriate mail/generation flow
 */

import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../contexts/GameContext';
import { HRMailModal } from '../extras/HRMailModal';
import { generateQuests } from '../../services/api';
import {
    getQuestGenerationTrigger,
    getZonesForQuestGeneration,
    QuestGenerationTrigger,
    saveQuestGenerationState,
    getQuestGenerationState,
} from '../../utils/questGenerationUtils';

export function QuestGenerationManager() {
    const { player, addNotification, setPlayer } = useGame();
    const [showHRMail, setShowHRMail] = useState(false);
    const [currentMailType, setCurrentMailType] = useState<'new-player' | 'new-day' | 'fired' | 'low-quests'>('new-player');
    const [isGenerating, setIsGenerating] = useState(false);

    const lastCheckedDayRef = useRef<number>(player.currentDay);
    const generatedQuestsRef = useRef<Set<QuestGenerationTrigger>>(new Set());
    const pageLoadedRef = useRef(false);

    // Initialize from sessionStorage on mount
    useEffect(() => {
        if (!pageLoadedRef.current) {
            pageLoadedRef.current = true;
            const savedState = getQuestGenerationState();
            if (savedState) {
                generatedQuestsRef.current.add(savedState.lastGeneratedTrigger);
                lastCheckedDayRef.current = savedState.lastGeneratedDay;
            }
        }
    }, []);

    useEffect(() => {
        if (!player.username) return;

        const trigger = getQuestGenerationTrigger(
            player,
            lastCheckedDayRef.current,
            getQuestGenerationState()?.lastGeneratedTrigger,
        );

        if (trigger !== 'none' && !generatedQuestsRef.current.has(trigger)) {
            setCurrentMailType(trigger);
            setShowHRMail(true);
            generatedQuestsRef.current.add(trigger);
        }

        lastCheckedDayRef.current = player.currentDay;
    }, [player.currentDay, player.username, player.reputation]);

    const handleQuestGeneration = async () => {
        if (isGenerating) return;

        setIsGenerating(true);

        try {
            const zones = getZonesForQuestGeneration(currentMailType);
            let allGeneratedQuests: any[] = [];

            // Process zones sequentially: workspace → game-lounge → meeting-room → cafeteria
            for (const zone of zones) {
                try {
                    const quests = await generateQuests(player.username, zone, 20);
                    allGeneratedQuests.push(...quests);
                    console.log(`✅ Generated ${quests.length} quests for ${zone}`);
                } catch (error) {
                    console.error(`Failed to generate quests for zone ${zone}:`, error);
                    // Send fallback error notification
                    addNotification({
                        type: 'warning',
                        title: 'Quest Generation Failed',
                        message: `Could not generate quests for ${zone}. Please try again later.`,
                    });
                }
            }

            // Update player with new quests
            if (allGeneratedQuests.length > 0) {
                const updatedPlayer = {
                    ...player,
                    activeQuests: [...(player.activeQuests || []), ...allGeneratedQuests],
                };
                setPlayer(updatedPlayer);

                saveQuestGenerationState(player.currentDay, currentMailType);

                // Send success notification
                addNotification({
                    type: 'quest',
                    title: '✅ Quests Generated',
                    message: `${allGeneratedQuests.length} new quests have been added across all zones!`,
                });
            }
        } catch (error: any) {
            console.error('Quest generation error:', error);

            // Fallback error notification
            addNotification({
                type: 'warning',
                title: '❌ Quest Generation Failed',
                message: 'Failed to generate quests. Please try again later.',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <HRMailModal
            isOpen={showHRMail}
            onClose={() => setShowHRMail(false)}
            mailType={currentMailType}
            playerName={player.username}
            companyName={player.companyName || 'OmniTech Solutions'}
            onConfirm={handleQuestGeneration}
            isGenerating={isGenerating}
        />
    );
}
