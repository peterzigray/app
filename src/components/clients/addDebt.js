import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import ReactDOM from 'react-dom'; 
import Select from "react-dropdown-select";
import { runInNewContext } from 'vm';

class addDebt extends Component {
  state = {
    balance: '',
    date: '',
    description: '',
    paidBy: '',
    debtTo: '',
    selectedOption: {},
    multi: true
  };

  componentDidMount = () => {
    var utc = new Date();
    var dd = String(utc.getDate()).padStart(2, "0");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var currentDate = String(dd + " " + monthNames[utc.getMonth()]);
    this.setState({ date: currentDate}) 
  }

  onSubmit = e => {
    // e.preventDefault();

    // const {
    //   state,
    //   props: { firestore, history }
    // } = this;

    // const newClient = {
    //   ...state,
    //   balance: state.balance === "" ? "0" : state.balance
    // };

    // firestore
    //   .add({ collection: "clients" }, newClient)
    //   .then(() => history.push("/"));
    e.preventDefault();

    var stateCopy4 = Object.assign({}, this.state);

    if (stateCopy4.debtTo[0] && stateCopy4.debtTo.length <= 1) {

      Object.assign(stateCopy4.debtTo[0], { actualDebt: stateCopy4.balance })
      console.log('na toto sa focusujem')
      console.log(stateCopy4)
      this.setState(stateCopy4);
    }

    const {
      state,
      props: { firestore, history }
    } = this;
    console.log(this.state)
    const newDebt = {
      ...state,
      balance: state.balance === "" ? "0" : state.balance
    };
    const nieco = {
      balance: '',
      date: '',
      description: '',
      paidBy: '',
      debtTo: [],
      options: ''}

    
    firestore
      .add({ collection: "debt" }, newDebt)
      // .then(() => history.push("/"));
      .then(this.setState(nieco))
      // ReactDOM.findDOMNode(this.refs.sStrike).value = '-';
      // ReactDOM.findDOMNode(this.refs.sStrike2).value = '-';
  };

  onChange = (e,id) => {
    const { auth , users ,firebase} = this.props
    this.setState({ [e.target.name]: e.target.value })
}
  // SET UP PERSON WHO IS IN DEPT
  // onChange2 = (e) => {
  //   this.setState({ debtTo: e.target.value})
  // }
  // SET UP PERSON WHO CREATED DEPT
  onChange3 = (e) => {
    this.setState({ paidBy: e.target.value })
  }

  handleChange = (selectedOption, e) => {
    var stateCopy3 = Object.assign({}, this.state);
    stateCopy3.debtTo = selectedOption;
   
    this.setState(stateCopy3);
    
    
   

    

    // console.log(`Option selected:`, selectedOption);
  };

  onEquallysplit = (e) => {
    //IF PAYER IS ALSO DEBTOR
    const { paidBy, debtTo} = this.state
    e.preventDefault();
   
    
    var stateCopy1 = Object.assign({}, this.state);
    stateCopy1.debtTo.push({id: paidBy})
    this.setState(stateCopy1);

    

    var stateCopy = Object.assign({}, this.state);
    var devidedBy = stateCopy.debtTo.length;
    var actualBalance = stateCopy.balance;
    

    if (this.state.balance && this.state.debtTo){

      const priceForOneDebtor = Number.parseFloat(actualBalance / devidedBy).toFixed(2);
      console.log(priceForOneDebtor)
        stateCopy.debtTo.forEach(debtor => {
          Object.assign(debtor, { actualDebt : priceForOneDebtor})
        })
    } else {
      window.confirm("Please add deptor and balance first")
    }
    this.setState(stateCopy)

    console.log(this.state)
  }




  

