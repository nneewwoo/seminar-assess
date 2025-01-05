'use client'
import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
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
import { ArrowUpDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import type { Seminar, Course, Cycle } from '@/lib/types'
import axios from 'axios'
import useLocalStorage from '@/hooks/use-local-storage'

export default function tna() {
  const [data, setData] = useState<Seminar[]>([])
  const [courseList, setCourseList] = useState<Course[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [cycle, setCycle] = React.useState<Cycle | null>(null)
  const [rowSelection, setRowSelection] = React.useState({})
  const [newSeminar, setNewSeminar] = React.useState<Seminar | null>(null)

  const getCycle = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/cycle/current`,
      {
        headers: {
          Authorization: `Bearer ${useLocalStorage('get', 'session-token')}`
        }
      }
    )
    setCycle(response.data.body)
  }

  const getCourses = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/course`, {
      headers: {
        Authorization: `Bearer ${useLocalStorage('get', 'session-token')}`
      }
    })
    setCourseList(response.data.body)
  }

  const getSeminars = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/seminar`,
      {
        headers: {
          Authorization: `Bearer ${useLocalStorage('get', 'session-token')}`
        }
      }
    )
    setData(response.data.body)
  }

  const columns: ColumnDef<Seminar>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            Title
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('title')}</div>
      )
    },
    {
      accessorKey: 'course',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            Title
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className='capitalize'>
          {(row.getValue('course') as Course).name}
        </div>
      )
    }
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  const handleAddSeminar = async () => {
    if (newSeminar) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/seminar`,
        {
          cycleId: cycle?.id,
          courseId: course?.id,
          title: newSeminar.title,
          description: newSeminar.description
        },
        {
          headers: {
            Authorization: `Bearer ${useLocalStorage('get', 'session-token')}`
          }
        }
      )
      if (response?.data?.success) {
        setData([...data, newSeminar])
        setNewSeminar(null)
      }
    }
    setDialogOpen(false)
  }

  useEffect(() => {
    getCycle()
    getCourses()
    getSeminars()
  }, [])

  return (
    <div className='w-full'>
      <div className='flex justify-end w-full'>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant='outline'>Add Seminar</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Add new seminar</DialogTitle>
            </DialogHeader>
            <Select
              value={course?.id}
              onValueChange={(val) => {
                const select = courseList.find((course) => course.id === val)
                setCourse(select || null)
              }}>
              <SelectTrigger className='w-auto'>
                <SelectValue placeholder='Select Course' />
              </SelectTrigger>
              <SelectContent>
                {courseList.map((course) => (
                  <SelectItem
                    key={course.id}
                    value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder='Enter seminar title...'
              value={newSeminar?.title || ''}
              onChange={(e) => {
                setNewSeminar({
                  ...newSeminar,
                  title: e.target.value
                } as Seminar)
              }}
            />
            <Input
              placeholder='Enter seminar description...'
              value={newSeminar?.description || ''}
              type='textarea'
              onChange={(e) => {
                setNewSeminar({
                  ...newSeminar,
                  description: e.target.value
                } as Seminar)
              }}
            />
            <DialogFooter>
              <Button
                onClick={handleAddSeminar}
                type='submit'>
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className='rounded-md border mt-2'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
