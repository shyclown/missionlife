<?
// receive amount from form on web page
require_once('tatrapay.php');

if(isset($_POST) && isset($_POST['ammount']) && is_int(intval($_POST['ammount']))){
  var_dump($_POST['ammount']);
  $setAmmount = $_POST['ammount'];
  $tatraPay = new TatraPay($setAmmount);
  $url = $tatraPay->GetUrl();
  header('Location: '.$url);
  $tatraPay->generateHMAC();
}
else{
  echo 'no ammount';
}
