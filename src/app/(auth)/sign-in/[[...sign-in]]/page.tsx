import { ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

const SignInPage = () => {
  return (
    <>
      <ClerkLoaded>
        <SignIn path='/sign-in' />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className='animate-spin' />
      </ClerkLoading>
    </>
  );
}

export default SignInPage;