<h1 align="center">#BackEnd Bioskop Ticketing Project</h1>


## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)
5. <a href="https://redis.io/">Redis</a>
6. <a href="https://code.visualstudio.com/">Visual Studio</a>

## Install dependencies
1. "bcrypt": "^5.0.1",
2. "body-parser": "^1.19.2",
3. "cloudinary": "^1.29.0",
4. "compression": "^1.7.4",
5. "cors": "^2.8.5",
6. "dotenv": "^16.0.0",
7. "express": "^4.17.3",
8. "helmet": "^5.0.2",
9. "jsonwebtoken": "^8.5.1",
10. "morgan": "^1.10.0",
11. "multer": "^1.4.4",
12. "multer-storage-cloudinary": "^4.0.0",
13. "nodemailer": "^6.7.3",
14. "redis": "^4.0.4",
15. "nodemon": "^2.0.15",

## How to run the backend project

1. Open localhost, redis, and Visual studio code terminal
3. Running program with 'npm start'
4. Open <a href="https://www.postman.com/">postman</a> and make request syntax
5. For checking uploaded file, open <a href="https://cloudinary.com/home-3722">cloudinary</a>

## Link
HEROKU = https://project-fw6rifang.herokuapp.com/
CLOUDINARY = https://res.cloudinary.com/djanbjfvx/image/upload/v1650922804/

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
PORT=3001

#remote database
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_PORT=
MYSQL_DATABASE=
#remode redis
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
#remote cloud storage
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
#remote sending mailer
MAIL_CLIENT_ID=
MAIL_CLIENT_SECRET=
MAIL_REFRESH_TOKEN=
#remote payment
MIDTRANS_PRODUCTION=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
```
## END POINT
### Module Auth

**Used for authentication**

| No. | Method | Endpoint              | Information                      |
| --- | ------ | --------------------- | -------------------------------- |
| 1.  | POST   | /auth/register        | Used for register new user.      |
| 2.  | POST   | /auth/login           | Used for login into app.         |
| 3.  | POST   | /auth/refresh         | Used for refresh for token auth  |
| 4.  | POST   | /auth/logout          | Used for logout from system.     |

### Module User

**Used for any user feature**

| No. | Method | Endpoint                         | Information                                                                              |
| --- | ------ | -------------------------------- | ---------------------------------------------------------------------------------------- |
| 1.  | GET    | /user/:userId                    | Used for get user by id                                                                  |
| 2.  | PATCH  | /user/password/:userId           | Used to change password for user.                                                        |
| 3.  | PATCH  | /user/profile/:userId            | Used to change any info for example name and phone number.                               |
| 4.  | PACTH  | /user/image/:userId              | Used to change profile picture for user.                                                 |

### Module Movie

**Used to all about managing movie**

| No. | Method. | Endpoint                                                                     | Information                    |
| --- | ------- | ---------------------------------------------------------------------------- | ------------------------------ |
| 1.  | GET     | /movie?page=&limit=&searchName=&sort=&searchRelease=                         | Used for get all movie         |
| 2.  | GET     | /movie/:id                                                                   | Used for get movie by its id   |
| 3.  | POST    | /movie                                                                       | Used for creating new movie    |
| 4.  | PATCH   | /movie/:id                                                                   | Used for updating movie        |
| 5.  | DEL     | /movie/:id                                                                   | Used for deleting movie        |

### Module Schedule

**Used to all about managing schedule**

| No. | Method. | Endpoint                                                                     | Information                       |
| --- | ------- | ---------------------------------------------------------------------------- | --------------------------------- |
| 1.  | GET     | /schedule?page=&limit=&searchLocation=&sort=&searchByMovieId                 | Used for get all schedule         |
| 2.  | GET     | /schedule/:id                                                                | Used for get schedule by its id   |
| 3.  | POST    | /schedule                                                                    | Used for creating new schedule    |
| 4.  | PATCH   | /schedule/:id                                                                | Used for updating schedule        |
| 5.  | DEL     | /schedule/:id                                                                | Used for deleting schedule        |

### Module Booking

**Used for booking and menaging order data**

| No. | Method | Endpoint                                                  | Information                                   |
| --- | ------ | --------------------------------------------------------- | ----------------------------------------------|
| 1.  | GET    | /booking/user/:userId                                     | Used for get data booking by user id          |
| 2.  | GET    | /booking/id/:Id                                           | Used for get data booking by booking id       |
| 2.  | GET    | /booking/seat?scheduleId=&dateBooking=&timeBooking=       | Used for get data booking by seat option      |
| 2.  | GET    | /booking/dashboard?scheduleId=&movieId=&location=         | Used for get data booking for dashboard       |
| 2.  | POST   | /booking/booking                                          | Used for creating new booking                 |
| 2.  | PATCH  | /booking/ticket/:id                                       | Used for updating status ticket in active     |  
| 2.  | POST   | /booking/midtrans-notification                            | Used for notification after finish payment    |  

## License

© [Rifang Pri Asmara](https://github.com/AsmaraRP)
