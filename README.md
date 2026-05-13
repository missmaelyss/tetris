# RedTetris
## Rt si Tetris 🕹

Tetris multijoueur en temps réel — React + Socket.IO.

## Lancer le projet

```bash
npm install
```

**Développement** (hot-reload, deux terminaux) :
```bash
npm start        # serveur Express + Socket.IO → port 4001
npm run dev      # Vite → port 3000
```

**Production** :
```bash
npm run build && npm start
# → http://localhost:4001
```

## Rejoindre une partie

Navigue vers `/#nomDeSalle[tonPseudo]` (ex: `/#salle1[Alice]`).

## Tests

```bash
npm test          # watch mode
npm run coverage  # rapport de couverture
```

Made with ☕ by [marnaud](https://github.com/missmaelyss) & [cde-laro](https://github.com/cde-laro) @[42Paris](https://twitter.com/42born2code)

![tetris lol](https://media1.giphy.com/media/Rd8mDiihpkFm5GgCqR/giphy.gif?cid=ecf05e4777cqtkbylbxg7xkuwlxmxao9w43cdt268sn9wv4h&rid=giphy.gif&ct=g)
