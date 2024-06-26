import { Task } from "./Task.js";

class Todos{
    #tasks = [];
    #backend_url = '';

    constructor(url){
        this.#backend_url = url;
    }

    getTask = () => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url)
            .then((response) => response.json())
            .then((json) => {
                this.#readJson(json)
                resolve(this.#tasks)
            }, (error) => {
                reject(error)
            })
        })
    }

    getCount = () =>{
        const activeTasks = this.#tasks.filter(obj => !obj.completed);
        return activeTasks.length;
    }

    #readJson = (taskAsJson) => {
        taskAsJson.forEach(node => {
            const task = new Task(node.id, node.description, node.is_completed);
            this.#tasks.push({id : task.getId(), description:task.getText(), completed:task.getCompleted()})
        });
    }

    #addToArray = (id, text) => {
        const task = new Task(id, text);
        const ele = {id : task.getId(), description:task.getText(), completed:task.getCompleted()};
        this.#tasks.push(ele)
        return ele
    }

    addTask = (text) => {
        return new Promise(async(resolve, reject) => {
            const json = JSON.stringify({ description:text});
            fetch(this.#backend_url + '/new', {
                method:'post',
                headers:{'Content-Type': 'application/json'},
                body:json
            })
            .then((response) => response.json())
            .then((json) => {
                resolve(this.#addToArray(json.id, text))
            }, (error) => {
                reject(error);
            })
        })
    }

    #removeFromArray = (id) => {
        const arrayWithoutRemoved = this.#tasks.filter(task => task.id !== id);
        this.#tasks = arrayWithoutRemoved;
    }

    removeTask = (id) => {
        return new Promise(async(resolve, rejects) => {
            fetch(this.#backend_url + '/delete/' + id, {
                method:'delete'
            })
            .then((response) => response.json())
            .then((json) => {
                this.#removeFromArray(id)
                console.log(json);
                resolve(json.id)
            }, (error) => {
                rejects(error);
            })
        })
    }

    completeTask = (id) => {
        return new Promise(async(resolve, rejects) => {
            fetch(this.#backend_url + '/complete/' + id, {
                method:'put'
            })
            .then((response) => response.json())
            .then((json) => {
                this.#removeFromArray(id)
                console.log(json);
                resolve(json.id)
            }, (error) => {
                rejects(error);
            })
        })
    }
}

export{ Todos}

