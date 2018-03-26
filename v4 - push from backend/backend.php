<!doctype html>
<html lang="de">
	<head>
		<meta charset="utf-8"/>
	  <meta name="author" content="Herbert Braun"/>
		<title>Push-Backend</title>
		<link rel="stylesheet" href="../common/less-ugly.css">
	</head>
	<body>
		<h1>Push-Backend</h1>
<?php if (!count($_POST)) { ?>
		<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST">
			<label>
				Name:
				<input type="text" name="name">
			</label>
			<label>
				Passwort:
				<input type="password" name="password">
			</label>
			<label>
				Nachricht:
				<input type="text" name="payload">
			</label>
			<input type="submit" value="Versand vorbereiten">
		</form>
<?php } else {

	if ($_POST['name'] !== 'login')
		exit;
	if ($_POST['password'] !== 'SuperSecretPasswrd')
		exit;

	$dbh = require './dbconnect.php';

	define('PUBKEY', file_get_contents('./pubkey.txt'));
	define('PVTKEY', 'YourPrivateKey');

	echo '<output>';
	$result = $dbh->query('SELECT * FROM subscriptions');
	while ($row = $result->fetchObject()) {
		echo 'web-push send-notification';
		echo ' --endpoint=' . $row->endpoint;
		echo ' --key=' . $row->p256dh;
		echo ' --auth=' . $row->auth;
		echo ' --vapid-pubkey=' . PUBKEY;
		echo ' --vapid-pvtkey=' . PVTKEY;
		echo ' --vapid-subject=mailto:wortwart@woerter.de';
		echo ' --ttl=300';
		echo ' --payload="' . $_POST['payload'] . '"';
		echo "\n";
	}
	echo '</output>';
	echo '<a href="' . $_SERVER['PHP_SELF'] . '">Zum Formular</a>';
}
?>

	</body>
</html>
