
import { logger } from '@/lib/logger';

const MEGACLOUD_MAIN_URL = "https://megacloud.blog";
const DECRYPT_MACRO_URL = "https://script.google.com/macros/s/AKfycbxHbYHbrGMXYD2-bC-C43D3njIbU-wGiYQuJL61H4vyy6YVXkybMNNEPJNPPuZrD1gRVA/exec";
const KEYS_URL = "https://raw.githubusercontent.com/yogesh-hacker/MegacloudKeys/refs/heads/main/keys.json";

interface MegacloudSource {
    file: string;
    type: string;
}

interface MegacloudTrack {
    file: string;
    label: string;
    kind: string;
    default?: boolean;
}

interface MegacloudResponse {
    sources: MegacloudSource[];
    tracks: MegacloudTrack[];
    encrypted: boolean;
    intro: { start: number; end: number };
    outro: { start: number; end: number };
    server: number;
}

export async function extractMegacloud(url: string) {
    const mainHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Origin": MEGACLOUD_MAIN_URL,
        "Referer": MEGACLOUD_MAIN_URL + "/",
    };

    try {
        const id = url.split('/').pop()?.split('?')[0];
        if (!id) throw new Error("Could not extract ID from URL");

        logger.info(`[Megacloud] Extracting sources for ID: ${id}`);

        const response = await fetch(url, { headers: mainHeaders });
        const responseText = await response.text();

        // Nonce extraction logic from Kotlin
        const match1 = responseText.match(/\b[a-zA-Z0-9]{48}\b/);
        const match2 = responseText.match(/\b([a-zA-Z0-9]{16})\b.*?\b([a-zA-Z0-9]{16})\b.*?\b([a-zA-Z0-9]{16})\b/);
        
        const nonce = match1 ? match1[0] : (match2 ? match2[1] + match2[2] + match2[3] : null);
        
        if (!nonce) throw new Error("Nonce not found in embed page");

        const apiUrl = `${MEGACLOUD_MAIN_URL}/embed-2/v3/e-1/getSources?id=${id}&_k=${nonce}`;
        const apiRes = await fetch(apiUrl, {
            headers: {
                ...mainHeaders,
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        if (!apiRes.ok) throw new Error(`Megacloud API failed with status ${apiRes.status}`);

        const data: MegacloudResponse = await apiRes.json();
        const encodedFile = data.sources[0]?.file;

        if (!encodedFile) throw new Error("No sources found in Megacloud response");

        let streamUrl = "";

        if (encodedFile.includes(".m3u8")) {
            streamUrl = encodedFile;
        } else {
            // Decryption logic using the macro
            const keysRes = await fetch(KEYS_URL);
            const keys = await keysRes.json();
            const secret = keys.mega;

            const decryptUrl = `${DECRYPT_MACRO_URL}?encrypted_data=${encodeURIComponent(encodedFile)}&nonce=${encodeURIComponent(nonce)}&secret=${encodeURIComponent(secret)}`;
            
            const decryptRes = await fetch(decryptUrl);
            const decryptText = await decryptRes.text();
            
            // Extract file URL from macro response
            const fileMatch = decryptText.match(/"file":"(.*?)"/);
            if (!fileMatch) throw new Error("Failed to decrypt URL or find file in response");
            
            streamUrl = fileMatch[1].replace(/\\\//g, '/');
        }

        return {
            sources: [{
                url: streamUrl,
                isM3U8: streamUrl.includes(".m3u8"),
                type: "hls"
            }],
            tracks: data.tracks.map(t => ({
                url: t.file,
                lang: t.label,
                kind: t.kind,
                default: t.default
            })),
            intro: data.intro,
            outro: data.outro,
            headers: {
                "Referer": MEGACLOUD_MAIN_URL + "/"
            }
        };

    } catch (error: any) {
        logger.error(`[Megacloud] Extraction failed: ${error.message}`);
        throw error;
    }
}
