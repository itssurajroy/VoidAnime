import { SectionTitle } from "@/components/shared/SectionTitle";
import { Award, Film, MessageSquare, Calendar, Star, Crown } from "lucide-react";
import type { Achievement } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const mockAchievements: Achievement[] = [
    { id: '1', name: 'Welcome!', description: 'Joined VoidAnime.', icon: Award, earned: true },
    { id: '2', name: 'First Steps', description: 'Watched your first episode.', icon: Film, earned: true },
    { id: '3', name: 'Social Butterfly', description: 'Left your first comment.', icon: MessageSquare, earned: true },
    { id: '4', name: 'Weekender', description: 'Watched anime for 3 days in a row.', icon: Calendar, earned: false },
    { id: '5', name: 'Critic', description: 'Rated 10 anime.', icon: Star, earned: false },
    { id: '6', name: 'Anime Veteran', description: 'Watched 100 episodes.', icon: Crown, earned: false },
];

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'Award': return Award;
        case 'Film': return Film;
        case 'MessageSquare': return MessageSquare;
        case 'Calendar': return Calendar;
        case 'Star': return Star;
        case 'Crown': return Crown;
        default: return Award;
    }
}

export function Achievements() {
    return (
        <section>
            <SectionTitle>Achievements</SectionTitle>
            <div className="bg-card p-4 rounded-lg">
                <TooltipProvider>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {mockAchievements.map(ach => {
                             
                            const Icon = typeof ach.icon === 'string' ? getIcon(ach.icon) : ach.icon as any;
                            return (
                                <Tooltip key={ach.id}>
                                    <TooltipTrigger>
                                        <div className={`aspect-square flex items-center justify-center rounded-lg p-2 ${ach.earned ? 'bg-secondary' : 'bg-secondary/30'}`}>
                                            <Icon className={`w-8 h-8 ${ach.earned ? 'text-accent' : 'text-muted-foreground/50'}`} />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-bold">{ach.name}</p>
                                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </div>
                </TooltipProvider>
            </div>
        </section>
    )
}
