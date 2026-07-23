# Admin App

A simple admin application with CRUD functionality for managing items.

## Features

- ✅ View all items
- ✅ Add new items
- ✅ Delete items (Delete Fx)
- ✅ RESTful API
- ✅ Modern, responsive UI

## Bug Fix: Delete Functionality

This implementation fixes the delete functionality issue (EPD-6791). The delete function now properly:

1. Sends a DELETE request to the correct API endpoint
2. Handles the response appropriately
3. Refreshes the items list after successful deletion
4. Shows confirmation dialog before deletion
5. Provides user feedback via notifications

### Key Changes:

- **Correct HTTP Method**: Uses `DELETE` instead of potentially incorrect method
- **Proper Error Handling**: Catches and displays errors to the user
- **Response Validation**: Checks if response is OK before proceeding
- **State Refresh**: Automatically refreshes the items list after deletion
- **User Feedback**: Shows success/error notifications

## Installation

```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a specific item
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item

## Testing the Delete Functionality

1. Open the application in your browser
2. You should see a list of sample items
3. Click the "Delete Fx" button on any item
4. Confirm the deletion in the dialog
5. The item should be removed from the list with a success notification

## Technology Stack

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript
- **Styling**: Modern CSS with gradients and animations
