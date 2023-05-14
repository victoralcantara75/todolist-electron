let data = []
let idGen

function init(){

    //for the first time creates the values on localStorage
    if (!window.localStorage.getItem('data')){
        persist('data', [])
        persist('idGen', 0)
    }
    //for the next times just get the values from previous created tasks from localStorage
    else{
        updateValue('data')
        updateValue('idGen')
    }

    loadTasks()
}

function menuClicked(option){
    
    //Loading screen
    let other;

    if (option == 'todo'){
        loadTasks()
        other = 'completed'
    }
    else {
        showCompleted()
        other = 'todo'
    } 

    //Changing menu style
    document.getElementById(option).classList = "menu-clicked"
    document.getElementById(other).classList = "menu-option"

}


function loadTasks(){

    //gets the html tasks container and clears it
    const taskContainer = document.getElementsByClassName("task-container")[0];
    taskContainer.innerHTML = null

    //iterates over the tasks and shows only the to-do ones
    data.map((task) => {
        if (!task.done)
            taskContainer.innerHTML += getTaskDiv(task)
    })
}

function showCompleted(){

    //gets the html tasks container and clears it
    const taskContainer = document.getElementsByClassName("task-container")[0];
    taskContainer.innerHTML = null

    //iterates over the tasks and shows only the done ones
    data.map((task) => {
        if (task.done)
            taskContainer.innerHTML += getCompletedTaskDiv(task)
    })

}

function completeTask(props){

    //gets the task id as a number and find it on the list
    const taskId = Number(props.value)
    const task = data.find(item => item.id == taskId)

    //sets the task as done and reload the screen
    task.done = true
    persist('data', data)
    loadTasks()
}


function undoTask(props){

    //gets the task id as a number and find it on the list
    const taskId = Number(props)
    const task = data.find(item => item.id == taskId)

    //undo the task and reload screen
    task.done = false
    persist('data', data)
    showCompleted()
}

function openModal(modalId, taskId = null){
    
    // if its a edit modal, loads the inputs with the current values
    if(taskId){
        const button = document.getElementById("btn-edit")
        button.setAttribute("onclick", `editTask(${taskId})`)

        let task = data.find(item => item.id == taskId)
        const inputText = document.getElementById("input-text2")
        inputText.value = task.text
        const inputSelect = document.getElementById("input-select2")
        inputSelect.value = task.priority

    }

    //sets modal visible 
    var modal = document.getElementById(modalId);
    modal.style.display = "block";
}

function closeModal(modalId, activeScreen = 'todo'){

    //removes modal from screen
    var modal = document.getElementById(modalId);
    modal.style.display = "none";

    //clears the inputs on the modal
    document.getElementById("input-text").value = null
    document.getElementById("input-select").value = ""

    //loads the previous screen opened
    if(activeScreen == 'todo')
        loadTasks()
    else   
        showCompleted()
}

function createTask(){
    
    //gets the values inputed on the modal
    const inputText = document.getElementById("input-text")
    const text = inputText.value
    const inputSelect = document.getElementById("input-select")
    const priority = inputSelect.value

    //clears the inputs on the modal
    inputText.value = null
    inputSelect.value = ""

    //creates a new task object and add it to the task list
    const newTask = {
        id: idGen + 1,
        text: text,
        done: false,
        priority: priority
    }
    data.push(newTask)
    idGen++
    persist('data', data)
    persist('idGen', idGen)

    //closes the modal
    const activeScreen = document.getElementsByClassName("menu-clicked")[0]
    closeModal('createModal', activeScreen.id)

}

function deleteTask(id, screen){
    
    //removes the task from the list by id
    const deletedTask = data.find(item => item.id == id)
    const index = data.indexOf(deletedTask)
    data.splice(index, 1)
    persist('data', data)

    //reloads the screen without the deleted task
    screen == 1 ? loadTasks() : showCompleted();
}

function editTask(id){

    //finds the task by id
    let task = data.find(item => item.id == id)

    //gets the values inputed on the modal
    const inputText = document.getElementById("input-text2").value
    const inputSelect = document.getElementById("input-select2").value

    //updates the task values
    task.text = inputText
    task.priority = inputSelect
    persist('data', data)

    closeModal('editModal')

}

//gets the value from the variable and persists it on the local storage
function persist(key, value){

    window.localStorage.setItem(key, JSON.stringify(value))
    updateValue(key)
    
}

//gets the value from localStorage and puts on the variables
function updateValue(key){
    if (key == 'data')
        data = JSON.parse(window.localStorage.getItem('data'))
    else 
        idGen = JSON.parse(window.localStorage.getItem('idGen'))
}

function getTaskDiv(task){

    //returns a 'task template' with the task values

    return `
    <div class="task flex-container">
        <input type="radio" class="radio" value="${task.id}" onchange="completeTask(this)"/>
        <p class="p-task">${task.text}</p>
        <div class="icon-container flex-container">
            <span class="priority ${task.priority}">${task.priority}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon edit-icon" onclick="openModal('editModal', ${task.id})">
                <path fill="currentColor" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon delete-icon" onclick="deleteTask(${task.id}, 1)">
                <path fill="currentColor" d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
            </svg>
        </div>
    </div>
    `
}

function getCompletedTaskDiv(task){

    //returns a 'task template' with the task values

    return `
    <div class="task flex-container">
        <input type="radio" class="radio" checked value="${task.id}"/>
        <p class="p-task p-task-completed">${task.text}</p>
        <div class="icon-container flex-container">
            <span class="priority ${task.priority}">${task.priority}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon edit-icon" onclick="undoTask(${task.id})">
                <path fill="currentColor" d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="icon delete-icon" onclick="deleteTask(${task.id}, 2)">
                <path fill="currentColor" d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
            </svg>
        </div>
    </div>
    `
}