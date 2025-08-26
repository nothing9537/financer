import { SignLayout } from '@/shared/components/layouts'
import { ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

const SignInPage = () => {
  return (
    <SignLayout>
      <ClerkLoaded>
        <SignIn path='/sign-in' />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className='animate-spin' />
      </ClerkLoading>
    </SignLayout>
  )
}

export default SignInPage