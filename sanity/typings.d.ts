export interface Post {
   _id: string;
   _createdAt:string;
   title:string;
   slug:{
       current:string;
   };
   author:{
        image : {
           asset : {
                 url : string;
            }
        };
        name:string;

    
   };
   description:string;
   mainImage:{
       asset : {
            url:string;
       };
   };
   body:[object];
}