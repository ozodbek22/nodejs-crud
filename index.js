import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// In-memory database
let users = [];

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/users') {
        // Create a new user
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { name, email } = JSON.parse(body);
            const newUser = { id: uuidv4(), name, email };
            users.push(newUser);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        });
    } else if (req.method === 'GET' && req.url === '/users') {
        // Read all users
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } else if (req.method === 'GET' && req.url.startsWith('/users/')) {
        // Read a specific user
        const id = req.url.split('/')[2];
        const user = users.find(u => u.id === id);
        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    } else if (req.method === 'PUT' && req.url.startsWith('/users/')) {
        // Update a user
        const id = req.url.split('/')[2];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                const { name, email } = JSON.parse(body);
                users[index] = { ...users[index], name, email };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(users[index]));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        });
    } else if (req.method === 'DELETE' && req.url.startsWith('/users/')) {
        // Delete a user
        const id = req.url.split('/')[2];
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            const deletedUser = users.splice(index, 1)[0];
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deletedUser));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});