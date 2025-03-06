const main = document.querySelector(".main")
const user = document.querySelector(".user")
const send_message = document.querySelector(".send_message")
const input = document.querySelector(".type_message");
const message_box = document.querySelector(".message_box")
const textarea = document.querySelector(".type_message")
const setting_icon = document.querySelector(".setting_icon")
const menu = document.querySelector(".menu")
const clear_history = document.querySelector(".clear-history");
const close_item = document.querySelector(".close_item")
const back = document.querySelector(".back")
const loading = document.querySelector(".loading")


back.addEventListener("click",()=>{
    loading.classList.remove("display")
    setTimeout(() => {
        document.location.href = "../index.html"
    },1000);
})

textarea.focus()

const choose_file = document.getElementById("chooseFile")
const send_file = document.querySelector(".send_file")
const getfile = document.querySelector(".getfile")


        clear_history.addEventListener("click",()=>{
            localStorage.removeItem("message")
            localStorage.removeItem("response")
            location.reload()
        })

        
      async function uploadImage(){
        
            const apiKey = "2a95140901ea5fc62ad060bfc12004e7"
            const url = `https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`

            if(!choose_file || choose_file.files.length === 0){
                console.log("not")
                return;
            }

            let file = choose_file.files[0]
            let formdata = new FormData()
            formdata.append("image",file)

            try {
                const response = await fetch(url, {
                    method : "POST",
                    body : formdata
                });

                const data = await response.json()

                if(data.success){
                    return data.data.url
                }
                else{
                    throw new Error("فایل وجود ندارد")
                }

            }catch(error){
                console.log(error)
            }
        
        }

       
 

 
 const welcome = document.createElement("div")
 welcome.classList.add("response","background")
 welcome.innerHTML = `
 سلام خوش امدید من یک دستیار هوش مصنوعی هستم و میتوانم به سوالات شما پاسخ بدم 
<br>
<br>
توجه داشته باشید که من به پیام های قبلی شما دسترسی ندارم و فقط میتوانم به سوالات شما پاسخ بدم
 `
  message_box.appendChild(welcome) 


menu.classList.add("display")
setting_icon.addEventListener("click",()=>{
    if(menu.classList.contains("display")){
        menu.classList.remove("display")
    }else{
        menu.classList.add("display")
    }
})


close_item.addEventListener("click",()=>{
    if(menu.classList.contains("display")){
        menu.classList.remove("display")
    }else{
        menu.classList.add("display")
    }
})

message_box.addEventListener("click",()=>{
        menu.classList.add("display")
    
})


input.addEventListener("input",()=>{
   if(input.value.trim() !== ""){
    send_message.classList.add("send_background")
   }
   else{
    send_message.classList.remove("send_background")
   }
})
 
const Get_message = JSON.parse(localStorage.getItem("message")) || []
const Get_response = JSON.parse(localStorage.getItem("response")) || []
window.scrollTop = window.scrollHeight 
//------------------------------------------------------------------------------------------------
function create_user_message(){
  
   const message = document.createElement("div")
   message.innerHTML = input.value
   message_box.appendChild(message)
   message.classList.add("write")

   Get_message.push(input.value)
   localStorage.setItem("message",JSON.stringify(Get_message))
}



send_message.addEventListener("click",()=>{

   if(input.value.trim() == "")return;

   send_message.classList.remove("send_background")
   create_user_message();
   chatApi()
   input.value = ""
})



document.addEventListener("DOMContentLoaded",()=>{
   const Get_message = JSON.parse(localStorage.getItem("message")) || []
   const Get_response = JSON.parse(localStorage.getItem("response")) || []

   for(var i = 0; i < Get_response.length;i++){
       const message = document.createElement("div")
       message.innerHTML = Get_message[i]
       message_box.appendChild(message)
       message.classList.add("write")

   const response = document.createElement("div")
    response.innerHTML = Get_response[i]
    response.classList.add("response")
    response.classList.add("background")
    message_box.appendChild(response)
   }

   message_box.scrollTop = message_box.scrollHeight  

})

 //---------------------------------------------------------------------------------------------------

// main function

async function chatApi() {
   if(input.value.trim() === "")return;


   
   const responseDiv = document.createElement("div")
   message_box.appendChild(responseDiv)

   responseDiv.classList.add("response")
   const loading = document.createElement("div")

   loading.classList.add("loading")

   responseDiv.appendChild(loading)
   message_box.scrollTop = message_box.scrollHeight



   try {
   
       const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer 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",
    "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
    "messages": [
    {"role": "user", "content": " لطفا جواب سوال را به صورت روان و شفاف و با قالب بندی مقدمه و بدنه و نتیجه گیری بفرست و بین هر قالب فاصله <br>بزار و برو به خط بعدی"},
    
    {"role": "user", "content": input.value}
    ],
    "top_p": 1,
    "temperature": 0.5,
    "repetition_penalty": 1
  })
});
       
       if (!apiResponse.ok) {
           throw new Error(`HTTP error! Status: ${apiResponse.status}`);
       }

        
       const data = await apiResponse.json();
       console.log("API Response:", data);

     

       const error = "خطا در برقراری ارتباط با سرور , لطفا دوباره تلاش کنید."
       const markdownText = data.choices?.[0]?.message?.content || error;
       console.log("Markdown Text:", markdownText);

       responseDiv.innerHTML = markdownText
        
       responseDiv.classList.add("background")

        
     

   }catch (error) {
       console.error("Error:", error);
       responseDiv.innerHTML = "error connection";
   }

   Get_response.push(responseDiv.innerHTML)
   localStorage.setItem("response",JSON.stringify(Get_response))
}