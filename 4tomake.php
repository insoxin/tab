<?php
if($_SERVER['REQUEST_METHOD'] == 'POST'){
	$weixin = '姬长信';
	extract($_POST);

	$month = intval(substr($birthday,5,2));
	$day = intval(substr($birthday,8,2));
	
	if (empty($name) || $month < 1 || $month > 12 || $day < 1 || $day > 31){
		echo '-1';
		exit();
	}
	
	$signs = array(
		array('20'=>2),
		array('19'=>3),
		array('21'=>4),
		array('20'=>5),
		array('21'=>6),
		array('22'=>7),
		array('23'=>8),
		array('23'=>9),
		array('23'=>10),
		array('24'=>11),
		array('22'=>12),
		array('22'=>1)
	);
	list($start, $num) = each($signs[$month-1]);
	if ($day < $start){
		list($start, $num) = each($signs[($month-2 < 0) ? 11 : $month-2]);
	}

	$basePath = dirname(__FILE__).'/';
	$font1 = $basePath.'assets/font1.ttf';
	$font2 = $basePath.'assets/font2.ttf';
	$font3 = $basePath.'assets/font3.ttf';
	$source = $basePath.'assets/'.$num.'.jpg';
	$water = $basePath.'assets/footer.jpg';
	$savepath = 'images/'.date('Ym');
	$savename = md5($month.$day.$name).'.jpg';
	$savefile = $savepath .'/'. $savename;
	
	if(!is_dir($basePath.$savepath)){
		mkdir($basePath.$savepath,0777,true);
	}
	
	if(file_exists($savefile)){
		echo $savefile;
		exit();
	}
    
    if (!file_exists($source) || !file_exists($water)) {
        echo '-1';
		exit();
    }

    $source = imagecreatefromjpeg($source);
    if (!$source) {
        echo '-1';
		exit();
    }
    $water = imagecreatefromjpeg($water);
    if (!$water) {
        echo '-1';
		exit();
    }
    switch ($num) {
		case 9:
			$x=45;
			$y=238;
		break;
		default:
			$x=120;
			$y=185;
    }
	imagefttext($source, 18, 0, $x, $y, imagecolorallocate($source, 175,152,85), $font1, $month.'月'.$day.'日');
	$length = mb_strlen($name,'utf-8');
	$margin = 120;
	$left = 20;
	if($length <= 4){
		$margin = 140;
		$left = 40;
	}
	for($i = 0; $i < $length; $i++){
		imagefttext($source, 60, 0, $margin * $i + $left, 335, imagecolorallocate($source, 255,255,255), $font2, mb_substr($name,$i,1,'utf-8'));
	}
    imagecopymerge($source, $water, 40, 590, 0, 0, 110, 110, 100);
	imagefttext($source, 17, 0, 175, 630, imagecolorallocate($source, 180,180,180), $font3, '长按识别二维码，生成您的性格签名');
    imagefttext($source, 17, 0, 175, 670, imagecolorallocate($source, 180,180,180), $font3, '或关注“'.$weixin.'”公众号生成');
	imagejpeg($source, $basePath.$savefile);
    imagedestroy($source);
    imagedestroy($water);
	echo $savefile;
}else{
	echo '-1';
}