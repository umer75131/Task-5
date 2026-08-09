const api = "/tasks";
const form = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskId = document.getElementById("taskId");
const title = document.getElementById("title");
const description = document.getElementById("description");
const status = document.getElementById("status");

// Load Tasks (Use _id in mongodb instead of id)
async function loadTasks(){
    const response = await fetch(api);
    const tasks = await response.json();
    taskList.innerHTML = "";
    tasks.forEach(task=>{
        taskList.innerHTML += `

        <div class="task">
            <h3>${task.title}</h3>
            <p>${task.description}</p>

            <strong>Status:</strong> ${task.status}
            <br>
            <button onclick="editTask('${task._id}')">Edit</button>
                
            <button onclick="deleteTask('${task._id}')">Delete</button>
        </div>
        `;
    });
}
loadTasks();

// Add or Update
form.addEventListener("submit", async(e)=>{
    e.preventDefault();

    const task = {
        title:title.value,
        description:description.value,
        status:status.value
    };
    if(taskId.value===""){
        await fetch(api,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(task)
        });
    }
    else{
        await fetch(`${api}/${taskId.value}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(task)
        });
    }
    form.reset();
    taskId.value="";
    loadTasks();
});

// Delete
async function deleteTask(id){
   await fetch(`${api}/${id}`,{
        method:"DELETE"
    });
    loadTasks();
}

// Edit
async function editTask(id){
    const response = await fetch(`${api}/${id}`);
    const task = await response.json();
    taskId.value = task._id;
    title.value = task.title;
    description.value = task.description;
    status.value = task.status;
}