const projectsContainer = document.querySelector('.projectsContainer');
const addProjectBtn = document.querySelector('#addProject');
const selectProjectName = document.querySelector('#projectName');
const selectProjectDescription = document.querySelector('#projectDescription');
const selectProjectDate = document.querySelector('#projectDate');
const confirmProject = document.querySelector('.confirmProject');
const main = document.querySelector('.main');

const projects = [];

class Project {
    constructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.id = crypto.randomUUID();
        this.todos = [];
    }
}
function addProject(title, description, dueDate){
    let project = new Project(title, description, dueDate);
    projects.push(project);
}

let currentProject = null;
class Todo {
    constructor(title, description, priority){
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.id = crypto.randomUUID();
    }
}
function addTodo(title, description){
    let todo = new Todo(title, description);
    todos.push(todo);
}

addProjectBtn.addEventListener('click', (event) => {
    dialog.showModal();
});

confirmProject.addEventListener('click', (event) => {
    event.preventDefault();
    addProject(selectProjectName.value, selectProjectDescription.value, selectProjectDate.value);
    // confirmBtn.disabled = true; // Disable confirm button initially

    // clears projectsContainer each time new project is added and to re-render all
    const displayProjects = document.querySelectorAll('.projectCard');
    displayProjects.forEach(project => project.remove());

    // loop to add and display projects
    for (let i=0 ; i<projects.length ; i++){
        const project = projects[i];
        const projectCard =  document.createElement('button');
        projectCard.classList.add('projectCard');


        projectsContainer.appendChild(projectCard);
        function updateProjectCardText(projectCard, book) {
            projectCard.textContent = project.title + ' ' + project.description + ' ' + project.dueDate;
        }
        updateProjectCardText(projectCard, projects[i]);       
        
        // saving the specific project ID
        const projectId = projects[i].id;


        // delete button and logic to remove specific project
        const delBtn = document.createElement('button');
        delBtn.textContent = '✘';
        delBtn.classList.add('delBtn');
        projectCard.appendChild(delBtn);
        delBtn.addEventListener('click', (event) => {
            projectCard.remove();
            delBtn.remove();
    
            // find and remove the project from projects[]
            const indexToRemove = projects.findIndex(project => project.id === projectId);
            if (indexToRemove !== -1) {
                projects.splice(indexToRemove, 1); // remove the correct project
            }
            });
        
            function renderTodos(project) {
                const todosContainer = document.createElement('div');
                todosContainer.textContent = '';
                main.appendChild(todosContainer);
            
                const displayTodos = document.querySelectorAll('.todoCard');
                displayTodos.forEach(todo => todo.remove());
            
                project.todos.forEach(todo => {
                    const todoCard = document.createElement('div');
                    todoCard.classList.add('todoCard');
                    todoCard.textContent = todo.title + todo.description;
            
                    const delTodoBtn = document.createElement('button');
                    delTodoBtn.textContent = '✘';
                    delTodoBtn.classList.add('delTodoBtn');
                    todoCard.appendChild(delTodoBtn);
            
                    delTodoBtn.addEventListener('click', () => {
                        const index = project.todos.findIndex(t => t.id === todo.id);
                        if (index !== -1) project.todos.splice(index, 1);
                        todoCard.remove();
                    });
            
                    todosContainer.appendChild(todoCard);
                });
            }
        
            projectCard.addEventListener('click', () => {
            currentProject = project;
            const projectCardMain = document.createElement('div');
            projectCardMain.classList.add('projectCardMain');
            main.textContent = '';
            main.appendChild(projectCardMain);
            projectCardMain.textContent = project.title;

            const newTodo = document.createElement('button');
            newTodo.classList.add('newTodo');
            newTodo.textContent = 'New Todo';
            main.appendChild(newTodo);

            renderTodos(project);


            newTodo.addEventListener('click', (event) => {
                const inputTodoTitle = document.createElement('input');
                inputTodoTitle.classList.add('inputTodoTitle');
                main.appendChild(inputTodoTitle);

                const inputTodoConfirm = document.createElement('button');
                inputTodoConfirm.textContent = 'confirm';
                main.appendChild(inputTodoConfirm);

                const todosContainer = document.createElement('div');
                todosContainer.textContent = '';
                main.appendChild(todosContainer);
                
                inputTodoConfirm.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (!currentProject) return;
                    const newTodo = new Todo(inputTodoTitle.value, inputTodoTitle.value);
                    currentProject.todos.push(newTodo); // add to the right project
                    renderTodos(currentProject); // render only this project’s todos
                    inputTodoTitle.value = '';
                    inputTodoTitle.style.display = 'none';
                    inputTodoConfirm.style.display = 'none';
                })
                
            })

        })
    }
    dialog.close();
    selectProjectName.value = '';
    selectProjectDescription.value = '';
    selectProjectDate.value = ''; 
    
});