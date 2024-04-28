import { useAuth } from '@clerk/clerk-react';
import { Outlet } from 'react-router-dom';
import LoadingComponent from '../Loaders/LoadingFullScreen';

export default function RootLayout() {
  const { isLoaded } = useAuth();

  if (!isLoaded) return <LoadingComponent />;

  return <Outlet />;
}