  render() {
    const { disableBalanceOnAdd } = this.props.settings;
    const { auth, users } = this.props;
 

    // Transform current user name to Me
    // const userIndex = users.findIndex(user => user.id === auth.uid)
    // const newUser = {
    //   ...users[userIndex],
    //   firstName: users[userIndex].id.match(auth.uid) ? 'Me' : users[userIndex].firstName
    // }
    // const newUsers = Object.assign([], users, { [userIndex]: newUser });
    const newUsers = users;

    // All users without current user
    // const usersWithoutMe = Object.assign([], users)
    // usersWithoutMe.splice(userIndex, 1)

    //GET ALL USERS AND CHANGE NAME INTO LABEL

    // CONCAT FIRSTNAME + LAST NAME

  

    // RENAME firstName keys in all array to label for input use
    function renameKeys(copyofUsers, newKeys) {
      var newArrOfChngedKeys = [];
      for (let i = 0; i < copyofUsers.length; i++) {
        newArrOfChngedKeys.push(giveBackNewArray(copyofUsers[i], newKeys))
      }
      return newArrOfChngedKeys
    }

    // RETURN changed key for every single object in array one by one
    function giveBackNewArray(copyofUsers, newKeys) {
      const keyValues = Object.keys(copyofUsers).map(key => {
      const newKey = newKeys[key] || key;
        return { [newKey]: copyofUsers[key] };
        }
      );
         return Object.assign({}, ...keyValues);
    }

    const newKeys = { firstName: "label" };
    const copyofUsers = users;
    const userNames = renameKeys(copyofUsers, newKeys);
    
     // DESTRACTURING ONLY NAME(LABEL) AND ID
    var newar = [];
    userNames.forEach(ar => {
    let { lastName, email , friends, ...rest } = ar ;
    newar.push(rest)
    return newar
    }
  )
  console.log('............')
  console.log(newar)
  console.log('............')

    const { selectedOption } = this.state;
    return (
      <div>
        <div className="row">
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Add an expense</div>
              <div className="card-body">
                 <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">With you and</label>
                    
                    
                      <Select
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={userNames}
                        multi={this.state.multi}
                      />
              
                   
                  </div>


                  <div className="form-group">
                    <label htmlFor="name">Paid by</label>

                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <label className="input-group-text" for="inputGroupSelect01">Options</label>
                      </div>
                      <select 
                      className="custom-select" 
                      id="inputGroupSelect01"
                      onChange={this.onChange3} 
                        ref="sStrike2"
                      >
                        <option selected>Choose...</option>
                        {newUsers.map(user => (

                          <option 
                            // name="paidBy" 
                            value={user.id}
                          >{

                            user.firstName

                          }

                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  







                  <div className="form-group">
                    <label htmlFor="description">Enter a description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={this.state.description}
                      minLength="2"
                      required
                      onChange={this.onChange}
                      // value={this.state.lastName}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="text"
                      className="form-control"
                      name="date"
                      minLength="2"
                      required
                      onChange={this.onChange}
                      value={this.state.date}
                    />
                  </div>

                  {/* <div className="form-group">
                    <label htmlFor="paidBy">Paid by</label>
                    <input
                      type="text"
                      className="form-control"
                      name="paidBy"
                      // onChange={this.onChange}
                      value={auth.uid}
                  />
                  </div> */}

                  {/* <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      minLength="10"
                      onChange={this.onChange}
                      value={this.state.phone}
                    />
                  </div> */}

                  <div className="form-group">
                    <label htmlFor="balance">Balance</label>
                    <input
                      type="text"
                      className="form-control"
                      name="balance"
                      onChange={this.onChange}
                      value={this.state.balance}
                      disabled={disableBalanceOnAdd}
                    />
                  </div>
                  <div className="div">

                
                  <tr>
                    <td> 
                      <button 
                        type="button" 
                        className="btn btn-outline-primary"
                        onClick={this.onEquallysplit}
                       >
                         Equally
                      </button>
                    </td>
                    <td> <button type="button" className="btn btn-outline-primary">Exact</button></td>
                    <td> <button type="button" className="btn btn-outline-primary">Primary</button></td>
                  </tr>
                  </div>
                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-dark btn-block"
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <img src={require("../../pics/app.jpg")} />
          </div>
        
        </div>
      </div>
    );
  }
}

addDebt.propTypes = {
  firestore: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
 
  settings: PropTypes.object.isRequired
};




export default compose(
  firestoreConnect([{ collection: 'users' }]),
  connect((state, props) => ({
    settings: state.settings,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth
  }))
)(addDebt);
