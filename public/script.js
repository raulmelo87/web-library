document.addEventListener('DOMContentLoaded', () => {
    const userTableBody = document.getElementById('userTableBody');
    const addNewBtn = document.getElementById('addNewBtn');

    // Fetch and display users
    fetchUsers();

    function fetchUsers() {
        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
                if (!Array.isArray(users)) {
                    throw new Error('Invalid response format');
                }
                userTableBody.innerHTML = '';
                users.forEach(user => {
                    const row = document.createElement('tr');
                    const hiddenPassword = '*'.repeat(user.password.length); // Substituir cada caractere da senha por asterisco
                    row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${hiddenPassword}</td>
                        <td>
                            <button class="btn btn-light btn-edit" data-id="${user._id}">Edit</button>
                            <button class="btn btn-secondary btn-delete" data-id="${user._id}">Del</button>
                        </td>
                    `;
                    userTableBody.appendChild(row);
                });

                document.querySelectorAll('.btn-edit').forEach(button => {
                    button.addEventListener('click', handleEdit);
                });

                document.querySelectorAll('.btn-delete').forEach(button => {
                    button.addEventListener('click', handleDelete);
                });
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }

    addNewBtn.addEventListener('click', () => {
        const username = prompt('Enter username:');
        const password = prompt('Enter password:');
        if (username && password) {
            fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(() => fetchUsers())
            .catch(error => {
                console.error('Error creating user:', error);
            });
        }
    });

    function handleEdit(event) {
        const id = event.target.getAttribute('data-id');
        const username = prompt('Enter new username:');
        const password = prompt('Enter new password:');
        if (username && password) {
            fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(() => fetchUsers())
            .catch(error => {
                console.error('Error updating user:', error);
            });
        }
    }

    function handleDelete(event) {
        const id = event.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`/api/users/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => fetchUsers())
            .catch(error => {
                console.error('Error deleting user:', error);
            });
        }
    }
});
