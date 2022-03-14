import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Banner from '../components/Banner'
import Header from '../components/Header'
import {sanityClient,urlFor} from '../sanity'
import { Post } from '../typings'

interface Props {
  posts : [Post]
}

const Home: NextPage = ({posts} : Props) => {
  console.log(posts)
  return (
    <> 
      <Header/>
      <Banner/>
      <div className="max-w-7xl mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
         {posts.map(post =>(
            <Link key={post._id} href={`${post.slug.current}`}>
              <div className="overflow-hidden rounded-lg border group cursor-pointer">
               <img className="w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" src={urlFor(post.mainImage).url()} alt="" />
               <div className="flex justify-between items-center p-2 ">
                   <div>
                     <p className="font-bold text-2xl uppercase">{post.title}</p>
                     <p className="text-sm">{post.description}</p>
                   </div>
                   <img className="w-14 h-14 rounded-full " src={urlFor(post.author.image).url()} alt="" />
               </div>
                </div>
            </Link>
         ))}
      </div>
    </>
  )
}

export default Home

export async function getServerSideProps(){
       const query = `*[_type== 'post']{
  _id,       
  _createdAt,       
  title,
  description,
  slug,
  body,
  mainImage,
  author ->{
   name,
   image
}
}
 `

 const posts = await sanityClient.fetch(query)
 return {
    props: {
      posts
    }
 }
}