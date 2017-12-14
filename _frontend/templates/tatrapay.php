<article class="card">
  <div class="content shadow">
    <style>
    img.tp{ width: 100px; }
    p.tp strong{
      display: inline-block;
      width: 150px;
    }
    p.tp-min{
      background-color: #DCEDC8;
      padding: 1rem;
    }
    p.tp-oznam{
      background-color: #a00b00;
      padding: 1rem;
      color: white;
    }
    </style>
    <?php
    // If payment was completed
    require $_SERVER['DOCUMENT_ROOT'].'/system/tatrapay/verify.php';
    if(isset($_GET) && isset($_GET[''])){

      if(verifyTatraPay()){
        // thank for payment
        echo "<h3>Ďakujeme<h3>";
      }
    }
    ?>
    <img class="tp"  src="/TPlogo_black.png" alt="TatraPay Logo">
    <p>
      Prostredníctvom služby tatraPay môzete občianskemu združeniu poslať finančný dar, a tak podporiť jeho činnost.
    </p>
    <h3>Informácie o príjmatelovy finančného daru:</h3>
    <p class="tp">
        <strong>Číslo účtu:</strong> 2622076180 Tatrabanka 1100<br>
        <strong>IBAN:</strong> SK9711000000002622076180<br>
        <strong>Sídlo:</strong> OZ Mission Life, Zelená ul. 2, 811 01 Bratislava<br>
        <strong>IČO:</strong> 30 792 541<br>
        <strong>DIČ:</strong> 2021869080
    </p>
    <h3>Podmienky:</h3>
    <p class="tp-min">

      Výška darovanej sumy je dobrovolná. Minimálna suma obdarovania však je stanovená na 5 euro, Ďakujeme za pochopenie.
    </p>

    <h3>Suma ktorú chem darovať:</h3>
    <p>
      <form id="tatrapayForm" action="/system/tatrapay/testpay.php" method="post">
        <input type="text" name="ammount" value="" placeholder="Minimalne 5">
        <input type="submit" name="" value="Darovať cez TatraPay">
      </form>
    </p>
  </div>
</article>
