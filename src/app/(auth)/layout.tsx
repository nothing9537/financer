import Image from 'next/image';
import { FC } from 'react';

interface SignLayoutProps {
  children: React.ReactNode;
}

const SignLayout: FC<SignLayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      <div className='h-full lg:flex flex-col items-center justify-center p-4'>
        <div className='text-center'>
          <h1 className='font-bold text-3xl text-muted-foreground'>
            Welcome Back!
          </h1>
          <p className='text-base text-[#7e8cA0]'>
            Log In or create an account to manage your transactions with ease.
          </p>
        </div>
        <div className='flex items-center justify-center mt-8'>
          {children}
        </div>
      </div>
      <div className='h-full hidden bg-blue-500 lg:flex items-center justify-center'>
        <Image src="/logo.svg" width={100} height={100} alt="Logo" className='select-none' />
      </div>
    </div>
  );
}

export default SignLayout;