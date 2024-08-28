import React from 'react'
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import Link from 'next/link';
import Image from 'next/image';
function CategoryList() {
    const categoryList = [
        {
          id: 1,
          name: "Dentist",
          icons: "https://cdn-icons-png.flaticon.com/512/2767/2767016.png",
        },
        {
          id: 2,
          name: "Cardiologist",
          icons: "https://cdn-icons-png.flaticon.com/512/2767/2767028.png",
        },
        {
          id: 3,
          name: "Orthopedic",
          icons: "https://cdn-icons-png.flaticon.com/512/2767/2767004.png",
        },
        {
          id: 4,
          name: "Neurologist",
          icons: "https://cdn-icons-png.flaticon.com/512/2767/2767025.png",
        },
        {
          id: 5,
          name: "Otology",
          icons: "https://cdn-icons-png.flaticon.com/512/2767/2767005.png",
        },
        {
          id: 6,
          name: "General Doctor",
          icons: "https://cdn-icons-png.flaticon.com/512/2767/2767026.png",
        },
        {
          id: 7,
          name: "Surgeon",
          icons: "https://cdn-icons-png.flaticon.com/512/2767/2767012.png",
        },
        {
          id: 8,
          name: "Psychotropic",
          icons: "https://cdn-icons-png.flaticon.com/512/2767/2767018.png",
        },
        {
          id: 9,
          name: "Eye Specialist",
          icons: "https://cdn-icons-png.flaticon.com/512/2767/2767013.png",
        },
      ];
    return (
        <div className='h-screen fixed mt-5 flex flex-col'>
            <Command>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className='overflow-visible'>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions" >
                        {categoryList&& categoryList.map((item,index)=>{
                            return <CommandItem key={index}>
                                    <Link href={''} className='p-2 flex gap-2 text-[14px] text-blue-600 rounded-md cursor-pointer w-full'>
                                    <Image src={item.icons} alt='icon' width={25} height={25}/>
                                    <label>{item.name}</label>
                                    </Link>
                                </CommandItem>
                           
                        })}
                        <CommandItem>Calendar</CommandItem>
                        <CommandItem>Search Emoji</CommandItem>
                        <CommandItem>Calculator</CommandItem>
                    </CommandGroup>
                
                </CommandList>
            </Command>
        </div>

    )
}

export default CategoryList