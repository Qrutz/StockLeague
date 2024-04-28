import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const Lolt = ({ element }) => {
  console.log('element', element.prediction);

  if (!element.prediction) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Badge
          contentEditable={false}
          className={`flex space-x-1 items-center text-sm font-semibold text-white ${
            element.prediction.movement > 0
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-400 hover:bg-red-500 '
          }`}
        >
          {element.prediction.ticker}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Card className='max-w-sm rounded-lg border bg-white  shadow-md'>
          <CardHeader className='flex items-center justify-between pb-4'>
            <CardTitle className='text-lg font-bold'>
              {element.prediction.ticker}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center mb-4'>
              <span className='font-medium'>Price Prediction</span>
            </div>
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>Target Date</span>
                <span className='text-lg font-semibold'>
                  {element.prediction.byDate.toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-sm text-gray-500'>Movement</span>
                <span className='text-lg font-semibold'>
                  {element.prediction.movement}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default Lolt;
