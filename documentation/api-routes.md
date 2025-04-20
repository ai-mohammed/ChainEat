## Auth Routes
- POST /auth/register – Create a new user
- POST /auth/login – Login user and return cookie
- GET /auth/logout – Logout user
- GET /auth/users – Get currently logged in user

## Restaurant Routes
- GET /restaurants – Get all restaurants
- POST /restaurants – (Admin) Create a restaurant

## Reservation Routes
- POST /reservations – Book a reservation
- GET /reservations/my – Get logged-in user's reservations

## Reviews
- POST /restaurants/:id****************/review – Submit a review
- GET /restaurants/:id****************/reviews – Get reviews for a restaurant
