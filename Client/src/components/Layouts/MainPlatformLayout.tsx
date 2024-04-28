import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainPlatformLayout() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/');
    } else {
      navigate('/home');
    }
  }, [isSignedIn, navigate]);
}
