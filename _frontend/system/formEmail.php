<?php
// AngularJS AJAX
$fileData = file_get_contents("php://input");
$ng_data = json_decode($fileData, true); //array

$to = $ng_data['form']['email']; // note the comma

// Subject
$subject = 'Missionlife - '.$ng_data['form']['name'];

// Message
function buildform($ng_data){
  $form = '';
  foreach ($ng_data['data'] as $key => $value) {
    $form = $form.'<tr><td><strong>'.$key.':</strong></td></tr><tr class="p"><td>'.$value['value'].'</td></tr>';
  }
  return $form;
}
$form = buildform($ng_data);

$message = '
<html>
<head>
  <title>Missionlife - '.$ng_data['form']['name'].'</title>
</head>
<style>
  .p{
    padding:4px;
  }
</style>
<body>
  <h3>Formular: '.$ng_data['form']['name'].'</h3>
  <table>'.$form.'
  </table>
</body>
</html>
';

// To send HTML mail, the Content-type header must be set
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=iso-8859-1';
// Additional headers
$headers[] = 'To: Missionlife <roman.moravcik1@gmail.com>';
$headers[] = 'From: missionlife.sk <noreply@missionlife.com>';
$headers[] = 'Cc: ';
$headers[] = 'Bcc: ';

// Mail it
mail($to, $subject, $message, implode("\r\n", $headers));
echo '<p>Email bol odoslany.</p>';
