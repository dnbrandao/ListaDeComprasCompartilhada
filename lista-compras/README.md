# Lista de Compras Colaborativa (protótipo)

Protótipo funcional com Node.js + Express + Socket.IO.

## Como rodar

1. Extraia o zip.
2. No terminal, dentro da pasta do projeto:
   ```
   npm install
   npm start
   ```
3. Abra `http://localhost:3000` no navegador.
4. Para testar o compartilhamento, abra a mesma URL em duas abas (ou dois dispositivos na mesma rede, trocando `localhost` pelo IP da sua máquina).

## Como usar

- Uma pessoa clica em **"Criar nova lista"** e recebe um código (ex: `A1B2C3`).
- Compartilha esse código com quem vai fazer a compra junto.
- A outra pessoa digita o nome e o código e clica em **"Entrar"**.
- Qualquer item marcado como pego aparece riscado e com o nome de quem pegou, atualizando em tempo real nas duas telas.

## Estrutura

- `server.js` — servidor Express + lógica do Socket.IO (salas, itens, presença)
- `public/index.html` — interface (HTML/CSS/JS puro, sem framework)
- Dados ficam em memória (zeram se o servidor reiniciar) — próximo passo natural seria persistir em um banco (MongoDB ou Postgres)

## Deploy no Render (acessar de qualquer lugar, inclusive do celular)

1. Crie um repositório no GitHub e suba esta pasta nele:
   ```
   git init
   git add .
   git commit -m "primeira versão"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
   git push -u origin main
   ```
2. Acesse [render.com](https://render.com) e crie uma conta (dá pra logar com GitHub).
3. Clique em **New +** → **Blueprint**, e selecione o repositório que você acabou de subir. O Render vai ler o arquivo `render.yaml` já incluído neste projeto e configurar tudo sozinho (plano gratuito).
   - Se preferir configurar manualmente: **New +** → **Web Service** → selecione o repo → Build Command: `npm install` → Start Command: `npm start`.
4. Aguarde o deploy terminar. O Render vai te dar uma URL pública, tipo `https://lista-compras-colaborativa.onrender.com`.
5. Acesse essa URL do celular (ou de qualquer navegador) — funciona de qualquer lugar, sem precisar da mesma rede Wi-Fi.

⚠️ No plano gratuito do Render, o servidor "dorme" depois de um tempo sem uso e demora uns segundos pra acordar na próxima visita — normal, não é bug.

## Instalar como app no celular (PWA)

Depois de fazer o deploy no Render (URL pública), no celular:

**Android (Chrome):**
1. Abra a URL do app no Chrome
2. Toque nos três pontinhos (menu) → **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**
3. Confirme — o app aparece na tela inicial com ícone próprio, abre em tela cheia (sem barra do navegador)

**iPhone (Safari):**
1. Abra a URL do app no Safari
2. Toque no ícone de compartilhar (quadrado com seta) → **"Adicionar à Tela de Início"**
3. Confirme — mesmo resultado: ícone próprio, tela cheia

A partir daí funciona como um app nativo: ícone na tela inicial, abre sem a barra do navegador, e mantém uma versão em cache da interface (o `sw.js` cuida disso), embora precise de internet pra sincronizar a lista em tempo real via Socket.IO.

## Próximos passos sugeridos

- Persistência em banco de dados
- Autenticação simples (hoje é só um "nome" livre)
- Deploy (Render, Railway ou Fly.io têm planos gratuitos e suportam WebSockets)
- Notificação quando alguém adiciona um item novo
