import React, { Component } from "react";
import agent from '../../agent/agent';
import './modal.css';

const Modal = ({ handleClose, show, children }) => {
  
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button className="modal-button" onClick={handleClose}>Done</button>
      </section>
    </div>
  );
};

class Mymodal extends Component {

  constructor(props){
    super(props)
    const {show,score,identifier,refreshBoggle} = this.props;
    this.state = {show:show,score:score,identifier:identifier,alert:false,name:''} ;
    this.refreshBoggle = refreshBoggle;
    console.log(this.state)
  }

  showModal = () => {
    this.setState({ show: true});
  };

  updateState = field => ev => {
    const state = this.state;
    state.alert=false;
    const newState = Object.assign({}, state, { [field]: ev.target.value });
    this.setState(newState);
  };

   hideModal = async () => {
    let name = this.state.name.trim();
    this.setState({name:name});
    if(typeof name === 'undefined'){
      this.setState({alert:'*Name cannot be empty*'})
    }else if(name.trim().length > 0){
      let res = await agent.Boggles.post(this.state);
      if(res.error === true){
        this.setState({alert:res.message});
        return;
      }
      this.refreshBoggle();
      this.setState({ show: false });
    }else{
      this.setState({alert:'*Name cannot be empty*'})
    }
  };

  render() {
    return (
      <main>
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <div className="modalDiv">
            <h2>Congratulation! you are the new high scorer. Please enter your name</h2>
          <p><input type="text" name="name" value={this.state.name} onInput={this.updateState('name')}></input></p>
          {this.state.alert ? <p className="error">{this.state.alert}</p> : ''}
          </div>
        </Modal>
      </main>
    );
  }
}

export default Mymodal;
