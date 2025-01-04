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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import axios from 'axios'
import type { Course } from '@/lib/types'
import useLocalStorage from '@/hooks/use-local-storage'

export default function CourseList() {
  const [data, setData] = React.useState<Course[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const [newCourse, setNewCourse] = React.useState('Bachelor of Science ')

  const getCourses = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/course`, {
      headers: {
        Authorization: `Bearer ${useLocalStorage('get', 'session-token')}`
      }
    })
    setData(response.data.body)
  }

  const handleAddCourse = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/course`,
      {
        name: newCourse
      },
      {
        headers: {
          Authorization: `Bearer ${useLocalStorage('get', 'session-token')}`
        }
      }
    )

    if (response?.data?.success) {
      alert('Course added successfully')
      setData([...data, { id: 'temp', name: newCourse }])
    }

    setDialogOpen(false)
  }

  const columns: ColumnDef<Course>[] = [
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
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            Course Name
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('name')}</div>
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

  React.useEffect(() => {
    getCourses()
  }, [])

  return (
    <div className='w-full'>
      <div className='flex justify-end w-full'>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant='outline'>Add Course</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Add new course</DialogTitle>
            </DialogHeader>
            <Input
              type='text'
              placeholder='Enter course title...'
              name='new-course'
              value={newCourse}
              onChange={(event) => setNewCourse(event.target.value)}
            />
            <DialogFooter>
              <Button
                type='submit'
                onClick={handleAddCourse}>
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
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
