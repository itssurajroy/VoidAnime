'use client';

interface AnimePageTitleProps {
    anime: {
        name: string;
        jname?: string;
    };
}

export function AnimePageTitle({ anime }: AnimePageTitleProps) {
    return (
        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
            {anime.name}
        </h1>
    )
}
