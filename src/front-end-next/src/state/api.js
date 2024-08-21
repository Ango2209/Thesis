import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query";

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl :"http://localhost:4000"
    }),
    reducerPath:"api",
    tagTypes:[],
    endpoints:(build)=>({}),
})

export const {} = api;