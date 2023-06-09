import type { GetStaticProps,   NextPage } from "next";
import Head from "next/head";
import {api} from "y/utils/api";
import { PageLayout } from "y/components/layout";
import Image from "next/image";
import { LoadingPage } from "y/components/loading";
import { PostView } from "y/components/postView";
import { generateSSGHelper } from "y/server/helpers/ssgHelper";
 
const ProfileFeed = (props:{userId:string})=>
{
  const {data,isLoading}=api.posts.getPostByUserId.useQuery({userId:props.userId})

  if(isLoading) return <LoadingPage/>

  if(!data || data.length==0) return <div>User has not posted</div>

  return <div className="flex flex-col">
    {data.map(fullPost=>(<PostView {...fullPost} key={fullPost.post.id}/>))}
  </div>
}
const ProfilePage: NextPage<{username: string}> = ({username}) => {
     
  const {data}=api.profile.getAllUsersByUsername.useQuery({
    username 
  })

  console.log(data)
  if(!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{data.username}</title>
         
      </Head>
    <PageLayout>
      <div className="border-b h-36 bg-slate-600 relative"> 
      <Image src={data.profileImageUrl}
       alt={`${data.username ?? ""}'s Profile pic`}
      width={128}
      height={128}
      className = "absolute bottom-0 left-0 -mb-[48px] ml-4 rounded-full border-4 border-black bg-black"  />

      
      </div>
      <div className="h-[64px]"></div>
      <div className="p-4 text-2xl font-bold">{`@${data.username ?? ""}`}</div>
      <div className="border-b border-slate-400 w-full"></div>
      <ProfileFeed userId={data.id ?? "" }/>
      </PageLayout>
    </>
  );
};


 

export const getStaticProps:GetStaticProps = async(context)=>{
  const ssg = generateSSGHelper();
    const slug =context.params?.slug;
    if(typeof slug!=="string") throw new Error("no Slug");

    const username = slug.replace("@", "");

    await ssg.profile.getAllUsersByUsername.prefetch({username});

  return{
    props:{
      trpcState:ssg.dehydrate(),
      username
    }
  }
};

export const getStaticPaths = ()=>{
  return{paths: [],fallback:"blocking"};
};

 

export default ProfilePage;
