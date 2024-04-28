import ProfilePageProfileCard from '@/components/ProfileComponents/ProfilePageProfile';
import '../index.css';

import ProfileSortBySlider from '@/components/ProfileComponents/ProfileSortBySlider';

export default function ProfilePage() {
  return (
    <div className='flex flex-col '>
      <ProfilePageProfileCard />

      <ProfileSortBySlider />
    </div>
  );
}
