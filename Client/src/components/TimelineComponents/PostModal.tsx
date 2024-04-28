import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { AlertDialogHeader, AlertDialogFooter } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

import { API } from '@/API/config';
import axios from 'axios';

import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronDownIcon, Cross1Icon } from '@radix-ui/react-icons';
import { Checkbox } from '../ui/checkbox';
import { Calendar } from '../ui/calendar';
import { useMutation } from '@tanstack/react-query';
interface Stock {
  symbol: string;
  name: string;
}

const fetchStocks = async (searchValue: string) => {
  console.log(
    'running fetch stocks function with search value: ' + searchValue
  );
  if (!searchValue.trim()) return []; // Return empty array if searchValue is empty

  const response = await axios.get(
    `${API}search-ticker?query=${searchValue}&limit=10&apikey=${
      import.meta.env.VITE_FMP_KEY
    }`
  );

  console.log(response.data);
  return response.data || [];
};

export default function PostModal() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchValue, setSearchValue] = useState(''); // Initial state is empty string
  const [chosenStock, setChosenStock] = useState<Stock>(); // Initial state is empty string
  const [selectedMovement, setSelectedMovement] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState(''); // Initial state is empty string
  const [selectedDescription, setSelectedDescription] = useState(''); // Initial state is empty string
  const [date, setDate] = useState<Date | Date[]>(); // Initial state is empty string

  const [StockChoosingState, setStockChoosingState] = useState(false); // Initial state is false
  const [StockMovementState, setStockMovementState] = useState(false); // Initial state is false
  const [StockDateState, setStockDateState] = useState(false); // Initial state is false
  const [sortedsC, setSortedsC] = useState<Stock[]>([]);

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // cant invalidate here because the post takes a while to be created
      console.log('success');
    },
  });

  async function createPost() {
    const token = await getToken();

    // if
    const res = await axios.post(
      'http://localhost:3000/api/posts',
      {
        content: selectedDescription,
        ticker: chosenStock?.symbol,
        predictedMovement: selectedPercentage,
        dateAtFinal: date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }

  // create a mockup of some stocks to display when field is empty
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
  const handleMovementChange = (movement: string) => {
    setSelectedMovement((current) => (current === movement ? '' : movement));
  };

  useEffect(() => {
    console.log(searchValue.length > 0);

    if (searchValue.length > 0) {
      //   refetch(); // Refetch when searchValue updates
      fetchStocks(searchValue).then((data) => {
        console.log(data);
        setSortedsC(data);
      });
    } else {
      setSortedsC([]);
    }
  }, [searchValue]);

  const handleStockButtonClick = () => {
    setStockChoosingState(!StockChoosingState);
  };

  if (!user) {
    return null;
  }

  return (
    <AlertDialog>
      <div className='flex z-[10] items-center dark:border-b dark:bg-slate-950 bg-white dark:border-l rounded-md   dark:border-slate-700 gap-2 p-4'>
        <Avatar className=' '>
          <AvatarImage
            className=' w-12 h-12 rounded-full'
            src={user.imageUrl}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <AlertDialogTrigger className='w-full'>
          <Input
            className='w-full cursor-pointer border-gray-900 focus:outline-none active:border-none'
            placeholder='Whats your prediction anon?'
          />
        </AlertDialogTrigger>
      </div>

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
              Whaddya think?
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

            <div className='grid w-full gap-1.5'>
              <Label htmlFor='message'>Why do you think this?</Label>
              <Textarea
                value={selectedDescription}
                onChange={(e) => setSelectedDescription(e.target.value)}
                placeholder='I like the stock fr fr'
                id='message'
              />
            </div>

            <Separator />
          </div>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => mutation.mutate()}
              className='w-full'
            >
              Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
