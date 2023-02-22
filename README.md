# startler

[![NPM version](https://img.shields.io/npm/v/startler?color=%23c53635&label=%20)](https://www.npmjs.com/package/startler)

A simple CLI application to kickstart new projects.

-   :hourglass: - Get up and running in seconds
-   :speech_balloon: - Simple dependency management - add or remove directly
-   :star: - Auto updates to latest versions of all dependencies
-   :file_folder: - Pre-configures project automatically
-   :bookmark: - Good templates to start from
-   :gear: - TypeScript, PNPM, Prettier, Vite, Vitest and more to choose from
-   :heart_eyes: - Beautiful and simple interface

Allows you to choose name, version, dependencies and type of package in seconds.

## Install

```bash
npm install startler -g
```

## Usage

```bash
# create a typescript library
startler lib <name-of-project>

# create a userscript project
startler userscript <name-of-project>

# create a cli application
startler cli <name-of-project>
```

## Commands

The currently supported commands are:

### lib

Simple lib template using TypeScript, Esno, Tsup, Vitest, Husky and more. All files setup and ready to go. Good starter for any application with Node.

### userscript

Easily get going with a new userscript. All things preconfigured. Uses Vite and `vite-plugin-monkey` to make development easy. 

### cli

Much like the `lib` template but more tweaked towards having good defaults for a CLI application. 