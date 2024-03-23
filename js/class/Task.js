class Task{
    #id;
    #text;
    #completed;

    constructor(id, text, completed){
        this.#id = id;
        this.#text = text;
        this.#completed = completed;
    }

    getId(){
        return this.#id
    }

    getText(){
        return this.#text;
    }

    getCompleted(){
        return this.#completed;
    }
}

export{ Task}