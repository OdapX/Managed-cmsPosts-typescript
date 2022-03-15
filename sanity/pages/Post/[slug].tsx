import { GetStaticProps } from 'next'
import React from 'react'
import {sanityClient} from '../../sanity'
import {Post} from  '../../typings'

interface Props { 
     post : Post
}

function Post({post} : Props) {
  return <div className="text-black">{post.title}</div>
}

export default Post

export async function getStaticPaths() {
  const query = `*[_type== 'post']{
  _id,       
  slug,
}`
  const posts  = await sanityClient.fetch(query)
   
  return {
      paths : posts.map((post : Post)=>({
           params : {
             slug : post.slug.current
           }
      })),
      fallback:false
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
console.log(post)
 return {
    props: {
      post
    }
 }
}