<!doctype html>
<html lang="de">
	<head>
		<meta charset="utf-8">
		<meta name="author" content="Herbert Braun">
		<title>Push-Benachrichtigungen</title>
		<link rel="stylesheet" href="../common/less-ugly.css">
		<script src="push.js" defer></script>
	</head>
	<body>
		<h1>Push-Benachrichtigungen</h1>
		<form action="#">
			<input type="hidden" value="<?php echo file_get_contents('./pubkey.txt'); ?>">
			<button disabled>Push-Nachrichten nicht möglich</button>
		</form>
	</body>
</html>