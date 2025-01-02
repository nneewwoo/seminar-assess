'use client'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { useState, useEffect } from 'react'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart'

// Define chartConfig with fixed course names (capitalized)
const chartConfig = {
  Education: {
    label: 'Education',
    color: '#CD7F32'
  },
  FoodTechnology: {
    label: 'Food Technology',
    color: '#E1C16E'
  },
  Criminology: {
    label: 'Criminology',
    color: '#C19A6B'
  },
  ComputerScience: {
    label: 'Computer Science',
    color: '#B87333'
  },
  Fisheries: {
    label: 'Fisheries',
    color: '#800020'
  }
}

// Define the correct course mapping (fix typo and normalize)
const normalizeCourseName = (course: string): keyof typeof chartConfig => {
  switch (course) {
    case 'Education':
      return 'Education'
    case 'Food Technology':
      return 'FoodTechnology'
    case 'Fisheries':
      return 'Fisheries'
    case 'Computer Science':
      return 'ComputerScience'
    case 'Crminology':
      return 'Criminology' // Fix typo here
    default:
      return 'Education' // Default to "Education" if unrecognized
  }
}

type Topic = {
  id: number
  title: string
  number_of_votes: number
  course: keyof typeof chartConfig
}
type ChartData = {
  course: string
  votes: number
}

function TNAResults() {
  const [_seminarList, setSeminarList] = useState<Topic[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([]) // To hold the formatted chart data

  useEffect(() => {
    // Fetch cycle data and then seminar list
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/cycle`)
      .then((response) => response.json())
      .then((data) => {
        fetch(`${import.meta.env.VITE_API_URL}/api/auth/seminar-list`, {
          method: 'POST',
          body: JSON.stringify({ cycle_id: data.id })
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.seminar_list)
            // Debugging: check fetched seminar list

            // Normalize the course names before setting state
            const normalizedSeminars = data.seminar_list.map(
              (seminar: Topic) => ({
                ...seminar,
                course: normalizeCourseName(seminar.course) // Normalize the course name
              })
            )

            setSeminarList(normalizedSeminars) // Set the normalized seminar list

            // Aggregate the data into chartData format
            const aggregatedData = normalizedSeminars.reduce(
              (acc: { [key: string]: number }, seminar: Topic) => {
                // If the course already exists in the accumulator, add votes
                if (acc[seminar.course]) {
                  acc[seminar.course] += seminar.number_of_votes
                } else {
                  // If the course doesn't exist yet, initialize it
                  acc[seminar.course] = seminar.number_of_votes
                }
                return acc
              },
              {} as { [key: string]: number }
            )

            // Transform aggregated data into chartData format
            const formattedChartData = Object.keys(aggregatedData).map(
              (course) => ({
                course,
                votes: aggregatedData[course]
              })
            )

            setChartData(formattedChartData) // Set the formatted chart data
          })
      })
  }, []) // Add empty dependency array to run only once on mount

  return (
    <ChartContainer
      config={chartConfig}
      className='min-h-[100px] w-full'>
      <BarChart
        accessibilityLayer
        data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='month'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey='Education'
          fill={chartConfig.Education.color}
          radius={4}
        />
        <Bar
          dataKey='FoodTechnology'
          fill={chartConfig.FoodTechnology.color}
          radius={4}
        />
        <Bar
          dataKey='Criminology'
          fill={chartConfig.Criminology.color}
          radius={4}
        />
        <Bar
          dataKey='ComputerScience'
          fill={chartConfig.ComputerScience.color}
          radius={4}
        />
        <Bar
          dataKey='Fisheries'
          fill={chartConfig.Fisheries.color}
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  )
}

export default TNAResults
