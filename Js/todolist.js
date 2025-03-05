const main = document.querySelector(".main")
const Task = document.querySelector(".task")
const Task_items = document.querySelector(".task_items")
const task_value = document.querySelector(".task_value")
const more_details = document.querySelector(".more_details")
const addtasks_input = document.querySelector(".addTasks_input")
const optional_textarea = document.querySelector(".optional_textarea")
const textarea_length = document.querySelector(".textarea_length")
const addTask = document.querySelector(".addTask")
const addtasks_page = document.querySelector(".addTasks_page")
const save_Task = document.querySelector(".save")
const Mine = document.querySelector(".Mine")
const goMine = document.querySelector(".goMine")
const goTask = document.querySelector(".goTask")
const body = document.querySelector("body")

const back_icon = document.querySelector(".back_icon")

back_icon.addEventListener("click", async function() {
    const response = await fetch("../html/index.html");
    const get = await response.text();
    console.log(get); // کار میکنه
    document.open();
    document.write(get); // این کار میکند
    document.close();
});


Mine.classList.add("display")
goTask.classList.add("menu_color")

goTask.addEventListener("click",()=>{
    Mine.classList.add("display")
    
    goTask.classList.add("menu_color")
    goMine.classList.remove("menu_color")

   
})



goMine.addEventListener("click",()=>{
    Mine.classList.toggle("display")
    goMine.classList.add("menu_color")
    goTask.classList.remove("menu_color")
})


if(task_value){
     task_value.addEventListener("click",()=>{
    
        more_details.classList.toggle("display")

})
}


document.addEventListener("click",(e)=>{


    if(!e.target.classList.contains("addTask_i") &&
    !e.target.classList.contains("save") && 
    !e.target.classList.contains("addTask") &&
    !e.target.classList.contains("addTasks_input") &&
    !e.target.classList.contains("addtask_pagename") &&
    !e.target.classList.contains("textarea_length") 
)
    
    {
        addtasks_page.classList.add("display")
    }
})

addTask.addEventListener("click",()=>{
    addtasks_page.classList.toggle("display")
    addtasks_input.focus()
})
addtasks_input.addEventListener("input",(event)=>{
    const input = event.target.value.trim() 

    textarea_length.innerHTML = `${String(input.length).padStart(2,"0")}/50`
    if(input.length >= 50){
        event.target.value = event.target.value.slice(0,50)
    }
})


let get_task = JSON.parse(localStorage.getItem("task")) || [];

function update_status(){
    let cm = 0
let pn = 0 
get_task.forEach((item)=>{
    if(item.state){
        cm += 1
         
    }
    else{
        pn += 1
         
    }
})

const complete = document.querySelector(".complete")
const pending = document.querySelector(".pending")

complete.innerHTML = cm
pending.innerHTML = pn
}

window.addEventListener("storage",()=>{
    update_status()
})

setInterval(update_status,500)

function setitem(value){
let {text, number, state,more_value} = value

get_task.push({
    text : value.text , 
    number : value.number, 
    state : value.state,
    more_value: value.more_value
})

localStorage.setItem("task",JSON.stringify(get_task))
}

save_Task.addEventListener("click", () => {
    if (addtasks_input.value.trim() == "") {
    return;
    }
    
    let random = Math.floor(Math.random() * 1000)
    let value = addtasks_input.value
    let more_value = optional_textarea.value

    setitem({
        text : addtasks_input.value,
        number : random, 
        state : false,
        more_value: more_value
    })

    createElement(value,random,false,more_value)
});



function createElement(value ,number ,state ,more_value) {
const Task = document.createElement("div");
Task.classList.add("task");
Task.setAttribute("number", number);

const Task_items = document.createElement("div");
Task_items.classList.add("task_items");

Task.appendChild(Task_items);
main.appendChild(Task);

const check_icon = document.createElement("div");
check_icon.classList.add("check_icon");
check_icon.innerHTML = state ? `<i class="fa-solid fa-circle-check"></i>` : `<i class="fa-regular fa-circle"></i>`; 

const task_value = document.createElement("div");
task_value.classList.add("task_value");
task_value.innerHTML = value;

const more_details_icon = document.createElement("div");
more_details_icon.classList.add("more_details_icon");
more_details_icon.innerHTML = `<i class="fa-solid fa-caret-down"></i>`;

const delete_task = document.createElement("div");
delete_task.classList.add("delete_task");
delete_task.innerHTML = `<i class="fa-regular fa-circle-xmark"></i>`;

Task_items.appendChild(check_icon);
Task_items.appendChild(task_value);
task_value.appendChild(more_details_icon);
Task_items.appendChild(delete_task);

const more_details = document.createElement("div");
more_details.classList.add("more_details", "display");
more_details.innerHTML = more_value

Task.appendChild(more_details);
addtasks_input.value = "";
optional_textarea.value = "";
addtasks_page.classList.add("display");


if (state) {
task_value.classList.add("line");
}

check_icon.addEventListener("click", () => {
state = !state;  
check_icon.innerHTML = state ? `<i class="fa-solid fa-circle-check"></i>` : `<i class="fa-regular fa-circle"></i>`;
task_value.classList.toggle("line");


const taskNumber = parseInt(Task.getAttribute("number"));
get_task = get_task.map(task => {
    if (task.number === taskNumber) {
        task.state = state;
    }
    return task;
});
localStorage.setItem("task", JSON.stringify(get_task));
});

delete_task.addEventListener("click", () => {
const Tasknumber = parseInt(Task.getAttribute("number"));
main.removeChild(Task);
get_task = get_task.filter(task => task.number !== Tasknumber);
localStorage.setItem("task", JSON.stringify(get_task));
});

task_value.addEventListener("click", () => {
const all_more_details = document.querySelectorAll(".more_details");

all_more_details.forEach((item) => {
    if (item != more_details) {
        item.classList.add("display");
    }
});
more_details.classList.toggle("display");
});
}
document.addEventListener("DOMContentLoaded", () => {
    get_task.forEach(task => {
    createElement(task.text,task.number,task.state,task.more_value);
    });
});