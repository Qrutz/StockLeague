import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  calculateAccuracy,
  calculateDaysLeft,
  getStockMovementPercentage,
} from '@/lib/postFunctions';
import { Button } from '../ui/button';

interface PostPredictionPopoverProps {
  post: TimeLinePost2;
  currentPrice: number;
}

export default function PostPredictionPopover({
  post,
  currentPrice,
}: PostPredictionPopoverProps) {
  const stockMovementPercentage = getStockMovementPercentage(
    post.predictions.priceAtGuess,
    currentPrice
  );
  const accuracy = calculateAccuracy(
    post.predictions.predictedMovement,
    post.predictions.priceAtGuess,
    currentPrice
  );
  const daysLeft = calculateDaysLeft(
    post.predictions.dateAtFinal,
    post.predictions.dateAtGuess
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'secondary'}
          className=' w-full '
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Show Prediction
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='w-full max-w-none'
        align='center'
        side='bottom'
      >
        {' '}
        <section className='flex flex-col border-slate-600 border border-dotted rounded-lg w-full'>
          <div className='flex justify-around p-2'>
            <div className='gap-1 flex flex-col'>
              <p className='text-xs font-thin  '>Price at guess:</p>
              <p className='text-xl font-bold'>
                {' '}
                ${Number(post.predictions.priceAtGuess).toFixed(2)}
              </p>
            </div>
            <div className='gap-1 flex flex-col'>
              <p className='text-xs font-thin  '>Current price:</p>
              <p className='text-xl font-bold'>${currentPrice?.toFixed(2)}</p>
            </div>
            <div className='gap-1 flex flex-col'>
              <p className='text-xs font-thin  '>Movement:</p>

              {stockMovementPercentage === undefined ? (
                <p className='text-xl font-bold text-gray-500'>Loading...</p>
              ) : (
                <div
                  className={`text-xl font-extrabold ${
                    stockMovementPercentage >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {stockMovementPercentage > 0 ? (
                    <div className='flex items-center gap-1'>
                      {/* <FaArrowUp className='text-green-500' /> */}
                      <span className='font-bold text-md'>
                        {stockMovementPercentage?.toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-1'>
                      {/* <FaArrowDown className='text-red-500' /> */}
                      <span className='font-bold text-md'>
                        {stockMovementPercentage?.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div
            className={`px-2 py-1 dark:bg-slate-600/10 ${
              accuracy && accuracy > 0 ? 'bg-green-300' : 'bg-red-200'
            }`}
          >
            <div className='container mx-auto md:max-w-3xl justify-between flex'>
              {accuracy && accuracy > 0 ? (
                <span className='font-bold text-green-500'>
                  {accuracy.toFixed(2)}% Accuracy
                </span>
              ) : (
                <span className='font-bold text-red-500'>
                  {accuracy?.toFixed(2)}% Accuracy
                </span>
              )}

              <span className='font-bold'>
                {daysLeft?.toFixed(0) + ' '}
                Days left
              </span>
            </div>
          </div>
        </section>
      </PopoverContent>
    </Popover>
  );
}
