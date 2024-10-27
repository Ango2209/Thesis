// import { createUserRaw } from "@/ultils/createUser";
// import { useCreateUserMutation } from "@/state/api";
// import {
//   getKindeServerSession,
//   handleAuth,
// } from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const { getUser } = getKindeServerSession();
//   const user = await getUser();

//   if (!user || user === null || !user.id) {
//     throw new Error("Something went wrong");
//   }

//   await createUserRaw(user);
//   return NextResponse.redirect("http://localhost:3000/");
// }
