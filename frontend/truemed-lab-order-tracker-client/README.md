# Lab Order Tracker UI

React application developed as part of the TrueMed Lab Order Tracker technical assessment.

The application provides a user-friendly interface for creating and viewing laboratory orders with client-side validation, automatic list updates, and API integration.

## Technology Stack

* React
* Vite
* JavaScript (ES6+)
* React Hook Form
* TanStack React Query
* Custom Hooks
* Service-Based API Layer

## Prerequisites

Before running the application, ensure the following are installed:

* Node.js 18 or later
* npm

Verify installation:

```bash
node --version
npm --version
```

## How to Run

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

By default, the application runs on:

```text
http://localhost:5173
```

If the default port is unavailable, Vite may automatically select another available port. The active URL will be displayed in the terminal when the application starts.

## Backend Requirement

The ASP.NET Core API must be running before starting the frontend.

The application uses Vite proxy configuration to forward API requests to the backend during development.

## Frontend Architecture

```text
Components
    ↓
Custom Hooks
    ↓
Services
    ↓
ASP.NET Core API
```

### Folder Structure

```text
src/
├── components
├── hooks
├── services
├── utils
├── constants
└── config
```

### Responsibilities

* Components handle UI rendering
* React Hook Form manages form state, validation, and error messages
* Custom Hooks and TanStack React Query manage order fetching, caching, and refresh behavior
* Services centralize API communication
* Utility functions provide reusable helper methods
* Constants centralize application configuration

## Implemented Features

### Order Submission Form

* Patient Name input
* Test Type dropdown

  * CBC
  * BMP
  * Lipid Panel
  * UA
* Priority selection

  * Routine
  * STAT
* Collection Date picker
* React Hook Form validation for required fields and date checks
* Loading indicators during submission

### Order List

* Displays submitted orders
* Automatically refreshes after successful submission using React Query
* No manual page refresh required
* Orders sorted by collection date
* STAT orders visually highlighted

### Error Handling

* Inline validation messages
* API validation error handling
* Network error handling
* User-friendly error messages

## Future Improvements

Given additional development time, the following improvements could be implemented:

* Unit tests using React Testing Library
* End-to-end testing
* Pagination for large datasets
* Advanced filtering and search
* Authentication integration
* Responsive mobile enhancements
* Dark mode support

## Notes

The frontend communicates with the backend through a centralized service layer and Vite proxy configuration, keeping API communication separated from UI components.
