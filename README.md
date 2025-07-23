![GitHub contributors](https://img.shields.io/github/contributors/ThomasHandlag/busify-admin)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/ThomasHandlag/busify-admin)
![GitHub License](https://img.shields.io/github/license/ThomasHandlag/busify-admin)

# Busify Admin Dashboard

A modern and powerful admin dashboard for the Busify bus management system. Built with React 19, TypeScript, Vite, and Ant Design to provide a comprehensive interface for managing bus operations, routes, schedules, and system administration.

## 🚌 About

Busify Admin Dashboard is the administrative interface of the Busify ecosystem, designed for system administrators, fleet managers, and operations teams to efficiently manage bus transportation services, monitor system performance, and handle day-to-day operations.

## ✨ Features

- **Modern Tech Stack**: Built with React 19, TypeScript, and Vite for optimal performance
- **State Management**: Zustand and Recoil for efficient state management
- **UI Framework**: Ant Design v5 for professional and consistent UI components
- **Styling**: Tailwind CSS for rapid and responsive design
- **API Integration**: Axios for seamless backend communication
- **Routing**: React Router v7 for smooth navigation
- **Development Experience**: Fast HMR with Vite and SWC
- **Type Safety**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript
- **UI Library**: Ant Design v5
- **Styling**: Tailwind CSS v4
- **State Management**: 
  - Zustand Toolkit for global state
  - Recoil for component-level state
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Compiler**: SWC for fast builds
- **Linting**: ESLint with TypeScript support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun package manager
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd bus-manage-system/busify-admin
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your environment variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Busify Admin Dashboard

# Other environment variables will be provided later
```

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the admin dashboard.

## 📁 Project Structure

```
busify-admin/
├── src/
│   ├── app/
│   │   ├── hooks/        # Custom React hooks
│   │   └── api/          # api definitions
│   ├── assets/           # Static assets (images, icons, etc.)
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature-based modules
│   │   ├── login/         # Authentication feature
│   │   │   ├──login.tsx  # Login UI
│   │   └── users/        # User management feature
│   │       ├── users.tsx # Users management UI
│   ├── routes/           # Route definitions and components
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Public static files
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## 🎨 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint for code linting
- `npm run preview` - Preview the production build locally

### Architecture Patterns

#### Feature-Based Organization
Each feature is organized with its own:
- **API Layer**: HTTP requests and API integration
- **State Management**: Zustand for global state
- **UI Components**: Feature-specific components

#### State Management Strategy
- **Zustand**: For global application state (auth, users, etc.)
- **Recoil**: For component-level and local state management
- **React Hooks**: For component logic and side effects

### Code Style and Standards

This project follows:
- **ESLint**: Code linting with TypeScript support
- **TypeScript**: Strict type checking
- **Ant Design**: Design system guidelines
- **Feature-based architecture**: Organized by business domains

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration:

```bash
# API Configuration
VITE_API_BASE_URL=         # Backend API base URL
VITE_APP_TITLE=           # Application title
# Additional configs will be provided later
```

### ESLint Configuration

For production applications, you can enhance the ESLint configuration with type-aware rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This will create a `dist` folder with the production-ready files.

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing

Testing setup and guidelines will be added as the project evolves. Consider adding:
- Unit tests with Vitest
- Component testing with React Testing Library
- E2E testing with Playwright or Cypress

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the established code style and architecture patterns
4. Write meaningful commit messages
5. Ensure all linting passes (`npm run lint`)
6. Test your changes thoroughly
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- Follow the feature-based architecture pattern
- Use TypeScript for all new code
- Follow Ant Design guidelines for UI consistency
- Write self-documenting code with proper TypeScript types
- Keep components small and focused on single responsibilities

## 🔐 Authentication & Security

The admin dashboard implements secure authentication and authorization:
- JWT-based authentication
- Role-based access control (RBAC)
- Secure API communication
- Session management with Redux

## 📖 Related Projects

This project is part of the Busify ecosystem:
- **busify-admin**: Admin dashboard for system management (this repository)
- **busify-next**: Main web application for end users
- **busify-provider**: Backend API and services

## 📚 Learn More

To learn more about the technologies used in this project:

- [React Documentation](https://react.dev) - Learn about React 19
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Learn about TypeScript
- [Vite Documentation](https://vitejs.dev/guide/) - Learn about Vite build tool
- [Ant Design Documentation](https://ant.design/docs/react/introduce) - Learn about Ant Design components
- [Zustand Documentation](https://zustand.docs.pmnd.rs/getting-started/introduction) - Learn about Zustand
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn about utility-first CSS
- [React Router Documentation](https://reactrouter.com/) - Learn about client-side routing

## 🆘 Support

If you encounter any issues or have questions:
- Check the existing issues on GitHub
- Create a new issue with detailed information
- Contact the development team
- Refer to the project documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

Future enhancements planned:
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Bulk operations for data management
- [ ] Advanced filtering and search capabilities
- [ ] Mobile-responsive improvements
- [ ] Comprehensive testing suite
- [ ] Performance monitoring integration

---

Built with ❤️ by the Busify team
