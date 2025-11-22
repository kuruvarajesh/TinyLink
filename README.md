# TinyLink
small web app similar to bit.ly, where users can shorten URLs, view click statistics, and manage links.

# PROJECT STRUCTURE

tinylink/
├── package.json
├── .env.example
├── .gitignore
├── vite.config.js
├── index.html
├── server/
│   ├── index.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── Link.js
│   ├── controllers/
│   │   └── linkController.js
│   ├── routes/
│   │   └── api.js
│   └── middleware/
│       └── errorHandler.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── api/
    │   └── links.js
    ├── utils/
    │   └── helpers.js
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── Toast.jsx
    │   ├── Modal.jsx
    │   ├── Spinner.jsx
    │   ├── LinkForm.jsx
    │   ├── LinkTable.jsx
    │   └── SearchBar.jsx
    └── pages/
        ├── Dashboard.jsx
        ├── Stats.jsx
        ├── Health.jsx
        └── NotFound.jsx
*/
