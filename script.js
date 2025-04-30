const projectsContainer = document.querySelector('.projectsContainer');
const addProjectBtn = document.querySelector('#addProject');
const showMarkedTodayBtn = document.querySelector('#showMarkedTodayBtn');
const selectProjectName = document.querySelector('#projectName');
const selectProjectDescription = document.querySelector('#projectDescription');
const selectProjectDate = document.querySelector('#projectDate');
const confirmProject = document.querySelector('.confirmProject');
const cancelProject = document.querySelector('.cancelProject');
const main = document.querySelector('.main');
const signUpBtnHeader = document.querySelector('#signUpBtnHeader');
const signUpForm = document.querySelector('.signUpForm');
const signUpBtn = document.querySelector('.signUpBtn');
const loggedOut = document.querySelector('.loggedOut');
const loggedIn = document.querySelector('.loggedIn');
const sidebar = document.querySelector('.sidebar');

const projects = [];

// Create the welcome container dynamically
const welcomeContainer = document.createElement('div');
welcomeContainer.className = 'welcome-container';

// Create the heading (Welcome to Today)
const welcomeHeading = document.createElement('h1');
welcomeHeading.textContent = 'Welcome to Today';

// Create the subheading (Your simple, fast, and fun task planner)
const welcomeSubheading = document.createElement('p');
welcomeSubheading.textContent = 'Your simple, fast, and fun task planner.';

// Create the motivational line (Make today count)
const motivationText = document.createElement('p');
motivationText.className = 'motivation';
motivationText.textContent = 'Make today count.';

// guide to create first project
const startNow = document.createElement('p');
startNow.className = 'startNow';
startNow.textContent = 'Start by adding your first project.';
// mobile version of guidance
const startNowMobile = document.createElement('p');
startNowMobile.className = 'startNowMobile';
startNowMobile.textContent = 'Add and track your projects.';

const arrow = document.createElement('div');
arrow.innerHTML = `
<svg fill="#000000" width="4rem" height="4rem" viewBox="0 0 24 24" id="curve-arrow-up-3" data-name="Line Color" xmlns="http://www.w3.org/2000/svg" class="icon line-color"><path id="secondary" d="M16,9,11.78,3.39a1,1,0,0,0-1.56,0L6,9" style="fill: none; stroke: #ffac12; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path><path id="primary" d="M16,15H13c0,4.27,5,6,5,6-4.21,0-9-1.07-9-6H6l5-6.76Z" style="fill: none; stroke: #3d3d3d; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path></svg>
`
arrow.classList.add('arrow-icon');

// Append the elements to the welcome container
welcomeContainer.appendChild(welcomeHeading);
welcomeContainer.appendChild(welcomeSubheading);
welcomeContainer.appendChild(motivationText);

setTimeout(() => {
    welcomeContainer.appendChild(startNow);
}, 3500);

setTimeout(() => {
    welcomeContainer.appendChild(arrow);
    welcomeContainer.appendChild(startNowMobile);
}, 1500);

// Append the welcome container to the body (or to a specific parent element)
main.appendChild(welcomeContainer);

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
        this.done = false;
    }
}
function addTodo(title, description){
    let todo = new Todo(title, description);
    todos.push(todo);
}

