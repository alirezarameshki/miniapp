const Todolist = document.querySelector(".Todolist");
const loading = document.querySelector(".loading")
const body = document.querySelector("body")

loading.classList.add("display") 
  
Todolist.addEventListener("click", async function(){
    loading.classList.remove("display") 
    const response = await fetch("../html/todolist.html")
    
    const get = await response.text()

    document.location.href = get
});
