const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Armazenamento em memória: cada lista tem itens e quem está "vendo" ela agora
// listas[codigo] = { itens: [{id, nome, pego, pegoPor}], usuarios: { socketId: nome } }
const listas = {};

function gerarCodigo() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function estadoPublico(codigo) {
  const lista = listas[codigo];
  if (!lista) return null;
  return {
    codigo,
    itens: lista.itens,
    usuarios: Object.values(lista.usuarios)
  };
}

io.on('connection', (socket) => {
  let listaAtual = null;
  let nomeUsuario = null;

  socket.on('criar-lista', (nome, callback) => {
    const codigo = gerarCodigo();
    listas[codigo] = { itens: [], usuarios: {} };
    callback({ codigo });
  });

  socket.on('entrar-lista', ({ codigo, nome }, callback) => {
    codigo = (codigo || '').toUpperCase().trim();
    if (!listas[codigo]) {
      callback({ erro: 'Lista não encontrada. Confira o código.' });
      return;
    }
    listaAtual = codigo;
    nomeUsuario = nome || 'Convidado';
    socket.join(codigo);
    listas[codigo].usuarios[socket.id] = nomeUsuario;

    callback({ sucesso: true, estado: estadoPublico(codigo) });
    io.to(codigo).emit('estado-atualizado', estadoPublico(codigo));
  });

  socket.on('adicionar-item', (texto) => {
    if (!listaAtual || !texto || !texto.trim()) return;
    const lista = listas[listaAtual];
    lista.itens.push({
      id: crypto.randomUUID(),
      nome: texto.trim(),
      pego: false,
      pegoPor: null
    });
    io.to(listaAtual).emit('estado-atualizado', estadoPublico(listaAtual));
  });

  socket.on('alternar-item', (itemId) => {
    if (!listaAtual) return;
    const lista = listas[listaAtual];
    const item = lista.itens.find((i) => i.id === itemId);
    if (!item) return;

    item.pego = !item.pego;
    item.pegoPor = item.pego ? nomeUsuario : null;

    io.to(listaAtual).emit('estado-atualizado', estadoPublico(listaAtual));
  });

  socket.on('remover-item', (itemId) => {
    if (!listaAtual) return;
    const lista = listas[listaAtual];
    lista.itens = lista.itens.filter((i) => i.id !== itemId);
    io.to(listaAtual).emit('estado-atualizado', estadoPublico(listaAtual));
  });

  socket.on('disconnect', () => {
    if (listaAtual && listas[listaAtual]) {
      delete listas[listaAtual].usuarios[socket.id];
      io.to(listaAtual).emit('estado-atualizado', estadoPublico(listaAtual));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