function updateProgress(project) {
    const doneCount = project.todos.filter(todo => todo.isChecked).length;
    const totalCount = project.todos.length;
    const percentage = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

    const circle = document.querySelector('.circle');
    const text = document.querySelector('.percentage-label');

    const offset = 100 - percentage; // reverse fill
    circle.style.strokeDashoffset = offset;

    if (percentage === 100) {
        text.textContent = `Project complete!`;
    } else {
        text.textContent = `Progress: ${doneCount} / ${totalCount}`;
    }
    
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
    const projectDueDate = document.createElement('div');
    projectDueDate.classList.add('projectCardDesc');

    if (project.dueDate) {
        const dateObjMain = new Date(project.dueDate);
        if (!isNaN(dateObjMain)) {
            const formattedDateMain = dateObjMain.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
    
            const dateDivMain = document.createElement('div');
            dateDivMain.classList.add('dateDivMain');
            dateDivMain.textContent = 'Due date: ' + formattedDateMain;
            main.appendChild(dateDivMain);
        }
    }

    // new todo button and progress bar wrapper
    const mainCirclesWrapper = document.createElement('div');
    mainCirclesWrapper.classList.add('mainCirclesWrapper');
    main.appendChild(mainCirclesWrapper);

    // new Todo button
    const newTodoBtn = document.createElement('button');
    newTodoBtn.classList.add('newTodoBtn');
    newTodoBtn.textContent = 'Add Task';
    mainCirclesWrapper.appendChild(newTodoBtn);

    // progress bar
    const progressWrapper = document.createElement('div');
    progressWrapper.classList.add('progressWrapper');
    
    const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    progressCircle.setAttribute("viewBox", "0 0 36 36");
    progressCircle.classList.add('circular-progress');
    
    const circleBg = document.createElementNS("http://www.w3.org/2000/svg", "path");
    circleBg.setAttribute("class", "circle-bg");
    circleBg.setAttribute("d", "M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831");
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "path");
    circle.setAttribute("class", "circle");
    circle.setAttribute("d", "M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831");
    
    const progressText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    progressText.setAttribute("x", "18");
    progressText.setAttribute("y", "20.5");
    progressText.setAttribute("text-anchor", "middle");
    progressText.setAttribute("alignment-baseline", "middle"); // center it
    progressText.setAttribute("class", "percentage-label");
    progressText.textContent = "Progress: 0%";
    
    progressCircle.appendChild(circleBg);
    progressCircle.appendChild(circle);
    progressCircle.appendChild(progressText);
    progressWrapper.appendChild(progressCircle);
    mainCirclesWrapper.appendChild(progressWrapper);
    

    // Save reference for updates
    project._progressElements = {
        circle,
        text: progressText
    };

    // Show existing todos
    renderTodos(project);

    // "New Todo" button logic
    newTodoBtn.addEventListener('click', () => {
        newTodoBtn.disabled = true;

        const todoInputWrapper = document.createElement('div');
        todoInputWrapper.classList.add('todoInputWrapper');
        main.appendChild(todoInputWrapper);
        
        const todoInputButtons = document.createElement('div');
        todoInputButtons.classList.add('todoInputButtons');
        
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
        todoInputButtons.appendChild(inputTodoConfirm);

        const inputTodoCancel = document.createElement('button');
        inputTodoCancel.classList.add('inputTodoCancel');
        inputTodoCancel.textContent = 'cancel';
        todoInputButtons.appendChild(inputTodoCancel);

        todoInputWrapper.appendChild(todoInputButtons);

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

            todoInputWrapper.remove();
        });

        inputTodoCancel.addEventListener('click', (event) => {
            newTodoBtn.disabled = false;
            todoInputWrapper.remove();
        })

        // scroll vertically by offset and focus title
        inputTodoTitle.focus();

        const confirmRect = inputTodoConfirm.getBoundingClientRect();
        const padding = 20;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // scroll page if new task inputs are off screen vertically
        if (confirmRect.bottom > viewportHeight - padding || confirmRect.top < 0) {
          const scrollY = window.scrollY + confirmRect.top - viewportHeight / 2 + confirmRect.height;
          window.scrollTo({ top: scrollY, behavior: 'smooth' });
        }

    });
}

