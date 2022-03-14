

function Banner() {
  return (
   <div className="flex items-center justify-between  bg-[#FFC017] p-10 max-w-7xl mx-auto  border-y-4 border-gray-700">
       <div className="px-10 space-y-5">
           <h1 className="text-6xl font-serif">
               <span className="underline decoration-black decoration-4">Medium </span> is a place to write read and connect</h1>
           <h2>It's easy and free to post and connect with millions of readers </h2>
       </div>
       <img className="hidden md:inline-flex " src="/logo.png" alt="" />
   </div>
  )
}

export default Banner