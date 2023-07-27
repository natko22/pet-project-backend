<p align="center"><img src="./assets/dog-logo.jpg" width="250px" /></p>

# Petopia Backend

## Description

Petopia is a MERN (MongoDB, Express, React, Node.js) stack application dedicated to connecting pet owners with loving caretakers and helping animals in need. It provides a seamless experience for pet owners and pet sitters to connect and build a community that cherishes all types of animals.

## Features

- Sign up and log in with email or Google account.
- User profiles with reviews, bookings, and pet profiles.
- Availability management to display available dates from calendar.
- Search for pets and pet sitters in our search pages based on name or postal code .
- Save and delete pet sitter's profiles from favorites.
- Edit user and pet profile to update information.
- Book a service inside sitter's profile.
- Add a review for a pet sitter and edit it,or delete it.
- Upload your own images in pet and sitter profiles.
- Admin's page for Profile's managment.

  ## Usage

### Signing Up and Logging In

- Visit the Petopia homepage.

- Click on the "Sign Up" button to create a new account.
- Alternatively, you can choose to log in with your Google account by clicking on the "Log In with Google" button.

### User Profile

- After logging in, you will be redirected to your user profile page.
- Update your profile information, including your name, profile picture, and contact details.
- Add information about the pets you own, such as their names, breeds, and descriptions.
- Manage your available dates for pet sitting by setting the dates when you are available to take care of pets.

### Searching for Pets and Pet Sitters

- Use the search feature to find pets available for sitting or pet sitters in your area.
- Filter your search by pet type, location, availability, and other criteria.
- Browse through the search results to view detailed profiles of pets and pet sitters.

### Adding Pet Sitters to Favorites

- When you find a pet sitter you like, click on the "heart " button on their profile.
- The pet sitter will be added to your favorites list for easy access in the future.

### Editing Profiles

- As a user, you can edit your own profile details at any time.
- Update your pet information, add new pets, or make changes to your available dates for pet sitting.

### Booking and Reviews

- To book a pet sitting service, visit the profile page of the desired pet sitter.
- Contact the pet sitter directly through the contact information provided on their profile.
- After a pet sitting experience, you can leave a review and rating for the pet sitter based on your experience.

### Managing Bookings

- As a pet sitter, you can manage your bookings through your user profile.
- View upcoming bookings and add available dates.
- Communicate with pet owners to coordinate pet sitting services.

### Logging Out

- To log out of your Petopia account, click on the "Logout" button in the navigation menu.

We hope you enjoy using Petopia and have a pawsome time caring for pets and connecting with pet owners!

## Technologies Used

- Node.js with Express: Backend server framework
- MongoDB with Mongoose: Database and data modeling
- JSON Web Tokens (JWT): Authentication and user sessions
- Nodemon: Development server with hot-reloading
- dotenv: Environment variables management
- CORS: Cross-Origin Resource Sharing
- Use Passport for implementing Google authedication.
- React Calendar
- React Avatar Editor
- Cloudinary

## Installation

To run Petopia backend server locally, please follow these steps:

1. Clone the repository from GitHub:

   ```bash
   git clone https://github.com/natko22/pet-project-backend
   ```

2. Install the necessary dependencies using npm:

   ```bash
   cd petopia
   npm install
   ```

3. Run the development server:

   ```bash
   npm start
   ```

4. The backend server will be running on http://localhost:5005.

5. Set up the MongoDB database:

   - Install MongoDB if you haven't already (https://docs.mongodb.com/manual/installation/).
   - Configure the MongoDB connection in the app's configuration file.

6. Open your browser and go to http://localhost:3000 to access Petopia locally.

## Deployment

- Frontend: The frontend is deployed on Netlify and will automatically deploy when changes are pushed to the main branch.
- Backend: The backend is hosted on Adaptable and will automatically deploy when changes are pushed to the main branch.

Contributing
We welcome contributions from the community! If you find any bugs or have ideas for new features, please open an issue or submit a pull request.

## License

MIT License

## Contact

For any questions or inquiries, please contact
[Yo-Jia Chen](https://github.com/Yo-Jia) and [Natassa Tsapanidou-Kornilaki](https://github.com/natko22).
