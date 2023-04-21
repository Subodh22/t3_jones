import { type NextPage } from "next";
import Head from "next/head";
 
import {SignInButton,useUser} from "@clerk/nextjs";
import {  api } from "y/utils/api";

import type{RouterOutputs } from "y/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage } from "y/components/loading";
import { useState } from "react";

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
        }}
      );
      const [input,setInput]=useState("")


      console.log(user)
      if(!user) return null;

      return <div className="flex w-full gap-3 " >
        <Image width={56} height={56} src={user.profileImageUrl} alt="Profile Image" className=" rounded-full" />
        <input placeholder="Type something" className="bg-transparent grow outline-none " type="text" value={input} disabled={isPosting} onChange={(e)=>{setInput(e.target.value)}}/>
        
        <button onClick={()=>
          
          mutate({content:input})
      
          } >Post</button>
      </div>
    }
  
type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const Feed =()=>{
  const {data,isLoading:postsLoading} = api.posts.getAll.useQuery(); 
  if(postsLoading) return <LoadingPage/>
  return (
    <div>
    {data?.map((fullPost)=>
 ( <PostView {...fullPost} key={fullPost.post.id}/>))}
  </div>
  )

}
const PostView =(props:PostWithUser)=>{
  const {post,author}=props
  return <div className=" flex p-8 border-b border-slate-400 gap-3" key={post.id} > 
    <Image src={author.profileImageUrl} className=" rounded-full" alt={`@${author.username}'s profile picture`} width={56} height={56} />
    <div className="flex flex-col">
    <div className="flex text-slate-300 gap-1">
      <span>{`@${author.username}`}</span>
      <span>{`· ${dayjs(post.createdAt).fromNow()}`}</span>
    </div>
    <span> {post.Content}</span>
    </div>
   
   </div>
}
const Home: NextPage = () => {
     
  const { isLoaded:userLoaded,isSignedIn} = useUser();
  api.posts.getAll.useQuery(); 

  if(!userLoaded ) return <div/>
 
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full h-screen justify-center">
        <div className="w-full md:max-w-2xl border-x border-slate-400  ">
           <div className="flex border-b border-slate-400 p-4">
             {!isSignedIn && 
             <div className="flex justify-center"> <SignInButton/></div>}
          {isSignedIn &&
          <CreatePostWizard/>
          }</div>
         <Feed/>
        </div>
         
      </main>
    </>
  );
};

export default Home;
