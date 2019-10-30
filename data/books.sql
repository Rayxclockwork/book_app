DROP TABLE books;
CREATE TABLE IF NOT EXISTS books(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf  VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description) VALUES ('Neil Gaiman, Terry Pratchett', 'Good Omens', 'ISBN_13 9780061991127', 'https://books.google.com/books/content?id=-o-2KpQlFNsC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api(18 kB)
https://books.google.com/books/content?id=-o-2KpQlFNsC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api
','The classic collaboration from the internationally bestselling authors Neil Gaiman and Terry Pratchett, soon to be an original series starring Michael Sheen and David Tennant. “Good Omens . . . is something like what would have happened if Thomas Pynchon, Tom Robbins and Don DeLillo had collaborated. Lots of literary inventiveness in the plotting and chunks of very good writing and characterization. It’s a wow. It would make one hell of a movie. Or a heavenly one. Take your pick.”—Washington Post According to The Nice and Accurate Prophecies of Agnes Nutter, Witch (the world''s only completely accurate book of prophecies, written in 1655, before she exploded), the world will end on a Saturday. Next Saturday, in fact. Just before dinner. So the armies of Good and Evil are amassing, Atlantis is rising, frogs are falling, tempers are flaring. Everything appears to be going according to Divine Plan. Except a somewhat fussy angel and a fast-living demon—both of whom have lived amongst Earth''s mortals since The Beginning and have grown rather fond of the lifestyle—are not actually looking forward to the coming Rapture. And someone seems to have misplaced the Antichrist . . .');

INSERT INTO books (author, title, isbn, image_url, description) VALUES ('Christian Moerk', 'Darling Jim', 'ISBN_13 9780805089479', 'http://books.google.com/books/content?id=IEM1zgMvyxcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api(13 kB)
http://books.google.com/books/content?id=IEM1zgMvyxcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api
','When two sisters and their aunt are found dead in their suburban Dublin home, it seems that the secret behind their untimely demise will never be known. But then Niall, a young mailman, finds a mysterious diary in the post office''s dead-letter bin. From b');

SELECT * FROM books;

