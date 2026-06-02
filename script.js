if(localStorage.getItem('data') == null){
    localStorage.setItem('data', JSON.stringify([]));
    localStorage.setItem('darkmode', JSON.stringify(false));
}


let data = JSON.parse(localStorage.getItem('data'));


function render(tasks){
    let count = data.length;
    let complete = (data.filter(task => task.complete)).length;
    let pending = count - complete;
    let tasks_container = document.querySelector('.task-container');
    let total = document.getElementById('total');
    let completes = document.getElementById('complete');
    let pendings = document.getElementById('pending');
    tasks_container.innerHTML = '';
    tasks.forEach((task,index) => {
        let taskelement = document.createElement('div');
        taskelement.classList.add('task');
        let details = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="button-formet">
                    <button onclick="edit(${index})">Edit</button>
                    <button onclick="del(${index})">Delete</button>
                    <button onclick="completed(${index})">Complete</button>
                </div>
                <div class="date-div">
                    <h4>Due Date: ${task.date}</h4>
                    <h4>Priority: ${task.priority}</h4>
                </div>
            `;
        if(task.complete){
            taskelement.classList.add('complete');
            let complete_button = document.getElementById("completed-button");
            console.log(complete_button);
            
        }
        else if(new Date(task.date) < new Date() && !task.complete){
            taskelement.classList.add('overdue');
        }
        else{
            if(task.priority == 'high'){
            taskelement.classList.add('high');
        }
        else if(task.priority == 'medium'){
            taskelement.classList.add('medium');
        }
        else if(task.priority == 'low'){
            taskelement.classList.add('low');
        }
        }
    taskelement.innerHTML = details;
    tasks_container.appendChild(taskelement);
    });
    total.innerText=`Total Tasks: ${count}`;
    completes.innerText=`Tasks Completed: ${complete}`;
    pendings.innerText=`Tasks Pending: ${pending}`;
    console.log(tasks);
}
render(data);
function openPopup() {
    let popup = document.getElementsByClassName('back');
    popup[0].style.display = 'block';
}
function closePopup() {
    let popup = document.getElementsByClassName('back');
    popup[0].style.display = 'none';
}
let current = null;
function addtask(){
    let title = document.querySelector('.popup-box input');
    let description = document.querySelector('.popup-box textarea');
    let priority = document.querySelector('input[name="priority"]:checked');
    let date = document.querySelector('.date input');
    console.log(date);
    if(title.value == '' || description.value == ''){
        alert('please fill all the fields');
    }
    else if(current != null){
        data[current].title = title.value;
        data[current].description = description.value;
        data[current].priority = priority.value;
        data[current].date = date.value;
        localStorage.setItem('data', JSON.stringify(data));
        render(data);
        title.value = '';
        description.value = '';
        current = null;
        closePopup();
    }
    else{
        let task = {
            "title": title.value,
            "description": description.value,
            "complete": false,
            "priority": priority.value,
            "date": date.value
        }
        console.log(data);
        data.push(task);
        localStorage.setItem('data', JSON.stringify(data));
        render(data);
        title.value = '';
        description.value = '';
        closePopup();
    }
}
function edit(index){
    let title = document.querySelector('.popup-box input');
    let description = document.querySelector('.popup-box textarea');
    let priority = document.querySelectorAll('input[name="priority"]');
    let date = document.querySelector('.date input');
    title.value = data[index].title;
    description.value = data[index].description;
    priority.forEach((p) => {
        if(p.value == data[index].priority){
            p.checked = true;
        }
    });
    date.value = data[index].date;
    current = index;
    openPopup();
}
function del(index){
    data.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(data));
    render(data);
}
function completed (index){
    data[index].complete = !data[index].complete;
    localStorage.setItem('data', JSON.stringify(data));
    render(data);
}

document.getElementById("search").addEventListener("input", searchtask);

function searchtask(){
    let search = document.getElementById('search');
    let obj = data.filter(task => task.title.toLowerCase().includes(search.value.toLowerCase()));
    render(obj);
}

function status(){
    let val = document.getElementById('status');
    if(val.value == 'all'){
        render(data);
    }
    else if(val.value == 'completed'){
        let completed_tasks = data.filter(task => task.complete);
        render(completed_tasks);
    }
    else if(val.value == 'pending'){
        let uncompleted_tasks = data.filter(task => !task.complete);
        render(uncompleted_tasks);
    }
    else if(val.value == 'date'){
        let sort_date = data.sort((a,b) => new Date(a.date) - new Date(b.date));
        render(sort_date);
    }
    else if(val.value == 'priority'){
        let pri = ["high", "medium", "low"];
        let sort_priority = data.sort((a,b) => pri.indexOf(a.priority)-pri.indexOf(b.priority));
        render(sort_priority);
    }
}

function DarkMode() {
    let element = document.body;
    let darkmode = JSON.parse(localStorage.getItem('darkmode'));
    let header = document.querySelector('.header');
    let search = document.querySelector('.search input');
    let filter = document.querySelector('#status');
    let darkmode_button = document.getElementById('dark');
    let total_tasks = document.querySelector('.total-tasks');
    let li = document.querySelectorAll('.total-tasks li:first-child');
    if(darkmode == false){
        element.classList.add("dark-mode");
        header.style.backgroundColor = "#f1f7d4";
        header.style.color = "#4a4466";
        search.style.backgroundColor = "#4a4466";
        search.style.color = "#f1f7d4";
        filter.style.backgroundColor = "#4a4466";
        filter.style.color = "#f1f7d4";
        darkmode_button.style.backgroundColor = "#4a4466";
        darkmode_button.style.color = "#f1f7d4";
        darkmode_button.style.border = "1px solid #f1f7d4";
        darkmode_button.style.hover = "background-color: #f1f7d4; color: #4a4466;";
        total_tasks.style.border = "#f1f7d4 2px solid";
        li.forEach((l) => {
            l.style.color = "#f1f7d4";
        });
        localStorage.setItem('darkmode', JSON.stringify(true));
    }
    else{
        element.classList.remove("dark-mode");
        header.style.backgroundColor = "#4a4466";
        header.style.color = "#f1f7d4";
        search.style.backgroundColor = "#f1f7d4";
        search.style.color = "#4a4466";
        filter.style.backgroundColor = "#f1f7d4";
        filter.style.color = "#4a4466";
        darkmode_button.style.backgroundColor = "#f1f7d4";
        darkmode_button.style.color = "#4a4466";
        darkmode_button.style.border = "1px solid #4a4466";
        darkmode_button.style.hover = "background-color: #4a4466; color: #f1f7d4;";
        total_tasks.style.border = "#4a4466 2px solid";
        li.forEach((l) => {
            l.style.color = "#4a4466";
        });
        localStorage.setItem('darkmode', JSON.stringify(false));
    }
}