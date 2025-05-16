
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form as ShadForm, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

import { Music2, Wand2, BookOpen, Sparkles, Loader2, Info } from 'lucide-react';

import type { Song } from '@/types';
import { songs as songsData } from '@/lib/songs';

const formSchema = z.object({
  songId: z.string().min(1, "Please select a song."),
  theme: z.string().min(2, "Theme must be at least 2 characters.").max(50, "Theme can be up to 50 characters."),
});
type FormData = z.infer<typeof formSchema>;

export default function HomePage() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [remixedLyrics, setRemixedLyrics] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLyrics, setShowLyrics] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      songId: "",
      theme: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setShowLyrics(false); // Hide previous lyrics while loading new ones

    const song = songsData.find(s => s.id === data.songId);
    if (!song) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Selected song not found.",
      });
      setIsLoading(false);
      return;
    }
    setSelectedSong(song);

    // Placeholder for AI lyric remixing
    // For now, "Lyric Remix: displays the users inputs"
    // This means the remixed lyrics will be a placeholder based on song and theme.
    // Simulating AI call delay
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    const placeholderRemix = `(Verse 1 - ${data.theme} Style)\n${song.originalLyrics.split('\n')[0].replace(/,/g, ' in a new way,')}
${song.originalLyrics.split('\n')[1].replace(/\./g, ' with a ${data.theme} display!')}\n
(Chorus - ${data.theme} Beat)\nOh, the ${song.title.toLowerCase().split(' ')[0]} goes ${data.theme}, ${data.theme}, ${data.theme},
All through the ${data.theme} town!
Everyone is happy, singing ${data.theme} songs,
With a cheerful, ${data.theme} sound!`;
    
    setRemixedLyrics(placeholderRemix);
    setIsLoading(false);
    setShowLyrics(true); // Show new lyrics

    toast({
      title: "Remix Complete!",
      description: `"${song.title}" has been remixed with a "${data.theme}" theme.`,
    });
  };
  
  // Effect to pre-populate theme if a song is selected (optional UX enhancement)
  useEffect(() => {
    if (form.watch('songId')) {
      // Could auto-focus theme input or suggest themes, etc.
    }
  }, [form.watch('songId'), form]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background transition-all duration-500 ease-in-out">
      <main className="w-full max-w-3xl space-y-8">
        <Card className="shadow-xl overflow-hidden">
          <CardHeader className="bg-primary/10 p-6">
            <div className="flex items-center space-x-3">
              <Music2 className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-3xl font-bold tracking-tight text-primary">Nursery Rhyme Remix</CardTitle>
                <CardDescription className="text-lg text-foreground/80">Give classic rhymes a modern, themed twist!</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ShadForm {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="songId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-foreground/90 flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-accent" /> Select a Song
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-base h-12 rounded-lg shadow-sm focus:ring-2 focus:ring-accent">
                            <SelectValue placeholder="Choose a nursery rhyme..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {songsData.map((song) => (
                            <SelectItem key={song.id} value={song.id} className="text-base">
                              {song.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-foreground/90 flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-accent" /> Enter a Theme
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Space Adventure, Pirate Quest, Magical Forest" 
                          {...field} 
                          className="text-base h-12 rounded-lg shadow-sm focus:ring-2 focus:ring-accent"
                        />
                      </FormControl>
                      <FormDescription className="flex items-center">
                        <Info className="h-4 w-4 mr-1 text-muted-foreground"/>
                        What vibe should the remix have?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-14 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-accent hover:bg-accent/90 text-accent-foreground"
                  aria-label="Remix the song"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Remixing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-6 w-6" /> Remix It!
                    </>
                  )}
                </Button>
              </form>
            </ShadForm>
          </CardContent>
        </Card>

        {showLyrics && selectedSong && (
          <div className="mt-8 space-y-6 animate-in fade-in-50 duration-500">
            <Separator />
            <h2 className="text-3xl font-bold text-center text-primary tracking-tight">
              Your Remix is Ready!
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-foreground/90 flex items-center">
                    <BookOpen className="mr-2 h-6 w-6 text-primary" /> Original Lyrics
                  </CardTitle>
                  <CardDescription className="text-base">{selectedSong.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-base text-foreground/80 leading-relaxed">{selectedSong.originalLyrics}</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-foreground/90 flex items-center">
                    <Wand2 className="mr-2 h-6 w-6 text-accent" /> Remixed Lyrics
                  </CardTitle>
                  <CardDescription className="text-base">{selectedSong.title} - {form.getValues("theme")} Remix</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-base text-foreground/80 leading-relaxed">{remixedLyrics}</p>
                </CardContent>
                <CardFooter>
                   <p className="text-sm text-muted-foreground italic">Lyrics generated with a touch of AI magic (placeholder for now)!</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
