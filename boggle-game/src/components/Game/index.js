import React, { Component } from 'react';
import {
  shuffleBoard,
  copyBoard,
  isTileEqual,
  isAdjacent,
  calculateScore,
  getIdentifier,
  getBoardLetters
} from '../../util/gameUtil';
import Board from '../Board';
import Timer from '../Timer';
import ScoreBox from '../ScoreBox';
import CurrentWord from '../CurrentWord';
import Button from '../Button';
import Leaderboard from '../Leaderboard';
import Mymodal from '../Mymodal';
import axios from 'axios';
import agent from '../../agent/agent';
import './Game.css';

export default class Game extends Component {

  constructor(props) {
    super(props);
    // TODO: Init board with random tiles
    this.initBoard = shuffleBoard();

    this.getBoardLetters = getBoardLetters(this.initBoard);

    this.Id = getIdentifier(32);

    // TODO: Init state with the board
    this.state = {
      isFetchingBoggles: true,
      board: this.initBoard,
      boardLetters: this.getBoardLetters,
      currentWord: '',
      currentWordPosition: [],
      wordScoreList: {},
      totalvalidcombination : [],
      alert:'',
      showGameArea: false,
      highscore:'',
      timeup: false,
      newhighscore: false,
      totalScore:0
    };

    this.showGameBoard = this.showGameBoard.bind(this);

    this.onStart = this.onStart.bind(this);

    this.handleTimeup = (data) => {
      this.setState({timeup:true})
      if(this.state.totalScore > this.state.highscore){
        this.setState({newhighscore:true})
      }
    }

    this.refreshBoggle = async (data) => {
      let Boggles = await agent.Boggles.all();
      let highscore = Boggles[0].score;
      this.setState({boggles: Boggles, isFetchingBoggles: false,highscore:highscore});
    }

  }

  async componentWillMount(){
    let Boggles = await agent.Boggles.all();
    console.log(Boggles)
    let highscore = Boggles[0].score;
    this.setState({boggles: Boggles, isFetchingBoggles: false,highscore:highscore});
  }

  // 1. click on the tile
  // 2. update tile selected to true.
  // 2.1 Can select and unselect the tile
  // 2.2 Can only unselect the last tile
  // 2.3 Update currentWord as we select and unselect
  // 2.4. Can only select the surrounding cells
  // 2.5 Make a copy of board, word, currentWordPositions, etc
  // 2.6 Mutate the state
  // 3. render the board with updated tile so it renders as active

  handleClick(rowId, columnId) {
    this.setState({alert:''})
    // TODO: Handle tile click to select / unselect tile.
    const selectedTile = this.state.board[rowId][columnId];
    const lastSelectedTile = this.state.currentWordPosition[
      this.state.currentWordPosition.length - 1
    ];
    if (selectedTile.selected) {
      // Check if selectedTile is last tile
      if (isTileEqual(selectedTile, lastSelectedTile)) {
        // Unselected selectedTile and remove from currentWordPosition
        // Also update the board to set the tile to unselected
        const newBoard = copyBoard(this.state.board);
        newBoard[rowId][columnId].selected = false;
        this.setState({
          currentWord: this.state.currentWord.slice(0, -1),
          board: newBoard,
          currentWordPosition: this.state.currentWordPosition.slice(0, -1)
        });
      }
    } else {
      if (!lastSelectedTile || isAdjacent(selectedTile, lastSelectedTile)) {
        // Select the tile
        const newBoard = copyBoard(this.state.board);
        newBoard[rowId][columnId].selected = true;
        this.setState({
          // update current word with selected tile
          currentWord: this.state.currentWord.concat(
            newBoard[rowId][columnId].letter
          ),
          // update board
          board: newBoard,
          // update current word position with selected tile position
          currentWordPosition: this.state.currentWordPosition.concat({
            rowId: rowId,
            columnId: columnId
          })
        });
      }
    }
  }

  showGameBoard(){
    this.setState({showGameArea:true});
  }


