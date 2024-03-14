<div align="center">
  <img src="https://user-images.githubusercontent.com/72812809/236295242-99005189-2eeb-4d21-9653-6fed5f4520c6.png" alt="readmeLogo" width="175px" height="23%" />
</div>

<h1 align="center">Multilingual Messaging Made Easy</h1>

<hr/>

<h4 align="center">LingoLink is a messaging application that allows users to communicate with others regardless of the language they speak. With the server's integration of Google Translate API, users can send and receive messages in their own language while the server automatically translates the messages in real-time for all other parties.</h4><br/>

<div align="center">
  <img alt="GitHub Workflow Status (with event)" src="https://img.shields.io/github/actions/workflow/status/mfiloramo/worldChatApp/.github%2Fworkflows%2Fmain_lingolink.yml">
  <img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/w/mfiloramo/worldChatApp">
  <img alt="GitHub package.json version (branch)" src="https://img.shields.io/github/package-json/v/mfiloramo/worldChatApp/main">
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/mfiloramo/worldChatApp">
  <img alt="GitHub License" src="https://img.shields.io/github/license/mfiloramo/worldChatApp">
</div>

## Early Screenshots
Below are some preview screenshots of LingoLink's interface as of its pre-alpha stage of development.

<p align="center">
  <img src="https://github.com/mfiloramo/LingoLinkApp/assets/72812809/0909bfe8-7462-4940-9ea4-d7b58a96363f" width="20%" />
  <img src="https://github.com/mfiloramo/LingoLinkApp/assets/72812809/591b04f7-c783-4289-99a6-8d1f23feea82" width="20%" />
  <img src="https://github.com/mfiloramo/LingoLinkApp/assets/72812809/5c429f2b-1e48-47fc-88d3-d903fb4d691b" width="20%" />
  <img src="https://github.com/mfiloramo/LingoLinkApp/assets/72812809/506486ec-59cd-4c2b-bb9a-7fddfebb8ea5" width="20%" />
</p>


## Features
- Real-time translation of messages
- User-friendly messaging interface
- Easy-to-use language selection for sending and receiving messages
- Automatic conversation saving
- User account/profile creation with OAuth 2.0 authentication

## Getting Started

The application is currently in its pre-alpha stage. It's available as a [web application](https://orange-tree-0d3c88e0f.3.azurestaticapps.net/), and is opened to user registration on a limited basis. To get started with a local working build of this app, follow these steps:

1. Clone the repo
2. Run `npm install` to install dependencies
3. Set up a Microsoft Azure Cognitive Services Translator API key
4. Create a `.env` file in the root directory of the project and add the following environment variables:
- `API_KEY`: your Microsoft Azure Cognitive Services Translator API key
- `API_REGION`: the region your API key is associated with
  
5. Run `npm start` to start the server

## Technologies Used

<p align="left">
  <a href="https://www.typescriptlang.org/" target="_blank"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a>
  <a href="https://angular.io/" target="_blank"> <img src="https://user-images.githubusercontent.com/72812809/235690049-7261a5d5-9daa-4fa2-8d64-32901e0eabc5.png" alt="angular" width="40" height="42"/> </a>
  <a href="https://material.angular.io/" target="_blank"> <img src="https://user-images.githubusercontent.com/72812809/235689161-97bab0c0-7aaf-4af5-99fb-3060213ee09f.png" alt="material" width="40" height="42"/> </a>
  <a href="https://tailwindcss.com/" target="_blank"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> </a>
  <a href="https://nodejs.org" target="_blank"> <img src="https://i.ibb.co/YyZ3N7z/js.png" alt="nodejs" width="36" height="40"/> </a>
  <a href="https://expressjs.com" target="_blank"> <img src="https://user-images.githubusercontent.com/72812809/235751208-f8e1739e-67a8-4a4c-8b8b-e08b057a3580.png" alt="express" width="40" height="40"/> </a>
   <a href="https://www.microsoft.com/en-us/sql-server" target="_blank"> <img src="https://www.freeiconspng.com/thumbs/sql-server-icon-png/sql-server-icon-png-1.png" alt="ms-sql-server" width="37" height="40"/> </a>
   <a href="https://sequelize.org/" target="_blank"> <img src="https://cdn.freebiesupply.com/logos/large/2x/sequelize-logo-png-transparent.png" alt="sequelize" width="37" height="40"/> </a>  
   <a href="https://azure.microsoft.com/en-us/free/search/?ef_id=_k_Cj0KCQjw6cKiBhD5ARIsAKXUdyYrXDXSt64l7wV9b_mbNz7NQoLd8C6rGJ5kdJlHqgHAA6RmhCyD4gEaAoHWEALw_wcB_k_&OCID=AIDcmm5edswduu_SEM__k_Cj0KCQjw6cKiBhD5ARIsAKXUdyYrXDXSt64l7wV9b_mbNz7NQoLd8C6rGJ5kdJlHqgHAA6RmhCyD4gEaAoHWEALw_wcB_k_&gad=1&gclid=Cj0KCQjw6cKiBhD5ARIsAKXUdyYrXDXSt64l7wV9b_mbNz7NQoLd8C6rGJ5kdJlHqgHAA6RmhCyD4gEaAoHWEALw_wcB" target="_blank"> <img src="https://user-images.githubusercontent.com/72812809/235690910-cfa4a49f-1caf-44e4-836c-34fcfc71e280.png" alt="sequelize" width="45" height="40"/> </a>  
  <a href="https://google.com/translate" target="_blank"> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/2048px-Google_Translate_logo.svg.png" alt="nodejs" width="40" height="40"/> </a>
</p>

## Contributions

Contributions to the project are welcome! If you would like to contribute, please contact the project owner for more information.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
