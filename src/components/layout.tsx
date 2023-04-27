import { PropsWithChildren } from "react";

export const PageLayout = (props:PropsWithChildren)=>
{
        
    return(
        <main className="flex h-full h-screen justify-center">
        <div className="w-full md:max-w-2xl border-x border-slate-400   ">

        {props.children}
            </div>
            </main>
    )
}