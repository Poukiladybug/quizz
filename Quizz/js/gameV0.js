let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

let restartQuizz;
let goodAnswerSound, badAnswerSound;
let score = 0;
let n = 28;
let currentQuestionIndex = 0;
let game = new Phaser.Game(config);
let backgroundImage;
let answerImage = [];
let answerText = [];
let starImage = [];
let answerNumber = 3; // Ou quizz.questions[0].answers.lenght --> la longueur de la liste de réponses par questions //
let questionImage;
let questionText;
let playButtonImage
let quizzString ; // = '{ "questions": [ { "title": "Quel célèbre dictateur dirigea l’URSS du milieu des années 1920 à 1953 ?", "answers": ["Lenine", "Staline", "Molotov"], "goodAnswerIndex" : 1 }, {"title": "Ma deuxième question", "answers": ["Réponse 0", "Réponse 1", "Réponse 2"],"goodAnswerIndex" : 0}]}';
let quizz; // = JSON.parse(quizzString);

/*
let quizz = { "questions": [ 
    { 
        "title": "Quel célèbre dictateur dirigea l’URSS du milieu des années 1920 à 1953 ?", 
        "answers": [
            "Lenine", 
            "Staline", 
            "Molotov"], 
        "goodAnswerIndex" : 1 }, 
    {
        "title": "Ma deuxième question", 
        "answers": [
            "Réponse 0", 
            "Réponse 1", 
            "Réponse 2"],
            "goodAnswerIndex" : 0}
        ]
    };
*/


function preload() {
    this.load.image('background', './assets/Sprites/background.png');
    this.load.image('labelquestion', './assets/Sprites/Label1.png');
    this.load.image('labelanswer', './assets/Sprites/Label2.png');
    this.load.json('questions', './assets/data/questionsZarb.json');
    this.load.image('playButton', './assets/Sprites/Play.png');
    this.load.image('starImage', './assets/Sprites/Star.png');
    this.load.audio('goodSound','./assets/Sound/good.wav');
    this.load.audio('badSound','./assets/Sound/wrong.wav');
    this.load.image('quizz', './assets/Sprites/Windows3.png');
    this.load.image('playQuizz', './assets/Sprites/Menu.png');
    this.load.image('restart', './assets/Sprites/Restart.png');
    loadFont("geekFont", "./assets/Fonts/geekFont.TTF"); 
}

function create() {
    quizz = this.cache.json.get('questions');
    backgroundImage = this.add.image(0, 0, 'background'); 
    backgroundImage.setOrigin(0, 0); 
    backgroundImage.setScale(0.5);

    welcomeImage= this.add.image(300, 300, 'quizz')
    welcomeImage.setScale(0.9);
    quizzText = this.add.text(270, 115, "QUIZZ", { fontFamily: 'geekFont', fontSize: 18, color: '#00ff00' });
    welcomeText = this.add.text(115, 280, "Appuyez sur le bouton pour commencer", { fontFamily: 'geekFont', fontSize: 18, color: '#00ff00' });
    startQuizz = this.add.image(300,375, 'playQuizz').setInteractive();
    startQuizz.setScale(0.5);
    startQuizz.on('pointerdown', displayGameScreen);

    restartQuizz= this.add.image(300, 375, 'restart').setInteractive();
    restartQuizz.setScale(0.5);
    restartQuizz.on('pointerdown', restartGame);
    restartQuizz.setVisible(false);

    questionImage = this.add.image(300, 100, 'labelquestion');
    questionImage.setScale(0.5);
    questionImage.setVisible(false);
    for(let i=0; i<answerNumber; i++) {
        answerImage[i] = this.add.image(300, 220 + i*110 , 'labelanswer').setInteractive();
        answerImage[i].on('pointerdown',  () => {checkAnswer(i)});
        answerImage[i].setScale(1.0);
        answerImage[i].setVisible(false);
    }
    questionText = this.add.text(130, 90, quizz.questions[0].title, { fontFamily: 'geekFont', fontSize: 18, color: '#00ff00' });
    questionText.setVisible(false);
    for(let i=0; i<answerNumber; i++) {
        answerText[i] = this.add.text(190, 210+i*110, quizz.questions[0].answers[i], { fontFamily: 'geekFont', fontSize: 18, color: '#000000' });
        answerText[i].setVisible(false);
    }
    playButtonImage = this.add.image(300, 530, 'playButton').setInteractive();
    playButtonImage.on('pointerdown',  displayNextQuestion);
    playButtonImage.setScale(0.3);
    playButtonImage.setVisible(false);
    // ou playButtonImage.alpha = 0 
    for (let i = 0; i<quizz.questions.length; i++){ //10 = quizz.questions.length
        starImage[i] = this.add.image(n,600,'starImage');
        starImage[i].setScale(0.2);
        n+=60;
        starImage[i].alpha = 0.5;
        starImage[i].setVisible(false);
    }
    goodAnswerSound = this.sound.add('goodSound');
    badAnswerSound = this.sound.add('badSound');
}

