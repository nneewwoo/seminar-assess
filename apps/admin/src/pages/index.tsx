import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import logo from "../assets/logo.png";
import TimePicker from "@/components/ui/time-picker";

export default function Home() {
  const [date, setDate] = React.useState<Date>();
  const [araw, setAraw] = React.useState<Date>();
  return (
    <>
      <div className="flex justify-center">
        <img src={logo} alt="Logo" />
      </div>
      <div className="text-center font-bold text-[200%]">Seminar Assess</div>
      <div className="text-center text-[100%]">
        A Mobile App for Comprehensive Extension Training Assessment
      </div>
      <Card className="w-full h-full mt-5">
        <div className="flex">
          <CardHeader>
            <CardTitle>Select the date</CardTitle>
          </CardHeader>
        </div>
        <CardFooter className="flex ">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Continue</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Select the date on which the examination should begin.
                </DialogTitle>
              </DialogHeader>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                  <TimePicker date={date} setDate={setDate} />
                </PopoverContent>
              </Popover>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
              <DialogTitle>
                Select the date on which the training assessment should begin.
              </DialogTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !araw && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {araw ? format(araw, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <TimePicker date={araw} setDate={setAraw} />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={araw}
                    onSelect={setAraw}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Continue</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Select the date on which the examination should begin.
                </DialogTitle>
              </DialogHeader>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                  <TimePicker date={date} setDate={setDate} />
                </PopoverContent>
              </Popover>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
              <DialogTitle>
                Select the date on which the training assessment should begin.
              </DialogTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !araw && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {araw ? format(araw, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <TimePicker date={araw} setDate={setAraw} />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={araw}
                    onSelect={setAraw}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Continue</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Select the date on which the examination should begin.
                </DialogTitle>
              </DialogHeader>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                  <TimePicker date={date} setDate={setDate} />
                </PopoverContent>
              </Popover>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
              <DialogTitle>
                Select the date on which the training assessment should begin.
              </DialogTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !araw && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {araw ? format(araw, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <TimePicker date={araw} setDate={setAraw} />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={araw}
                    onSelect={setAraw}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
        <CardHeader>
          <CardTitle>Choose exam for seminar participants</CardTitle>
        </CardHeader>
        <CardFooter className="flex ">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Select Exam</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Select which exam to give to the seminar participants.
                </DialogTitle>
              </DialogHeader>
              <Popover>
                <PopoverTrigger asChild></PopoverTrigger>
                <Select>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Select A Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </Popover>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
        <CardHeader>
          <CardTitle>
            End the voting for the training needs assessment
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex ">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Proceed</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  End the voting for the training needs assessment
                </DialogTitle>
              </DialogHeader>
              <Popover>
                <PopoverTrigger asChild></PopoverTrigger>
              </Popover>
              <DialogFooter>
                <Button type="submit">End</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
}
