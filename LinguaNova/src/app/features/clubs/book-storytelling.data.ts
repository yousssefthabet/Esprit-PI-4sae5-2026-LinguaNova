export interface StoryBook {
  id: string;
  title: string;
  author: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMin: number;
  cover: string;
  summary: string;
  content: string;
}

export const STORY_BOOKS: StoryBook[] = [
  {
    id: 'the-lantern-keeper',
    title: 'The Lantern Keeper',
    author: 'LinguaNova Studio',
    level: 'Beginner',
    durationMin: 4,
    cover: 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?q=80&w=1200&auto=format&fit=crop',
    summary: 'A warm short story about kindness, routine, and courage in a small coastal town.',
    content: `Every evening, when the sun touched the sea, old Sami walked up the hill to the lighthouse.
He carried a brass lantern in one hand and a loaf of bread in the other.
People in the village said the path was too steep for him, but Sami smiled and kept walking.

At the top, he lit the great lamp and watched the coast become a line of silver.
Fishing boats moved like tiny stars on dark water.
Sami always waved, even when no one could see him.
He believed every sailor deserved a friendly signal before the long night.

One stormy evening, wind pushed rain against the windows, and the main lamp went out.
Without waiting, Sami raised his small lantern and climbed to the balcony.
Its light was weak, but steady.
Far below, one boat turned safely toward shore.
The next morning, a young captain came to thank him.
Sami simply said, "A small light can still guide a tired heart."`
  },
  {
    id: 'midnight-library',
    title: 'The Midnight Library Steps',
    author: 'LinguaNova Studio',
    level: 'Intermediate',
    durationMin: 6,
    cover: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=1200&auto=format&fit=crop',
    summary: 'A student discovers that reading at night can change how she sees the world.',
    content: `Lina loved noise in the daytime, but she loved silence at night.
After dinner, she crossed the old square and climbed the stone steps of the city library.
The building closed at nine, yet she stayed outside and read under a streetlamp.

At first, she read to improve her English.
She underlined verbs, wrote new words in a notebook, and repeated difficult sentences aloud.
Slowly, reading became more than homework.
She began hearing different voices in every page:
an inventor speaking with hope, a traveler describing rain in another country, a child asking brave questions.

One night, the librarian opened the door and offered her a chair by the window.
"You always read like you are listening to someone," he said.
Lina laughed.
"Maybe I am," she answered.

Months passed.
Her vocabulary grew.
Her confidence grew, too.
During class presentations, she no longer rushed.
She paused, breathed, and chose words with care.
When her friends asked how she improved so much, Lina pointed to the library steps and said,
"I learned that language is not only grammar.
Language is rhythm, memory, and attention.
If you listen deeply, words become doors."`
  },
  {
    id: 'paper-bridge',
    title: 'The Paper Bridge',
    author: 'LinguaNova Studio',
    level: 'Advanced',
    durationMin: 7,
    cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop',
    summary: 'Two strangers connect through notes hidden inside second-hand books.',
    content: `Nour bought used books for the same reason others collected postcards:
each one carried a trace of someone else's life.
Some had coffee stains.
Some had folded corners.
A few had careful notes in the margins, as if a distant reader had whispered advice across time.

In a worn copy of a poetry anthology, she found a sentence on the final page:
"If you loved this line, leave a reply in chapter three of any blue book at Cedar Street Shop."
She laughed at first, then did exactly that.

Weeks later, she returned and found a response tucked between two pages of a travel memoir.
The handwriting was different, angular and deliberate.
The unknown reader disagreed with her interpretation, but politely.
Nour replied.
Then came another note, and another.
Their conversation moved through novels, essays, and biographies.

They never signed full names.
They debated endings, defended characters, and traded lists of beautiful verbs.
When the city felt too loud, those pages became a private bridge.
A bridge made of paper, ink, and patient attention.

On the first day of spring, Nour opened a blue book and found a final message:
"Same shop, same shelf, Saturday at noon.
Bring your favorite sentence."
She arrived early, holding a marked page.
A stranger approached with another book in hand.
No dramatic music played.
No speech was rehearsed.
They simply smiled, sat near the window, and began reading aloud.`
  }
];

export function getStoryBookById(id: string): StoryBook | undefined {
  return STORY_BOOKS.find(book => book.id === id);
}
