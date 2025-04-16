# ChainEat Frontend

ChainEat Frontend is a React-based user interface for the ChainEat restaurant reservation platform. Built using **React**, **TypeScript**, **React Router**, and **Axios**, this project connects seamlessly to the ChainEat backend to provide an interactive experience including user authentication, restaurant listings, reservations, and more.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage Navigation](#usage--navigation)

## Overview

The ChainEat Frontend provides a modern, responsive interface that allows users to:

- Browse restaurant listings and view detailed descriptions.
- Register, log in, and manage their reservations.
- Rate restaurants and get real-time feedback.
- Use dedicated pages for About Us, Contact, and more to enhance user engagement.

## Features

- **User Authentication:**
  - Login and registration pages enable secure user access.
  - Session management is integrated with the backend via cookies.
- **Restaurant Management:**
  - Public listing of restaurants with detailed views and ratings.
  - Administrators have tools to add or edit restaurant information.
- **Reservation System:**
  - Users can create, view, and cancel reservations.
  - Admins have the ability to view and manage all reservations.
- **Responsive Design:**
  - Clean, modern styling using custom CSS with responsive breakpoints.
  - A consistent navigation bar and footer for seamless site-wide experience.
- **Contact & About Pages:**
  - Dedicated pages with team introductions and a contact form integrated with EmailJS.

## Technologies Used

- **React & TypeScript:** Core framework with type safety.
- **React Router:** Managing client-side routing.
- **Axios:** Handling HTTP requests to the backend API.
- **CSS:** Custom styling with App.css and index.css to provide a modern look.
- **EmailJS:** (On the Contact page) to enable sending email directly from the frontend.
- **React Icons:** For social media icons and enhanced UI elements.

## Project Structure

```
├── src/
| ├── assets / # Contains static files such as images, icons, etc.
│ ├── components/ # Reusable UI components and widgets
│ │ ├── AddAdmin.tsx # Form for adding new admin users
│ │ ├── AddRestaurant.tsx # Component for admin to add restaurant entries
│ │ ├── Footer.tsx # Footer component displayed across pages
│ │ ├── RateRestaurant.tsx # Component for users to rate restaurants
│ │ └── Reservations.tsx # Displays and manages reservations
│ ├── pages/ # Route-specific pages of the application
│ │ ├── AboutUs.tsx # "About Us" page with team member profiles
│ │ ├── ContactUs.tsx # "Contact" page with a form and contact details
│ │ ├── Home.tsx # Landing page with hero section and call-to-action
│ │ ├── Login.tsx # Login page for user authentication
│ │ ├── Register.tsx # Registration page for new users
│ │ └── Restaurants.tsx # Page displaying restaurant listings with search & admin controls
│ ├── App.tsx # Main application component including routing and layout
│ ├── App.css # Component-specific styling
│ ├── index.css # Global stylesheet for base styles and resets
│ └── main.tsx # Entry point that renders the App component into the DOM
├── package.json # Configuration for project dependencies and scripts
└── README.md # Project documentation
```

## Installation & Setup

1. **Clone the Repository:**

```bash
    git clone https://github.com/ai-mohammed/ChainEat.git
    cd ChainEat-frontend
```

2. **Install Depencies:**

```bash
npm install
```

3. **Run the Project:**

```bash
npm start
```

## Usage & Navigation

The ChainEat Frontend is designed with user experience in mind. Below is an overview of how to navigate and use the application effectively:

### Navigation Bar

- **Home:**  
  Returns you to the landing page featuring an engaging hero section with a call-to-action button to make a reservation.
- **Restaurants:**  
  Displays a comprehensive list of restaurants. Users can search for specific restaurants by name or cuisine, and sort results by name or rating.

- **About Us:**  
  Learn about our team! This page showcases team member profiles complete with photos, bios, and links to GitHub profiles.

- **Contact:**  
  Provides contact details and includes a form powered by EmailJS, allowing you to send messages directly from the site.

- **My Reservations:**  
  Available for logged-in users, this link takes you to your personal reservations dashboard where you can view, confirm, or cancel your reservations.

- **Authentication Options:**  
  When not logged in, the navigation bar displays **Login** and **Register** options so you can easily access the secure parts of the application.

### Authentication Pages

- **Login Page:**  
  Users can log in using their email and password. On successful login, your session is maintained and the navigation bar updates to show options specific to authenticated users (e.g., My Reservations, Logout). Error messages are displayed if the login fails.

- **Register Page:**  
  New users can create an account by providing a valid email, password, and confirming the password. Upon successful registration, you'll be redirected to the login page to sign in.

### Restaurants Page

- **Restaurant Listings:**  
  Browse through a searchable and sortable list of restaurants. Every restaurant card displays key details such as the name, cuisine, and address.
- **Ratings & Reviews:**  
  Interact with the star-based rating system to submit your rating for a restaurant. Your rating updates in real time and influences the average rating displayed.

- **Admin Controls:**  
  If logged in as an admin, you’ll have additional options:
  - **Add Restaurant:** Use the form to add new restaurant entries.
  - **Edit/Delete:** On each restaurant card, admins can edit details or remove a restaurant from the listing.

### Reservations

- **Create a Reservation:**  
  Users can make a reservation by selecting a restaurant, choosing a date, time, and specifying the number of guests. The form validates your input and prevents duplicate bookings.

- **Manage Reservations:**  
  The reservations interface presents a clear list of your current bookings, including details like the restaurant name, reservation time, and status.
  - **For Regular Users:**  
    You can cancel your own reservations.
  - **For Admins:**  
    You can view all reservations and have additional controls to confirm or cancel any reservation.

### Contact & About Us Pages

- **About Us:**  
  Gain insight into the team behind ChainEat. This page features detailed bios, professional photos, and direct links to team members' GitHub profiles, highlighting the people who built the application.

- **Contact:**  
  The contact page provides multiple avenues to reach out:
  - **Contact Details:** Includes a phone number, email address, and physical location details.
  - **Contact Form:** Use the form to send a direct message via EmailJS. Fill in your name, email, and message to get in touch.
