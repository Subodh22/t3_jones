import { z } from "zod";
import type { User } from "@clerk/nextjs/dist/api";
import { createTRPCRouter, privateProcedure, publicProcedure } from "y/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "y/server/helpers/filterUserForClient";


export const profileRouter = createTRPCRouter({
    getAllUsersByUsername:publicProcedure.input(z.object({username:z.string()}))
    .query(async({input})=>
    {
        const [user] = await clerkClient.users.getUserList({
            username:[input.username],
        });
        if(!user){
            throw new TRPCError({
                code:"INTERNAL_SERVER_ERROR",
                message:"user not found",
            })
        }
        return filterUserForClient(user);
    })
});
