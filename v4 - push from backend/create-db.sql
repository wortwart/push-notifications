CREATE DATABASE webpush;
USE webpush;
CREATE TABLE subscriptions (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	endpoint VARCHAR(511) NOT NULL UNIQUE,
	expirationTime BIGINT(13) NULL,
	p256dh VARCHAR(88) NOT NULL,
	auth VARCHAR(24) NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8;
