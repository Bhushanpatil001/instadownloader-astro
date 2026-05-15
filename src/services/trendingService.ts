import fs from 'fs/promises';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'pSeoConfig.json');

export async function getTrendingData() {
    try {
        const data = await fs.readFile(CONFIG_PATH, 'utf-8');
        const config = JSON.parse(data);
        return {
            trending: config.trending || [],
            platformConfigs: config.platformConfigs || {}
        };
    } catch (error) {
        console.error('Error reading trending data:', error);
        return { trending: [] };
    }
}

export async function updateTrendingData(trending: any[]) {
    try {
        const data = await fs.readFile(CONFIG_PATH, 'utf-8');
        const config = JSON.parse(data);
        
        config.trending = trending;

        await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Error updating trending data:', error);
        throw new Error('Failed to update trending data');
    }
}
