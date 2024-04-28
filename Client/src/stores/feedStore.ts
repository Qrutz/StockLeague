import { create } from 'zustand';

type State = {
  posts: guess[];
  addPost: (post: guess) => void;
};

// Create the store
export const useStore = create<State>((set) => ({
  posts: [],
  addPost: (newPost) => set((state) => ({ posts: [...state.posts, newPost] })),
}));
