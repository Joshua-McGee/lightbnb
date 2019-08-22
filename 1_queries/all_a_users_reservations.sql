SELECT properties.*, reservations.*, avg(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = property_id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = 1
  GROUP BY properties.id, reservations.id
  HAVING (now()::date > end_date)
  ORDER BY reservations.start_date
  LIMIT 10;