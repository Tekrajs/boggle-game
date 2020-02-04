import React from 'react';
import './Leaderboard.css';

const Lblist = props => {
  // TODO: Destructure ScoreBox props
  const { lblist } = props;
  console.log('after update',props)
  const scorerList = lblist.map(function(scorer, index) {
    return <li key={index}>{scorer.name} : {scorer.score}</li>;
  });

  const restart = ev => {
      location.reload();
  }
  

  return (
    <div>
    <div className="scorer-list">
      <div className="scorer">
        <h2>Name : Scorer</h2>
        {scorerList}
      </div>
    </div>
    <div className="total-score">
        <a className="restart-button"onClick={restart}>Restart</a>
      </div>
    </div>
  );
};

export default Lblist;
