
import { logger } from '@/lib/logger';
import * as cheerio from 'cheerio';

const HIANIME_BASE = "https://hianime.to";

export async function getHiAnimeServers(episodeId: string) {
    const url = `${HIANIME_BASE}/ajax/v2/episode/servers?episodeId=${episodeId}`;
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": HIANIME_BASE
            }
        });
        const data = await res.json();
        if (!data.status) throw new Error("Failed to fetch servers from HiAnime");

        const $ = cheerio.load(data.html);
        const servers: { id: string, name: string, type: string }[] = [];

        $('.server-item').each((_, el) => {
            const id = $(el).attr('data-id');
            const type = $(el).attr('data-type');
            const name = $(el).find('a').text().trim();
            if (id && name && type) {
                servers.push({ id, name, type });
            }
        });

        return servers;
    } catch (error: any) {
        logger.error(`[HiAnime] Failed to fetch servers: ${error.message}`);
        throw error;
    }
}

export async function getHiAnimeSourceUrl(serverId: string) {
    const url = `${HIANIME_BASE}/ajax/v2/episode/sources?id=${serverId}`;
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": HIANIME_BASE
            }
        });
        const data = await res.json();
        if (!data.link) throw new Error("Failed to fetch source link from HiAnime");

        return data.link; // This is the embed URL (e.g. Megacloud)
    } catch (error: any) {
        logger.error(`[HiAnime] Failed to fetch source link: ${error.message}`);
        throw error;
    }
}
