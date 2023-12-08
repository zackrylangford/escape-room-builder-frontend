# Escape Room Builder Frontend

## Introduction
Welcome to the **Escape Room Builder Frontend** repository! This project is an innovative web application that allows users to create, manage, and share custom escape room experiences. It's designed for escape room enthusiasts and creators who want to explore and craft unique and interactive puzzles and challenges.

## Project Status
**Note**: This project is currently in the development phase. The features described below are planned and not yet implemented.

## Features
- **Escape Room Creation**: Users can create personalized escape rooms, setting timers and adding various challenges.
- **Challenge Customization**: Offers a mix of pre-built and user-generated challenges. Users can add trivia, puzzles, and more, with a future feature to incorporate AI-generated trivia questions.
- **Real-Time Playthrough**: Users can play through their escape rooms with real-time tracking of progress and completion of challenges.
- **Social Sharing**: Escape rooms can be shared with friends or the community, featuring a competitive aspect with leaderboards and time tracking.

## Technical Overview
- **Frontend**: Developed as a Jekyll site.
- **Hosting**: Hosted on AWS S3.
- **Pages**: Currently includes a login page and a home page.
- **Backend Integration**: Connects with [Escape Room Builder Backend](https://github.com/zackrylangford/escape-room-builder-backend).

## Installation and Setup

### Prerequisites
- **Ruby and Jekyll**: This project is built with Jekyll. If you're not familiar with Jekyll, don't worry! You can still contribute using other front-end technologies, and we're open to discussing alternative approaches. If you want to stick with Jekyll, here's a helpful [Installation Guide](https://jekyllrb.com/docs/installation/).
- **AWS Account (Optional)**: The backend is hosted on AWS, but you don't need an AWS account to contribute to the front end. If you would like to use our development backend, you can contact us for API keys and instructions. If you want to set up your own backend, you'll need an AWS account and some familiarity with AWS services like API Gateway, DynamoDB, and Lambda. Email zack@cloudzack.com for more information on using the pre-built backend or setting up your own if you have questions.

### Getting Started
1. **Clone the Repository**:
```
git clone https://github.com/zackrylangford/escape-room-builder-frontend.git
```

2. **Install Dependencies**: If you're using Jekyll, run `bundle install` in the project directory.

### Backend Access and Understanding
- **Pre-Built Backend**: If you're not familiar with AWS, you can use our pre-built backend for pulling challenge information and pre-built escape room games that we have already built to help you. Please [contact us](mailto:zack@cloudzack.com) for API keys and integration instructions.
- **Backend Repository**: To understand how we're structuring data for the backend, check out our [Escape Room Builder Backend Repository](https://github.com/zackrylangford/escape-room-builder-backend).
- **Set Up Your Own Backend**: If you prefer to set up your own backend, you'll need to configure AWS services like API Gateway, DynamoDB, and Lambda.

### Running the Project
- **Jekyll Users**: Run `jekyll serve` in the project directory and access the app via `http://localhost:4000`.
- **Non-Jekyll Users**: If you're using a different frontend setup, please adjust the running instructions accordingly.

## Usage

### Current Functionality
As of now, the Escape Room Builder Frontend is in its early development stages. Here's what you can do:
- **View the Home Page**: See the layout and basic design of the home page.
- **Login Functionality**: Access the login page. Note: if you want to use our authentication, you will need a user from our Cognito pool, unless you set up your own pool. To request a Cognito user login, please [contact us](mailto:zack@cloudzack.com). We'll provide you with the necessary credentials and instructions.

### How to Use
- **Accessing Pages**: After running the project, navigate to `http://localhost:4000` to view the home page. The login page can be accessed via a link on the home page.
- **Interacting with the Backend**: Currently, the frontend's interaction with the backend is minimal, focusing mainly on layout and basic navigation. If you are using the pre-built backend, you can currently add new escape rooms games (just the information right now, not the actual game) and pull game information from the backend. If you are using your own backend, you can see how our data is structured and how we're interacting with the backend in the backend repository (https://github.com/zackrylangford/escape-room-builder-backend).



### Backend Interaction and API Testing
- **Authenticated API Calls**: If you're interested in making authenticated calls to the API, we can set you up with a Cognito user login and API Key. This will allow you to fully test and interact with the API endpoints defined in this frontend.
- **Requesting Access**: To request a Cognito user login and API Key please [contact us](mailto:zack@cloudzack.com). We'll provide you with the necessary credentials and instructions.

### Future Developments
We're working on adding more features, including:
- **Creating and Managing Escape Rooms**: Users will be able to create custom escape rooms, set timers, and add challenges.
- **Challenge Customization**: Including both pre-built and user-generated challenges.
- **Real-Time Gameplay**: Play through escape rooms with real-time progress tracking.
- **Social Features**: Share escape rooms and compete on leaderboards.

Stay tuned for these exciting updates!

## Contributing
We warmly welcome contributions! If you're interested in contributing, please read our [Contributing Guidelines](CONTRIBUTING.md).

## Code of Conduct

Our project is committed to providing a welcoming and inclusive experience for everyone. We expect all participants to adhere to our [Contributor Code of Conduct](CODE_OF_CONDUCT.md).


## Support and Feedback
For support, questions, or feedback, please [open an issue](https://github.com/zackrylangford/escape-room-builder-frontend/issues).

or email us at [zack@cloudzack.com](mailto:zack@cloudzack.com).

or find me on Threads (https://threads.net/@zackrydlangford)!

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

We hope this project sparks your creativity and enthusiasm for interactive and collaborative gaming experiences!
