window.onload = function()                       
{
    var canvas = document.getElementById('mon_canvas');	
        if(!canvas)
        {
            alert("Impossible de récupérer le canvas");
            return;
        }

    var context = canvas.getContext('2d');
        if(!context)
        {
            alert("Impossible de récupérer le context du canvas");
            return;
        }

    var myInterval = setInterval(animate, 1000/100);	// 30 fois par seconde

 var x=10;		// abscisse initiale du centre du cercle
 var y=10;		// ordonnée iniiale du centre du cercle
 var a=1;		// incrément de déplacement horizontal
 var b=1;		// incrément de déplacement vertical
 var W=300;		// largeur du rectangle 
 var H=300;     // hauteur du rectangle
 var R=10;      // rayon du cercle 
 var largeur = 10; // largeur de la raquette
 var longueur = 80; //longueur de la raquette
 var bordure = 20; // bordure de la raquette
 var pos_x = 0;
 var pos_y = 280;
 var GameOver=0;
 var score=0;
 var scoreText;
function animate()
 {	
   // Rectangle
   context.fillStyle = "rgb(0, 0, 0)"; 
   context.fillRect(0, 0, W, H);
   // Balle
   context.beginPath(); 			// Début d'un nouveau tracé.
   context.fillStyle = "rgb(255, 255, 255)"; 
   
   context.arc(x,y,R, 0, Math.PI*2); 
   context.fill();					 // Méthode fill(); - forme pleine
   context.closePath();
   
   x = x+a;
   y = y+b;
   if(x>=R && x<=W-R){
	if(y<=R){
		b=getRandom(1, score+1);
	}
	if(y>=H-R && GameOver==0){
		alert("Tu as perdu ! Ton score est de " + score + " points !");
		GameOver=1;
		location.reload();
	}
   }
   
   if(y>= R && y<= H-R) {
	if(x<=R) {
		a=getRandom(1, score+1); }
	if(x>=W-R) {
		a=-getRandom(1, score+1)	}
		}
	//Raquette
	context.beginPath();
	context.fillRect(pos_x, pos_y, longueur, largeur); 
	context.fill();
	context.closePath();
	
	window.addEventListener('keydown',lect_clavier,true);
	
	if(x>=pos_x && longueur>=x-pos_x &&y>=pos_y-R ){
	b=-1;
	score++;
	}
	document.getElementById('score').innerHTML = "Score: " + score;
	
	
}

function lect_clavier(evt){
	switch (evt.keyCode) {
		case 37: 
			if(pos_x>=longueur-70){
			pos_x = pos_x-10;
			}
			break;
		case 39:
			if(pos_x<=longueur+130){
			pos_x = pos_x+10;
			}
			break;
	}
	}
 function getRandom(min, max){				// On renvoie un ENTIER aléatoire 
	 min=Math.ceil(min);								// compris entre min et max
	 max=Math.floor(max);
	 return Math.floor(Math.random()*(max-min))+min;
 }
}