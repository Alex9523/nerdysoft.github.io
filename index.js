$(document).ready(()=>{
    

    const display = $("#display");
    const form = $("#form");
    const todoUserInput = $("#todoUserInput");
   

    const isEmpty = ()=>{
        if($('#display').children().length == 0)
        display.prepend(`<p class="empty">Список порожній</p>`)
    }

    const getTodos = ()=>{
        
        fetch('/getTodos',{method : "get"}).then((response)=>{
            return response.json();
        }).then((data)=>{
            console.log(data);
            displayTodos(data);
        });
    }

    getTodos();

    const resetTodosInput = ()=>{
        todoUserInput.val('');
    }


    const editTodo = (todo,todoID,editID)=>{
        
        let editBtn = $(`#${editID}`);
        editBtn.click(()=>{
            if(todoUserInput.val().length > 0){
            fetch(`/${todo._id}`,{
                method : "put",
                headers : {
                    "Content-Type" : "application/json; charset=utf-8" 
                },
                body : JSON.stringify({todo : todoUserInput.val()})
            }).then((response)=>{
                return response.json();
            }).then((data)=>{
                if(data.ok == 1){
                    let todoIndex = $(`#${todoID}`);
                    todoIndex.html(data.value.todo);
                    resetTodosInput();
                    isEmpty();
                }
            });
        }else{alert("Поле пусте! Введіть завдання в поле")}
        });
    }

    const deleteTodo = (todo,listItemID,deleteID)=>{
         
        let deleteBtn = $(`#${deleteID}`);
        deleteBtn.click(()=>{
            const decision = confirm('Ви спаравді хочете видалити задачу?')
            if (decision) {
                fetch(`/${todo._id}`,{
                    method: "delete"
                }).then((response)=>{
                    return response.json();
                }).then((data)=>{
                    if(data.ok == 1){
                        $(`#${listItemID}`).remove();
                    }
                    isEmpty();
                });
               
            }
        });
    }


    const buildIDS = (todo)=>{
        return {
            editID : "edit_" + todo._id,
            deleteID : "delete_" + todo._id,
            listItemID : "listItem_" + todo._id,
            todoID : "todo_" + todo._id
        }
    }

    const buildTemplate = (todo,ids)=>{
        resetTodosInput();
        $('.empty').remove();
        return `
            <div class="row" id="${ids.listItemID}">
                <div class="col s10 m6">
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text>
                            <p style="margin-bottom: 8px; class="card-title"id="${ids.todoID}">${todo.todo}</p>
                        </div>
                        <div class="card-action">
                            <button class="btn-floating btn-small waves-effect waves-light blue" id="${ids.editID}"><i class="material-icons">create</i></button>
                            <button class="btn-floating btn-small waves-effect waves-light red" id="${ids.deleteID}"><i class="material-icons">delete</i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    const displayTodos = (data)=>{
        
        data.forEach((todo)=>{
            let ids = buildIDS(todo);
            display.prepend(buildTemplate(todo,ids));
            editTodo(todo,ids.todoID,ids.editID);
            deleteTodo(todo,ids.listItemID,ids.deleteID);
        });
    }

    form.submit((e)=>{
        e.preventDefault();
        fetch('/',{
            method : 'post',
            body : JSON.stringify({todo : todoUserInput.val()}),
            headers : {
                "Content-Type" : "application/json; charset=utf-8"
            }
        }).then((response)=>{
            return response.json();
        }).then((data)=>{
            if(!data.error){
                if(data.result.ok == 1 && data.result.n == 1){
                    let ids = buildIDS(data.document);
                    display.prepend(buildTemplate(data.document,ids));
                    editTodo(data.document,ids.todoID,ids.editID);
                    deleteTodo(data.document,ids.listItemID,ids.deleteID);
                    isEmpty();
                }
            }
        });
    });

});
