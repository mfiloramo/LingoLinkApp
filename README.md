<p align="center">
  <img src="https://user-images.githubusercontent.com/72812809/235482535-571dd542-8214-4dcc-ad81-d5001eac5d22.png" alt="readmeLogo" width="40%" height="40%" />
</p>

LingoLink is a messaging application that allows users to communicate with others regardless of the language they speak. With the app's integration of Google Translate API, users can send and receive messages in their own language while the app automatically translates the messages in real-time for all other parties.

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

The application is currently a work in progress and is not yet available for download. Once the app is completed, it will be available online in desktop/mobile formats. To get started with a local working build of the app, follow these steps:

1. Clone the repo
2. Run `npm install` to install dependencies
3. Set up a Microsoft Azure Cognitive Services Translator API key
4. Create a `.env` file in the root directory of the project and add the following environment variables:
- `API_KEY`: your Microsoft Azure Cognitive Services Translator API key
- `API_REGION`: the region your API key is associated with
  
5. Run `npm start` to start the app

## Technologies Used

- Google Translate API
- Angular 15 / TypeScript 4.9.x
- Angular Material
- Ionic -- <i>coming soon!</i>
- TailwindCSS
- Node/Express
- Microsoft SQL Server
- Sequelize ORM
- Microsoft Authentication Library

## Contributions

Contributions to the project are welcome! If you would like to contribute, please contact the project owner for more information.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
