import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'
export default async function createMessage(
  req: NextApiRequest,
  res: NextApiResponse
) { 
 const {_id,name,email,message} = JSON.parse(req.body)
  const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token:process.env.NEXT_PUBLIC_SANITY_SANITY_API_TOKEN,
   useCdn: process.env.NODE_ENV === 'production',
})
 try{
   const re = await client.create({
       _type: 'message',
       post:{
           _type:'reference',
           _ref:_id
       },
       name,
       email,
       message
    }

  )
  console.log(re)
 }catch(err){
   console.log(err)
 }
  
  res.status(200).json({ name: 'John Doe' })
}
