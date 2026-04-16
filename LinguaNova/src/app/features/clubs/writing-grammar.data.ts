export interface DictationPassage {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topic: string;
  text: string;
}

export const WRITING_DICTATION_PASSAGES: DictationPassage[] = [
  {
    id: 'market-morning',
    title: 'Morning Market',
    level: 'Beginner',
    topic: 'Daily life',
    text: `Every Saturday morning, Lina visits the local market with her brother. They buy fresh fruit, warm bread, and a few flowers for their mother. The market is always noisy, but Lina enjoys the friendly voices and colorful stands. Before they go home, they drink orange juice and plan the meals for the week.`
  },
  {
    id: 'team-project',
    title: 'Team Project Meeting',
    level: 'Intermediate',
    topic: 'School collaboration',
    text: `Our class started a project about eco-friendly schools, and each student has a clear role. Salma collects data, Amir designs slides, and I prepare the final summary. During meetings, we try to listen carefully and speak in complete sentences. If someone makes a grammar mistake, we correct it politely and continue the discussion with confidence.`
  },
  {
    id: 'future-goals',
    title: 'Future Goals',
    level: 'Advanced',
    topic: 'Motivation and planning',
    text: `Learning English has changed the way I think about my future. It has opened opportunities to read international research, communicate with people from different cultures, and present ideas with clarity. My goal is to keep improving every month by writing regularly, reviewing feedback, and transforming mistakes into practical lessons that strengthen my confidence.`
  }
];

export function getPassageById(id: string): DictationPassage | undefined {
  return WRITING_DICTATION_PASSAGES.find((passage) => passage.id === id);
}