function renderTodos(project) {
    const todosContainer = document.createElement('div');
    todosContainer.classList.add('todosContainer');
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

        // make title and decription editable on click
        // title
        todoCardTitle.addEventListener('click', () => {
            setTimeout(() => {
                todoCardTitle.setAttribute('contenteditable', 'true');
                todoCardTitle.focus();
            }, 0);
          });
        todoCardTitle.addEventListener('blur', () => {
            todo.title = todoCardTitle.textContent.trim(); 
            todoCardTitle.removeAttribute('contenteditable');
          });
        todoCardTitle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            todo.title = todoCardTitle.textContent.trim();
            todoCardTitle.removeAttribute('contenteditable');
            todoCardTitle.blur();
        }
        });
        // desc
        todoCardDesc.addEventListener('click', () => {
            setTimeout(() => {
                todoCardDesc.setAttribute('contenteditable', 'true');
                todoCardDesc.focus();
            }, 0);
          });
          todoCardDesc.addEventListener('blur', () => {
            todo.description = todoCardDesc.textContent.trim(); 
            todoCardDesc.removeAttribute('contenteditable');
          });
          todoCardDesc.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            todo.description = todoCardDesc.textContent.trim();
            todoCardDesc.removeAttribute('contenteditable');
            todoCardDesc.blur();
        }
        });

        if (todo.isMarkedToday) {
            todoCard.classList.add('markedToday');
        }

        if (todo.isMarkedPrio) {
            todoCard.classList.add('markedPrio');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('todoCheckbox');
        checkbox.id = 'cbtest-19';
        const checkboxId = `cb-${todo.id}`;
        checkbox.id = checkboxId;
        if (todo.isChecked){
            checkbox.checked = true;
            todoCard.classList.add('isChecked');
            todoCard.classList.remove('markedToday');
            todoCard.classList.remove('markedPrio');
        }
        checkbox.addEventListener('change', () => {
            todo.isChecked = checkbox.checked;
            todo.done = true;

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
                todo.done = false;
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
        
            setTimeout(() => {
                renderTodos(project); // re-render to shift or unshift after change
            }, 0);

        })
        
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('checkbox-wrapper-19');
        
        const checkboxLabel = document.createElement('label');
        checkboxLabel.classList.add('check-box');
        checkboxLabel.setAttribute('for', checkboxId); // ✅ matches unique ID
        
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(checkboxLabel);
        todoCard.appendChild(checkboxWrapper);

        const todoButtonsDiv = document.createElement('div');
        todoButtonsDiv.classList.add('todoButtonsDiv');

        // Today button todo
        const todayTodoBtn = document.createElement('button');
        todayTodoBtn.textContent = 'to do today';
        todayTodoBtn.classList.add('todayTodoBtn');
        todoButtonsDiv.appendChild(todayTodoBtn);
        todayTodoBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                todoButtonsDiv.style.display = 'none';
                buttonsShown = false;
                }
                
            todo.isMarkedToday = !todo.isMarkedToday; 
            if (todo.isMarkedToday) {
                todoCard.classList.add('markedToday');
            } else {
                todoCard.classList.remove('markedToday');
            }
        });

        // Priority button todo
        const prioTodoBtn = document.createElement('button');
        prioTodoBtn.textContent = '🏴 priority';
        prioTodoBtn.classList.add('prioTodoBtn');
        todoButtonsDiv.appendChild(prioTodoBtn);
        prioTodoBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
            todoButtonsDiv.style.display = 'none';
            buttonsShown = false;
            }

            todo.isMarkedPrio = !todo.isMarkedPrio;

            // Add 'moving' class to trigger the transition
            todoCard.classList.add('moving');

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
        
        // add little delay with adding moving class when selecting prio
        setTimeout(() => {
            renderTodos(project);
            todoCard.classList.remove('moving');
        }, 500);
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
        todoButtonsDiv.appendChild(delTodoBtn);
        delTodoBtn.addEventListener('click', () => {
            const index = project.todos.findIndex(t => t.id === todo.id);
            if (index !== -1) project.todos.splice(index, 1);
            todoCard.remove();
            renderTodos(currentProject);
        });

        // 3 dots to toggle buttons on mobile
        if (window.innerWidth <= 768) {
            todoButtonsDiv.style.display = 'none';
            const showTodoButtons = document.createElement('button');
            showTodoButtons.classList.add('showTodoButtons');
            const span1 = document.createElement('span');
            const span2 = document.createElement('span');
            const span3 = document.createElement('span');
            showTodoButtons.appendChild(span1);
            showTodoButtons.appendChild(span2);
            showTodoButtons.appendChild(span3);
            todoCard.appendChild(showTodoButtons);

            let buttonsShown = false;
            showTodoButtons.addEventListener('click', (event) => {
                if (!buttonsShown) {
                    todoButtonsDiv.style.display = '';
                    requestAnimationFrame(() => { 
                      todoButtonsDiv.classList.add('show');
                    });
                    buttonsShown = true;
                } else if (buttonsShown) {
                    todoButtonsDiv.classList.remove('show');
                    setTimeout(() => {
                      todoButtonsDiv.style.display = 'none';
                    }, 300);
                    buttonsShown = false;
                }
            })
          }

        todoCard.appendChild(todoButtonsDiv);
        todosContainer.appendChild(todoCard);
        });
        updateProgress(project);
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
    const reRenderProjects = () => { 
        
        // clears projectsContainer each time new project is added and to re-render all
        const displayProjects = document.querySelectorAll('.projectCard');
        displayProjects.forEach(project => project.remove());
        
        for (let i=0 ; i<projects.length ; i++){
        const project = projects[i];
        const projectCard =  document.createElement('button');
        projectCard.classList.add('projectCard');
        const projectButtons = document.createElement('div');
        projectButtons.classList.add('projectButtons');
        


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


        const editProjectBtn = document.createElement('button');
        editProjectBtn.textContent = '';
        editProjectBtn.style.backgroundImage = 'url("img/edit.png")';
        editProjectBtn.style.backgroundRepeat = 'no-repeat';
        editProjectBtn.style.backgroundPosition = 'center';
        editProjectBtn.style.backgroundSize = 'contain';
        editProjectBtn.style.width = '30px';
        editProjectBtn.style.height = '30px';
        editProjectBtn.style.border = 'none';
        editProjectBtn.style.backgroundColor = 'transparent';
        editProjectBtn.classList.add('editProjectBtn');
        projectButtons.appendChild(editProjectBtn);

        editProjectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
        
            const modal = document.getElementById('editProjectModal');
            const titleInput = document.getElementById('editProjectTitle');
            const descriptionInput = document.getElementById('editProjectDescription');
            const saveProjectBtn = document.getElementById('saveProjectBtn');
            const cancelEditBtn = document.getElementById('cancelEditBtn');
            const dateInput = document.getElementById('editProjectDate');

            // format date
            if (project.dueDate) {
                const formattedDate = new Date(project.dueDate).toISOString().split('T')[0];
                dateInput.value = formattedDate;
              } else {
                dateInput.value = '';
              }

            // set current project values
            titleInput.value = project.title;
            descriptionInput.value = project.description;
        
            const newSaveBtn = saveProjectBtn.cloneNode(true);
            newSaveBtn.classList.add('newSaveBtn');
            saveProjectBtn.parentNode.replaceChild(newSaveBtn, saveProjectBtn);
        
            // save edit button
            newSaveBtn.addEventListener('click', () => {
                project.title = titleInput.value.trim();
                project.description = descriptionInput.value.trim();
                const selectedDate = dateInput.value;
                project.dueDate = selectedDate ? new Date(selectedDate).toISOString() : null;
            
                renderProject(project);
                currentProject = project;
                reRenderProjects();
            
                const allProjectCards = document.querySelectorAll('.projectCard');
                allProjectCards.forEach(card => {
                    card.classList.remove('projectSelected');
                });
            
                // re-add selected class to the updated project card
                const updatedCard = Array.from(allProjectCards).find(card =>
                    card.textContent.includes(project.title)
                );
                if (updatedCard) updatedCard.classList.add('projectSelected');
            
                modal.close();
            });

            const newCancelBtn = cancelEditBtn.cloneNode(true);
            newCancelBtn.classList.add('newCancelBtn');
            cancelEditBtn.parentNode.replaceChild(newCancelBtn, cancelEditBtn);
            newCancelBtn.addEventListener('click', () => {
                modal.close();
            });
        
            modal.showModal();
        });
       
        
        // Move Up Button
        const moveUpBtn = document.createElement('button');
        moveUpBtn.textContent = '';
        moveUpBtn.style.backgroundImage = 'url("img/arrowup.png")';
        moveUpBtn.style.backgroundRepeat = 'no-repeat';
        moveUpBtn.style.backgroundPosition = 'center';
        moveUpBtn.style.backgroundSize = 'contain';
        moveUpBtn.style.width = '30px';
        moveUpBtn.style.height = '30px';
        moveUpBtn.style.border = 'none';
        moveUpBtn.style.backgroundColor = 'transparent';
        moveUpBtn.classList.add('moveUpBtn');
        projectButtons.appendChild(moveUpBtn);

        moveUpBtn.disabled = i === 0;
        moveUpBtn.onclick = () => {
            [projects[i - 1], projects[i]] = [projects[i], projects[i - 1]];
            reRenderProjects();
        }
        // ⬇️ Move Down Button
        const moveDownBtn = document.createElement('button');
        moveDownBtn.textContent = '';
        moveDownBtn.style.backgroundImage = 'url("img/arrowdown.png")';
        moveDownBtn.style.backgroundRepeat = 'no-repeat';
        moveDownBtn.style.backgroundPosition = 'center';
        moveDownBtn.style.backgroundSize = 'contain';
        moveDownBtn.style.width = '30px';
        moveDownBtn.style.height = '30px';
        moveDownBtn.style.border = 'none';
        moveDownBtn.style.backgroundColor = 'transparent';
        moveDownBtn.classList.add('moveDownBtn');
        projectButtons.appendChild(moveDownBtn);

        moveDownBtn.disabled = i === projects.length - 1;
        moveDownBtn.onclick = () => {
            [projects[i], projects[i + 1]] = [projects[i + 1], projects[i]];
            reRenderProjects();
        }
        projectCard.appendChild(projectButtons);
        projectCard.addEventListener('click', () => {
            renderProject(project);
            const previouslySelected = document.querySelector('.projectSelected');
            if (previouslySelected && previouslySelected !== projectCard) {
                previouslySelected.classList.remove('projectSelected');
            }
        
            // add class to currently clicked card
            if (!projectCard.classList.contains('projectSelected')) {
                projectCard.classList.add('projectSelected');
            }
            sidebarToggleBtn.classList.toggle('active');
            sidebarToggleBtnInner.classList.toggle('active');
            toggleSidebar();
        });

        // delete button and logic to remove specific project
        const delBtn = document.createElement('button');
        delBtn.textContent = '';
        delBtn.textContent = '';
        delBtn.style.backgroundImage = 'url("img/delete.png")';
        delBtn.style.backgroundRepeat = 'no-repeat';
        delBtn.style.backgroundPosition = 'center';
        delBtn.style.backgroundSize = 'contain';
        delBtn.style.width = '30px';
        delBtn.style.height = '30px';
        delBtn.style.border = 'none';
        delBtn.style.backgroundColor = 'transparent';
        delBtn.classList.add('delBtn');
        projectButtons.appendChild(delBtn);
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
                        main.textContent = '';
                        const noProjectsText = document.createElement('div');
                        noProjectsText.classList.add('noProjectsText');
                        noProjectsText.textContent = 'You have no active projects.';
                        main.appendChild(noProjectsText);
                    }
                }
            }
        });
        
    // remove 'projectSelected' from all cards
    document.querySelectorAll('.projectCard.projectSelected').forEach(card => {
        card.classList.remove('projectSelected');
    });
    // add the class to newly created project
    projectCard.classList.add('projectSelected');

    }}
    
    reRenderProjects();
    dialog.close();
    selectProjectName.value = '';
    selectProjectDescription.value = '';
    selectProjectDate.value = ''; 
    confirmProject.disabled = true;
});

