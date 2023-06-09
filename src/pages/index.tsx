import { type NextPage } from "next";
import Head from "next/head";
 
import {SignInButton,useUser} from "@clerk/nextjs";
import {  api } from "y/utils/api";

import type{RouterOutputs } from "y/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "y/components/loading";
import { useState } from "react";
import {toast} from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "y/components/layout";
import { PostView } from "y/components/postView";
dayjs.extend(relativeTime);

const CreatePostWizard=()=>
    {
      const {user} = useUser();
      const ctx = api.useContext();
      const {mutate ,isLoading:isPosting} = api.posts.create.useMutation( 
        {onSuccess:()=>
        {
            setInput("");
            void ctx.posts.getAll.invalidate();
        },
          onError:(e)=>
          {
           const errorMessage = e.data?.zodError?.fieldErrors.content;
           if(errorMessage && errorMessage[0]){
            toast.error(errorMessage[0]!)
           }else{
            toast.error("Failed to post! Try again later");
           }
          }
      }
      );
      const [input,setInput]=useState("")


      console.log(user)
      if(!user) return null;

      return <div className="flex w-full gap-3 " >
        <Image width={56} height={56} src={user.profileImageUrl} alt="Profile Image" className=" rounded-full" />
        <input placeholder="Type something" className="bg-transparent grow outline-none " type="text" 
        value={input} 
        disabled={isPosting} 
        onChange={(e)=>{setInput(e.target.value)}}
        onKeyDown={(e)=>{
          if(e.key==="Enter"){
            e.preventDefault();
            if(input!==""){
              mutate({content:input});
            }

          }
        }}
        />
        
        <button onClick={()=>
          
          mutate({content:input})
      
          } disabled={isPosting} >Post</button>

        {isPosting && 
        <div className="flex justify-center items-center"> 
        <LoadingSpinner/> </div>
        }
      </div>
    }
  
 

const Feed =()=>{
  const {data,isLoading:postsLoading} = api.posts.getAll.useQuery(); 
  if(postsLoading) return <LoadingPage/>
   console.log(data)
  return (
  
    <div>
       
    {data?.map((fullPost)=>
 ( <PostView {...fullPost} key={fullPost.post.id}/>))}
  </div>
  )

}

const Home: NextPage = () => {
     
  const { isLoaded:userLoaded,isSignedIn} = useUser();
  api.posts.getAll.useQuery(); 

  if(!userLoaded ) return <div/>
 
  return (
    <>
      <Head>
        <title>Jones</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
           <div className="flex border-b border-slate-400 p-4">
             {!isSignedIn && 
             <div className="flex justify-center"> <SignInButton/></div>}
          {isSignedIn &&
          <CreatePostWizard/>
          }</div>
         <Feed/>
         </PageLayout>
    </>
  );
};

export default Home;
