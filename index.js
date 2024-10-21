import http from 'http';
import {v4 as uuidv4} from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

let users = [];

function createUser(request, response) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        const username = JSON.parse(body).username;
        const age = JSON.parse(body).age;
        const hobbies = JSON.parse(body).hobbies;

        const newUser = { id: uuidv4(), username, age, hobbies };
        users.push(newUser);

        response.writeHead(201, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(newUser));
    });
}

function getUsers(request, response) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(users));
}


function getSingleUser(request, response) {
    const id = request.url.split('/')[2];
    const user = users.find(u => u.id === id);
    if (user) {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(user));
    } else {
        notFoundUser(response);
    }
}

function updateUser(request, response) {
    const id = request.url.split('/')[2];
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            const username = JSON.parse(body).username;
            const age = JSON.parse(body).age;
            const hobbies = JSON.parse(body).hobbies;

            users[index] = { ...users[index], username, age, hobbies };
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.end(JSON.stringify(users[index]));
        } else {
            notFoundUser(response);
        }
    });
}

function deleteUser(request, response) {
    const id = request.url.split('/')[2];
    // console.log(id);
    const index = users.findIndex(u => u.id === id);
    // console.log(index);
    if (index !== -1) {
        const deletedUser = users.splice(index, 1)[0];
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify(deletedUser));
    } else {
        notFoundUser(response);
    }
}

function notFoundUser(response) {
    response.writeHead(404, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({message: 'Not Found'}));
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/users') {
        createUser(req, res);
    } else if (req.method === 'GET' && req.url === '/users') {
        getUsers(req, res);
    } else if (req.method === 'GET' && req.url.startsWith('/users/')) {
        getSingleUser(req, res);
    } else if (req.method === 'PUT' && req.url.startsWith('/users/')) {
        updateUser(req, res);
    } else if (req.method === 'DELETE' && req.url.startsWith('/users/')) {
        deleteUser(req, res);
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Not Found'}));
    }
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});