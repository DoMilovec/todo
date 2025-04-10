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
        this.isMarkedToday = false;
        this.isMarkedPrio = false;
        this.isChecked = false;
    }
}
function addTodo(title, description){
    let todo = new Todo(title, description);
    todos.push(todo);
}

function renderProject(project) {
    currentProject = project;
    main.textContent = ''; // Clear the main area

    // Title
    const projectCardMain = document.createElement('div');
    projectCardMain.classList.add('projectCardMain');
    projectCardMain.textContent = project.title;
    main.appendChild(projectCardMain);

    // New Todo button
    const newTodo = document.createElement('button');
    newTodo.classList.add('newTodo');
    newTodo.textContent = 'New Todo';
    main.appendChild(newTodo);

    // Show existing todos
    renderTodos(project);

    // "New Todo" button logic
    newTodo.addEventListener('click', () => {
        const inputTodoTitle = document.createElement('input');
        inputTodoTitle.classList.add('inputTodoTitle');
        main.appendChild(inputTodoTitle);

        const inputTodoConfirm = document.createElement('button');
        inputTodoConfirm.textContent = 'confirm';
        main.appendChild(inputTodoConfirm);

        inputTodoConfirm.addEventListener('click', (event) => {
            event.preventDefault();
            if (!currentProject) return;

            const newTodo = new Todo(inputTodoTitle.value, inputTodoTitle.value); // ADD DESCRIPTION INPUT AND OPTION

            const firstCheckedIndex = currentProject.todos.findIndex(t => t.isChecked); // find first checked todo
            if (firstCheckedIndex === -1) {
                currentProject.todos.push(newTodo);
            } else {
                currentProject.todos.splice(firstCheckedIndex, 0, newTodo); // insert before the first checked todo
            }

            renderTodos(currentProject);

            inputTodoTitle.remove();
            inputTodoConfirm.remove();
        });
    });
}

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

        if (todo.isMarkedToday) {
            todoCard.classList.add('markedToday');
        }

        if (todo.isMarkedPrio) {
            todoCard.classList.add('markedPrio');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('todoCheckbox');
        if (todo.isChecked){
            checkbox.checked = true;
            todoCard.classList.add('isChecked');
            todoCard.classList.remove('markedToday');
            todoCard.classList.remove('markedPrio');
        }
        checkbox.addEventListener('change', () => {
            todo.isChecked = checkbox.checked;

            const index = project.todos.findIndex(t => t.id === todo.id);
            if (index !== -1) project.todos.splice(index, 1); // remove from current position
        
            if (checkbox.checked) {
                todo._wasPrio = todo.isMarkedPrio; // temp for storing state prior to checking
                todo.isMarkedToday = false;
                todo.isMarkedPrio = false;
        
                todoCard.classList.add('isChecked');
                todoCard.classList.remove('markedToday');
                todoCard.classList.remove('markedPrio');
        
                project.todos.push(todo);
                } else {
                todoCard.classList.remove('isChecked');
    
                // check if it was prio before checking it first time
                if (todo._wasPrio) {
                    todo.isMarkedPrio = true;
                    project.todos.unshift(todo);
                } else {
                    // insert just under prio todos
                    const prioEndIndex = project.todos.findIndex(t => !t.isMarkedPrio);
                    if (prioEndIndex === -1) {
                        project.todos.push(todo); // all are prio
                    } else {
                        project.todos.splice(prioEndIndex, 0, todo);
                    }
                }
                delete todo._wasPrio;
            }
        
            renderTodos(project); // re-render to shift or unshift after change
        })
        todoCard.appendChild(checkbox);

        // Today button todo
        const todayTodoBtn = document.createElement('button');
        todayTodoBtn.textContent = 'today';
        todayTodoBtn.classList.add('todayTodoBtn');
        todoCard.appendChild(todayTodoBtn);
        todayTodoBtn.addEventListener('click', () => {
            todo.isMarkedToday = !todo.isMarkedToday; 
            if (todo.isMarkedToday) {
                todoCard.classList.add('markedToday');
            } else {
                todoCard.classList.remove('markedToday');
            }
        });

        // Priority button todo
        const prioTodoBtn = document.createElement('button');
        prioTodoBtn.textContent = 'prio';
        prioTodoBtn.classList.add('prioTodoBtn');
        todoCard.appendChild(prioTodoBtn);
        prioTodoBtn.addEventListener('click', () => {
            todo.isMarkedPrio = !todo.isMarkedPrio;

            // Remove from current position
            const index = project.todos.findIndex(t => t.id === todo.id);
            if (index !== -1) project.todos.splice(index, 1);
        
            if (todo.isMarkedPrio) {
                project.todos.unshift(todo);
            } else {
                const prioEndIndex = project.todos.findIndex(t => !t.isMarkedPrio);
                if (prioEndIndex === -1) {
                    project.todos.push(todo);
                } else {
                    project.todos.splice(prioEndIndex, 0, todo); // Insert below last prio todo
                }
            }
        
            renderTodos(project);
        });

        // Del button todo
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

addProjectBtn.addEventListener('click', (event) => {
    dialog.showModal();
});

confirmProject.addEventListener('click', (event) => {
    event.preventDefault();
    addProject(selectProjectName.value, selectProjectDescription.value, selectProjectDate.value);
    
    const newProject = projects[projects.length - 1];
    renderProject(newProject);

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
            event.stopPropagation(); // prevent triggering the project card click event
            projectCard.remove();
            delBtn.remove();
        
            // Find index of the project to remove
            const indexToRemove = projects.findIndex(p => p.id === projectId);
            if (indexToRemove !== -1) {
                // check if this is currently selected project
                const isCurrent = currentProject && currentProject.id === projectId;

                projects.splice(indexToRemove, 1);
                if (isCurrent) {
                    if (projects.length > 0) {
                        const nextProject = projects[indexToRemove] || projects[projects.length - 1];
                        renderProject(nextProject);
                    } else { // if no projects
                        currentProject = null;
                        main.textContent = 'No projects';
                    }
                }
            }
        });
        
        projectCard.addEventListener('click', () => {
            renderProject(project);
        });
    }

    dialog.close();
    selectProjectName.value = '';
    selectProjectDescription.value = '';
    selectProjectDate.value = ''; 
    
});