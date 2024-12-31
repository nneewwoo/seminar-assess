'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type Exam = {
  name: string
  pretest: number
  posttest: number
  comparing: number
  id: string
}

export default function results() {
  const [exam, setExam] = useState<Exam[]>([])
  useEffect(() => {
    fetch('https://672f763a66e42ceaf15dc7b4.mockapi.io/exam')
      .then((response) => response.json())
      .then((data) => {
        setExam(data)
      })
  }, [])
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className=''>Name</TableHead>
            <TableHead className=''>Pre-Test</TableHead>
            <TableHead className=''>Post-Test</TableHead>
            <TableHead className=''>Comparing</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exam.map((invoice) => (
            <TableRow key={invoice.name}>
              <TableCell>{invoice.name}</TableCell>
              <TableCell>{invoice.pretest}</TableCell>
              <TableCell>{invoice.posttest}</TableCell>
              <TableCell>{invoice.comparing}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex items-center justify-center '>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className='grid w-full items-center gap-4'>
                <div className='flex'>
                  <Input placeholder='Enter' />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button className='bg-amber-700 hover:bg-amber-800   text-white font-bold py-2 px-4 rounded active:bg-amber-900 '>
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
