'use strict';

let numUsers = 0;
const users = [
    { username: 'Ronro1', email_address: 'ron@rapitec.co.il', full_name: 'Ron Rofe' },
    { username: 'Ronro2', email_address: 'ron@rapitec.co.il', full_name: 'Ron Rofe' },
    { username: 'Ronro3', email_address: 'ron@rapitec.co.il', full_name: 'Ron Rofe' },
    { username: 'Ronro4', email_address: 'ron@rapitec.co.il', full_name: 'Ron Rofe' },
];
let editing; // Currently edited user

// Elements
const $tableData = document.querySelector('#tableData');
const $search = document.querySelector('#search');

const $usernameInput = document.querySelector('input[name="username"]');
const $emailInput = document.querySelector('input[name="email_address"]');
const $fullNameInput = document.querySelector('input[name="full_name"]');

const $errors = document.querySelectorAll('.error');

// regex
const regex = {
    email_address: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

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
            numUsers--;
            
            this.parentNode.parentNode.remove(); // td element

            const $delete_buttons = document.querySelectorAll('img[data-delete-id]');
            const $edit_buttons = document.querySelectorAll('img[data-edit-id]');
            for (let i = index; i < $delete_buttons.length; i++) { // Update buttons indexes from the place deleted and above
                const currentId = +$delete_buttons[i].getAttribute('data-delete-id');
                $delete_buttons[i].setAttribute('data-delete-id', currentId - 1); // Delete button id
                $edit_buttons[i].setAttribute('data-edit-id', currentId - 1); // Edit button id
            }
        }
    });

    // Edit listener
    $editImg.addEventListener('click', function () {
        const index = +this.getAttribute('data-edit-id');

        $usernameInput.value = users[index].username;
        $emailInput.value = users[index].email_address;
        $fullNameInput.value = users[index].full_name;
        
        editing = index;
    })

    // Add element to the DOM
    $tableData.appendChild($row);
};

const showError = (id) => {
    $errors[id].style.display = 'inline';
        
    setTimeout(() => {
        $errors[id].style.display = 'none';
    }, 2500);
}

const filterUsers = (value) => {
    $tableData.innerHTML = '';

    users.forEach((user, index) => {
        if(user.username.toLowerCase().startsWith(value.toLowerCase())) {
            addUser(user, index);
        }
    });
};

// Insert default users
for (let user of users) {
    addUser(user, numUsers++);
}

// Add user
document.querySelector('#addButton').addEventListener('click', () => {
    const username = $usernameInput.value;
    const email_address = $emailInput.value;
    const full_name = $fullNameInput.value;

    let valid = true;
    
    // Validations
    if (!username) {
        valid = false;
        showError(0);
    }

    if (!email_address || !regex.email_address.test(email_address)) {
        valid = false;
        showError(1);
    }

    if (!full_name) {
        valid = false;
        showError(2);
    }

    if (!valid) {
        return;
    }

    // Edit mode
    if(editing) {
        users[editing] = { username, email_address, full_name };
        filterUsers($search.value);

        editing = null;
        return;
    }

    // Add values to users array
    addUser({ username, email_address, full_name }, numUsers);
    users.push({ username, email_address, full_name });
    
    // Reset form
    $usernameInput.value = '';
    $emailInput.value = '';
    $fullNameInput.value = '';

    filterUsers($search.value);
});

// Search user
$search.addEventListener('input', event => filterUsers(event.target.value));