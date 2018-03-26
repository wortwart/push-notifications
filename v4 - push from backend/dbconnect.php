<?php
try {
	$whitelist = ['127.0.0.1', '::1'];
	if (in_array($_SERVER['REMOTE_ADDR'], $whitelist)) {
		$dbh = new PDO('mysql:dbname=webpush;host=127.0.0.1', 'root', '');
	} else {
		$dbh = new PDO('mysql:dbname=DBNAME;host=HOST', 'USER', 'PASSWORD');
	}
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
	print_r($e);
	exit;
}
return $dbh;
?>