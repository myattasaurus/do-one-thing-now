function submitTask(event) {
    if (event.code === 'Enter') {
        const para = document.createElement("p");
        const node = document.createTextNode(event.srcElement.value);
        para.appendChild(node);
        document.getElementById('dontainer').appendChild(para);

        event.srcElement.remove();
    }
}

function refocus(event) {
    event.srcElement.focus();
}