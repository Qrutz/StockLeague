'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from './ui/button';

export function NavigationTopbar() {
  return (
    <NavigationMenu className=''>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href={'/Leaderboard'}
            className={navigationMenuTriggerStyle()}
          >
            Leaderboard
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href={'/calendar'}
            className={navigationMenuTriggerStyle()}
          >
            Market Calendar
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href={'/'}
            className={navigationMenuTriggerStyle()}
          >
            WarrantListan
            {/* <Button variant={'outline'} className='font-bold text-white'>
              Warrantlistan
            </Button> */}
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            href={'/nyheter'}
            className={navigationMenuTriggerStyle()}
          >
            Nyheter
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
