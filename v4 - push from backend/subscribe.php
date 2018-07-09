<?php
$dbh = require __DIR__ . '/dbconnect.php';

if (count($_POST)) {
	if (!isset($_POST['endpoint'])) exit;
	$sth = $dbh->prepare('DELETE FROM subscriptions WHERE endpoint = :endpoint');
	$sth->bindValue(':endpoint', $_POST['endpoint'], PDO::PARAM_STR);
	$sth->execute();
	echo $sth->rowCount();
	exit;
}

$json = file_get_contents('php://input') or die('No data');
$subscription = json_decode($json, false, 4, JSON_BIGINT_AS_STRING) or die('Invalid subscription');
foreach ([$subscription->endpoint, $subscription->keys->p256dh, $subscription->keys->auth] as $val) {
	if (!preg_match('/^[\w:\/.=-]+$/', $val)) die('Invalid subscription data: ' . $val);
}
if (!isset($subscription->expirationTime))
	$subscription->expirationTime = null;

$sth = $dbh->prepare('INSERT subscriptions (endpoint, expirationTime, p256dh, auth) VALUES (:endpoint, :expirationTime, :p256dh, :auth)');
$sth->bindValue(':endpoint', $subscription->endpoint, PDO::PARAM_STR);
$sth->bindValue(':expirationTime', $subscription->expirationTime, PDO::PARAM_INT);
$sth->bindValue(':p256dh', $subscription->keys->p256dh, PDO::PARAM_STR);
$sth->bindValue(':auth', $subscription->keys->auth, PDO::PARAM_STR);
$sth->execute();
echo $dbh->lastInsertId();
?>