import { GetStaticProps } from 'next'
import {useState} from "react"
import Header from '../../components/Header'
import {sanityClient, urlFor} from '../../sanity'
import {Post} from  '../../typings'
import PortableText from "react-portable-text"
import {useForm,SubmitHandler} from "react-hook-form"
interface Props { 
     post : Post
}
interface Inputs { 
     _id : string,
     name : string,
     email: string,
     message:string

}
function Post({post} : Props) {
  const [Submited,setSubmited] = useState(false)
  const { register, handleSubmit,formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) =>{
             fetch('/api/PostMessage',{
                method: 'POST',
                body:JSON.stringify(data),
             })
             .then(() => {setSubmited(true)})
             .catch((err) => {console.log(err)})
  }
  return <> <Header/> <main>
         <img src={urlFor(post.mainImage).url()} alt="" className="block w-full mt-7 object-cover max-h-[500px]" />
         <article className="max-w-3xl mx-auto mt-7 space-y-3">
             <h1 className="font-sansserif text-5xl">{post.title}</h1>
             <div className="pl-5 space-y-3">
                <p className="text-3xl font-light">{post.description}</p>
                <div className="flex items-center space-x-2">
                <img  src={urlFor(post.author.image).url()} className="w-11 h-11 rounded-full"/> 
                <p>Written by {post.author.name} - Published at {new Date(post._createdAt).toLocaleString()}</p>
                </div>
                
             </div>
             <PortableText
              content={post.body}
              projectId={process.env.SANITY_PROJECT_ID!}
              dataset={process.env.SANITY_DATASET!}
              serializers={{
                h1: (props : any) => <h1 className="font-semibold text-5xl my-3" {...props} />,
                h2: (props : any) => <h2 className="font-semibold text-3xl my-3" {...props} />,
                li: ({ children } : any) => <li className="ml-5">{children}</li>,
                link:({ href,children } : any) => <a href={href} className="text-yellow-400 underline">{children}</a>,
              
              }}
          />
         </article>
          <hr className="max-w-xl mx-auto my-5 border border-yellow-500"/>
          <div className="max-w-3xl mx-auto space-y-2 mt-10">
                 <h1 className="uppercase text-3xl font-semibold">Comments Section</h1>
                 {post.messages.map((message,index) =>(<div className="flex flex-col shadow py-4 px-2 mb-2" key={index} >
                   <span className="text-gray-700 text-sm font-light ">comment By {message.name} </span>
                   <span className="text-xl font-semibold pl-2">{message.message} </span>
                    
                   </div>))
                   }
                   
         </div>
         <hr className="max-w-xl mx-auto my-5 border border-yellow-500"/>
          
       {Submited ? (<div className="flex max-w-3xl mx-auto mb-5 flex-col py-2 bg-yellow-500 text-center text-white">
             <h1 className="text-4xl font-bold uppercase ">thank you for your message !</h1>
             <p className="text-lg font-semibold"> your message will appear once approved.</p>
       </div>) 
       
       
       
       :
       
        (<> 
         <div className="max-w-3xl mx-auto"> <h1 className="text-4xl font-semibold uppercase ">Leave A Comment</h1></div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-w-3xl mx-auto my-7  space-y-3" >
              <label><input type="text" value={post._id} {...register("_id", { required: true })} className="hidden"/></label>
            
             <label>
               <span>Name</span>
               <input type="text" {...register("name", { required: true })} placeholder="Joe" className="block mt-2 w-full border border-yellow-100 shadow p-2 outline-none rounded-lg  focus:ring-yellow-600 focus:ring-2 focus:shadow-yellow-600"/>
               
               </label>

               <label>
               <span> Email </span>
               <input type="email" {...register("email", { required: true })} placeholder="joe@email.com" className="block mt-2 w-full p-2 outline-none rounded-lg shadow focus:ring-2 focus:ring-yellow-600"/>
               
               </label>
             <label>
               <span>Message</span>
               <textarea placeholder="message" {...register("message", { required: true })} className="block mt-2 w-full p-2 outline-none rounded-lg shadow-lg focus:ring-2 focus:ring-yellow-600" rows={8}/>
               
               </label>
            {errors.name && <span className="text-red-700 font-semibold text-lg">Name is required</span>}
             {errors.email && <span className="text-red-700 font-semibold text-lg">Email is required</span>}
             {errors.message && <span className="text-red-700 font-semibold text-lg">Message is required</span>}
             <input type="submit"   className="block mt-2 w-full bg-yellow-600 rounded-lg py-3 text-white font-semibold text-lg cursor-pointer hover:bg-yellow-400"/>
           
         </form>
         </>)}

        
         
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
  'messages': *[ _type == "message" && post._ref == ^._id && approved ==true],
  body[]{
    ..., 
    asset->{
      ...,
      "_key": _id
    }
  },

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