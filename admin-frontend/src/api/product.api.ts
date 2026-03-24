// import { BASE_URL } from "../config/api.config";
// import { refreshTokeApi } from "./auth.api";

// export const createProduct=async(payload:any)=>{
//     try{
//         let res=await fetch(`${BASE_URL}/v1/product/create`,{
//             method:"POST",
//             headers:{
//                 "Content-Type":"application/json",
//             },
//             credentials:"include",
//             body:JSON.stringify(payload),
//         });

//         if(res.status===401){
//             try{
//                 await refreshTokeApi();
//                 res=await fetch(`${BASE_URL}/v1/product/create`,{
//                     method:"POST",
//                     headers:{
//                         "Content-Type:application/json"
//                     }
//                     credentials:"include"
//                 })
//             }catch(err){
//                 window.location.href="/login";
//                 throw new Error("Sessio expired");
//             }
//         }
//     }catch(err){
//         console.log("Internla server error");
//     }
// }