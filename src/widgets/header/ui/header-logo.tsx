import Image from 'next/image';
import Link from 'next/link';

export const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className='items-center hidden lg:flex'>
        <Image
          src="/logo.svg"
          alt='Logo'
          width={32}
          height={32}
        />
        <p className='font-semibold text-white text-2xl ml-2.5'>
          Financer
        </p>
      </div>
    </Link>
  );
};