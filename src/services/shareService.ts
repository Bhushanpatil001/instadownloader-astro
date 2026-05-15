import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'shares.json');

export interface SharableLink {
    id: string;
    targetUrl: string;
    title: string;
    description: string;
    image: string;
    platform: string;
    createdAt: string;
    updatedAt: string;
}

export async function getAllShares(): Promise<SharableLink[]> {
    try {
        const data = await fs.readFile(DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading shares data:', error);
        return [];
    }
}

export async function getShareById(id: string): Promise<SharableLink | undefined> {
    const shares = await getAllShares();
    return shares.find(share => share.id === id);
}

export async function saveShare(share: Partial<SharableLink>): Promise<SharableLink> {
    const shares = await getAllShares();

    const index = share.id 
        ? shares.findIndex(s => s.id === share.id)
        : shares.findIndex(s => s.targetUrl === share.targetUrl);

    const now = new Date().toISOString();

    let savedShare: SharableLink;

    if (index !== -1) {
        // If it exists by targetUrl but no ID was provided, we just return the existing one.
        // If an ID was provided, we update it.
        if (!share.id) {
            return shares[index];
        }
        savedShare = { ...shares[index], ...share, updatedAt: now } as SharableLink;
        shares[index] = savedShare;
    } else {
        const newId = share.id || Math.random().toString(36).substring(2, 8);
        savedShare = {
            id: newId,
            targetUrl: share.targetUrl || '',
            title: share.title || '',
            description: share.description || '',
            image: share.image || '',
            platform: share.platform || 'other',
            createdAt: now,
            updatedAt: now
        } as SharableLink;
        shares.push(savedShare);
    }

    await fs.writeFile(DATA_PATH, JSON.stringify(shares, null, 2), 'utf-8');
    return savedShare;
}

export async function deleteShare(id: string): Promise<void> {
    const shares = await getAllShares();
    const filteredShares = shares.filter(share => share.id !== id);
    await fs.writeFile(DATA_PATH, JSON.stringify(filteredShares, null, 2), 'utf-8');
}
