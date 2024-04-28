import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

import { Card, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';

import { Button } from '../ui/button';
import { ChevronDownIcon, Cross1Icon } from '@radix-ui/react-icons';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Calendar } from '../ui/calendar';

const StocksMockup = [
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
  },
  {
    symbol: 'NIO',
    name: 'NIO Inc.',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
  },
];

type Prediction = {
  ticker: string | undefined;
  movement: string | undefined;
  byDate: Date | Date[] | undefined;
};

interface Props {
  children: React.ReactNode;
  // callbackfunction
  onPredictionSubmit: (prediction: Prediction) => void;
}

export default function PredictionModal({
  children,
  onPredictionSubmit,
}: Props) {
  const [searchValue, setSearchValue] = useState(''); // Initial state is empty string
  const [chosenStock, setChosenStock] = useState<Stock>(); // Initial state is empty string
  const [selectedMovement, setSelectedMovement] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState(''); // Initial state is empty string
  const [date, setDate] = useState<Date | Date[]>(); // Initial state is empty string

  const [StockChoosingState, setStockChoosingState] = useState(false); // Initial state is false
  const [StockMovementState, setStockMovementState] = useState(false); // Initial state is false
  const [StockDateState, setStockDateState] = useState(false); // Initial state is false
  const [sortedsC, setSortedsC] = useState<Stock[]>([]);

  const handleMovementChange = (movement: string) => {
    setSelectedMovement((current) => (current === movement ? '' : movement));
  };

  const handleStockButtonClick = () => {
    setStockChoosingState(!StockChoosingState);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      {StockChoosingState ? (
        <AlertDialogContent className=''>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-2xl flex gap-2 dark:text-slate-200'>
              <Button
                variant={'outline'}
                className='flex'
                onClick={handleStockButtonClick}
              >
                Back
              </Button>
              Choose a stock
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className='flex flex-col dark:text-slate-200'>
            <Input
              className=' focus:outline-none active:border-none'
              placeholder='Search for a stock'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <ScrollArea className='h-[320px] rounded-md '>
              {sortedsC.length > 0
                ? sortedsC.map((stock) => (
                    <Card
                      key={stock.symbol}
                      onClick={() => {
                        setChosenStock(stock);
                        handleStockButtonClick();
                      }}
                      className='rounded-none dark:hover:bg-green-00 cursor-pointer '
                    >
                      <CardHeader>
                        <CardTitle className='flex items-center gap-3'>
                          <span className='font-bold text-2xl'>
                            {stock.symbol}
                          </span>
                          <Badge className='ml-2'>{stock.name}</Badge>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))
                : // Assuming StocksMockup is an array of stock items
                  StocksMockup.map((stock) => (
                    <Card
                      key={stock.symbol}
                      onClick={() => {
                        setChosenStock(stock);
                        handleStockButtonClick();
                      }}
                      className='rounded-none hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer '
                    >
                      <CardHeader>
                        <CardTitle className='flex items-center gap-3'>
                          <span className='font-bold text-2xl'>
                            {stock.symbol}
                          </span>
                          <Badge className='ml-2'>{stock.name}</Badge>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
            </ScrollArea>
            <Separator />
          </div>
        </AlertDialogContent>
      ) : StockMovementState ? (
        <AlertDialogContent className=''>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-2xl flex gap-2 dark:text-slate-200'>
              <Button
                variant={'outline'}
                className='flex'
                onClick={() => {
                  setStockMovementState(false);
                }}
              >
                Back
              </Button>
              Movement
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className='gap-6 flex flex-col dark:text-slate-200'>
            <Label>Trend</Label>
            <div className='flex items-center  space-x-2'>
              <Checkbox
                id='up'
                checked={selectedMovement === 'up'}
                onCheckedChange={() => handleMovementChange('up')}
              />
              <Label
                htmlFor='up'
                className='text-sm font-medium leading-none cursor-pointer'
              >
                Up
              </Label>

              <Checkbox
                id='down'
                checked={selectedMovement === 'down'}
                onCheckedChange={() => handleMovementChange('down')}
              />
              <Label
                htmlFor='down'
                className='text-sm font-medium leading-none cursor-pointer'
              >
                Down
              </Label>
            </div>
            <div className='grid w-full max-w-sm items-center gap-1.5 '>
              <Label htmlFor='percentage'>Percentage %</Label>
              <Input
                value={selectedPercentage}
                onChange={(e) => {
                  // if selectedMovement is up, just set state, else if selectedMovement is down, add a minus sign
                  if (selectedMovement === 'up') {
                    setSelectedPercentage(e.target.value);
                  } else if (selectedMovement === 'down') {
                    setSelectedPercentage('-' + e.target.value);
                  }
                }}
                id='percentage'
                placeholder='2%'
              />
            </div>

            <Separator />

            <Button
              className='w-full'
              onClick={() => {
                setStockMovementState(false);
              }}
            >
              Done
            </Button>
          </div>
        </AlertDialogContent>
      ) : StockDateState ? (
        <AlertDialogContent className=''>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-2xl flex gap-2 dark:text-slate-200'>
              <Button
                variant={'outline'}
                className='flex'
                onClick={() => {
                  setStockDateState(false);
                }}
              >
                Back
              </Button>
              By date
            </AlertDialogTitle>
          </AlertDialogHeader>
          {/* @ts-expect-error shadcn calendar weird idk */}
          <Calendar
            mode='single'
            selected={date}
            onSelect={setDate}
            className='rounded-md border shadow dark:text-slate-200'
          />

          {date && (
            <div className='flex justify-end'>
              <Button
                className='w-full'
                onClick={() => {
                  setStockDateState(false);
                }}
              >
                Done
              </Button>
            </div>
          )}
        </AlertDialogContent>
      ) : (
        <AlertDialogContent className='w-full '>
          <AlertDialogHeader className='flex justify-between flex-row items-center dark:text-slate-200 '>
            <AlertDialogTitle className='text-2xl'>
              Make a prediction
            </AlertDialogTitle>

            <AlertDialogCancel className=''>
              <Cross1Icon />
            </AlertDialogCancel>
          </AlertDialogHeader>

          <div className='flex flex-col space-y-3 dark:text-slate-200'>
            <div className='flex gap-2 items-center text-lg py-2'>
              <p>Jag tror </p>
              <Button
                variant={'outline'}
                className='flex'
                onClick={() => {
                  setStockChoosingState(true);
                }}
              >
                {chosenStock ? (
                  <>
                    <span className='font-semibold text-lg'>
                      {chosenStock.symbol}
                    </span>
                  </>
                ) : (
                  <>
                    <span className=''> {'stock'}</span>
                    <ChevronDownIcon className='h-12 w-5' />
                  </>
                )}
              </Button>
              <p>kommer gå</p>

              <Button
                onClick={() => setStockMovementState(true)}
                variant={'outline'}
                className='flex'
              >
                {selectedMovement && selectedPercentage ? (
                  <span className=''>
                    {' '}
                    {selectedMovement} {selectedPercentage}%
                  </span>
                ) : (
                  <>
                    <span className=''>movement</span>
                    <ChevronDownIcon className='h-12 w-5' />
                  </>
                )}
              </Button>
              <p>tills</p>
              <Button
                onClick={() => setStockDateState(true)}
                variant={'outline'}
                className='flex'
              >
                {date ? (
                  <span className=''>
                    {' '}
                    {date.toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                ) : (
                  <>
                    <span className=''>date</span>
                    <ChevronDownIcon className='h-12 w-5' />
                  </>
                )}
              </Button>
            </div>

            {/* <div className='grid w-full gap-1.5'>
              <Label htmlFor='message'>Why do you think this?</Label>
              <Textarea
                value={selectedDescription}
                onChange={(e) => setSelectedDescription(e.target.value)}
                placeholder='I like the stock fr fr'
                id='message'
              />
            </div> */}

            <Separator />
          </div>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() =>
                onPredictionSubmit({
                  ticker: chosenStock?.symbol,
                  movement: selectedPercentage,
                  byDate: date as Date,
                })
              }
              className='w-full bg-green-500'
            >
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