showMarkedTodayBtn.addEventListener('click', () => {
    main.textContent = '';
    const projectsMap = new Map();

    sidebarToggleBtn.classList.toggle('active');
    sidebarToggleBtnInner.classList.toggle('active');
    toggleSidebar();

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
        const noTasksText = document.createElement('div');
        noTasksText.classList.add('noTasksText');
        noTasksText.textContent = 'No tasks marked for today.';
        main.appendChild(noTasksText);
        return;
    }

    const todayTodosSection = document.createElement('div');
    todayTodosSection.classList.add('todayTodosSection');
    main.appendChild(todayTodosSection);

    const todayTodosSectionTitle = document.createElement('div');
    todayTodosSectionTitle.classList.add('todayTodosSectionTitle');
    todayTodosSectionTitle.textContent = "Today's tasks:"
    todayTodosSection.appendChild(todayTodosSectionTitle);

    projectsMap.forEach((todos, projectName) => {
        
        // project name
        const projectNameDiv = document.createElement('div');
        projectNameDiv.classList.add('todayProjectNameUpper');
        projectNameDiv.textContent = projectName;
        todayTodosSection.appendChild(projectNameDiv);

        // todo cards for each todo in a project
        todos.forEach(todo => {
            const todayTodoCard = document.createElement('div');
            todayTodoCard.classList.add('todayTodoCard');

            const projectNameDiv = document.createElement('div');
            projectNameDiv.classList.add('todayProjectName');
            
            // project title
            const titleDiv = document.createElement('div');
            titleDiv.textContent = todo.title;
            projectNameDiv.appendChild(titleDiv);
            
            // open that project button
            const openProjectBtn = document.createElement('button');
            openProjectBtn.textContent = '🔍 Open Project';
            openProjectBtn.classList.add('openProjectBtn');
            openProjectBtn.addEventListener('click', () => {
                const projectToOpen = projects.find(p => p.title === projectName);
                if (projectToOpen) {
                    renderProject(projectToOpen);
                }
            });
            projectNameDiv.appendChild(openProjectBtn);
            
            todayTodosSection.appendChild(projectNameDiv);

                const todoCardDesc = document.createElement('div');
                todoCardDesc.classList.add('todayTodoCardDesc');
                todoCardDesc.textContent = todo.description;
                todayTodoCard.appendChild(todoCardDesc);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('todoCheckbox');
                checkbox.checked = todo.isChecked;
                todayTodoCard.appendChild(checkbox);

                checkbox.addEventListener('change', () => {
                    todo.isChecked = checkbox.checked;

                    // remove from its current place in the project
                    const project = projects.find(p => p.todos.some(t => t.id === todo.id));
                    const index = project.todos.findIndex(t => t.id === todo.id);
                    if (index !== -1) {
                        project.todos.splice(index, 1);
                    }

                    if (todo.isChecked) {
                        todo._wasPrio = todo.isMarkedPrio;
                        todo.isMarkedPrio = false;
                        todo.isMarkedToday = false;
                        project.todos.push(todo);
                    } else {
                        if (todo._wasPrio) {
                            todo.isMarkedPrio = true;
                            project.todos.unshift(todo);
                        } else {
                            const prioEndIndex = project.todos.findIndex(t => !t.isMarkedPrio);
                            if (prioEndIndex === -1) {
                                project.todos.push(todo);
                            } else {
                                project.todos.splice(prioEndIndex, 0, todo);
                            }
                        }
                        delete todo._wasPrio;
                    }

                    if (currentProject && currentProject.id === project.id) {
                        renderProject(currentProject);
                    }

                    showMarkedTodayBtn.click(); // refresh today view
                    sidebarToggleBtn.classList.toggle('active');
                    sidebarToggleBtnInner.classList.toggle('active');
                    toggleSidebar();
                });
            // append the todo card to the project section
            todayTodosSection.appendChild(todayTodoCard);
        });
    });
});

