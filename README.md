# Invitation System API

This is an API for managing occasions and invitations, with features like WhatsApp notifications and QR code generation for guests.

## Features

- User authentication
- Create, read, update, and delete occasions
- Manage invitations and guests
- Generate QR codes for guests
- Send WhatsApp notifications (requires Twilio setup)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables in a `.env` file:
   ```
   DATABASE_URL="your_database_url"
   JWT_SECRET="your_jwt_secret"
   TWILIO_ACCOUNT_SID="your_twilio_sid"
   TWILIO_AUTH_TOKEN="your_twilio_auth_token"
   ```
4. Run database migrations: `npx prisma db push`
5. Start the server: `npm start`

## API Usage

### Authentication

#### Register a new user

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response will include a JWT token to use for authenticated requests.

### Occasions

#### Create an occasion

```http
POST /api/occasions
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Summer BBQ",
  "date": "2023-07-15T18:00:00Z",
  "location": "Central Park",
  "capacity": 50
}
```

#### Get all occasions

```http
GET /api/occasions
Authorization: Bearer <your_jwt_token>
```

#### Update an occasion

```http
PUT /api/occasions/:id
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Updated Summer BBQ",
  "capacity": 60
}
```

#### Publish an occasion

```http
POST /api/occasions/:id/publish
Authorization: Bearer <your_jwt_token>
```

### Invitations

#### Create an invitation

```http
POST /api/invitations
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "occasionId": 1,
  "inviteeId": 2,
  "additionalGuests": 2,
  "guests": [
    {"name": "Jane Doe"},
    {"name": "Jim Doe"}
  ]
}
```

#### Update an invitation

```http
PUT /api/invitations/:id
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "status": "ACCEPTED",
  "additionalGuests": 1,
  "guests": [
    {"name": "Jane Doe"}
  ]
}
```

#### Send WhatsApp invitations

```http
POST /api/occasions/:id/send-invitations
Authorization: Bearer <your_jwt_token>
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
