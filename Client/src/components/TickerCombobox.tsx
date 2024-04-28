'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSort } from '@/hooks/useSort';

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: 'pltr',
    label: 'PLTR',
  },
  {
    value: 'aapl',
    label: 'AAPL',
  },
  {
    value: 'tsla',
    label: 'TSLA',
  },
  {
    value: 'msft',
    label: 'MSFT',
  },
  {
    value: 'beam',
    label: 'BEAM',
  },
];

export function TickerCombobox() {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null
  );
  const { sort, updateSortType, updateTicker } = useSort();

  return (
    <div className='flex items-center space-x-2 z-[10]'>
      <p className='text-xs text-muted-foreground'>Show tickers</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='default' className=' justify-start'>
            {sort.ticker ? <>{sort.ticker}</> : <>All</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='bottom' align='start'>
          <Command>
            <CommandInput placeholder='Search bolag...' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    updateTicker(null);
                    setOpen(false);
                  }}
                >
                  {' '}
                  All
                </CommandItem>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      updateTicker(status.label);
                      setOpen(false);
                    }}
                  >
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
