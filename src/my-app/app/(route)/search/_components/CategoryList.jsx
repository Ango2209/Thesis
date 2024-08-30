"use client"
import React, { useEffect, useState } from 'react'
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
import { usePathname } from 'next/navigation';
function CategoryList() {

  const params=usePathname()
  const category= params.split('/')[2]

    useEffect(()=>{
      console.log(params);
      console.log(category);
      
    },[])

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
                                    <Link
                                     href={'/search/'+item?.name} 
                                     className={`p-2 flex gap-2 text-[14px]
                                     rounded-md cursor-pointer 
                                      items-center
                                      w-full ${category==item.name&&'bg-blue-100'}`}>
                                    <Image src={item.icons} alt='icon' width={25} height={25}/>
                                    <label>{item.name}</label>
                                    </Link>
                                </CommandItem>
                           
                        })}
                   
                    </CommandGroup>
                
                </CommandList>
            </Command>
        </div>

    )
}

export default CategoryList