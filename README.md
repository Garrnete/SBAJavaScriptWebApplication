# 🪄⚡ Hogwarts Spellbook

This is a magical single-page web app that allows users to browse, search, and filter spells from the wizarding world. It fetches data from the [HP API](https://hp-api.onrender.com), and lets users explore various spell types interactively.

## Features
- Search by spell name
- Filter by spell type
- Pagination and page size control
- Magical themed UI with sparkles and custom cursor
- Fetches data asynchronously using `fetch` and `async/await`
- Modular JavaScript structure

## How to Run
Clone the repo and open `index.html` in a browser. No server needed.

## Technologies Used
- HTML, CSS
- JavaScript (ES6 modules, fetch API)
- Harry Potter API


## Reflection (Optional)
1. What could you have done differently during the planning stages of your project to make the execution easier?

I could have reviewed the API documentation more thoroughly at the start to avoid data structure surprises. Also, defining components and file structure early would have saved time during refactoring.

2. Were there any requirements that were difficult to implement? What do you think would make them easier to implement in future projects?

Using ES modules with Axios via CDN was tricky due to compatibility issues. In future projects, I’ll test small module imports early or use local copies of third-party libraries.

3. What would you add to, or change about your application if given more time?
I’d add user accounts to let users favorite or bookmark spells, and possibly include animations when spells are revealed.

4. Use this space to make notes for your future self about anything that you think is important to remember about this process, or that may aid you when attempting something similar again.
Start small and get the basic flow working before adding extras. Test APIs and external libraries independently first to avoid scope creep and last-minute surprises.