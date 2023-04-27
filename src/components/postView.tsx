
 

import type{RouterOutputs } from "y/utils/api";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView =(props:PostWithUser)=>{
  const {post,author}=props
  return <div className=" flex p-8 border-b border-slate-400 gap-3" key={post.id} > 
    <Image src={author.profileImageUrl} className=" rounded-full" alt={`@${author.username}'s profile picture`} width={56} height={56} />
    <div className="flex flex-col">
    <div className="flex text-slate-300 gap-1">
      <Link href={`@${author.username}`}> <span>{`@${author.username}`}</span></Link>
      <Link href={`/post/${post.id}`}> <span>{`· ${dayjs(post.createdAt).fromNow()}`}</span></Link>
    </div>
    <span> {post.Content}</span>
    </div>
   
   </div>
}