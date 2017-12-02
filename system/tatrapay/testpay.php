<?
// receive amount from form on web page
require_once('tatrapay.php');

if(isset($_POST) && isset($_POST['ammount']) && is_int($_POST['ammount'])){
  $setAmmount = $_POST['ammount'];
  $tatraPay = new TatraPay;
  $url = $tatraPay->GetUrl();
  header('Location: '.$url);
}
