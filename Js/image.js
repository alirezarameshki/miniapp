const upload_img = document.querySelector(".upload_img");
const fileInput = document.querySelector("#fileInput");
let importimg = document.querySelector(".importimg");  
const outputText = document.querySelector("#outputText")
const loading = document.querySelector(".loading")
const warning = document.querySelector(".warning")

const back_icon = document.querySelector(".back_icon")

back_icon.addEventListener("click",()=>{
loading.classList.remove("display")


setTimeout(() => {
 document.location.href = "../index.html"
}, 1000);
});

document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("importimg")) {
    warning.classList.add("display");
 
    }
});

upload_img.addEventListener("click", () => {
    fileInput.click();
});

importimg.addEventListener("click", async() => {
   let img = await uploadImage();
   
   if(img || img !== undefined){
    getResponse(img)

    loading.classList.add("display")
     warning.classList.remove("display")
    outputText.classList.remove("display")
   }
});

async function uploadImage() {
    const imageInput = document.getElementById("fileInput");
    const result = document.querySelector("#outputText");
    const apiKey = "2a95140901ea5fc62ad060bfc12004e7"; // کلید API ImgBB رو اینجا بذار
    const url = `https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`;

    // چک کردن انتخاب فایل
    if (!imageInput.files || imageInput.files.length === 0) {
        result.textContent = "لطفاً یه عکس انتخاب کن!";
        return;
    }

    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append("image", file); // فایل رو به‌عنوان image می‌فرستیم

    try {
        loading.classList.remove("display")
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            return data.data.url
        } else {
            throw new Error(data.error.message || "خطا در آپلود");
        }
    } catch (error) {
        result.textContent = "خطا: " + error.message;
    }
}

async function getResponse(imageUrl) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
{
"role": "user",
"content": [
  {
    "type": "text",
    "text": "تو یک ربات تبدیل کننده عکس به متن هستی و وظیفه تو این است که هر عکسی که فرستادم متن درون آن عکس را برای من بفرستی و حرف اضافه هم نزن"
  },
  {
    "type": "image_url",
    "image_url": {
      "url": imageUrl
    }
  }
]
}
]
})
});
    const data = await response.json();

    const markdownText = data.choices?.[0]?.message?.content || error;

    document.getElementById("outputText").innerHTML = markdownText
    
}