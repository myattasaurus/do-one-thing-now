window.onload = function () {
    createTaskEntry();
}

window.onkeyup = function (event) {
    if (event.code === 'Enter') {
        let task = findTask();
        if (task) {
            createTaskEntry();
            removeTask();
        } else {
            createTask();
            removeTaskEntry();
        }
    }
};

function findTaskEntry() {
    return document.getElementById('taskEntry');
}

function createTaskEntry() {
    let input = document.createElement('input');
    input.setAttribute('id', 'taskEntry');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'w-100 p-2 border-0 text-center');
    input.setAttribute('placeholder', 'What one thing do you need to do?');
    input.onblur = function (event) {
        findTaskEntry().focus();
    };

    document.getElementById('dontainer').appendChild(input);
    input.focus();
}

function removeTaskEntry() {
    let taskEntry = findTaskEntry();
    taskEntry.onblur = null;
    taskEntry.remove();
}

function findTask() {
    return document.getElementById('task');
}

function createTask() {
    let taskEntry = findTaskEntry();

    let para = document.createElement('p');
    para.setAttribute('id', 'task');
    para.appendChild(text(taskEntry.value));

    document.getElementById('dontainer').appendChild(para);
}

function removeTask() {
    let task = findTask();
    task.remove();
}

function text(str) {
    return document.createTextNode(str);
}