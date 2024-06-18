<div align=center>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/nextjs-light.svg">
  <source media="(prefers-color-scheme: light)" srcset="public/nextjs-dark.svg">
  <img alt="Next.js">
</picture>

# Next.js Library

### Next.js Library App with TypeScript, Tailwind CSS, Zustand, ESLint, Prettier, and Husky.

</div>

## Technologies Used

- ⚡ **[Next.js](https://nextjs.org/)** - A React Framework for Production
- 🔥 **[App Router](https://nextjs.org/docs/app)** - It is a new paradigm for building applications using React's latest features.
- 🎨 **[Tailwind CSS](https://tailwindcss.com/)** - A Utility-First CSS Framework for Rapid UI Development
- 📦 **[TypeScript](https://www.typescriptlang.org/)** - A typed superset of JavaScript that compiles to plain JavaScript
- 📝 **[ESLint](https://eslint.org/)** - The pluggable linting utility for JavaScript and JSX
- 🛠 **[Prettier](https://prettier.io/)** - An opinionated code formatter
- 🐶 **[Husky](https://typicode.github.io/husky/#/)** - A tool that makes Git hooks easy
- 🚫 **[lint-staged](https://github.com/okonet/lint-staged)** - Run linters against staged git files
- 📄 **[commitlint](https://commitlint.js.org/#/)** - Lint commit messages
- 🐻 **[Zustand](https://github.com/pmndrs/zustand)** The fastest and most scalable state management solution for React.

## Set the environment variables

```
NEXTAUTH_SECRET="secret"

NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:8000"

GITHUB_ID=YOUR_GITHUB_CLIENT_ID
GITHUB_SECRET=YOUR_GITHUB_CLIENT_SECRET

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

## Install dependencies and run

```bash
git clone https://github.com/dragan717080/NextDjangoLibrary.git

npm install

npm run dev
```

## Available Scripts

In the project directory, you can run:

| **Script**   | **Description**                                      |
| ------------ | ---------------------------------------------------- |
| `dev`        | Runs the app in the development mode.                |
| `build`      | Builds the app for production to the `.next` folder. |
| `start`      | Runs the built app in the production mode.           |
| `preview`    | Builds and serves the app in the production mode.    |
| `lint`       | Runs next lint on the project.                       |
| `type-check` | Runs TypeScript type checker.                        |
| `fmt`        | Formats the code with Prettier.                      |
| `fmt:check`  | Checks if the code is formatted with Prettier.       |
| `prepare`    | Installs husky git hooks.                            |

[repo-size]: https://img.shields.io/github/repo-size/dragan717080/NextDjangoLibrary
[stars]: https://img.shields.io/github/stars/dragan717080/NextDjangoLibrary

## App hosted on Vercel

https://libralink-three.vercel.app/
