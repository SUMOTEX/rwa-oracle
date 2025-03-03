import routes from '@/config/routes';
import { HomeIcon } from '@/components/icons/home';
import { FarmIcon } from '@/components/icons/farm';
import { PoolIcon } from '@/components/icons/pool';
import { ProfileIcon } from '@/components/icons/profile';
import { DiskIcon } from '@/components/icons/disk';
import { ExchangeIcon } from '@/components/icons/exchange';
import { VoteIcon } from '@/components/icons/vote-icon';
import { PlusCircle } from '@/components/icons/plus-circle';
import { CompassIcon } from '@/components/icons/compass';
import { LivePricing } from '@/components/icons/live-pricing';
import { LockIcon } from '@/components/icons/lock-icon';
import { TradingBotIcon } from '@/components/icons/trading-bot-icon';

export const defaultMenuItems = [
  // {
  //   name: 'Home',
  //   icon: <HomeIcon />,
  //   href: routes.home,
  // },
  {
    name: 'Contract',
    icon: <CompassIcon />,
    href: routes.search,
    dropdownItems: [
      {
        name: 'View Contract',
        icon: <CompassIcon />,
        href: routes.viewContract,
      },
      {
        name: 'Create Contract',
        icon: <PlusCircle />,
        href: routes.createContract,
      }
      // {
      //   name: 'NFT Details',
      //   icon: <DiskIcon />,
      //   href: routes.nftDetails,
      // },
    ],
  },
];
