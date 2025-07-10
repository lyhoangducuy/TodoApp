/**
    1.Thêm việc cần làm
    2.Xem việc cần làm
    3.Lưu việc cần làm
    4.Cập nhật trạng thái việc cần làm
    5.Sưa việc cần làm
    6.Ghi chi tiết việc cần làm
    7.Xóa việc cần làm
**/
const todoForm= document.getElementById("todoForm");
const descriptionElement = document.getElementById("description");
const titleElement = document.getElementById("title");

const btnReset= document.getElementById("reset-btn");
const btnAdddo = document.getElementById("add-btn");
const btnRemoveAll = document.getElementById("btn-removeAll");
const tBody= document.getElementById("tbody");

let todoSaved = JSON.parse(localStorage.getItem("todos") || "[]");

let editingId= null;
function generateRandomId(n, preflix="todo-") {
    const chracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id= preflix;
    for (let i = 0; i < n; i++) {
        id += chracters.charAt(Math.floor(Math.random() * chracters.length));
    }
    return id;
}
todoForm.addEventListener("submit", function(event) {
    event.preventDefault();
    if (editingId!== null) {    
        todoSaved = todoSaved.map((item) => {
            if (item.id === editingId) {
                item.title = titleElement.value;
                item.description = descriptionElement.value;
            }
            return item;
            }
    );
    editingId = null;
    btnAdddo.textContent = "Add";
    btnAdddo.classList.remove("btn-success");
    btnAdddo.classList.add("btn-primary");
    }else{
    const toDo= {
        title: titleElement.value,
        description: descriptionElement.value,
        id: generateRandomId(4),
        status:false,
        };
    todoSaved.push(toDo);
    }
    
    handleViewTodo(todoSaved);
    resetForm();
});
function handleViewTodo(todos) {
    tBody.innerHTML = "";
    const isEditing = editingId !== null;

    btnRemoveAll.disabled = isEditing;
    if (todos.length>0){ todos.forEach(item => {
        let trElement = document.createElement("tr");
        trElement.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>
                <p onclick="toggleStatus('${item.id}')" >
                    <i class='bx ${item.status ? "bx-check" : "bx-x"}' 
                    style="cursor:pointer;${isEditing ? 'pointer-events:none;opacity:0.5;' : ''}"></i>
                </p>
            </td>
            <td>
                <button class="btn btn-primary" ${isEditing ? 'disabled' : ''} onclick="updateTodo('${item.id}')">Update</button>
                <button class="btn btn-danger" ${isEditing ? 'disabled' : ''} onclick="removeTodo('${item.id}')">Remove</button>
            </td>
        `;
        tBody.appendChild(trElement);
    })
    }else {tBody.innerHTML =`<tr>
        <td colspan="5" class="text-center">No todos available</td> </tr>`;}
    localStorage.setItem("todos", JSON.stringify(todoSaved));
}
function toggleStatus(id) {
    todoSaved = todoSaved.map((item) => {
        if (item.id === id) {
            item.status = !item.status;
        }
        return item;
    });
    handleViewTodo(todoSaved);
}
function removeTodo(id) {
    if  (window.confirm("Are you sure you want to delete this todo?")) {
        todoSaved = todoSaved.filter((item) => item.id !== id);
        localStorage.setItem("todos", JSON.stringify(todoSaved));
    }
    
    handleViewTodo(todoSaved);
}
function resetForm() {
    todoForm.reset();
}
function removeAllTodo() {
    if (window.confirm("Are you sure you want to remove all todos?")) {
        todoSaved=[];
        localStorage.setItem("todos", JSON.stringify(todoSaved));
        handleViewTodo(todoSaved);
    }
}
function updateTodo(id) {
    const todo=todoSaved.find(item => item.id === id)
    titleElement.value = todo.title;
    descriptionElement.value = todo.description;
    editingId = id;
    btnAdddo.textContent = "Update";
    btnAdddo.classList.remove("btn-primary");
    btnAdddo.classList.add("btn-success");
    handleViewTodo(todoSaved);

}
btnReset.addEventListener("click", resetForm);

handleViewTodo(todoSaved);