window.onload = function () {
    createTaskEntryTheFirstTime();
}

window.onkeyup = function (event) {
    if (event.code === 'Enter') {
        let task = findTask();
        if (task) {
            crossOutTask();
            removeTaskAndCreateTaskEntry();
        } else {
            let taskEntryValue = removeTaskEntry();
            createTask(taskEntryValue);
        }
    }
};

function findTaskEntry() {
    return document.getElementById('taskEntry');
}

function createTaskEntryTheFirstTime() {
    let input = createTaskEntry();
    input.setAttribute('placeholder', 'What one thing do you need to do?');
}

function createTaskEntry() {
    let input = document.createElement('input');
    input.setAttribute('id', 'taskEntry');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'w-100 p-2 border-0 text-center');
    input.onblur = function (event) {
        findTaskEntry().focus();
    };

    document.getElementById('dontainer').appendChild(input);
    input.focus();
    return input;
}

function removeTaskEntry() {
    let taskEntry = findTaskEntry();
    let taskEntryValue = taskEntry.value;
    taskEntry.onblur = null;
    taskEntry.remove();
    return taskEntryValue;
}

function findTask() {
    return document.getElementById('task');
}

function createTask(taskEntryValue) {
    let para = document.createElement('p');
    para.setAttribute('id', 'task');
    para.appendChild(text(taskEntryValue));

    document.getElementById('dontainer').appendChild(para);
}

function crossOutTask() {
    findTask().style.textDecorationLine = 'line-through';
}

function removeTaskAndCreateTaskEntry() {
    setTimeout(() => {
        findTask().remove();
        createTaskEntry();
    }, 400);
}

function text(str) {
    return document.createTextNode(str);
}