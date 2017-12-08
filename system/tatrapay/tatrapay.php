<?php
// TatraPay

class TatraBanka
{
  const KEY = '43626f62344749444b34777a59465f6148747731434c3644753764726f425f584f6662454a645356753166376a536138337a3477485077366478675731444e32';
  const MID = '4891';
  const RSMS = '';
  const REM = 'roman.moravcik1@gmail.com';

	protected $AMT;
	protected $CURR;
	protected $VS;
	protected $RURL;
  protected $TIME;

  protected $STRING;

	protected function GetSignature( $HMAC_STRING )
	{
    $keyBytes = pack("H*" , self::KEY); // konverzia do binárneho formátu
    $HMAC = hash_hmac("sha256", $HMAC_STRING, $keyBytes);
    return $HMAC;
	}
}

class TatraPay extends TatraBanka{

	protected function SanitizeFloat($flt){	return str_replace(',', '.', sprintf('%.2f', $flt));}

  public function __construct($AMT = '5', $CURR = '978', $VS = '0444', $RURL = 'https://www.missionlife.sk/_frontend/tatrapay/', $TIME = null)
	{
        $AMT = $this->SanitizeFloat($AMT);
        if($AMT < 5){$AMT = 5;} // min 5
        date_default_timezone_set('UTC');

        // vstupne parametre
        $this->AMT = $AMT; // suma platby
	      $this->CURR = $CURR; // mena "978" pre euro
				$this->VS = $VS; // variabilny symbol

        $this->RURL = $RURL; // navratova url
        $this->TIME = date('dmYHis'); // UTC TIME

        $HMAC_STRING = self::MID . $this->AMT . $this->CURR . $this->VS . $RURL . self::REM . $this->TIME;
        $this->STRING = $HMAC_STRING;
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
  // test HMAC

  public function generateHMAC(){
    var_dump($this->STRING);
    var_dump($this->HMAC);
  }

}
