import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from '@/router'
import axios from 'axios'

function signup() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/account/signup/steps/password`,
      data
    )

    if (response?.data?.success) {
      alert('Signup successful')
    }
  }

  return (
    <div>
      <div className='flex items-center justify-center '>
        <form onSubmit={handleSubmit}>
          <Card className='w-[350px]'>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Please sign up to proceed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid w-full items-center gap-4'>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    placeholder='Email'
                  />
                </div>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    type='password'
                    id='password'
                    name='password'
                    placeholder='Password'
                  />
                </div>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='confirm'>Confirm Password</Label>
                  <Input
                    type='password'
                    id='confirm'
                    name='confirm'
                    placeholder='Confirm Password'
                  />
                </div>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='givenName'>Given Name</Label>
                  <Input
                    id='givenName'
                    name='givenName'
                    placeholder='Given Name'
                  />
                </div>
                <div className='flex flex-col space-y-1.5'>
                  <Label htmlFor='familyName'>Family Name</Label>
                  <Input
                    id='familyName'
                    name='familyName'
                    placeholder='Family Name'
                  />
                </div>
                <input
                  type='hidden'
                  name='role'
                  value='ADMIN'
                />
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button
                type='submit'
                className='bg-amber-700 hover:bg-amber-800   text-white font-bold py-2 px-4 rounded active:bg-amber-900 '>
                Signup
              </Button>
              <Link
                to='/auth/login'
                className='text-blue-500 hover:underline'>
                Login
              </Link>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default signup
