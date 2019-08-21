INSERT INTO users (name, email)
VALUES ('Shia Lebouf', 'shialebouf@gmail.com'),
 ('Nima Boss', 'nima@hotmail.com'),
 ('Dungeon Masta', 'DnDmasta@gmail.com');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, street, country, city, province, post_code, active)
VALUES (1, 'Modern Loft', 'Description', 'http://thumbnailphoto.com', 'http://coverphoto.com', 350, 2, 2, 3, '102 Street', 'Canada', 'Vancouver', 'BC', 'V3X 3G4', True),
(2, 'Cheap Motel', 'Description', 'http://thumbnailphoto.com', 'http://coverphoto.com', 200, 1, 1, 1, '111 Something Road', 'Canada', 'Vancouver', 'BC', 'V3T 0K4', True),
(3, 'Apartment Downtown', 'Description', 'http://thumbnailphoto.com', 'http://coverphoto.com', 500, 3, 3, 4, 'Downtown Van 112 street', 'Canada', 'Vancouver', 'BC', 'V4N 5N5', True);


INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 4, 'message'),
(2, 3, 2, 3, 'message'),
(3, 2, 1, 5, 'message');

INSERT INTO rates (start_date, end_date, cost_per_night, property_id)
VALUES ('2019-09-21', '2019-09-26', 350, 1),
('2021-09-21', '2021-09-26', 200, 2),
('2019-09-21', '2019-09-26', 500, 3);

INSERT INTO guest_reviews (guest_id, owner_id, reservation_id, rating, message)
VALUES (1, 2, 3, 5, 'message'),
(2, 3, 2, 3, 'message'),
(3, 2, 3, 4, 'message');