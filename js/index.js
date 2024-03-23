const BACKEND_ROOT_URL = 'http://localhost:3001';
import { Todos } from "./class/Todo.js";

const todos = new Todos(BACKEND_ROOT_URL);

const list = document.querySelector('ul');
const input = document.querySelector('input');
const countBox = document.querySelector('#count');
const addButton = document.querySelector('#btn-add-tasks');

const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item d-flex');
    li.setAttribute('data-key', task.id);
    renderSpan(li, task.description);
    renderLink(li, task.id);
    renderCheckbox(li, task.id, task.completed);
    taskCount();
    list.prepend(li);
}

const renderSpan = (li, text) => {
    const span = li.appendChild(document.createElement('p'));
    span.innerHTML = text;
}

const renderCheckbox = (li, id, completed) => {
    const newCheckBox = document.createElement('input');
    newCheckBox.type = 'checkbox';
    newCheckBox.id = id ;
    newCheckBox.name = 'checkbox';
    newCheckBox.value = 0
    newCheckBox.setAttribute("class", "form-check-input");
    li.prepend(newCheckBox);

    if(completed){
        disableCheckBox(li, id);
    }

    newCheckBox.addEventListener('click', (event) => {
        var adjSpanBox = event.target.nextSibling;
        adjSpanBox.setAttribute("class", 'text-decoration-line-through');
        event.target.setAttribute("disabled", true);
        todos.completeTask(id).then((complete_id) => {
            if(complete_id){
                taskCount();
            }
        }).catch((error) => {
            console.log(error);
        })
    })
}

const taskCount = () => {
    const count = todos.getCount();
    countBox.innerHTML = count
}

const disableCheckBox = (li, id) => {
    li.childNodes[0].setAttribute("disabled", true);
    li.childNodes[0].checked = true;
    li.childNodes[1].setAttribute("class", 'text-decoration-line-through');
}


const renderLink = (li, id) => {
    
    const a = li.appendChild(document.createElement('a'));

    a.innerHTML = '<i style="float: right; cursor: pointer;" class="bi bi-trash"></i>';
    a.addEventListener('click', (event) => {
        todos.removeTask(id).then((remove_id) => {
            const li_to_remove = document.querySelector(`[data-key='${remove_id}']`);
            if(li_to_remove){
                list.removeChild(li_to_remove);
            }
        }).catch((error) => {
            console.log(error);
        })
    })
}

const getTasks = () => {
    todos.getTask().then((tasks) => {
        taskCount();
        tasks.forEach(task => {
            renderTask(task);
        })
    }).catch((error) => {
        alert(error + '2');
    })
} 


const saveTask = async(task) => {
    try{
        const json = JSON.stringify({description:task});
        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method:'post',
            headers:{
                'Content-Type': 'application/json'
            },
            body:json
        })
        return response.json();
    }catch(error){
        alert(`Error Saving task ${error.message}`)
    }
}

getTasks();

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTaskIfNotEmpty();
    }
});

const addTaskIfNotEmpty = () =>{
    const task = input.value.trim();
    if(task !== '') {
        todos.addTask(task).then(task => {
            renderTask(task);
            input.value = '';
            input.focus();
        });
    }
}

// Event listener for the button's click event
addButton.addEventListener('click', (event) => {
    addTaskIfNotEmpty();
});
