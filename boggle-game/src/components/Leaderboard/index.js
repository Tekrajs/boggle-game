import React from 'react'
import ScoreBox from '../ScoreBox';
import Lblist from './Lblist';
import './Leaderboard.css'

class Leaderboard extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            leaderboard : '',
            gamedata : props.gameData
        };

    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.gameData) {
        this.setState(Object.assign({}, this.state, {
          gamedata: nextProps.gameData
        }));
      }
    }

    render(){

        return(
          <div>
            <div className="game-area">
            <div>Your Score Details</div>
            
            <ScoreBox
              wordScoreList={this.state.gamedata.wordScoreList}
              totalScore={Object.values(
                this.state.gamedata.wordScoreList
              ).reduce((totalScore, next) => {
                return totalScore + next;
              }, 0)}
            />

          </div>
          <div className="game-area">
              <div>High Scorer</div>
              <div className="score-box">
              <Lblist lblist={this.state.gamedata.boggles} />
              </div>
            
          </div>
          </div>
        );
    }

}

export default Leaderboard