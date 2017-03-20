<?
require_once('tatrapay.php');

$tp = new TatraPay;
var_dump($tp);
var_dump($tp->GetUrl());


//header('Location: ' . $tp->GetUrl());
