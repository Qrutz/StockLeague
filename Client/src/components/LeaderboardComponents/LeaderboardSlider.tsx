interface LeaderboardSliderProps {
  active: tabs;
  setActive: (tabName: tabs) => void;
}

export default function LeaderboardSlider({
  active,
  setActive,
}: LeaderboardSliderProps) {
  const isActive = (tabName: tabs) =>
    active === tabName ? ' dark:bg-slate-900 bg-gray-200 font-bold  ' : '';

  return (
    <div className='flex  dark:p-2 dark:mx-2 gap-1  dark:bg-transparent '>
      <span
        className={`w-1/3 p-3 flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-900 ${isActive(
          'monthly'
        )}`}
        onClick={() => setActive('monthly')}
      >
        Monthly
      </span>
      <span
        className={`w-1/3 p-3 flex justify-center rounded-lg items-center  cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-900 ${isActive(
          'weekly'
        )}`}
        onClick={() => setActive('weekly')}
      >
        Weekly
      </span>
      <span
        className={`w-1/3 p-3 flex justify-center items-center rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-900 ${isActive(
          'yearly'
        )}`}
        onClick={() => setActive('yearly')}
      >
        Yearly
      </span>
    </div>
  );
}
