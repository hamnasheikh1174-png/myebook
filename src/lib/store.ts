import { Novel } from '../types';

const INITIAL_NOVELS: Novel[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 15.99,
    category: 'Fiction',
    description: 'A classic novel about the American Dream in the 1920s.',
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000',
    user_id: 'system'
  },
  {
    id: '2',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    price: 24.50,
    category: 'Fiction',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000',
    user_id: 'system'
  }
];

class SimpleStore {
  private getNovels(): Novel[] {
    const stored = localStorage.getItem('e-novels');
    if (!stored) {
      localStorage.setItem('e-novels', JSON.stringify(INITIAL_NOVELS));
      return INITIAL_NOVELS;
    }
    return JSON.parse(stored);
  }

  private saveNovels(novels: Novel[]) {
    localStorage.setItem('e-novels', JSON.stringify(novels));
  }

  auth = {
    getUser: async () => {
      const user = localStorage.getItem('e-user');
      return { data: { user: user ? JSON.parse(user) : null } };
    },
    signInWithPassword: async ({ email }: { email: string }) => {
      const user = { id: 'u-' + btoa(email).slice(0, 8), email };
      localStorage.setItem('e-user', JSON.stringify(user));
      return { data: { user }, error: null };
    },
    signUp: async ({ email }: { email: string }) => {
      const user = { id: 'u-' + btoa(email).slice(0, 8), email };
      localStorage.setItem('e-user', JSON.stringify(user));
      return { data: { user }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('e-user');
      return { error: null };
    }
  };

  novels = {
    getAll: async () => {
      return { data: this.getNovels(), error: null };
    },
    getById: async (id: string | undefined) => {
      const novel = this.getNovels().find(n => n.id === id);
      return { data: novel || null, error: novel ? null : { message: 'Not found' } };
    },
    getByUser: async (userId: string) => {
      const novels = this.getNovels().filter(n => n.user_id === userId);
      return { data: novels, error: null };
    },
    insert: async (novel: Omit<Novel, 'id'>) => {
      const novels = this.getNovels();
      const newNovel = { ...novel, id: Math.random().toString(36).substring(2, 11) } as Novel;
      novels.push(newNovel);
      this.saveNovels(novels);
      return { data: newNovel, error: null };
    },
    update: async (id: string, updates: Partial<Novel>) => {
      const novels = this.getNovels();
      const index = novels.findIndex(n => n.id === id);
      if (index === -1) return { error: { message: 'Not found' } };
      novels[index] = { ...novels[index], ...updates };
      this.saveNovels(novels);
      return { error: null };
    },
    delete: async (id: string) => {
      const novels = this.getNovels().filter(n => n.id !== id);
      this.saveNovels(novels);
      return { error: null };
    }
  };
}

export const store = new SimpleStore();
