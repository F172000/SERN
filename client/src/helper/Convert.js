/** image into base64 */
// export default function converttobase(file){
// return new Promise((resolve,reject)=>{
//     const filereader= new FileReader();
//     filereader.readAsDataURL(file);

//     filereader.onload=()=>{
//         resolve(filereader.result)
//     }
//     filereader.onerror=(error)=>{
// reject(error);
//     }
// })
// }
export default function converttobase(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(file);
    });
  }
  
