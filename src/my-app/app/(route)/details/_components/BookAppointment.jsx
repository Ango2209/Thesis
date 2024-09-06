"use client"
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays, Clock } from 'lucide-react'

function BookAppointment() {
    const [date, setDate] = useState(new Date());
    const [timeSlot,setTimeSlot]=useState([])

    const getTime=()=>{

    const timeList=[]

    for (let i = 10; i<=12;i++){
        timeList.push({
            time: i + ':00 AM'
        })
        timeList.push({
            time: i + ':30 AM' 
        })
    }
    for (let i = 1; i<=6;i++){
        timeList.push({
            time: i + ':00 AM'
        })
        timeList.push({
            time: i + ':30 AM' 
        })
    }
    setTimeSlot(timeList)
    }
    
    console.log(timeSlot);
    
    useEffect(()=>{
        getTime()
    },
    [])

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="mt-4">Book Appointment</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                    <DialogDescription>
                        <div>
                            <div className='grid grid-cols-1 md:grid-cols-2 mt-5'>
                                {/* Calender */}
                                <div className='flex flex-col gap-3 items-baseline'>
                                    <h2 className='flex gap-2 items-center'>
                                    <CalendarDays className='text-primary h-5 w-5'/>
                                    </h2>
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border"
                                    />
                                </div>

                                {/* Time slot */}
                                <div className='mt-3'>
                                    <h2 className='flex gap-2 items-center mb-3'>
                                        <Clock className='text-primary h-5 w-5'/>
                                        Select Time Slot
                                    </h2>
                                    <div className='grid grid-cols-3 gap-3 border rounded-lg'>
                                        {timeSlot.map((item,index)=>{
                                            <h2 className='p-2 border rounded-full'>{item.time}</h2>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default BookAppointment