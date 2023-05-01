<p align="center">
  <img src="https://user-images.githubusercontent.com/72812809/235409038-e5dde257-01a5-4ea7-acb6-d817e6ee074d.png" alt="readmeLogo" width="30%" height="30%" />
</p>

LingoLink is a messaging application that allows users to communicate with others regardless of the language they speak. With the app's integration of Google Translate API, users can send and receive messages in their own language while the app automatically translates the messages in real-time for the other party.

## Early Screenshots (Desktop Version Only)
Below are some preview screenshots of an early iteration of LingoLink's interface. The screenshots are for UI demonstration purposes only.

![mainApp](https://user-images.githubusercontent.com/72812809/235406312-57cbe937-ad9b-4160-8d53-e8c3ab1d44cf.png)

![loginScreen](https://user-images.githubusercontent.com/72812809/235406317-8ba3a0f8-797e-427c-8432-5a99971ba972.png)


## Features

- Real-time translation of messages
- User-friendly messaging interface
- Easy-to-use language selection for sending and receiving messages
- Automatic conversation saving
- User account/profile creation with OAuth 2.0 authentication

## Getting Started

To get started with the app, follow these steps:

1. Clone the repo
2. Run `npm install` to install dependencies
3. Set up a Microsoft Azure Cognitive Services Translator API key
4. Create a `.env` file in the root directory of the project and add the following environment variables:
- `API_KEY`: your Microsoft Azure Cognitive Services Translator API key
- `API_REGION`: the region your API key is associated with
  
5. Run `npm start` to start the app

## Technologies Used

- Google Translate API
- Angular 15 / TypeScript
- Angular Material
- Ionic
- TailwindCSS
- Node/Express
- Microsoft SQL Server
- Sequelize ORM
- Microsoft Authentication Library

## Contributions

Contributions to the project are welcome! If you would like to contribute, please contact the project owner for more information.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
