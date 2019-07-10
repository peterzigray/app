import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import '../../css/Cients.css';
import { get } from 'http';
import ClientOverview from './ClientOverview';
import AddDebt from './addDebt';
import Dashboard from './Dashboard';
import Friends from './Friends';

const styles = {
  transition: "all 0.3s ease-out"
}

class Clients extends Component {
  state = {
    totalOwed: null,
    youAreOwed: null,
    youOwed: null,

    isAuthenticated: false,
    cards: [
      {
        id: 0,
        name: "Dashboard",
        message: "Overview",
        icon: "fas fa-chart-bar",
        button: "btn btn-primary btn-lg float-right",
        bigIcon: "fas fa-file-invoice-dollar fa-3x",
        scale: 1,
        clicked: false,
        borderLeftColor: '#007bff'
      },
      {
        id: 1,
        name: "Add + ",
        message: "Update now",
        icon: "fas fa-sync",
        button: "btn btn-warning btn-lg float-right",
        bigIcon: "fas fa-wallet fa-3x",
        scale: 1,
        clicked: false,
        borderLeftColor: '#ffc107'
      },
      {
        id: 2,
        name: "History",
        message: "Let's set it up",
        icon: "far fa-calendar-check",
        button: "btn btn-success btn-lg float-right",
        bigIcon: "far fa-calendar-check fa-3x",
        scale: 1,
        clicked: false,
        borderLeftColor: '#28a745'
      },
      {
        id: 3,
        name: "Friends",
        message: "Check your friends",
        icon: "fas fa-chart-bar",
        button: "btn btn-danger btn-lg float-right",
        bigIcon: "fas fa-chart-pie fa-3x",
        scale: 1,
        clicked: false,
        borderLeftColor: '#dc3545'
      }
    ],
    showSettings: false,
    showAddClient: ''
  };


