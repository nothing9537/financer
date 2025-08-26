import { SignLayout } from '@/shared/components/layouts'
import { ClerkLoaded, ClerkLoading, SignUp } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

const SignUpPage = () => {
  return (
    <SignLayout>
      <ClerkLoaded>
        <SignUp path='/sign-up' />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className='animate-spin' />
      </ClerkLoading>
    </SignLayout>
  )
}

export default SignUpPage