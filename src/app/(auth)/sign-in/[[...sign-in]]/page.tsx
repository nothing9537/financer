import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { ClerkLoaded, ClerkLoading, SignIn } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'

const SignInPage = () => {
  return (
    <>
      <ClerkLoaded>
        <div>
          <SignIn path='/sign-in' />
          <Card className='mt-12'>
            <CardHeader>
              <CardTitle className='text-base'>
                If you don&apos;t want to create your own account but still want to test the app, you can use this test account.
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
              <p>
                Username: {' '}
                <b>TestUser</b>
              </p>
              <p>
                Password: {' '}
                <b>GoodPasswordForTestUser123!</b>
              </p>
            </CardContent>
          </Card>
        </div>
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className='animate-spin' />
      </ClerkLoading>
    </>
  );
}

export default SignInPage;