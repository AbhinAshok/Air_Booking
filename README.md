# AirBooking - Flight Reservation System

A full-stack web application for booking flights, built with Django backend and a modern frontend.

## Features

### Backend Features
- User authentication and authorization
- Flight search and booking management
- User profile management
- Admin dashboard for flight management
- RESTful API endpoints

### Frontend Features
- Responsive user interface
- flight search
- Interactive booking system
- User dashboard
- Mobile-friendly design

##  Technology Stack

### Backend
- *Framework: Django
- *Database: SQLite3 (Development)
- *Authentication: Django Auth
- *API: Django REST Framework

### Frontend
- *Framework: React
- *State Management: Context API
- *Styling: CSS3 / Tailwind CSS
- *HTTP Client: Axios

##  Project Structure


AirBooking/
├── airbooking-frontend/ # Frontend application
├── bookings/ # Booking management app
├── flights/ # Flight management app
├── users/ # User authentication app
├── manage.py # Django management script
├── requirements.txt # Python dependencies
├── db.sqlite3 # Database (dev)
└── test_backend.py # Backend tests


### Prerequisites

- Python 3.8+
- Node.js 14+
- pip (Python package manager)
- npm or yarn

### Backend Setup

- Clone the repository
   **-git clone https://github.com/yourusername/airbooking.git
   **-cd airbooking

- Set up Python environment
**-python -m venv nenv
**-source nenv/bin/activate

- Install dependencies
**-pip install -r requirements.txt

- Run migrations
 **- python manage.py migrate

-Create superuser (optional)

**-python manage.py createsuperuser

- Run development server

**-python manage.py runserver


### Frontend Setup

-Navigate to frontend directory

*-cd airbooking-frontend

*-Install dependencies

-npm install

-Start development server

*-npm start

### API Documentation

-Authentication Endpoints

POST /api/auth/login/ - User login

POST /api/auth/register/ - User registration

POST /api/auth/logout/ - User logout

-Flight Endpoints

GET /api/flights/ - List all flights

GET /api/flights/search/ - Search flights

POST /api/flights/{id}/book/ - Book a flight

-Booking Endpoints

GET /api/bookings/ - User bookings

GET /api/bookings/{id}/ - Booking details

DELETE /api/bookings/{id}/cancel/ - Cancel booking

### Testing

-Backend Testing

-*python manage.py test

-*python test_backend.py

- Frontend Testing
  
cd airbooking-frontend
*-pm test









