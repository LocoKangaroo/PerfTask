import React, { useState, useEffect } from 'react';
import './App.css';

// constants defining the dimensions & properties of the game board, paddles, and ball
const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
var PADDLE_SPEED = 20; //variable PADDLE_SPEED allows us to either stop the paddles from moving while the game is paused
const BALL_SPEED = 3;
const PAUSE_TIME = 3000; // 1 second pause after scoring
const MAX_SCORE = 3; // max score to end the game
var gameStatePaused = false; //game state for stoping the paddles from moving and for an accurate output in the output div
var displayMessage = false; 
var displayScore1 = false; 
var displayScore2 = false; 

function App() {
  const [paddle1Y, setPaddle1Y] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [paddle2Y, setPaddle2Y] = useState(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballX, setBallX] = useState(BOARD_WIDTH / 2 - BALL_SIZE / 2);
  const [ballY, setBallY] = useState(BOARD_HEIGHT / 2 - BALL_SIZE / 2);
  const [ballSpeedX, setBallSpeedX] = useState(BALL_SPEED);
  const [ballSpeedY, setBallSpeedY] = useState(BALL_SPEED);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // unpause the game when starting
  const [gameOver, setGameOver] = useState(false); // new state to track game over
  const [gameStarted, setGameStarted] = useState(false); // new state to track if the game has started

  useEffect(() => {
    if (!gameStarted) return; // don't run if game hasn't started

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        setPaddle2Y(prevY => Math.max(prevY - PADDLE_SPEED, 0));
      } else if (e.key === 'ArrowDown') {
        setPaddle2Y(prevY => Math.min(prevY + PADDLE_SPEED, BOARD_HEIGHT - PADDLE_HEIGHT));
      } else if (e.key === 'w') {
        setPaddle1Y(prevY => Math.max(prevY - PADDLE_SPEED, 0));
      } else if (e.key === 's') {
        setPaddle1Y(prevY => Math.min(prevY + PADDLE_SPEED, BOARD_HEIGHT - PADDLE_HEIGHT));
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || isPaused || gameOver) return;

    const moveBall = setInterval(() => {
      const newBallX = ballX + ballSpeedX;
      const newBallY = ballY + ballSpeedY;

      // check to make sure the ball is in bounds
      if (newBallY <= 0 || newBallY >= BOARD_HEIGHT - BALL_SIZE) {
        setBallSpeedY(prevSpeedY => -prevSpeedY);
      }

      // handles scoring and pausing after scoring
      if (newBallX <= 0) {
        setScore2(prevScore => prevScore + 1);
        if (score2 + 1 === MAX_SCORE) {
          setGameOver(true);
        } else {
          setIsPaused(true);
          setTimeout(() => {
            resetBall();
            setIsPaused(false);
          }, PAUSE_TIME);
          player2Scored();
        }
      } else if (newBallX >= BOARD_WIDTH - BALL_SIZE) {
        setScore1(prevScore => prevScore + 1);
        if (score1 + 1 === MAX_SCORE) {
          setGameOver(true);
        } else {
          setIsPaused(true);
          setTimeout(() => {
            resetBall();
            setIsPaused(false);
          }, PAUSE_TIME);
          player1Scored();
        }
      } else if (
        (newBallX <= PADDLE_WIDTH &&
          newBallY + BALL_SIZE >= paddle1Y &&
          newBallY <= paddle1Y + PADDLE_HEIGHT) ||
        (newBallX + BALL_SIZE >= BOARD_WIDTH - PADDLE_WIDTH &&
          newBallY + BALL_SIZE >= paddle2Y &&
          newBallY <= paddle2Y + PADDLE_HEIGHT)
      ) {
        setBallSpeedX(prevSpeedX => -prevSpeedX);
      }

      setBallX(newBallX);
      setBallY(newBallY);
    }, 20);

    return () => clearInterval(moveBall);
  }, [gameStarted, ballX, ballY, paddle1Y, paddle2Y, ballSpeedX, ballSpeedY, isPaused, gameOver, score1, score2]);

  const resetBall = () => {
    // resets the ball position
    setBallX(BOARD_WIDTH / 2 - BALL_SIZE / 2);
    setBallY(BOARD_HEIGHT / 2 - BALL_SIZE / 2);
    setBallSpeedX(BALL_SPEED);
    setBallSpeedY(BALL_SPEED);
  };

  const resetGame = () => {
    // resets both players score counts
    setScore1(0);
    setScore2(0);
    setGameOver(false); // Reset game over status
    resetBall();
    setPaddle1Y(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2); 
    setPaddle2Y(BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  };

  const startGame = () => {
    // Start the game when the start button is clicked
    setGameStarted(true);
  };

  const pause = () => {
    if (!isPaused){
      PADDLE_SPEED = 0;
      gameStatePaused = true; 
    } else if(isPaused){
      PADDLE_SPEED = 20;
      gameStatePaused = false; 
    }
    setIsPaused(prevPaused => !prevPaused);
  };


  function player1Scored(){
    displayMessage = true; 
    displayScore1 = true; 
    setTimeout(function () {
      displayMessage = false; 
      displayScore1 = false; 
    }, PAUSE_TIME); 
  }

  function player2Scored() {
    displayMessage = true; 
    displayScore2 = true; 
    setTimeout(function () {
      displayMessage = false; 
      displayScore2 = false; 
    }, PAUSE_TIME)
  }

  const loser = score1 < score2 ? 'Player 1' : 'Player 2';

  // array of funny quotes for the loser
  const funnyQuotes = [
    `"Looks like ${loser} needs more practice!"`,
    `"Better luck next time, ${loser}!"`,
    `"Is ${loser} even trying? 😜"`,
    `"It's okay ${loser}, losing builds character!"`,
    `"Don't worry ${loser}, it's just a game!"`,
  ];




  // randomly select a funny quote for the loser
  const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];



  // renders the game components and scoreboard

    return (
      <div className="App">

        <div className="title">
          PONG: Remastered
         
        </div>

       

        <div className="board">
          <div className="paddle" style={{ top: paddle1Y, left: 0 }} />
          <div className="paddle" style={{ top: paddle2Y, right: 0 }} />
          <div className="ball" style={{ top: ballY, left: ballX }} />
        </div>

        <div className="vertical-elements">
          <div className="scoreboard">
            <div>Player 1: {score1}</div>
            <div>Player 2: {score2}</div>
          </div>


          {!gameStarted && !gameOver && (
            <button className="custom" onClick={startGame}>
              Start Game
            </button>

          )}

          {gameStarted && gameStatePaused && (
            <button className="custom" onClick={pause}>
              Resume
            </button>
          )}
          
          {gameStarted && !gameStatePaused && (
            <button className="custom" onClick={pause}>
              Pause
            </button>
          )}

          {(gameOver || gameStatePaused )&& (
            <button className="custom" onClick={resetGame}>
              Restart
            </button>
          )}

        </div>

        
          
        <div className="output-print">
            {!gameStarted && <div>Press "Start Game" to Start</div>}
            {gameStatePaused && <div>Game is Paused</div>}
            {displayMessage && displayScore1 && <div>Player 1 Scored!</div>}
            {displayMessage && displayScore2 && <div>Player 2 Scored!</div>}
            {gameOver && <div>Game Over!</div>}
            {gameOver && <div>{loser} is the loser!</div>}
            {gameOver && <div>Funny Quote for the Loser:</div>}
            {gameOver && <div>{randomQuote}</div>}
        </div>

      </div>
    );
}

export default App;