const todayDate = new Date();

const formattedTodayDate = todayDate.toLocaleDateString('en-GB', {
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});
document.getElementById('todayDate').textContent = formattedTodayDate;

function openModal() {
    document.getElementById("signUpModal").style.display = "flex";
  }
  
  function closeModal() {
    document.getElementById("signUpModal").style.display = "none";
  }
  
  function validatePasswords(event) {
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const pw1 = document.getElementById("password");
    const pw2 = document.getElementById("confirmPassword");

        // Clear old validity messages
    username.setCustomValidity('');
    pw2.setCustomValidity('');
  
    // Clear previous custom messages
    username.setCustomValidity('');
    pw2.setCustomValidity('');
  
    // Username check
    if (username.value.length < 4) {
      username.setCustomValidity("Username must be at least 4 characters long.");
      username.reportValidity();
      event.preventDefault();
      return false;
    }
  
    // ✅ validations passed, show user icon and name
    const userInfoWrapper = document.createElement('div');
    userInfoWrapper.classList.add('userInfoWrapper');

    const userDisplayName = document.createElement('div');
    userDisplayName.classList.add('userDisplayName');
    userInfoWrapper.appendChild(userDisplayName);
    userDisplayName.textContent = username.value;

    const userDisplayEmail = document.createElement('div');
    userDisplayEmail.classList.add('userDisplayEmail');
    userInfoWrapper.appendChild(userDisplayEmail);
    userDisplayEmail.textContent = email.value;
    
    const userDisplayAvatar = document.createElement('img');
    userDisplayAvatar.classList.add('userDisplayAvatar');
    userDisplayAvatar.src = 'img/avatar.png';
    loggedIn.appendChild(userInfoWrapper);
    loggedIn.appendChild(userDisplayAvatar);

    event.preventDefault(); // Prevent default form submission
    closeModal();

    loggedOut.style.display = 'none';
    loggedIn.style.display = 'flex';

    userDisplayAvatar.addEventListener('click', (event) => {
        let existingMenu = document.getElementById('dropdownMenu');

        if (existingMenu) {
          existingMenu.remove(); // Toggle off
          return;
        }
      
        const dropdownMenu = document.createElement('div');
        dropdownMenu.id = 'dropdownMenu';
        dropdownMenu.className = 'dropdown-menu';
      
        const profileBtn = document.createElement('button');
        profileBtn.textContent = '👤 Profile';
      
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '⚙️ Settings';
      
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = '🚪 Logout';
      
        dropdownMenu.append(profileBtn, settingsBtn, logoutBtn);
      
        userDisplayAvatar.parentElement.appendChild(dropdownMenu);
    })    

    // close dropdown on click elsewhere
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('dropdownMenu');
        const avatar = document.getElementById('userDisplayAvatar');
        if (dropdown && !avatar.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.remove();
        }
      });
    
  }
  

signUpBtnHeader.addEventListener('click', (event) => {
    openModal();
})

// sidebar toggling button and logic
const sidebarToggleBtn = document.querySelector('.sidebarToggle');
const sidebarToggleBtnInner = document.querySelector('.sidebarToggleInner');

sidebarToggleBtn.addEventListener('click', () => {
    sidebarToggleBtn.classList.toggle('active');
    sidebarToggleBtnInner.classList.toggle('active');
  });

sidebarToggleBtnInner.addEventListener('click', () => {
    sidebarToggleBtn.classList.toggle('active');
    sidebarToggleBtnInner.classList.toggle('active');
});


// When clicking either toggle
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

sidebarToggleBtn.addEventListener('click', toggleSidebar);
sidebarToggleBtnInner.addEventListener('click', toggleSidebar);

// if sidebar is active close it by clicking on right non sidebar part
document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && !sidebarToggleBtn.contains(e.target)) {
            sidebarToggleBtn.classList.toggle('active');
            sidebarToggleBtnInner.classList.toggle('active');
            toggleSidebar();
        }
    }
});