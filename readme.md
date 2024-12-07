# THIS IS A TEMP MAINLY FOR BACKEND DO NOT FOCUS ON THE FRONTEND
dont mind the frontend I only used to to test api

## TECH STACK
- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQ**
- **Drizzle ORM**
- **AI (for workout generation)not yet implemented**

## HOW TO SETUP
1. Download and install Postgresql
2. create a database in PgAdmin
3. create a .env file in the backend folder 
```bash
DATABASE_URL= "postgresql://postgres:[password]@localhost:5432/[dbname]" //remove and replace the []
JWT_SECRET = 'your secret'
```
4. In you code editor cd backend and type
```bash
npm i
npx drizzle-kit push
npm run dev
```
## AFTER TEST REGISTER
```bash
POST
http://localhost:3000/auth/register
{
 "username":"guyNum20",
    "email":"imguy20@email.com",
    "password":"december",
    "age":"24",
    "gender":"Male",
    "height":"5.10",
    "weight":"60"
}
```
## API Documentation(not yet finished)
https://documenter.getpostman.com/view/40110318/2sAYBbeowV
