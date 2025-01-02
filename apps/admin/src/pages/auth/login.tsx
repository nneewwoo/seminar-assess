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
import { useAuth } from '@/context/AuthProvider'
import { Link } from '@/router'
import axios from 'axios'

function login() {
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/account/signin/steps/password`,
      data
    )

    if (response?.data?.success) {
      if (response.data.body.role !== 'ADMIN') {
        alert('You are not authorized to access this page')
        return
      }
      login(response.data.body.token)
    }
  }

  return (
    <div>
      <div className='flex items-center justify-center '>
        <form onSubmit={handleSubmit}>
          <Card className='w-[350px]'>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Please log in to proceed</CardDescription>
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
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button
                type='submit'
                className='bg-amber-700 hover:bg-amber-800   text-white font-bold py-2 px-4 rounded active:bg-amber-900 '>
                Login
              </Button>
              <Link
                to='/auth/signup'
                className='text-blue-500 hover:underline'>
                Signup
              </Link>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
export default login
