import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
type Exam = {
  exam: string
  choices: string[]
  answer: string
  id: string
}

function test() {
  const [exams, setExams] = useState<Exam[]>([])
  useEffect(() => {
    fetch('https://672ecdf8229a881691f0f414.mockapi.io/exam')
      .then((response) => response.json())
      .then((data) => {
        setExams(data)
      })
  }, [])
  return (
    <>
      <div>
        <div className='flex  '>
          <Card className='w-full h-full'>
            <div className='flex'>
              <CardHeader>
                <CardTitle>Add Questions</CardTitle>
              </CardHeader>
            </div>
            <CardFooter className='flex '>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='outline'>Continue</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>Add Questions to the New Topics</DialogTitle>
                  </DialogHeader>

                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label className='text-right'>Question</Label>
                      <Input className='col-span-3' />
                      <Label className='text-right'>A</Label>
                      <Input className='col-span-3' />
                      <Label className='text-right'>B</Label>
                      <Input className='col-span-3' />
                      <Label className='text-right'>C</Label>
                      <Input className='col-span-3' />
                      <Label className='text-right'>Correct Answer</Label>
                      <Input className='col-span-3' />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type='submit'>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=''>Question</TableHead>
              <TableHead className=''>A</TableHead>
              <TableHead className=''>B</TableHead>
              <TableHead className=''>C</TableHead>
              <TableHead className=''>D</TableHead>
              <TableHead className=''>Answer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((invoice) => (
              <TableRow key={invoice.exam}>
                <TableCell>{invoice.exam}</TableCell>
                {invoice.choices.map((choice, index) => (
                  <TableCell
                    key={`${invoice.exam}-${index}`}
                    className='max-w-8 text-ellipsis whitespace-nowrap overflow-hidden'>
                    {choice}
                  </TableCell>
                ))}
                <TableCell>{invoice.answer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default test
