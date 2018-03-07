var documentWidth = document.body.clientWidth;
var documentHeight = document.body.clientHeight;

function init() {
	var buttonWidth = documentWidth*0.8;
	var buttonHeight = buttonWidth*90/618;

	$('.button').css({
		'width': buttonWidth +'px',
		'height': buttonHeight +'px',
		'position': 'absolute',
		'z-index': 10,
		'top': '77%',
		'left': '10%'
	});
	
	var pictureBoxWidth = documentWidth*0.94;
	var pictureBoxHeight = pictureBoxWidth*806/624;
	$('.picture-box').css({
		'width': pictureBoxWidth +'px',
		'height': pictureBoxHeight +'px',
		'position': 'relative',
		'margin-top': '2%',
		'margin-left': '3%'
	});

	var pictureWidth = pictureBoxWidth*0.96;
	var pictureHeight = pictureWidth*710/600;
	$('.picture').css({
		'width': pictureWidth +'px',
		'height': pictureHeight +'px',
		'position': 'absolute',
		'z-index': '1',
		'bottom': '2%',
		'left': '2%'
	});

	$('.scan').css({
		'width': pictureWidth +'px',
		'height': pictureHeight +'px',
		'position': 'absolute',
		'z-index': '2',
		'top': '2%',
		'left': '2%'
	});
	
	var textWidth = documentWidth*0.94;
	var textHeight = buttonWidth*109/611;

	$('.text').css({
		'width': textWidth +'px',
		'height': textHeight +'px',
		'position': 'relative',
		'margin-top': '5%',
		'left': '3%'
	});
}

function checkName() {
	$('.user-name').val($('.user-name').val().replace(/[^\u4E00-\u9FA5]/g,''));
}

var waitHandler = null;
function makePicture() {
	var name = $('.user-name').val();
	if(name == '') {
		alert('请输入姓名(姬长信)');return;
	}
	
	switch(name.length) {
		case 2:
			name = '我是'+ name;
			break;
		case 3:
			name = '我是'+ name;
			break;
		case 4:
			name = '我'+ name;
			break;
		default:
			break;
	}

	var birthday = $('.user-birthday').val();
	if(birthday == '') {
		alert('请选择出生日期');return;
	}
	
	$('.transparent-float').css('display', 'block');
	$('.float').css('display', 'block');
	$('.scan').css('display', 'block');

	$('.mypicture').attr('src', '');
	$('.mypicture').css('display', 'none');
	$('.button').css('display', 'none');
	
	$.ajax({
		type:'POST',
		url:'4tomake.php',
		data:'name='+ name +'&birthday='+ birthday +'&subtype=2',
		timeout:6000,
		success:function(response){		
			if(response != '-1') {
				var img = new Image();  
				img.src = response;
				img.onload = function(){
					$('.mypicture').attr('src', response);
				};
			}
		},
		error:function(){}
	})

	waitHandler = setInterval("waitLoading()", 1200)
}

var waitText = ['姓名计算中...', '年份计算中...', '生日计算中...'];
var waitNum = 0;
function waitLoading() {
	if(waitNum == waitText.length) {
		clearInterval(waitHandler);
		waitNum = 0;

		var imgUrl = $('.mypicture').attr('src');

		if(imgUrl == '') {
			$('.scan').html("<br/><br/><br/><br/>&nbsp;&nbsp;Sorry，本次标签卡生成失败，请联系站长检查配置");

			return;
		}
		else {
			$('.mypicture').css('display', 'block');
			
			$('.scan').html('');
			$('.scan').css('display', 'none');

			return;
		}
	}

	var content = $('.scan').html();
		content += "<br/><br/><br/><br/>";
		content += waitText[waitNum];

	$('.scan').html(content);
	
	waitNum++;
}

function pointAnimation() {
	var content = $('.scan').html();

	if(content.split('.').length >= 4) {
		clearInterval(pointHandler);
		
		content = '';
		for(var i=0; i<waitNum; i++) {
			content += "<br/><br/><br/><br/>&nbsp;&nbsp;";
			content += waitEnd[i];
		}
	
		$('.scan').html(content);

		setTimeout("waitLoading()", 300);
	}
	else {
		content += '.';
		
		$('.scan').html(content);
	}
}

function closeFloat() {
	$('.button').css('display', 'block');

	$('.transparent-float').css('display', 'none');
	$('.float').css('display', 'none');
}