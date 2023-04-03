// Tableau qui va stocker les tâches à faire.
let todoItems = [];

// La fonction renderTodo prend un objet "todo" en paramètre et affiche cet objet dans la liste HTML.
function renderTodo(todo) {
    // Sauvegarde les tâches dans le localStorage
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
    // Récupère la liste HTML
    const list = document.querySelector('.js-todo-list');
    // Récupère l'élément HTML correspondant à l'ID de la tâche.
    const item = document.querySelector(`[data-key='${todo.id}']`);

    // Si la tâche a été supprimée
    if (todo.deleted) {
        // Supprime l'élément HTML correspondant à la tâche.
        item.remove();
        // Si la liste est vide, on la vide également.
        if (todoItems.length === 0) list.innerHTML = '';
        // On sort de la fonction.
        return 
    }

    // Si la tâche a été cochée, on ajoute la classe "done" à l'élément HTML.
    const isChecked = todo.checked ? 'done': '';
    // Crée un nouvel élément HTML de type <li>.
    const node = document.createElement("li"); 
    // Définit la classe CSS de l'élément HTML.
    node.setAttribute('class', `todo-item ${isChecked}`);
    // Définit l'attribut "data-key" de l'élément HTML.
    node.setAttribute('data-key', todo.id);
    // Définit le contenu HTML de l'élément <li> avec un modèle de chaîne de caractères.
    node.innerHTML = `
        <input id="${todo.id}" type="checkbox"/>
        <label for="${todo.id}" class="tick js-tick"></label>
        <span>${todo.text}</span>
        <button class="delete-todo js-delete-todo">
        <svg><use href="#delete-icon"></use></svg>
        </button>
    `; 
    // Si l'élément HTML correspondant à la tâche existe déjà
    if (item) { 
        // On remplace l'élément existant par le nouvel élément HTML.
        list.replaceChild(node, item); 
    } else {
        // On ajoute le nouvel élément HTML à la fin de la liste.
        list.append(node);
    }
}


// Cette fonction permet d'ajouter un élément à la liste des tâches à faire
function addTodo(text) {
    // Création d'un objet représentant une tâche
    const todo = {
        text, // le texte saisi par l'utilisateur
        checked: false, // initialisé à faux car la tâche n'est pas encore terminée
        id: Date.now(), // un identifiant unique généré à partir de la date actuelle
    };

    // Ajout de la tâche à la liste des tâches à faire
    todoItems.push(todo);

    // Appel de la fonction pour afficher la tâche dans l'interface utilisateur
    renderTodo(todo);
}


/**
 * Cette fonction permet de basculer l'état "checked" d'un élément de todo.
 * @param {string} key - l'identifiant unique de l'élément à basculer.
 */
function toggleDone(key) {
    // Récupérer l'index de l'élément à partir de son ID unique
    const index = todoItems.findIndex(item => item.id === Number(key));
    
    // Inverser la valeur de la propriété "checked" de l'élément
    todoItems[index].checked = !todoItems[index].checked;
    
    // Mettre à jour l'affichage de l'élément
    renderTodo(todoItems[index]);
}


function deleteTodo(key) {
    // Recherche l'index de l'élément dans le tableau todoItems qui a l'id correspondant à la clé fournie
    const index = todoItems.findIndex(item => item.id === Number(key));

    // Crée un nouvel objet todo qui a la propriété "deleted" définie à "true" et toutes les autres propriétés copiées de l'élément à supprimer
    const todo = {
        deleted: true,
        ...todoItems[index]
    };

    // Supprime l'élément du tableau todoItems qui a l'id correspondant à la clé fournie
    todoItems = todoItems.filter(item => item.id !== Number(key));

    // Met à jour l'interface en appelant la fonction renderTodo() avec l'objet todo créé précédemment
    renderTodo(todo);
}


// Récupération du formulaire depuis le DOM
const form = document.querySelector('.js-form');

// Ajout d'un écouteur d'événement sur l'événement "submit" du formulaire
form.addEventListener('submit', event => {
    // Empêcher la soumission du formulaire et le rechargement de la page
    event.preventDefault();

    // Récupération de l'élément d'entrée du formulaire
    const input = document.querySelector('.js-todo-input');

    // Récupération du texte saisi dans l'élément d'entrée et suppression des espaces blancs en début et fin de chaîne
    const text = input.value.trim();

    // Vérification que le texte n'est pas vide
    if (text !== '') {
        // Ajout d'un nouvel élément de tâche dans la liste avec le texte saisi
        addTodo(text);

        // Réinitialisation de l'élément d'entrée et focus dessus pour permettre une nouvelle saisie
        input.value = '';
        input.focus();
    }
});


// Sélectionne la liste des tâches à faire
const list = document.querySelector('.js-todo-list');

// Ajoute un événement de clic à la liste
list.addEventListener('click', event => {

    // Vérifie si l'élément cliqué est la case à cocher (tick)
    if (event.target.classList.contains('js-tick')) {
        // Récupère la clé de l'élément parent de la case à cocher (tick)
        const itemKey = event.target.parentElement.dataset.key;
        // Bascule l'état de la case à cocher (coché/non cochée) pour l'élément correspondant dans le tableau todoItems
        toggleDone(itemKey);
    }

    // Vérifie si l'élément cliqué est le bouton de suppression
    if (event.target.classList.contains('js-delete-todo')) {
        // Récupère la clé de l'élément parent du bouton de suppression
        const itemKey = event.target.parentElement.dataset.key;
        // Supprime l'élément correspondant dans le tableau todoItems
        deleteTodo(itemKey);
    }
});


// Exécute la fonction lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {

    // Récupère les données de todoItems stockées dans localStorage
    const ref = localStorage.getItem('todoItems');

    // Si des données existent dans localStorage, les récupère et les affiche sur la page
    if (ref) {
        // Transforme les données en objet JavaScript
        todoItems = JSON.parse(ref);
        // Parcourt chaque élément de todoItems et appelle la fonction renderTodo pour l'afficher sur la page
        todoItems.forEach(element => {
            renderTodo(element);
        });
    }
});
