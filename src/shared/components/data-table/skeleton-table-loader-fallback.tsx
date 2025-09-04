import * as React from "react";

import { cn } from '@/shared/lib/utils/cn';
import { Skeleton } from '@/shared/ui/skeleton';

type OwnProps = {
  count: number;
  skeletonClassName?: string;
};

type PolymorphicProps<C extends React.ElementType, Props = object> =
  Props & {
    as?: C;
  } & Omit<React.ComponentPropsWithoutRef<C>, keyof Props | "as">;

export const SkeletonTableLoader = <
  C extends React.ElementType = typeof React.Fragment
>(
  { count, skeletonClassName, as, ...rest }: PolymorphicProps<C, OwnProps>
) => {
  const Wrapper = (as ?? React.Fragment) as React.ElementType;
  const isFragment = Wrapper === React.Fragment;

  return (
    <>
      {Array.from({ length: count }, (_, index) =>
        isFragment ? (
          <React.Fragment key={index}>
            <Skeleton as="td" className={cn("h-8", skeletonClassName)} />
          </React.Fragment>
        ) : (
          <Wrapper key={index} {...(rest as React.ComponentPropsWithoutRef<C>)}>
            <Skeleton as="td" className={cn("h-8", skeletonClassName)} />
          </Wrapper>
        )
      )}
    </>
  );
};

