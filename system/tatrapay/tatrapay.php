<?php
// TatraPay

class TatraBanka
{
  // TEST
  const KEY = '31323334353637383930313233343536373839303132333435363738393031323132333435363738393031323334353637383930313233343536373839303132';
  const MID = '9999';
  const RSMS = '0911761474';
  const REM = 'roman.moravcik1@gmail.com';

	protected $AMT;
	protected $CURR;
	protected $VS;
	protected $RURL;
  protected $TIME;

	protected function GetSignature( $HMAC_STRING )
	{
    $keyBytes = pack("H*" , self::KEY); // konverzia do binárneho formátu
    $HMAC = hash_hmac("sha256", $HMAC_STRING, $keyBytes);
    return $HMAC;
	}
}

class TatraPay extends TatraBanka{

	protected function SanitizeFloat($flt){	return str_replace(',', '.', sprintf('%.2f', $flt));}

  public function __construct($AMT = '5', $CURR = '978', $VS = '0444', $RURL = 'http://www.missionlife.sk', $TIME = null)
	{
        date_default_timezone_set('UTC');
        // vstupne parametre
        $this->AMT = $this->SanitizeFloat($AMT); // suma platby
	      $this->CURR = $CURR; // mena "978" pre euro
				$this->VS = $VS; // variabilny symbol

        $this->RURL = $RURL; // navratova url
        $this->TIME = date('dmYHis'); // UTC TIME

        $HMAC_STRING = self::MID . $this->AMT . $this->CURR . $this->VS . $RURL . self::REM . $this->TIME;
				$HMAC = $this->GetSignature( $HMAC_STRING );
        $this->HMAC = $HMAC;
	}


	public function GetUrl()
	{
		$url = sprintf('https://moja.tatrabanka.sk/cgi-bin/e-commerce/start/tatrapay?MID=%s&AMT=%s&CURR=%s&VS=%s&RURL=%s&REM=%s&TIMESTAMP=%s&HMAC=%s',
      self::MID,
  		$this->AMT,
  		$this->CURR,
  		$this->VS,
  		$this->RURL,
      self::REM,
      $this->TIME,
  		$this->HMAC
		);
		return $url;
  }

	public function VerifyReply()
	{
    // PUBLIC
    $ecdsa = array(
      'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEaq6djyzkpHdX7kt8DsSt6IuSoXjpWVlLfnZPoLaGKc/2BSfYQuFIO2hfgueQINJN3ZdujYXfUJ7Who+XkcJqHQ==',
      'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE+Y5mYZL/EEY9zGji+hrgGkeoyccKD0/oBoSDALHc9+LXHKsxXiEV7/h6d6+fKRDb6Wtx5cMzXT9HyY+TjPeuTg==',
      'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEkvgJ6sc2MM0AAFUJbVOD/i34YJJ8ineqTN+DMjpI5q7fQNPEv9y2z/ecPl8qPus8flS4iLOOxdwGoF1mU9lwfA=='
    );

    $verified = openssl_verify($stringToVerify, pack("H*", $ECDSA), $publicKey, "sha256");
    if ($verified === 1) {
      return true;  // odpoveď verifikovaná
    }
    return false;
	}
}
