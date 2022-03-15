import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import {sanityClient, urlFor} from '../../sanity'
import {Post} from  '../../typings'

interface Props { 
     post : Post
}

function Post({post} : Props) {
  return <> <Header/> <main>
         <img src={urlFor(post.mainImage).url()} alt="" className="block w-full mt-7 object-cover max-h-[300px]" />
         <article className="max-w-7xl mx-auto mt-7 space-y-3">
             <h1 className="font-sansserif text-5xl">{post.title}</h1>
             <div className="pl-5 space-y-3">
                <p className="text-3xl font-light">{post.description}</p>
                <div className="flex items-center space-x-2">
                <img  src={urlFor(post.author.image).url()} className="w-11 h-11 rounded-full"/> 
                <p>Written by {post.author.name} - Published at {new Date(post._createdAt).toLocaleString()}</p>
                </div>
                
             </div>
         </article>
  </main>
  </>
}

export default Post

export async function getStaticPaths() {
  const query = `*[_type== 'post']{
  _id,       
  slug,
}`
  const posts  = await sanityClient.fetch(query)
  const paths = posts.map((post : Post)=>({
           params : {
             slug : post.slug.current
           }
      }))
      console.log(paths);
  return {
      paths ,
      fallback:false,
  }
}



export const getStaticProps : GetStaticProps  = async ({params}) =>{
       const query = `*[_type == "post" && slug.current == $slug][0]{
   _id,       
  _createdAt,       
  title,
  description,
  slug{ 
    current
  },
  body,
  mainImage,
  author ->{
   name,
   image
  }
 
}
 `
 const Groqparams = {slug: params?.slug}
 const post = await sanityClient.fetch(query,Groqparams)
 
 if(!post){
   return{
     notFound:true,
   }
 }
 return {
    props: {
      post
    },
    revalidate : 60*60*24,
 }
}