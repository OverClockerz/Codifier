import { NPC } from '../types/game';

export const NPCS: NPC[] = [
  {
    id: 'manager-alex',
    name: 'Alex Chen',
    role: 'Engineering Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    zone: 'workspace',
    dialogues: [
      {
        id: 'greeting',
        text: "Hey there! Ready to crush some code today?",
        context: 'greeting',
      },
      {
        id: 'quest-assign',
        text: "I've got a new task for you. It's challenging but I know you can handle it!",
        context: 'quest-assign',
      },
      {
        id: 'quest-complete',
        text: "Excellent work! Your code quality is really improving.",
        context: 'quest-complete',
      },
      {
        id: 'warning',
        text: "We need to talk about those missed deadlines. Let's get back on track.",
        context: 'warning',
      },
    ],
  },
  {
    id: 'hr-sarah',
    name: 'Sarah Martinez',
    role: 'HR Director',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    zone: 'meeting-room',
    dialogues: [
      {
        id: 'greeting',
        text: "Good morning! Remember to maintain that work-life balance.",
        context: 'greeting',
      },
      {
        id: 'quest-assign',
        text: "We need you to prepare a presentation. Communication is key!",
        context: 'quest-assign',
      },
      {
        id: 'quest-complete',
        text: "Great presentation skills! You're really developing as a professional.",
        context: 'quest-complete',
      },
      {
        id: 'fired',
        text: "I'm sorry, but we have to let you go. Your performance hasn't met our standards.",
        context: 'fired',
      },
    ],
  },
  {
    id: 'lead-marcus',
    name: 'Marcus Johnson',
    role: 'Tech Lead',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    zone: 'workspace',
    dialogues: [
      {
        id: 'greeting',
        text: "Let's build something awesome today!",
        context: 'greeting',
      },
      {
        id: 'quest-assign',
        text: "Here's a critical bug that needs fixing ASAP.",
        context: 'quest-assign',
      },
      {
        id: 'quest-complete',
        text: "Perfect! Your debugging skills are top-notch.",
        context: 'quest-complete',
      },
    ],
  },
  {
    id: 'games-coordinator',
    name: 'Jamie Taylor',
    role: 'Wellness Coordinator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jamie',
    zone: 'game-lounge',
    dialogues: [
      {
        id: 'greeting',
        text: "Time to exercise that brilliant mind of yours!",
        context: 'greeting',
      },
      {
        id: 'quest-assign',
        text: "I've got some fun puzzles to help you destress.",
        context: 'quest-assign',
      },
      {
        id: 'quest-complete',
        text: "Nice! You're getting sharper every day.",
        context: 'quest-complete',
      },
    ],
  },
  {
    id: 'cafeteria-bob',
    name: 'Bob Williams',
    role: 'Cafeteria Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    zone: 'cafeteria',
    dialogues: [
      {
        id: 'greeting',
        text: "Welcome! What can I get you today?",
        context: 'greeting',
      },
    ],
  },
];

export function getNPCByZone(zone: string): NPC | undefined {
  return NPCS.find(npc => npc.zone === zone);
}

export function getNPCById(id: string): NPC | undefined {
  return NPCS.find(npc => npc.id === id);
}