  // GET TOTAL BALANCE OWED MONEY AND PAID MONEY
  static getDerivedStateFromProps(props, state) {
    const { clients, debt, auth, } = props;
    const total = {};
    var youOwedNum = [];
    var theyOwedNum = [];
    var sumOfOwedMoney = 0;
    var sumOfPaidMoney = 0;
    //
    if (debt) {
      debt.forEach(d => {
        if (d.debtor && d.debtor[1] === auth.uid) {
          youOwedNum.push(parseInt(d.debtor[0]))
          // Object.assign(total, {totalOwed:d.debtor[0]}) ;
        }
        if (d.paidBy === auth.uid) {
          console.log(d.balance)
          theyOwedNum.push(parseInt(d.balance))
        }
      }
      )
      for (let i = 0; i < youOwedNum.length; i++) {
        sumOfOwedMoney += youOwedNum[i]
      }
      for (let i = 0; i < theyOwedNum.length; i++) {
        sumOfPaidMoney += theyOwedNum[i]
      }
      // result of amount of money you owed
      Object.assign(total, { youOwed: sumOfOwedMoney });
      // result of amount of money you paid
      Object.assign(total, { youAreOwed: sumOfPaidMoney });
      return total
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   const { debt, auth } = props;
    
  //   if(debt){
  //     //Add balances 
  //     const total = {}
  //     debt.forEach(d => {
  //     if(d.debtTo === auth.uid){
  //     Object.assign(total, { totalOwed: d.balance })
  //     }
  //     })
  //     return total
  //   }
   
  //   // PREVIOUS RESOLUTION
  //   // if (debt) {
  //   //   //Add balances 
  //   //   const total = debt.reduce((total, d) => {
  //   //    console.log(total)
  //   //     console.log(d)
  //   //     return total + parseFloat(d.balance.toString());
  //   //   }, 0);
  //   //   return { totalOwed: total };
  //   // }
  //   // return null
  // }

  // static getDerivedStateFromProps(props, state) {
  //   const { auth } = props;
  //   if (auth.uid) {
  //     return { isAuthenticated: true };
  //   } else {
  //     return { isAuthenticated: false };
  //   }
  // }
  onLogoutClick = e => {
    e.preventDefault();

    const { firebase } = this.props;
    firebase.logout();

    // this.props.history.push('/login');
  };

  onMouseOverHandler = id => {
    let stateCopy = Object.assign({}, this.state);
      stateCopy.cards[id].scale = 1.07;
    this.setState(stateCopy);
  };

  onMouseLeaveHandler = () => {
    let stateCopy = Object.assign({}, this.state);
    const length = this.state.cards.length;
    var clickedId = stateCopy.cards.findIndex(i => i.clicked === true)
      for(let i = 0; i < length; i++){
        stateCopy.cards[i].scale = 1;
      }
      if(clickedId !== -1){
        stateCopy.cards[clickedId].scale = 1.07;
      } 
    this.setState(stateCopy);
  };

  onClickButton = id => {

    window.scrollTo({
      top: 165,
      behavior: "smooth"
    });

    let stateCopy = Object.assign({}, this.state);
    stateCopy.showAddClient = id;
    const length = this.state.cards.length;
    for (let i = 0; i < length; i++) {
      stateCopy.cards[i].scale = 1;
      stateCopy.cards[i].clicked = false;
    }
    stateCopy.cards[id].clicked = true;
    stateCopy.cards[id].scale = 1.07;
    this.setState(stateCopy)
  };

  render() {
    const { clients , users, debt} = this.props;
    const { totalOwed, cards, showSettings, showAddClient, youAreOwed,
      youOwed } = this.state;
    const { auth, isAuthenticated } = this.props;
    console.log(this.state.showAddClient);
    let settingsAndLogout = "";

    if (showSettings) {
      settingsAndLogout = (
        <div className="dropdown-menu show ">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a href="#!" className="nav-link">
                {auth.email}
              </a>
            </li>
            <li className="nav-item">
              <Link to="/settings" className="nav-link">
                Settings
              </Link>
            </li>
            <li className="nav-item">
              <a href="#!" className="nav-link" onClick={this.onLogoutClick}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      );
    } else {
      settingsAndLogout = null;
    }

    if (debt && users) {
      return (
        <div className='containeris' >
          <div className="row clientTop">
            <div className="col-md-1 clientData">
              <i class="fas fa-user-circle fa-5x clientAvatar" />
            </div>
            <div className="col-md-7 clientData">

              {users.map(user => {
                if(user.id === auth.uid){
                  return (
                    <h4 style={{ color: "black" }}>
                    <span>

                    
                      
                      {user.firstName}{' '}{user.lastName}{" "}
                      </span>
                   </h4>
                  )
                } 
              
  
              })}
              <h4 className=" text-secondary">
                Balance{" "}
                <span className="text-primary">
                  ${parseFloat(youAreOwed - youOwed).toFixed(2)}
                </span>
              </h4>
              <p class="text-muted"><span style={{ color: "#a9a9a9" }}>

                You owed <span style={{ color: "red" }}>{' '}${parseFloat(youOwed).toFixed(2)} </span>{' '} You are owed<span style={{ color: "green" }}>{' '}${parseFloat(youAreOwed).toFixed(2)}</span>
              </span></p>
              
              {/* <ul>
                <li>
                  <Link to="/client/add" className="btn btn-success btn-block">
                    <i className="fas fa-plus" />{' '}New
                  </Link>
                </li>
              </ul> */}
            </div>

            <div className="col-md-4">
              <div className="row">
                <div className="col-md-6">
                  <input
                    className="group"
                    type="text"
                    name="email"
                    required
                    placeholder="Search"
                    id="inputUp"
                  />
                  <span className="bar" />
                </div>
                <div className="col-md-6 " id="navIcons">
                  <div class="btn button1">
                    <i className="fas fa-bell fa-2x float-left" />
                    <span class="button__badge">10</span>
                  </div>
                  <i
                    class="btn fas fa-cog fa-2x"
                    onMouseEnter={() =>
                      this.setState({ showSettings: !showSettings })}
                    // onMouseLeave={() =>
                    //   this.setState({ showSettings: !showSettings })
                    // }
                  />
                  {settingsAndLogout}
                </div>
              </div>

              {/* {isAuthenticated ? (
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <a href="#!" className="nav-link">
                      {auth.email}
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link to="/settings" className="nav-link">
                      Settings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a
                      href="#!"
                      className="nav-link"
                      onClick={this.onLogoutClick}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              ) : null}{" "} */}
              {/* <span className="text-primary">
                ${parseFloat(totalOwed).toFixed(2)}
              </span> */}
            </div>
          </div>

          <div className="row">
            {cards.map(card => (
              <div className="col-md-6 col-xl-3">
                <div
                  className="card" 
                  // style={{ width: "180rem", color: "red"}}
                  onMouseEnter={this.onMouseOverHandler.bind(
                    this,
                    card.id
                  )}
                  onMouseLeave={this.onMouseLeaveHandler.bind(
                    this,
                    card.id
                  )}
                  style={{
                    ...styles,
                    transform: "scale(" + card.scale + ")",
                    "border-left-color": `${card.borderLeftColor}`,
                    "border-left-width": "5px"
                
              }}
                // style={{...styles, opacity: this.state.opacity, transform: 'scale(' +this.state.scale +')'}}
                >
                  <div className="card-body">
                    <div className="row">
                      <div className="col-5">
                        <i
                          className={card.bigIcon}
                          style={{ color: "#17a2b8" }}
                        />
                      </div>
                      <div className="col-7">
                        <button
                          type="button"
                          className={card.button}
                          onClick={this.onClickButton.bind(this, card.id)}
                        >
                          {card.name}
                        </button>
                      </div>
                    </div>


                  </div>
                  <div class="card-footer">
                    <small class="text-muted"><span style={{ color: "#a9a9a9" }}>
                      <i className={card.icon} />
                      {' '}{card.message}
                    </span></small>
                  </div>
                </div>
              </div>
            ))}

            {/* <div className="col-md-6 col-xl-3">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-5">
                      <i
                        class="fas fa-hand-holding-usd fa-3x"
                        style={{ color: "green" }}
                      />
                    </div>
                    <div className="col-7">
                      <h5 className="text-right text-secondary">
                        Balance{" "}
                        <span className="text-primary">
                          ${parseFloat(youAreOwed - youOwed).toFixed(2)}
                        </span>
                      </h5>
                    </div>
                  </div>

                </div>
                <div class="card-footer">
                  <small class="text-muted"><span style={{ color: "#a9a9a9" }}>
                    <i />
                    You owed <span style={{ color: "red" }}>${parseFloat(youOwed).toFixed(2)} </span>{' '} You are owed<span style={{ color: "green" }}>${parseFloat(youAreOwed).toFixed(2)}</span>
                  </span></small>
                </div>
              </div>
            </div> */}
          </div>
          <div className=" row row3">
            <div className="col-md-12">
              <div
                className="card text-white bg-info mb-2 iconsoverlap"
                style={{ width: "110px", height: "60px" }}
              >
                <div className="d-flex ">
                  {/* <i class="fas fa-bookmark" /> {' '} */}
                  {showAddClient === 0 || !showAddClient ? (
                    <h5> Dashboard </h5>
                  ) : null}
                  {showAddClient === 1 ? (
                    <h5> Add Debt </h5>
                  ) : null}
                  {showAddClient === 2 ? (
                    <h5> History </h5>
                  ) : null}
                  {showAddClient === 3 ? (
                    <h5> Friends </h5>
                  ) : null}
                </div>
              </div>
              {/* <ClientOverview/> */}
              <div className="clientTable">
                {showAddClient === 0 || !showAddClient ? <Dashboard/> : null}
                {showAddClient === 1 ? <AddDebt /> : null}

                {showAddClient === 2  ? <ClientOverview
                  debt={debt}
                /> : null}
                {showAddClient === 3 ? <Friends></Friends> : null}
              </div>
            </div>
          </div>
        </div>
      );
    }





    else {
      return <Spinner />;
    }
  }
}

Clients.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,

  firestore: PropTypes.object.isRequired,
  clients: PropTypes.array,
  debt: PropTypes.array
}

export default compose(
  firestoreConnect([{ collection: 'clients' }]), firestoreConnect([{ collection: 'users' }]),
  firestoreConnect([{ collection: 'debt' }]),
  connect((state, props) => ({
    clients: state.firestore.ordered.clients,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth,
    settings: state.settings,
    debt: state.firestore.ordered.debt
  }))
)(Clients);
// export default compose(
//   firestoreConnect([{ collection: 'users' }]),
//   connect((state, props) => ({
//     users: state.firestore.ordered.users,
//     auth: state.firebase.auth,
//     settings: state.settings
//   }))
// )(Clients);


