function crossOut(element, onComplete) {
    element.onclick = () => {
        element.style.textDecorationLine = 'line-through';
        setTimeout(() => {
            onComplete();
            element.style.textDecorationLine = '';
        }, 400);
    }
}

class ListItems {
    constructor(parent) {
        this.parent = parent;
    }

    getRandom() {
        if (this.length > 0) {
            let index = Math.floor(Math.random() * this.length);
            return this.parent.childNodes[index];
        }
        return null;
    }

    pushText(text) {
        let li = document.createElement('li');
        li.append(text);
        this.parent.insertBefore(li, this.parent.lastChild);
        return li
    }

    fromArray(array) {
        for (let item of array) {
            this.pushText(item);
        }
    }

    toArray() {
        let array = [];
        for (let item of this) {
            array.push(item.textContent);
        }
        return array;
    }

    clear() {
        while (this.parent.firstChild !== this.parent.lastChild) {
            this.parent.firstChild.remove();
        }
    }

    get length() {
        return this.parent.childNodes.length - 1;
    }

    [Symbol.iterator]() {
        let index = -1;

        return {
            next: () => {
                return {
                    value: this.parent.childNodes[++index],
                    done: index >= this.length
                }
            }
        };
    }
}

class List {

    constructor() {
        this.element = document.createElement('ul');

        this.newItemElement = document.createElement('input');
        this.newItemElement.type = 'text';
        this.newItemElement.onblur = () => this.newItemElement.focus();
        let li = document.createElement('li');
        li.append(this.newItemElement);
        this.element.append(li);

        this.items = new ListItems(this.element);
    }

    pushNewItem() {
        if (this.newItemElement.value?.trim() !== '') {
            let li = this.items.pushText(this.newItemElement.value.trim());
            this.newItemElement.value = '';
            return li;
        }
        return null;
    }

    show(parent) {
        parent.append(this.element);
        this.newItemElement.focus();
    }

    hide() {
        this.element.remove();
    }
}

class Repository {
    loadList(list) {
        list.items.clear();
        let saved = localStorage.getItem('dotn-list');
        if (saved !== null) {
            list.items.fromArray(JSON.parse(saved).items);
        }
    }

    saveList(list) {
        localStorage.setItem('dotn-list', JSON.stringify({
            items: list.items.toArray()
        }));
    }
}

class SingleTask {
    constructor(text = '') {
        this.element = document.createElement('p');
        this.element.append(text);
    }

    get text() {
        return this.element.innerHTML;
    }

    set text(text) {
        this.element.innerHTML = text;
    }
}

class BackButton {
    constructor() {
        this.element = document.createElement('button');
        this.element.innerHTML = '<-';
    }
}

class TaskPage {
    constructor(dontainer, backButton, singleTask, list, repository) {
        this.dontainer = dontainer;
        this.backButton = backButton;
        this.singleTask = singleTask;
        this.list = list;
        this.repository = repository;
    }

    load() {
        window.onkeyup = (event) => this.onkeyup(event);

        this.backButton.element.onclick = () => this.unload();

        this.createTask();
        this.dontainer.append(this.singleTask.element);
    }

    unload() {
        this.singleTask.element.remove();

        new ListPage(this.dontainer, this.backButton, this.list, this.repository).load();
    }

    onkeyup(event) {
        if (event.code === 'Enter') {
            this.createTask();
        }
    }

    createTask() {
        let li = this.createRandomTask();
        crossOut(this.singleTask.element, () => {
            li.remove();
            this.repository.saveList(this.list);
            li = this.createRandomTask();
        });
    }

    createRandomTask() {
        let li = this.list.items.getRandom();
        if (li == null) {
            this.unload();
            return;
        }
        this.singleTask.text = li.innerHTML;
        return li;
    }
}

class ListPage {
    constructor(dontainer, backButton, list, repository) {
        this.dontainer = dontainer;
        this.backButton = backButton;
        this.list = list;
        this.repository = repository;
    }

    load() {
        window.onkeyup = (event) => this.onkeyup(event);

        this.repository.loadList(this.list);

        this.backButton.element.onclick = () => this.unload();

        this.dontainer.append(this.backButton.element);
        this.list.show(this.dontainer);
        for (let li of this.list.items) {
            this.crossOutListItem(li);
        }
    }

    unload() {
        this.list.hide();

        new TaskPage(this.dontainer, this.backButton, new SingleTask(), this.list, this.repository).load();
    }

    onkeyup(event) {
        if (event.code === 'Enter') {
            let li = this.list.pushNewItem();
            this.crossOutListItem(li);
            this.repository.saveList(this.list);
        }
    }

    crossOutListItem(li) {
        crossOut(li, () => {
            li.remove();
            this.repository.saveList(this.list)
        });
    }
}

function onLoad() {
    new ListPage(document.getElementById('dontainer'), new BackButton(), new List(), new Repository()).load();
}