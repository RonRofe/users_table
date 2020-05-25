const users = [];

// Elements
const $usernameInput = document.querySelector('input[name="username"]');
const $emailInput = document.querySelector('input[name="email_address"]');
const $fullNameInput = document.querySelector('input[name="full_name"]');

const addUser = (user) => {
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
    $deleteImg.setAttribute(`data-delete`, users.length);

    const $deleteCell =  document.createElement('td');
    $deleteCell.appendChild($deleteImg);
    $deleteCell.classList.add('cell');
    $row.appendChild($deleteCell);

    // Edit button generate
    const $editImg = new Image();
    $editImg.src = './images/pencil.svg';
    $editImg.alt = 'Edit';
    $editImg.classList.add('action');
    $editImg.setAttribute(`data-edit`, users.length);

    const $editCell =  document.createElement('td');
    $editCell.appendChild($editImg);
    $editCell.classList.add('cell');
    $row.appendChild($editCell);

    // Delete listener
    $deleteImg.addEventListener('click', function () {
        const index = +this.getAttribute('data-delete');
        
        const toDelete = confirm('Are you sure you want to delete this user?');
        
        if (toDelete) {
            users.splice(index ,1);
            document.querySelectorAll('tr')[index+1].remove();

            const $new_delete_buttons = document.querySelectorAll('img[data-delete]');
            for(let i = index; i < $new_delete_buttons.length; i++) { // Update buttons indexes from the place deleted and above
                $new_delete_buttons[i].setAttribute('data-delete', i);
                $new_delete_buttons[i].setAttribute('data-edit', i);
            }
        }
    });

    // Edit listener
    $editImg.addEventListener('click', function () {
        console.log(this.getAttribute('data-edit'));
    })

    // Add element to the DOM
    document.querySelector('#tableData').appendChild($row);

    // Add user to array of users
    users.push(user);
};

const defaultUsers = [
    { username: 'Ronro1', email_address: 'ron@rapitec.co.il', full_name: 'Ron Rofe' },
    { username: 'Ronro2', email_address: 'ron@rapitec.co.il', full_name: 'Ron Rofe' },
    { username: 'Ronro3', email_address: 'ron@rapitec.co.il', full_name: 'Ron Rofe' },
    { username: 'Ronro4', email_address: 'ron@rapitec.co.il', full_name: 'Ron Rofe' },
];

for (user of defaultUsers) {
    addUser(user);
}

document.querySelector('#addButton').addEventListener('click', () => {
    // Add values to users array
    addUser({
        username: $usernameInput.value,
        email_address: $emailInput.value,
        full_name: $fullNameInput.value,
    });
    
    // Reset form
    $usernameInput.value = '';
    $emailInput.value = '';
    $fullNameInput.value = '';
});