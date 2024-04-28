import ReactDOM from 'react-dom/client';
import MainPlatform from './MainPlatform.tsx'; // Assuming App contains the ClerkProvider
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './views/Home.tsx';
import PostPage from './views/PostPage.tsx';
import AuthPage from './views/AuthPage.tsx';
import { ClerkProvider } from '@clerk/clerk-react';
import RootLayout from './components/Layouts/RootLayout.tsx';
import ProfilePage from './views/ProfilePage.tsx';
import LeaderboardPage from './views/LeaderboardPage.tsx';

export const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <AuthPage /> },

      {
        element: <MainPlatform />,
        children: [
          { path: '/home', element: <Home /> },
          { path: '/post/:id', element: <PostPage /> },
          { path: '/user/:userId', element: <ProfilePage /> },
          { path: '/leaderboard', element: <LeaderboardPage /> },
        ],
      },
    ],
  },
]);

// force dark mode for now
document.body.classList.toggle(
  'dark',
  localStorage.getItem('theme') === 'dark'
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </QueryClientProvider>
);