  onStart() {
    var that = this;

    // Reset state.
    this.setState({ totalvalidcombination: [], alert: '' }, function() {
      // Start web worker.
      var worker = new Worker('js/boggle/solveManagerWorker.js');
      worker.postMessage({ board: this.state.boardLetters });
      worker.onmessage = function(message) {
        if (message.data.status.indexOf('Solving') !== -1 || message.data.done) {
          that.setState({ alert: message.data.status });
          if(message.data.done){
            this.setState({showGameArea: true})
          }
        }
        else if (message.data.result) {
          var words = that.state.totalvalidcombination;
          words.push(message.data.result);
          that.setState({ totalvalidcombination: words });
        }
      }
    });
  };

  // Adds Current Word to the Word List
  handleSubmit(word) {

    const API_KEY = 'dict.1.1.20200129T162724Z.cc26a35e3cf80c7d.a6b72704976b4dfb65faaab81fb7f2132daafca5';
    
    // TODO: Check if Current Word is valid

    // Check if word is valid
    if (word.length < 3 || this.state.wordScoreList[word]) {
      if(this.state.wordScoreList[word]){
        this.setState({alert:'*word already exists*'})
      }else{
        this.setState({alert:'*word too short*'})
      }
      return;
    }

    axios.get("https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key="+API_KEY+"&lang=en-ru&text="+word)
      .then(res => { 
        const clearedBoard = this.initBoard;
        if(res.data.def.length > 0){

          console.log(res.data.def)
          const score = calculateScore(word);

          this.setState({
            // wordScoreList: Object.assign(this.state.wordScoreList, {[word]: score}),
            wordScoreList: { ...this.state.wordScoreList, [word]: score },
            currentWord: '',
            currentWordPosition: [],
            board: clearedBoard
          });

          let currentScore = Object.values(
            this.state.wordScoreList
          ).reduce((totalScore, next) => {
            return totalScore + next;
          }, 0)

          this.setState({totalScore:currentScore})

        }else{
          this.setState({currentWord: '',currentWordPosition: [], board:clearedBoard,alert:'Invalid Word'});
          return;
        }

      })
  }

  render() {

    if(this.state.isFetchingBoggles){
      return (<div className="loader">loading...</div>)
    }

    const istimeup = this.state.timeup;
    const newhighscore = this.state.newhighscore;

    return (
    
      <div>
        
        {istimeup && newhighscore ? 
        <ModalShow 
        show={istimeup}
        identifier={this.Id}
        score={this.state.totalScore}
        refreshBoggle={this.refreshBoggle.bind(this)}
         /> 
        : ''}
        
        {(this.state.showGameArea && this.state.timeup===false) ?
        <div>
          <div className="timer-area">
          <Timer handleTimeup={this.handleTimeup.bind(this)}
          />
          </div>
        <div className="game-area">
          <Board
            // TODO: Pass Board Props
            board={this.state.board}
            handleClick={this.handleClick.bind(this)}
          />
          <CurrentWord
            // TODO: Pass CurrentWord props
            currentWord={this.state.currentWord}
            label="Current Word"
          />
          
          <div className="error-area">{this.state.alert}</div>
          
          <Button
            // TODO: Pass Button Props and Button Callback
            handleSubmit={this.handleSubmit.bind(this, this.state.currentWord)}
            label="SUBMIT WORD"
          />
        </div>

        <ScoreBox
          // TODO: Pass ScoreBox Props
          wordScoreList={this.state.wordScoreList}
          totalScore={this.state.totalScore}
        />

        {/* Makes Board and ScoreBox be side by side */}
        <div className="clear" />

        </div>
        
        : (this.state.timeup===true) ?
        
        <div>
          <div className="timer-area">
              <Timer handleTimeup={this.handleTimeup.bind(this)}
              />
          </div>
          <Leaderboard gameData={this.state}/>
        </div>

        :
        
        <div>
          <button className="button"onClick={this.showGameBoard}>Start</button>
          <div className="error-area">{this.state.alert}</div>
        </div>

        }

      </div>
    );
  }
}

const ModalShow = (props) => {
  return <Mymodal {...props} />
}
