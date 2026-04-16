export interface RoleplayRole {
  id: string;
  name: string;
  objective: string;
  speakingTips: string[];
}

export interface RoleplayScenario {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMin: number;
  setting: string;
  summary: string;
  image: string;
  goals: string[];
  aiCoachStyle: string;
  roles: RoleplayRole[];
  openingLines: string[];
}

export const DRAMA_ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: 'coffee-shop-rush',
    title: 'Coffee Shop Rush',
    level: 'Beginner',
    durationMin: 8,
    setting: 'Busy coffee shop near campus',
    summary: 'Handle quick customer requests, solve order mistakes, and keep a polite tone under pressure.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop',
    goals: [
      'Use polite requests and confirmations',
      'Practice listening and clarifying questions',
      'Stay calm while solving a problem'
    ],
    aiCoachStyle: 'Warm and supportive barista trainer',
    roles: [
      {
        id: 'barista',
        name: 'Barista',
        objective: 'Take orders quickly, confirm details, and fix mistakes professionally.',
        speakingTips: ['Use short confirmations', 'Offer alternatives politely']
      },
      {
        id: 'customer',
        name: 'Customer',
        objective: 'Order confidently, explain preferences, and report an issue clearly.',
        speakingTips: ['Be specific about size and flavor', 'Ask for clarification if needed']
      },
      {
        id: 'manager',
        name: 'Shift Manager',
        objective: 'Step in when needed and keep everyone respectful.',
        speakingTips: ['Use calm tone', 'Summarize a fair solution']
      }
    ],
    openingLines: [
      'Good afternoon. Welcome in. What can I get started for you?',
      'Sorry about that mix-up. Let me fix it right away.',
      'Could you repeat your order so I can make sure it is correct?'
    ]
  },
  {
    id: 'airport-missed-flight',
    title: 'Airport Missed Flight',
    level: 'Intermediate',
    durationMin: 10,
    setting: 'International airport service desk',
    summary: 'Negotiate rebooking options after a missed flight and communicate urgency clearly.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
    goals: [
      'Explain a problem with timeline details',
      'Ask follow-up questions about options',
      'Negotiate politely'
    ],
    aiCoachStyle: 'Professional travel communication coach',
    roles: [
      {
        id: 'passenger',
        name: 'Passenger',
        objective: 'Explain your situation and secure the best rebooking choice.',
        speakingTips: ['Use clear time expressions', 'State your priority directly']
      },
      {
        id: 'agent',
        name: 'Airline Agent',
        objective: 'Provide options, explain policies, and maintain empathy.',
        speakingTips: ['Acknowledge frustration', 'Offer structured options']
      },
      {
        id: 'supervisor',
        name: 'Desk Supervisor',
        objective: 'Resolve conflicts and approve exceptions when justified.',
        speakingTips: ['Balance policy and customer care', 'Give concise final decision']
      }
    ],
    openingLines: [
      'I understand this is stressful. Let me check your booking now.',
      'My connection was delayed, and I just missed the gate by five minutes.',
      'What are the soonest available flights to London today?'
    ]
  },
  {
    id: 'startup-pitch-day',
    title: 'Startup Pitch Day',
    level: 'Advanced',
    durationMin: 12,
    setting: 'University innovation competition',
    summary: 'Present a startup idea, answer investor questions, and defend decisions convincingly.',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1200&auto=format&fit=crop',
    goals: [
      'Use persuasive language',
      'Handle challenging follow-up questions',
      'Summarize value proposition clearly'
    ],
    aiCoachStyle: 'Direct but encouraging public speaking mentor',
    roles: [
      {
        id: 'founder',
        name: 'Founder',
        objective: 'Pitch the product vision and convince the panel.',
        speakingTips: ['Lead with the user problem', 'Close with measurable impact']
      },
      {
        id: 'investor',
        name: 'Investor',
        objective: 'Ask strategic and financial questions to test the idea.',
        speakingTips: ['Push for evidence', 'Challenge assumptions respectfully']
      },
      {
        id: 'product-lead',
        name: 'Product Lead',
        objective: 'Explain roadmap, team execution, and technical feasibility.',
        speakingTips: ['Use concrete timelines', 'Describe trade-offs']
      }
    ],
    openingLines: [
      'Today we are solving a real problem faced by language learners worldwide.',
      'Can you explain your customer acquisition cost assumptions?',
      'Our first milestone is a pilot with 500 students in one semester.'
    ]
  }
];

export function getDramaScenarioById(id: string): RoleplayScenario | undefined {
  return DRAMA_ROLEPLAY_SCENARIOS.find((scenario) => scenario.id === id);
}

