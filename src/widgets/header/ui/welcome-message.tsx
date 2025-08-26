import { FC } from 'react';

export const WelcomeMessage: FC = () => {

  return (
    <div className='space-y-2 mb-4'>
      <h2 className='text-2xl lg:text-4xl text-white font-medium'>
        Welcome Back 👋
      </h2>
      <p className='text-sm lg:text-base text-[#aec9f6]'>This is your Financial Overview Report</p>
    </div>
  );
};