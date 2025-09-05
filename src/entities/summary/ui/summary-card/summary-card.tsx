'use client';

import { IconType } from 'react-icons';
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils/cn';
import { CountUp } from '@/shared/ui/count-up';
import { formatAmount, formatPercentage } from '@/shared/lib/utils/format';
import { Skeleton } from '@/shared/ui/skeleton';

const boxVariant = cva(
  'rounded-md p-3 shrink-0',
  {
    variants: {
      variant: {
        default: "bg-blue-500/20",
        success: "bg-emerald-500/20",
        danger: "bg-rose-500/20",
        warning: "bg-yellow-500/20",
      },
    },
    defaultVariants: {
      variant: 'default',
    }
  },
);

const iconVariant = cva(
  'size-6',
  {
    variants: {
      variant: {
        default: "fill-blue-500",
        success: "fill-emerald-500",
        danger: "fill-rose-500",
        warning: "fill-yellow-500",
      },
    },
    defaultVariants: {
      variant: 'default',
    }
  },
);

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface SummaryCardProps extends BoxVariants, IconVariants {
  title: string;
  value?: number;
  percentageChange?: number;
  Icon: IconType;
  dateRangeLabel: string;
  isLoading?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value = 0, percentageChange = 0, Icon, variant, dateRangeLabel, isLoading }) => {
  if (isLoading) {
    return (
      <Card className='border-none drop-shadow-sm w-full'>
        <CardHeader className='flex flex-row items-center justify-between gap-x-4'>
          <div className='space-y-2'>
            <Skeleton className='h-6 w-24' />
            <Skeleton className='h-4 w-40' />
          </div>
          <Skeleton className='size-12' />
        </CardHeader>
        <CardContent>
          <Skeleton className='shrink-0 h-10 w-24 mb-2' />
          <Skeleton className='shrink-0 h-4 w-40' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='border-none drop-shadow-sm w-full'>
      <CardHeader className='flex flex-row items-center justify-between gap-x-4'>
        <div className='space-y-2'>
          <CardTitle className='text-2xl line-clamp-1'>
            {title}
          </CardTitle>
          <CardDescription>
            {dateRangeLabel}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className='font-bold text-2xl mb-2 line-clamp-1 break-all'>
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimal='2'
            decimalPlaces={2}
            formattingFn={formatAmount}
          />
        </h1>
        <p className={cn('text-muted-foreground text-sm line-clamp-1', percentageChange > 0 && 'text-emerald-500', percentageChange < 0 && 'text-rose-500')}>
          {formatPercentage(percentageChange, { addPrefix: true })} from last period
        </p>
      </CardContent>
    </Card>
  );
};