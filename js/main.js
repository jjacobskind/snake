$(document).ready(function() {
	var direction = 2;
	$(document).keydown(function(e) {
		if((direction===2) || (direction===4)){
			if(e.keyCode == 38) {
				direction=1;
			}
			else if(e.keyCode==40){
				direction=3;
			}
		} else {
			if(e.keyCode == 37) {
				direction=4;
			}
			else if(e.keyCode==39){
				direction=2;
			}
		}
	})

	var snake_width = 12;
	var half_width = snake_width/2;
	var quarter_width = snake_width/4;
	var dist = 12;
	var game_space = document.getElementById("gameSpace");
	var game_width = $("#gameSpace").width();
	var game_height = $("#gameSpace").height();
	var score = 0;
	var ms = 50;
	paint = game_space.getContext("2d");
	paint.fillStyle = "#000000";
	var snake = [[snake_width*10, snake_width*20, 2], [snake_width*9, snake_width*20, 2], [snake_width*8, snake_width*20, 2]];
	var snake_reset = snake;
	var speed = setInterval(move, ms);
	var chipx = (Math.floor(Math.random() * 40)*snake_width) + (snake_width/2);
	var chipy = (Math.floor(Math.random() * 40)*snake_width) + (snake_width/2);

	function move() {
		var x = snake[0][0];
		var y = snake[0][1];
		if (direction===1) {
			y-=dist;
		} 
		else if(direction===2) {
			x+=dist;
		}
		else if(direction===3) {
			y+=dist;
		}
		else if(direction===4) {
			x-=dist;
		}
		if((y<game_height) && (y>=0) && (x<game_width) && (x>=0)) {
			var collide = false;
			var i=0;
			while((i<snake.length) && (collide===false)) {
				if((x===snake[i][0]) && (y===snake[i][1])) collide=true;
				i++;
			}
			if(collide===true) {

			}
			else if((x+(snake_width/2)===chipx) && (y+(snake_width/2)===chipy))
			{
				score+=1;
				$("#wrapper>h2").text("Score: " + score);
				chipx = (Math.floor(Math.random() * 40)*snake_width) + (snake_width/2);
				chipy = (Math.floor(Math.random() * 40)*snake_width) + (snake_width/2);
				snake.unshift([x,y, direction]);
			}
			else {
				snake.pop();
				snake.unshift([x,y, direction]);
			}
			paint.fillStyle = "#abf";
			paint.fillRect(0,0,game_width, game_height);
			paint.fillStyle = "#500";
			paint.beginPath();
			paint.arc(chipx,chipy, snake_width/2, 0, Math.PI*2);
			paint.stroke();
			paint.fill();
			for(i=0;i<snake.length;i++) {
				x = snake[i][0];
				y = snake[i][1];
				paint.fillStyle = "#000";
				if(i===0) {
					paintEnds(x, y, snake[i][2]);
				}
				else if (i===snake.length-1){
					switch(snake[i-1][2]) {
						case 1:
							paintEnds(x, y, 3);
							break;
						case 2:
							paintEnds(x, y, 4);
							break;
						case 3:
							paintEnds(x, y, 1);
							break;
						case 4:
							paintEnds(x, y, 2);
							break;
					}
				}
				else if(snake[i][2]!==snake[i-1][2]) {
					var corner = 0.75;
					if(((snake[i][2])===2 && (snake[i-1][2]===1)) || ((snake[i][2])===3 && (snake[i-1][2]===4))) {
						//Used for snake turning right->up AND down->left
						paint.beginPath();
						paint.arc(x, y, snake_width, Math.PI/2, 0, true);
						paint.lineTo(x+snake_width, y-quarter_width);
						paint.lineTo(x,y-quarter_width);
						paint.arc(x-quarter_width,y-quarter_width, quarter_width, 0, Math.PI/2);
						paint.lineTo(x-quarter_width, y+snake_width);
						paint.closePath();
						paint.fill();
					}
					else if(((snake[i][2])===2 && (snake[i-1][2]===3)) || ((snake[i][2])===1 && (snake[i-1][2]===4))) {
						//Used for snake turning right->down AND up->left
						paint.beginPath();
						paint.arc(x, y+snake_width, snake_width, 0, Math.PI*1.5, true);
						paint.lineTo(x-quarter_width, y);
						paint.lineTo(x-quarter_width,y+snake_width);
						paint.arc(x-quarter_width,y+(5*quarter_width), quarter_width, Math.PI*1.5, 0);
						paint.closePath();
						paint.fill();
					}
					else if(((snake[i][2])===4 && (snake[i-1][2]===3)) || ((snake[i][2])===1 && (snake[i-1][2]===2))) {
						//Used for snake turning left->down AND up->right
						paint.beginPath();
						paint.arc(x+snake_width, y+snake_width, snake_width, Math.PI*1.5, Math.PI, true);
						paint.lineTo(x, y+(quarter_width*5));
						paint.lineTo(x+snake_width,y+(quarter_width*5));
						paint.arc(x+(quarter_width*5),y+(quarter_width*5), quarter_width, Math.PI, Math.PI*1.5);
						paint.closePath();
						paint.fill();
					}
					else if(((snake[i][2])===4 && (snake[i-1][2]===1)) || ((snake[i][2])===3 && (snake[i-1][2]===2))) {
						//Used for snake turning left->up AND down->right
						paint.beginPath();
						paint.arc(x+snake_width, y, snake_width, Math.PI/2, Math.PI);
						paint.lineTo(x, y-quarter_width);
						paint.lineTo(x+snake_width,y-quarter_width);
						paint.arc(x+(quarter_width*5),y-quarter_width, quarter_width, Math.PI, Math.PI/2, true);
						paint.closePath();
						paint.fill();
					}
				}
				else {
					paint.fillRect(x,y,snake_width, snake_width);
				}
			}
		}
		else {
			clearInterval(speed);
			$("#gameOver").fadeIn(200);
		}
		
		
	}

	function paintEnds(x, y, direct) {
		paint.fillStyle = ("#000");
		switch(direct) {
			case 1:
				paint.fillRect(x, y+half_width, snake_width, half_width);
				paint.beginPath();
				paint.arc(x+half_width, y+half_width, half_width-1, 0, Math.PI, true);
				paint.stroke();
				paint.fill();
				break;
			case 2:
				paint.fillRect(x, y, half_width, snake_width);
				paint.beginPath();
				paint.arc(x+half_width, y+half_width, half_width-1, Math.PI*1.5, Math.PI/2);
				paint.stroke();
				paint.fill();
				break;
			case 3:
				paint.fillRect(x, y, snake_width, half_width);
				paint.beginPath();
				paint.arc(x+half_width, y+half_width, half_width-1, 0, Math.PI);
				paint.stroke();
				paint.fill();
				break;
			case 4:
				paint.fillRect(x+half_width, y, half_width, snake_width);
				paint.beginPath();
				paint.arc(x+half_width, y+half_width, half_width-1, Math.PI/2, Math.PI*1.5);
				paint.stroke();
				paint.fill();
				break;
		}
	}

	$("#new").on("click", function(){
		$("#gameOver").fadeOut(100);
		$("#wrapper>h2").text("Score: 0");
		snake = [[snake_width*10, snake_width*20, 2], [snake_width*9, snake_width*20, 2], [snake_width*8, snake_width*20, 2]];
		score=0;
		direction=2;
		chipx = (Math.floor(Math.random() * 40)*snake_width) + (snake_width/2);
		chipy = (Math.floor(Math.random() * 40)*snake_width) + (snake_width/2);
		speed = setInterval(move, ms);
	});
});