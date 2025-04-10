const projectsContainer = document.querySelector('.projectsContainer');
const addProjectBtn = document.querySelector('#addProject');
const showMarkedTodayBtn = document.querySelector('#showMarkedTodayBtn');
const selectProjectName = document.querySelector('#projectName');
const selectProjectDescription = document.querySelector('#projectDescription');
const selectProjectDate = document.querySelector('#projectDate');
const confirmProject = document.querySelector('.confirmProject');
const cancelProject = document.querySelector('.cancelProject');
const main = document.querySelector('.main');

const projects = [];

confirmProject.disabled = true;
selectProjectName.addEventListener('input', () => {
    confirmProject.disabled = selectProjectName.value.trim() === '';
});

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

    // Project title and description
    const projectCardTitle = document.createElement('div');
    projectCardTitle.classList.add('projectCardTitle');
    projectCardTitle.textContent = project.title;
    main.appendChild(projectCardTitle);
    const projectCardDesc = document.createElement('div');
    projectCardDesc.classList.add('projectCardDesc');
    projectCardDesc.textContent = project.description;
    main.appendChild(projectCardDesc);

    // New Todo button
    const newTodoBtn = document.createElement('button');
    newTodoBtn.classList.add('newTodoBtn');
    newTodoBtn.textContent = 'New Todo';
    main.appendChild(newTodoBtn);

    // Show existing todos
    renderTodos(project);

    // "New Todo" button logic
    newTodoBtn.addEventListener('click', () => {
        newTodoBtn.disabled = true;

        const todoInputWrapper = document.createElement('div');
        todoInputWrapper.classList.add('todoInputWrapper');
        main.appendChild(todoInputWrapper);
        const inputTodoTitle = document.createElement('input');
        inputTodoTitle.classList.add('inputTodoTitle');
        todoInputWrapper.appendChild(inputTodoTitle);
        const inputTodoDesc = document.createElement('input');
        inputTodoDesc.classList.add('inputTodoDesc');
        inputTodoDesc.placeholder = 'Description';
        todoInputWrapper.appendChild(inputTodoDesc);

        const inputTodoConfirm = document.createElement('button');
        inputTodoConfirm.classList.add('inputTodoConfirm');
        inputTodoConfirm.textContent = 'confirm';
        todoInputWrapper.appendChild(inputTodoConfirm);

        inputTodoConfirm.addEventListener('click', (event) => {
            newTodoBtn.disabled = false;
            event.preventDefault();
            if (!currentProject) return;

            const newTodo = new Todo(inputTodoTitle.value, inputTodoDesc.value);

            const firstCheckedIndex = currentProject.todos.findIndex(t => t.isChecked); // find first checked todo
            if (firstCheckedIndex === -1) {
                currentProject.todos.push(newTodo);
            } else {
                currentProject.todos.splice(firstCheckedIndex, 0, newTodo); // insert before the first checked todo
            }

            renderTodos(currentProject);

            inputTodoTitle.remove();
            inputTodoDesc.remove();
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
        const todoCardWrapper = document.createElement('div');
        todoCard.classList.add('todoCard');
        todoCardWrapper.classList.add('todoCardWrapper');

        const todoCardTitle = document.createElement('div');
        todoCardTitle.classList.add('todoCardTitle');
        const todoCardDesc = document.createElement('div');
        todoCardDesc.classList.add('todoCardDesc');
        todoCardWrapper.appendChild(todoCardTitle)
        todoCardWrapper.appendChild(todoCardDesc)
        todoCardTitle.textContent = todo.title;
        todoCardDesc.textContent = todo.description;
        todoCard.appendChild(todoCardWrapper);

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
                todayTodoBtn.style.display = 'none';
                prioTodoBtn.style.display = 'none';
        
                project.todos.push(todo);
                } else {
                todoCard.classList.remove('isChecked');
                todayTodoBtn.style.display = '';
                prioTodoBtn.style.display = '';
    
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

        if (todo.isChecked) {
            todayTodoBtn.style.display = 'none';
            prioTodoBtn.style.display = 'none';
        } else {
            todayTodoBtn.style.display = '';
            prioTodoBtn.style.display = '';
        }

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

cancelProject.addEventListener('click', (event) => {
    dialog.close();
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
        function updateProjectCardText(projectCard) {
            projectCard.textContent = project.title;
        }
        updateProjectCardText(projectCard, projects[i]);

        // Date showing under the project name
        if (project.dueDate) {
            const dateObj = new Date(project.dueDate);
            if (!isNaN(dateObj)) {
                const formattedDate = dateObj.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
        
                const dateDiv = document.createElement('div');
                dateDiv.classList.add('dateDiv');
                dateDiv.textContent = formattedDate;
                projectCard.appendChild(dateDiv);
            }
        }
        
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
    confirmProject.disabled = true;
});

showMarkedTodayBtn.addEventListener('click', () => {
    main.textContent = '';
    const projectsMap = new Map();

    // group todos by project title
    projects.forEach(project => {
        project.todos.forEach(todo => {
            if (todo.isMarkedToday) {
                if (!projectsMap.has(project.title)) {
                    projectsMap.set(project.title, []); // create a new array if project isnt added yet
                }
                projectsMap.get(project.title).push(todo); // add the todo to the respective project
            }
        });
    });

    // if no todos marked for today, show a message
    if (projectsMap.size === 0) {
        main.textContent = 'No todos marked for today.';
        return;
    }

    const todayTodosSection = document.createElement('div');
    todayTodosSection.classList.add('todayTodosSection');
    main.appendChild(todayTodosSection);

    projectsMap.forEach((todos, projectName) => {
        
        // project name
        const projectNameDiv = document.createElement('div');
        projectNameDiv.classList.add('todayProjectName');
        projectNameDiv.textContent = projectName;
        todayTodosSection.appendChild(projectNameDiv);

        // todo cards for each todo in a project
        todos.forEach(todo => {
            const todayTodoCard = document.createElement('div');
            todayTodoCard.classList.add('todayTodoCard');

                const todoCardTitle = document.createElement('div');
                todoCardTitle.classList.add('todayTodoCardTitle');
                todoCardTitle.textContent = todo.title;
                todayTodoCard.appendChild(todoCardTitle);

                const todoCardDesc = document.createElement('div');
                todoCardDesc.classList.add('todayTodoCardDesc');
                todoCardDesc.textContent = todo.description;
                todayTodoCard.appendChild(todoCardDesc);

            // append the todo card to the project section
            todayTodosSection.appendChild(todayTodoCard);
        });
    });
});
