import { useEffect, useState } from 'react';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import UserProfileCard from './ProfileComponents/UserProfileCard';
import logo from '../assets/Logo.svg';
import '../app.css';
import {
  BellIcon,
  ChatBubbleIcon,
  PersonIcon,
  GroupIcon,
  Pencil2Icon,
  PlayIcon,
  GearIcon,
  ExitIcon,
  HomeIcon,
} from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

export default function Component() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  const handleToggleDarkmode = () => {
    const newDarkMode = !darkMode;
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    setDarkMode(newDarkMode);
  };

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode);
    setDarkMode(isDarkMode);
  }, []);

  //dark:border-r dark:border-slate-700
  return (
    <aside className='dark:bg-slate-950 bg-white dark:border-r dark:border-slate-700 border-r dark:text-white w-4/12 py-5 flex flex-col max-h-screen sticky top-0 overflow-y-auto '>
      <img
        className='flex justify-center object-cover h-[7rem] self-center'
        src={logo}
        alt='Logo'
      />
      <h2 className='flex justify-center font-lalezar text-black-500 text-3xl tracking-widest font-bold '>
        AKTIELIGAN
      </h2>
      <div className='space-y-4 p-4'>
        <Separator className='bg-gradient-to-r from-slate-50 via-slate-950 to-slate-50 dark:from-slate-950 dark:via-slate-400 dark:to-slate-950' />
        <UserProfileCard />
        <Separator className='bg-gradient-to-r from-slate-50 via-slate-950 to-slate-50 dark:from-slate-950 dark:via-slate-400 dark:to-slate-950' />
      </div>

      <label className='text-sm font-medium px-3 py-2 flex justify-center md:justify-start'>
        MENU
      </label>

      <div className='flex flex-col flex-grow'>
        {/* Menu items */}
        <Link
          to={`/home`}
          className='dark:hover:bg-slate-800 hover:bg-slate-200/90 cursor-pointer py-2 px-3 flex gap-3 text-lg items-center justify-center md:justify-start'
        >
          <HomeIcon className='md:h-6 md:w-7' />
          <span className='font-semibold hidden md:block'>Home</span>
        </Link>

        <div className='dark:hover:bg-slate-800 hover:bg-slate-200/90 cursor-pointer py-2 px-3 flex gap-3 text-lg items-center justify-center md:justify-start'>
          <BellIcon className='md:h-6 md:w-7' />
          <span className='font-semibold hidden md:block'>Notifications</span>
        </div>

        <div className='dark:hover:bg-slate-800 hover:bg-slate-200/90 cursor-pointer py-2 px-3 flex gap-3 text-lg items-center justify-center md:justify-start'>
          <ChatBubbleIcon className='md:h-6 md:w-7' />
          <span className='font-semibold hidden md:block'>Messages</span>
        </div>

        <div className='dark:hover:bg-slate-800 hover:bg-slate-200/90 cursor-pointer py-2 px-3 flex gap-3 text-lg items-center justify-center md:justify-start'>
          <PersonIcon className='md:h-6 md:w-7' />
          <span className='font-semibold hidden md:block'>Profile</span>
        </div>

        <div className='dark:hover:bg-slate-800 hover:bg-slate-200/90 cursor-pointer py-2 px-3 flex gap-3 text-lg items-center justify-center md:justify-start'>
          <GroupIcon className='md:h-6 md:w-7' />
          <span className='font-semibold hidden md:block'>Groups</span>
        </div>

        <div className='dark:hover:bg-slate-800 hover:bg-slate-200/90 cursor-pointer py-2 px-3 flex gap-3 text-lg items-center justify-center md:justify-start'>
          <Pencil2Icon className='md:h-6 md:w-7' />
          <span className='font-semibold hidden md:block'>Write</span>
        </div>

        <div className='dark:hover:bg-slate-800 hover:bg-slate-200/90 cursor-pointer py-2 px-3 flex gap-3 text-lg items-center justify-center md:justify-start'>
          <PlayIcon className='md:h-6 md:w-7' />
          <span className='font-semibold hidden md:block'>Videos</span>
        </div>

        <div className='px-3 py-2'>
          <Separator className='bg-gradient-to-r from-slate-950 via-slate-400 to-slate-950' />
        </div>

        <div className='flex  space-x-2 mt-2  justify-center md:justify-start flex-col'>
          <div className='dark:hover:bg-slate-800 hover:bg-slate-200/90 cursor-pointer py-2 px-3 flex gap-3 text-lg items-center justify-center md:justify-start'>
            <GearIcon className='md:h-6 md:w-7' />
            <span className='font-semibold hidden md:block'>Settings</span>
          </div>
          <Switch
            onCheckedChange={handleToggleDarkmode}
            checked={darkMode}
            id='dark-mode-switch'
          />
        </div>
      </div>

      <div className='px-3 py-2'>
        <Separator className='bg-gradient-to-r from-slate-950 via-slate-400 to-slate-950' />
      </div>

      <div className='dark:hover:bg-slate-800 hover:bg-slate-200/90 cursor-pointer p-2 flex gap-3 text-lg items-center justify-center md:justify-start'>
        <ExitIcon className='md:h-6 md:w-7' />
        <span className='font-semibold hidden md:block'>Exit</span>
      </div>
    </aside>
  );
}
