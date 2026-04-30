import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'blogdata.json');

export interface BlogPost {
    id: string;
    title: string;
    shortName: string;
    slug: string;
    description: string;
    content: string;
    image: string;
    tags: string[];
    category: string;
    readTime: string;
    metaTitle: string;
    metaDescription: string;
    metaKeys: string;
    createdAt: string;
    updatedAt: string;
}


export async function getAllBlogs(): Promise<BlogPost[]> {
    try {
        const data = await fs.readFile(DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading blog data:', error);
        return [];
    }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
    const blogs = await getAllBlogs();
    return blogs.find(blog => blog.slug === slug);
}

export async function saveBlog(blog: BlogPost): Promise<void> {
    const blogs = await getAllBlogs();

    // Check slug uniqueness
    const duplicate = blogs.find(b => b.slug === blog.slug && b.id !== blog.id);
    if (duplicate) {
        blog.slug = `${blog.slug}-${Math.random().toString(36).substring(2, 5)}`;
    }

    if (!blog.id) {
        blog.id = crypto.randomUUID();
    }

    const index = blogs.findIndex(b => b.id === blog.id);

    if (index !== -1) {
        blogs[index] = { ...blog, updatedAt: new Date().toISOString() };
    } else {
        blogs.push({ ...blog, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    await fs.writeFile(DATA_PATH, JSON.stringify(blogs, null, 2), 'utf-8');
}

export async function deleteBlog(id: string): Promise<void> {
    const blogs = await getAllBlogs();
    const filteredBlogs = blogs.filter(blog => blog.id !== id);
    await fs.writeFile(DATA_PATH, JSON.stringify(filteredBlogs, null, 2), 'utf-8');
}

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}
