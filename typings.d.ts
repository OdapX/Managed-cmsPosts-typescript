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
   messages : [Message];
   description:string;
   mainImage:{
       asset : {
            url:string;
       };
   };
   body:[object];
}

export interface Message{
    name:string;
    message:string;
}