const CircleProgress = ({
  progress,
  max,
  size = 80, // Default size
  strokeWidth = 8, // Default stroke width
}: {
  progress: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2; // Adjust radius based on size and strokeWidth
  const circumference = 2 * Math.PI * radius;
  const percentage = (progress / max) * 100;
  const strokeDashoffset = ((100 - percentage) / 100) * circumference;

  return (
    <div style={{ width: size, height: size }} className='relative'>
      <svg className='w-full h-full' viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          className='text-gray-300 dark:text-slate-600 stroke-current'
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='transparent'
          strokeDasharray={circumference}
        />

        {/* Foreground circle */}
        <circle
          className='text-gray-900 dark:text-slate-300 stroke-current'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='transparent'
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // Adjust the start position of the circle
        />
      </svg>
    </div>
  );
};

export default CircleProgress;
