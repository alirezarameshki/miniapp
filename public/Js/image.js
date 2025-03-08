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
    const response = await fetch('/api/getData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl })
    });
    const data = await response.json();
    document.getElementById('outputText').innerText = data.choices[0].message.content;
}

// مثال استفاده:
 