#DDS-Food

## About
Food pick-up ordering app that allows a customer to create and submit an order for pick-up from a restaurant. SMS notifications are sent to both the customer and the restaurant about the order and it's status.
## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Tech Stack
- Javascript
- Express
- jQuery
- EJS
- HTML 
- CSS
- PostgreSql
- Twilio

## Gallery
#### Homepage to Menu
![Homepage to Menu]()
#### Adding Items to Cart
![Adding Items to Cart]()
#### Edit Cart and Submit Order
![Edit Cart and Submit Order]()
#### Admin: Set Time Estimate/Mark Order Completed
![Admin: Set Time Estimate/Mark Order Completed]()
#### Order Complete
![Order Complete]()


## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
