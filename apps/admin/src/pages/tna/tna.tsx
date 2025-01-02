import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { useState } from 'react'
import { useEffect } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

type Topic = {
  id: number
  title: string
  number_of_votes: number
  course: string
}

enum Course {
  Criminology = 'Criminology',
  ComputerScience = 'Computer Science',
  FoodTechnology = 'Food Technology',
  Fisheries = 'Fisheries',
  Education = 'Education'
}

export default function tna() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [course, setCourse] = useState<Course>(Course.Criminology)
  const [topic, setTopic] = useState<string>('')
  const [topicAdded, setTopicAdded] = useState<number>(0)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/cycle`)
      .then((response) => response.json())
      .then((data) => {
        fetch(`${import.meta.env.VITE_API_URL}/api/auth/seminar-list`, {
          method: 'POST',
          body: JSON.stringify({ cycle_id: data.cycle.id })
        })
          .then((response) => response.json())
          .then((data) => {
            setTopics(data.seminar_list)
          })
      })
  }, [topicAdded])

  const handleSubmit = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/cycle`)
      .then((response) => response.json())
      .then((data) => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/add-seminar`, {
          method: 'POST',
          body: JSON.stringify({
            course,
            title: topic,
            cycle_id: data.cycle.id
          })
        })
          .then((response) => response.json())
          .then((_data) => {
            setTopicAdded(topicAdded + 1)
          })
      })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px] text-black font-bold  '>
              Topic
            </TableHead>
            <TableHead className='w-[100px] text-black font-bold  '>
              Course
            </TableHead>
            <TableHead className='w-[100px] text-black font-bold  '>
              Votes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topics.map((topiko) => (
            <TableRow key={topiko.id}>
              <TableCell className=''>{topiko.title}</TableCell>
              <TableCell className=''>{topiko.course}</TableCell>
              <TableCell className=''>{topiko.number_of_votes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex items-center justify-center '>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>Add Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={course}
              onValueChange={(val) => setCourse(val as Course)}>
              <SelectTrigger className='w-auto'>
                <SelectValue placeholder='Select Course' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Course).map((course) => (
                  <SelectItem
                    key={course}
                    value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder='Topic'
              value={topic}
              onChange={(e) => setTopic(e.currentTarget.value)}
            />
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              onClick={handleSubmit}
              className='bg-amber-700 hover:bg-amber-800   text-white font-bold py-2 px-4 rounded active:bg-amber-900 '>
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
