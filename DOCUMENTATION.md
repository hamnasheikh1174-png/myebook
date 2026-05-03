# E-Novel Archive Application Documentation

## 1. Project Overview
A sophisticated web application for managing a personal library of novels. Users can browse a collection, view details, and manage their own archive (add, edit, delete books).

## 2. Source Code
The source code can be accessed and exported directly from Google AI Studio:
- **Export to GitHub**: Go to **Settings > Export to GitHub**.
- **Download as ZIP**: Go to **Settings > Download as ZIP**.

## 3. Live Deployed Website
- **Live Link**: [https://enovelai.netlify.app](https://enovelai.netlify.app)
- **Preview Link**: [https://ais-pre-37vdlihj4zf3czbbwbs64g-804941792488.asia-southeast1.run.app](https://ais-pre-37vdlihj4zf3czbbwbs64g-804941792488.asia-southeast1.run.app)

## 4. API Documentation (Internal Data Service)
The application uses a local storage-based data service located in `src/lib/store.ts`. This replaces the previous Supabase integration to ensure 100% availability without external dependencies.

### Auth Service
| Method | Description | Parameters |
| :--- | :--- | :--- |
| `store.auth.getUser()` | Retrieves the current authenticated user from local storage. | None |
| `store.auth.signInWithPassword(email)` | Signs in a user (creates session in local storage). | `{ email: string }` |
| `store.auth.signUp(email)` | Registers a new user (creates session). | `{ email: string }` |
| `store.auth.signOut()` | Clears the session from local storage. | None |

### Novels Service
| Method | Description | Parameters |
| :--- | :--- | :--- |
| `store.novels.getAll()` | Returns all novels in the archive. | None |
| `store.novels.getById(id)` | Returns a specific novel by its ID. | `id: string` |
| `store.novels.getByUser(userId)` | Returns all novels created by a specific user. | `userId: string` |
| `store.novels.insert(novel)` | Adds a new novel to the archive. | `Novel (without ID)` |
| `store.novels.update(id, updates)`| Updates an existing novel's details. | `id: string, updates: Partial<Novel>` |
| `store.novels.delete(id)` | Permanently removes a novel from the archive. | `id: string` |

## 5. Deployment Steps (Netlify)
The project is configured for seamless deployment to Netlify.

1. **Build Configuration**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
2. **SPA Routing**:
   - A `netlify.toml` and `public/_redirects` file are included to handle client-side routing (redirecting all paths to `index.html`).
3. **Deployment**:
   - Connect the GitHub repository to Netlify.
   - Netlify will automatically detect the configuration and deploy the app.

## 6. Development Report & Learning Resources
### Architecture
- **Frontend**: React 19 with Vite for ultra-fast development.
- **Styling**: Tailwind CSS 4.0 for a modern, high-contrast "Archival" aesthetic.
- **Animation**: Framer Motion (`motion`) for smooth transitions and layout changes.
- **State Management**: React `useState` and `useEffect` combined with a custom `SimpleStore` class for persistence.

### Learning Resources Used
- **React Documentation**: For the latest React 19 hooks and patterns.
- **Tailwind CSS Documentation**: For the new archiving-style typography and spacing utilities.
- **MDN Web Docs**: For LocalStorage and Web Storage API implementations.
- **Lucide Icons**: For the comprehensive library of "bookery" and "archive" icons.

### Key Learnings
- Implementing a custom event system (`auth-change`) to bridge synchronization between different React components when using local storage.
- Designing a highly distinctive "editorial" UI using serif fonts and neutral color palettes to simulate a high-end physical library.