function update() {

}


function checkAnswer(answerIndex){
    if (answerIndex==quizz.questions[currentQuestionIndex].goodAnswerIndex) {
        starImage[currentQuestionIndex].alpha = 1;
        score ++;
        goodAnswerSound.play()
    } 
    else {
        starImage[currentQuestionIndex].setTint(0xff0000);
        badAnswerSound.play();
    }
    if (currentQuestionIndex<quizz.questions.length){
        playButtonImage.setVisible(true);
    }  
    for (let i =0; i<answerNumber; i++){
        answerImage[i].disableInteractive();
        if (i == quizz.questions[currentQuestionIndex].goodAnswerIndex){
            answerText[i].setColor('#00ff00');
        }
        else{
            answerText[i].setColor('#ff0000');
        }
        
    }
}

function displayNextQuestion(){
    currentQuestionIndex ++;
    if(currentQuestionIndex>quizz.questions.length){
        displayGameOver();
    }
    else{
        questionText.text = quizz.questions[currentQuestionIndex].title;
    for (let i = 0; i<answerNumber; i++){
        answerText[i].text= quizz.questions[currentQuestionIndex].answers[i];
        answerText[i].setColor('#000000')
    }
    playButtonImage.setVisible(false);
    for (let i =0; i<answerNumber; i++){
        answerImage[i].setInteractive();
    }
    }
    
}

function displayGameScreen(){
    welcomeImage.setVisible(false);
    quizzText.setVisible(false);
    welcomeText.setVisible(false);
    startQuizz.setVisible(false);
    questionImage.setVisible(true);
    questionText.setVisible(true);
    for(let i=0; i<answerNumber; i++) {
        answerImage[i].setVisible(true);
        answerText[i].setVisible(true);
    }
    for (let j = 0; j<quizz.questions.length; j++){
        starImage[j].setVisible(true);
        starImage[j].tint = 0xffffff;
        starImage[j].alpha= 0.5;
    }
}

function displayGameOver(){
    welcomeImage.setVisible(true);
    quizzText.setVisible(true);
    welcomeText.setVisible(true);
    welcomeText.text= "Vous avez un score de " + score + " sur " +quizz.questions.length +1 +"! \n Pressez le bouton pour recommencer";
    restartQuizz.setVisible(true);
    playButtonImage.setVisible(false);
    questionImage.setVisible(false);
    questionText.setVisible(false);
    for(let i=0; i<answerNumber; i++) {
        answerImage[i].setVisible(false);
        answerText[i].setVisible(false);
    }
}

function restartGame(){
    currentQuestionIndex = -1;
    displayNextQuestion();
    restartQuizz.setVisible(false);
    displayGameScreen();
    score = 0;   
}

function loadFont(name, url) {     
    var newFont = new FontFace(name, `url(${url})`);     
    newFont.load().then(function (loaded) {         
        document.fonts.add(loaded);     }).catch(function (error) {         
            return error;     
        }); } 

/*

- quizz
    - question []
        -title (string)
        -answer [] (string)
        -goodAnswerIndex (int)

Implémentation dans :
    - une Base de données
    - CSV
    - XML
    - JSON
    - YAML

XML :
    <quizz>
        <question>
            <title>la première question ?</title>
            <answer i="0"> Réponse 0</answer>
            <answer i="1"> Réponse 1</answer>
            <answer i="2"> Réponse 2</answer>
            <goodAnswerIndex>1</goodAnswerIndex>
        </question>
    </quizz>

YAML :
    quizz :
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 1
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 0

JSON :
    {
        "questions":[
            {
                "title": "Ma premère question",
                "answer": ["réponse 0", "Réponse 1"],
                "goodAnswerIndex" : 1
            },
            {
                "title": "Ma deuxième question",
                "answer": ["réponse 0", "Réponse 1"],
                "goodAnswerIndex" : 0
            }
        ]
    }

    */
