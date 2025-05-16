'use server';
/**
 * @fileOverview A Genkit flow for remixing nursery rhyme lyrics.
 *
 * - remixLyrics - A function that handles the lyric remixing process.
 * - RemixLyricsInput - The input type for the remixLyrics function.
 * - RemixLyricsOutput - The return type for the remixLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemixLyricsInputSchema = z.object({
  songTitle: z.string().describe('The title of the original song.'),
  originalLyrics: z.string().describe('The original lyrics of the song.'),
  theme: z.string().describe('The theme to apply to the remix (e.g., Space Adventure, Pirate Quest).'),
});
export type RemixLyricsInput = z.infer<typeof RemixLyricsInputSchema>;

const RemixLyricsOutputSchema = z.object({
  remixedLyrics: z.string().describe('The remixed lyrics based on the theme.'),
});
export type RemixLyricsOutput = z.infer<typeof RemixLyricsOutputSchema>;

export async function remixLyrics(input: RemixLyricsInput): Promise<RemixLyricsOutput> {
  return remixLyricsFlow(input);
}

const remixPrompt = ai.definePrompt({
  name: 'remixLyricsPrompt',
  input: {schema: RemixLyricsInputSchema},
  output: {schema: RemixLyricsOutputSchema},
  prompt: `You are a creative songwriter specializing in remixing children's nursery rhymes.
Given the original song title, its lyrics, and a new theme, rewrite the lyrics to fit the theme while maintaining the song's original rhythm and rhyme scheme as much as possible. Make it fun and appropriate for children.

Original Song Title: {{{songTitle}}}
Original Lyrics:
{{{originalLyrics}}}

New Theme: {{{theme}}}

Generate the remixed lyrics below:
`,
  config: {
    // Adjust safety settings if needed, but default should be fine for nursery rhymes.
    // Example:
    // safetySettings: [
    //   {
    //     category: 'HARM_CATEGORY_HARASSMENT',
    //     threshold: 'BLOCK_NONE',
    //   },
    // ],
  }
});

const remixLyricsFlow = ai.defineFlow(
  {
    name: 'remixLyricsFlow',
    inputSchema: RemixLyricsInputSchema,
    outputSchema: RemixLyricsOutputSchema,
  },
  async (input) => {
    const {output} = await remixPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return any output for remixed lyrics.");
    }
    return output;
  }
);
