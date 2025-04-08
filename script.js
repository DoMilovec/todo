const container = document.querySelector('.container');
const addProjectBtn = document.querySelector('#addProject');
const selectProjectName = document.querySelector('#projectName');
const selectProjectDescription = document.querySelector('#projectDescription');
const selectProjectDate = document.querySelector('#projectDate');
const confirmProject = document.querySelector('.confirmProject');

const projects = [];
class Project {
    constructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.id = crypto.randomUUID();
    }
}
function addProject(title, description, dueDate){
    let project = new Project(title, description, dueDate);
    projects.push(project);
}

addProjectBtn.addEventListener('click', (event) => {
    dialog.showModal();
});

confirmProject.addEventListener('click', (event) => {
    event.preventDefault();
    addProject(selectProjectName.value, selectProjectDescription.value, selectProjectDate.value);
    // confirmBtn.disabled = true; // Disable confirm button initially

    // clears container on project that is added
    const displayProjects = document.querySelectorAll('.projectCard');
    displayProjects.forEach(project => project.remove());

    // loop to add and display projects
    for (let i=0 ; i<projects.length ; i++){
        const project = projects[i];
        const projectCard =  document.createElement('div');
        projectCard.classList.add('projectCard');


        container.appendChild(projectCard);
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
    }
    dialog.close();
    selectProjectName.value = '';
    selectProjectDescription.value = '';
    selectProjectDate = ''; 
    
});