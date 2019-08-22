const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/* 
SELECT id, name, email, password
FROM users
WHERE email = 'tristanjacobs@gmail.com';
*/

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT *
    FROM users
    WHERE email = $1;
  `, [email])
  .then(res => res.rows[0]);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT *
    FROM users
    WHERE id = $1
  `, [id])
  .then(res => res.rows[0]);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password) 
  VALUES ($1, $3, $2) 
  RETURNING *;
  `, [user.name, user.password, user.email])
  .then(res => res.rows[0]);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT properties.*, reservations.*, avg(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  HAVING (now()::date > end_date)
  ORDER BY reservations.start_date
  LIMIT $2;
  `, [guest_id, limit])
  .then(res => res.rows);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit) {
   // 1
   const queryParams = [];
   // 2
   let queryString = `
   SELECT properties.*, avg(property_reviews.rating) as average_rating
   FROM properties
   JOIN property_reviews ON properties.id = property_id
   `;
 
   // 3
   if (options.city) {
     queryParams.push(`%${options.city}%`);
     queryString += `${queryParams.length === 1 ? "WHERE" : "AND"} city LIKE $${queryParams.length} `;
     console.log('first query string', queryString);
   }

   if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `${queryParams.length === 1 ? "WHERE" : "AND"} owner_id = $${queryParams.length} `;
   }

   if(options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(parseInt(options.minimum_price_per_night) * 100);
    queryParams.push(parseInt(options.maximum_price_per_night) * 100);
    queryString += `${queryParams.length === 1 ? "WHERE" : "AND"} cost_per_night BETWEEN $${queryParams.length -1} AND
    $${queryParams.length} `;
   }
 
   // 4
   queryParams.push(limit);
   queryString += `
   GROUP BY properties.id `;
   if(options.minimum_rating) {
    queryParams.push(parseInt(options.minimum_rating));
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
    queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length -1};
    `;
    // need this else because if this is not run we want to return queryParams.length
    // this will give us the last $ in the array, however the above needs to work together
    // hence the -1 on queryParams otherwise they reference the same paramenter.
   } else {
   queryString += `
   ORDER BY cost_per_night
   LIMIT $${queryParams.length};
   `;
  }
 
   // 5
   console.log(queryString, queryParams);
 
   // 6
   return pool.query(queryString, queryParams)
   .then(res => res.rows);

}
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  return pool.query(`
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
  RETURNING *;
  `, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
  .then(res => res.rows[0]);
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
}
exports.addProperty = addProperty;
