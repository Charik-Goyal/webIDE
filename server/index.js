const http = require('http');
const express = require('express');
const {Server: SocketServer} = require('socket.io');
const fs = require('fs/promises')
const path = require('path');
const cors = require('cors');
const pty = require('node-pty');
const chokidar = require('chokidar');

var ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user',
    env: process.env
  });


const app = express();
const server = http.createServer(app);
const io = new SocketServer({
    cors: '*'
});
io.attach(server);

app.use(cors())

chokidar.watch('.').on('./user', (event, path) => {
    io.emit('file:refresh', path)
  });

ptyProcess.onData((data) => {
    io.emit('terminal:data', data);
  });

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('terminal:write', (data) => {
        ptyProcess.write(data);
    })
})

app.get('/files', async (req, res) => {
    const fileTree = await generateFileTree('./user');
    return res.json({tree: fileTree});
})
server.listen(9000, () => {
    console.log(`🐳 Docker server running on port 9000`);
})

async function generateFileTree(directory){
    const tree = {};

    async function buildTree(currentDir, currentTree) {
        const files = await fs.readdir(currentDir);
        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                currentTree[file] = {}
                await buildTree(filePath, currentTree[file]);
            } else {
                currentTree[file] = null;
            }
        }
    }
    await buildTree(directory, tree)
    return tree;
}