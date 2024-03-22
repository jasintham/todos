const BACKEND_ROOT_URL = 'https://todo-backend-br7m.onrender.com/';
import { Todos } from "./class/Todo.js";

const todos = new Todos(BACKEND_ROOT_URL);

const list = document.querySelector('ul');
const input = document.querySelector('input');

const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');

    console.log(task.description);
    li.setAttribute('data-key', task.id);
    li.innerHTML = task.description;

    renderSpan(li, task.description);
    renderLink(li, task.id);
    list.append(li);
}

const renderSpan = (li, text) => {
    const span = li.appendChild(document.createElement('span'));
    //span.innerHTML = '<i style="float: right" class="bi bi-trash"></i>';
}

const renderLink = (li, id) => {
    const a = li.appendChild(document.createElement('a'));
    a.innerHTML = '<i style="float: right" class="bi bi-trash"></i>';
    a.addEventListener('click', (event) => {
        todos.removeTask(id).then((remove_id) => {
            const li_to_remove = document.querySelector(`[data-key='${remove_id}']`);
            console.log('remove_id : '+remove_id);
            console.log(li_to_remove);
            if(li_to_remove){
                console.log(li_to_remove)
                list.removeChild(li_to_remove);
            }
        }).catch((error) => {
            alert(error);
        })
    })
   
}

const getTasks = () => {
    todos.getTask().then((tasks) => {
        tasks.forEach(task => {
            renderTask(task)
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
        const task = input.value.trim();
        if(task !== ''){
            todos.addTask(task).then(task => {
                renderTask(task);
                input.value = '';
                input.focus();
            })
        }
    }
});