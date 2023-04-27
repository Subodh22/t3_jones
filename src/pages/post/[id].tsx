import type { GetStaticProps,   NextPage } from "next";
import Head from "next/head";
import {api} from "y/utils/api";
 import { PageLayout } from "y/components/layout";
 
import { generateSSGHelper } from "y/server/helpers/ssgHelper";
import { PostView } from "y/components/postView";
 
const SinglePostPage: NextPage<{id: string}> = ({id}) => {
     
  const {data}=api.posts.getById.useQuery({id})
  console.log(data)
  if(!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{`${data.post.Content} - @${data.author.username}`}</title>
         
      </Head>
    <PageLayout>
     <PostView {...data}/>
      </PageLayout>
    </>
  );
};


 

export const getStaticProps:GetStaticProps = async(context)=>{
  const ssg = generateSSGHelper();
    const id =context.params?.id;
    if(typeof id!=="string") throw new Error("no Slug");

 
    await ssg.posts.getById.prefetch({id})
  return{
    props:{
      trpcState:ssg.dehydrate(),
      id
    }
  }
};

export const getStaticPaths = ()=>{
  return{paths: [],fallback:"blocking"};
};

 

export default SinglePostPage;
