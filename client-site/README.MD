```
└── src/
    ├── features/
    │   │   # the todo "feature" contains everything related to todos
    │   ├── todos/
    │   │   │   # this is used to export the relevant modules aka the public API (more on that in a bit)
    │   │   ├── index.js
    │   │   ├── create-todo-form/
    │   │   ├── edit-todo-modal/
    │   │   ├── todo-form/
    │   │   └── todo-list/
    │   │       │   # the public API of the component (exports the todo-list component and hook)
    │   │       ├── index.js
    │   │       ├── todo-list.context.js
    │   │       ├── todo-list.test.js
		│   │       ├── components/
		|		|				|		├── todo-item.component.js
		|		│			  │   └── todo-list.component.js
		│   │       ├── hooks/
		|		|				|		└── use-todo-list.js
		│   │       └── services/
    │   ├── projects/
    │   │   ├── index.js
    │   │   ├── create-project-form/
    │   │   └── project-list/
    │   ├── ui/
    │   │   ├── index.js
    │   │   ├── button/
    │   │   ├── card/
    │   │   ├── checkbox/
    │   │   ├── header/
    │   │   ├── footer/
    │   │   ├── modal/
    │   │   └── text-field/
    │   └── users/
    │       ├── index.js
    │       ├── login/
    │       ├── signup/
    │       └── use-auth.js
    └── pages/
    │   │   # all that's left in the pages folder are simple JS files
    │   │   # each file represents a page (like Next.js)
    │   ├── create-project.js
    │   ├── create-todo.js
    │   ├── index.js
    │   ├── login.js
    │   ├── privacy.js
    │   ├── project.js
    │   ├── signup.js
    │   └── terms.js
		└── setup/
		│   ├── app-context-manager # if using context
		│   ├── auth
		│		└── router-manager
		└── store/ # redux
		└── data/ # storing our data assets such as JSON files
		└── utils/ # all utility functions such as formatters.
		└── layouts/ # for placing any layout based components
		└── lib/ # like axios, or API
		└── services/ # contains all your code for interfacing with any external API
```

```
{
  "rules": {
    "no-restricted-imports": [
      "error", { "patterns": ["@/features/*/*"] }
    ]
  }
}
```

```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@features/*": ["src/features/*"],
    }
  }
}
```
