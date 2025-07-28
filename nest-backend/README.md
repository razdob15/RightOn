# RightOn NestJS Backend

This backend is written in NestJS with TypeORM and PostgreSQL.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment file:

   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your database credentials:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=righton
   ```

4. Make sure PostgreSQL is running and create the database:
   ```sql
   CREATE DATABASE righton;
   ```

## Development

1. Start the development server:

   ```bash
   npm run start:dev
   ```

2. The API will be available at: `http://localhost:3001`

## API Endpoints

### Health Check

- `GET /` - Welcome message
- `GET /health` - Health status with database connection check

### Rights Management

- `GET /rights` - Get all rights
- `GET /rights?search=term` - Search rights by text
- `GET /rights/count` - Get total count of rights
- `GET /rights/category/:category` - Get rights by category
- `GET /rights/:id` - Get a specific right by ID
- `POST /rights` - Create a new right
- `POST /rights/bulk` - Create multiple rights at once
- `PUT /rights/:id` - Update a right
- `DELETE /rights/:id` - Delete a right

### Database Seeding

- `npm run seed` - Populate database with sample rights data

## Usage Examples

### Create a new right

```bash
curl -X POST http://localhost:3001/rights \
  -H "Content-Type: application/json" \
  -d '{
    "category": "משכן",
    "name": "דמי שכירות",
    "description": "זכאות לקבלת סיוע בדמי שכירות",
    "source": "משרד הביטחון",
    "provider": "אגף כספים",
    "eligibility": "חייל בודד פעיל"
  }'
```

### Search rights

```bash
curl "http://localhost:3001/rights?search=משכן"
```

### Get rights by category

```bash
curl "http://localhost:3001/rights/category/משכן"
```

## Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with watch mode
- `npm run build` - Build the application
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
