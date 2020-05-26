'use strict';

// ========================================= VARIABLES ========================================= //
const MAX_USERS_PER_PAGE = 10;

const users = [
    { username: 'User2', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User1', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User3', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User4', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User5', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User6', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User7', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User8', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User9', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User10', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User11', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User12', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User13', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User14', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User15', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User16', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User17', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
    { username: 'User18', email_address: 'ron@email.co.il', full_name: 'Ron Ron' },
];

let currentNumOfUsers = 0;
let editing; // Currently edited user
let page = 0;

// regex
const regex = {
    email_address: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

// Elements
const $tableData = document.querySelector('#tableData');
const $pages = document.querySelector('#pages');
const $search = document.querySelector('#search');
const $addButton = document.querySelector('#addButton');
const $addEditTitle = document.querySelector('#addEditTitle');
const $cancelEdit = document.querySelector('#cancelEdit');

const $usernameInput = document.querySelector('input[name="username"]');
const $emailInput = document.querySelector('input[name="email_address"]');
const $fullNameInput = document.querySelector('input[name="full_name"]');

const $errors = document.querySelectorAll('.error');

// ========================================= FUNCTIONS ========================================= //

/**
 * Add user row to the DOM
 * @param {Object} user object of user
 * @param {number} id id of the user for delete + edit buttons' data
 */
const addUser = (user, id) => {
    const $row = document.createElement('tr');

    Object.keys(user).forEach(key => {
        const $cell = document.createElement('td');
        $cell.appendChild(document.createTextNode(user[key]));
        $cell.classList.add('cell');
        $row.appendChild($cell);
    });

    // Delete button generate
    const $deleteImg = new Image();
    $deleteImg.src = './images/trash.svg';
    $deleteImg.alt = 'Delete';
    $deleteImg.classList.add('action');
    $deleteImg.setAttribute(`data-delete-id`, id);

    const $deleteCell =  document.createElement('td');
    $deleteCell.appendChild($deleteImg);
    $deleteCell.classList.add('cell');
    $row.appendChild($deleteCell);

    // Edit button generate
    const $editImg = new Image();
    $editImg.src = './images/pencil.svg';
    $editImg.alt = 'Edit';
    $editImg.classList.add('action');
    $editImg.setAttribute(`data-edit-id`, id);

    const $editCell =  document.createElement('td');
    $editCell.appendChild($editImg);
    $editCell.classList.add('cell');
    $row.appendChild($editCell);

    // Delete listener
    $deleteImg.addEventListener('click', function () {
        const index = +this.getAttribute('data-delete-id');
        
        const toDelete = confirm('Are you sure you want to delete this user?');
        
        if (toDelete) {
            users.splice(index ,1);
            
            this.parentNode.parentNode.remove(); // td element

            const $delete_buttons = document.querySelectorAll('img[data-delete-id]');
            const $edit_buttons = document.querySelectorAll('img[data-edit-id]');
            for (let i = index; i < $delete_buttons.length; i++) { // Update buttons indexes from the place deleted and above
                const currentId = +$delete_buttons[i].getAttribute('data-delete-id');
                $delete_buttons[i].setAttribute('data-delete-id', currentId - 1); // Delete button id
                $edit_buttons[i].setAttribute('data-edit-id', currentId - 1); // Edit button id
            }

            const newPageNumber = Math.ceil((currentNumOfUsers - 1) / MAX_USERS_PER_PAGE);

            // Check if needs to remove one page
            if(newPageNumber !== 0 && newPageNumber !== Math.ceil(currentNumOfUsers / MAX_USERS_PER_PAGE)) {
                removeLastPage();

                // Check if needs to go to previous page (as it was the last value of the page where the client is)
                if (page > 0 && newPageNumber <= page) {
                    page--;
                }
            }

            currentNumOfUsers = filterUsers($search.value);
        }
    });

    // Edit listener
    $editImg.addEventListener('click', function () {
        const index = +this.getAttribute('data-edit-id');

        $usernameInput.value = users[index].username;
        $emailInput.value = users[index].email_address;
        $fullNameInput.value = users[index].full_name;
        
        editing = index;

        // Refactor style
        $addButton.textContent = 'Edit';
        $addEditTitle.textContent = 'Edit user';
        $addButton.style.backgroundColor = '#DC3C00';
        $cancelEdit.style.display = 'block';

        // Cancel editing
        $cancelEdit.addEventListener('click', stopEdit);
    })

    // Add element to the DOM
    $tableData.appendChild($row);
};

/**
 * Show error on the DOM for 2.5 seconds
 * @param {number} id Error index in the dom
 */
const showError = (id) => {
    $errors[id].style.display = 'inline';
        
    setTimeout(() => {
        $errors[id].style.display = 'none';
    }, 2500);
}

/**
 * Filter users list on the DOM
 * @param {string} value Value to filter the list with (username based)
 * @returns {number} number of filtered found and list
 */
const filterUsers = (value) => {
    $tableData.innerHTML = '';
    
    let numFound = 0; // Num of objects match filter
    for(let i = 0; i < users.length; i++) {
        if(users[i].username.toLowerCase().startsWith(value.toLowerCase())) {
            numFound++;
            
            if(
                numFound > page * MAX_USERS_PER_PAGE &&
                numFound <= page * MAX_USERS_PER_PAGE + MAX_USERS_PER_PAGE
            ) {
                addUser(users[i], i);
            }
        }
    }

    return numFound;
};

/**
 * Switch back to "add" mode
 */
const stopEdit = () => {
        editing = null;

        // Refactor style
        $addButton.textContent = 'Add';
        $addEditTitle.textContent = 'Add user';
        $addButton.style.backgroundColor = '#0D79AB';

        $cancelEdit.style.display = 'none';

        // Empty inputs
        $usernameInput.value = '';
        $emailInput.value = '';
        $fullNameInput.value = '';

        // Remove click to cancel listener
        $cancelEdit.removeEventListener('click', stopEdit);
};

/**
 * Rebuild the pages bar
 * @param {number} numPages Number of pages to build
 */
const setPages = (numPages) => {
    $pages.innerHTML = '';

    for(let i = 0; i < numPages; i++) {
        const $page = document.createElement('button');
        $page.appendChild(document.createTextNode(i + 1));
        $page.classList.add('page');
        $pages.appendChild($page);

        $page.addEventListener('click', () => {
            if(page !== i) {
                markPage(i);
                filterUsers($search.value);
            }
        });
    }
};

/**
 * Remove the last page button in the pages container
 */
const removeLastPage = () => $pages.lastChild.remove();

const markPage = (newPage) => {
    const $pagesList = $pages.children;
    
    if($pagesList[page]) { // Checks if button still exists
        $pagesList[page].classList.remove('page--selected');
    }
    
    $pagesList[newPage].classList.add('page--selected');

    page = newPage;
};

// ========================================= INITIALIZATION ========================================= //
// Initialization of the list with the default users list
for (let i = 0; i < users.length && i < MAX_USERS_PER_PAGE; i++) {
    addUser(users[i], i);
}

currentNumOfUsers = users.length;

setPages(Math.ceil(currentNumOfUsers / MAX_USERS_PER_PAGE));

markPage(page);

// ========================================= EVENT LISTENERS ========================================= //

// Add user
$addButton.addEventListener('click', () => {
    const username = $usernameInput.value;
    const email_address = $emailInput.value;
    const full_name = $fullNameInput.value;

    let valid = true;
    
    // ---------- Validations

    // Empty username
    if (!username) {
        valid = false;
        showError(0);
    }

    // Empty email address or invalid format
    if (!email_address || !regex.email_address.test(email_address)) {
        valid = false;
        showError(1);
    }

    // Empty fullname
    if (!full_name) {
        valid = false;
        showError(2);
    }

    if (!valid) {
        return;
    }

    if(typeof editing === 'number') { // ----------------- Edit mode
        // Check if username is already taken
        users.forEach((user, index) => {
            if(index !== editing && user.username === username) {
                valid = false;
                showError(0);
            }
        });

        if (!valid) {
            return;
        }
    
        users[editing] = { username, email_address, full_name };
        filterUsers($search.value);

        stopEdit();
    } else { // ----------------- Add mode
        for (let user of users) {
            if(user.username === username) {
                valid = false;
                showError(0);
            }
        }

        if (!valid) {
            return;
        }

        // Add values to users array
        users.push({ username, email_address, full_name });

        currentNumOfUsers = filterUsers($search.value);

        // Check if a new page added
        if(users.length % MAX_USERS_PER_PAGE === 1) {
            setPages(Math.ceil(currentNumOfUsers / MAX_USERS_PER_PAGE));
        }

        // Reset form
        $usernameInput.value = '';
        $emailInput.value = '';
        $fullNameInput.value = '';
    }
});

// Search user
$search.addEventListener('input', event => {
    currentNumOfUsers = filterUsers(event.target.value);
    const numPages = Math.ceil(currentNumOfUsers / MAX_USERS_PER_PAGE);
    setPages(numPages || 1); // If no users

    markPage(0);
});