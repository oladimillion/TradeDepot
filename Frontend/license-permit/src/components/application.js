import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ApplyRequest } from "../actions/actions";
import { Logout, FetchApplicationsRequest } from "../actions/actions";
import { connect } from 'react-redux'
import Loading from "./loading";
import Header from "./header";
import MsgInfo from "./msg-info";

class Application extends Component {

  constructor(props){

    super(props);

    this.state = { 
      firstName: "",
      lastName: "",
      dob: "",
      email: "",
      sex: "",
      stateOfOrigin: "",
      occupation: "",
      address: "",
      applicationType: "",
      isLoading: false,
      isAdmin: false,
      info: null,
    }

    this.timerID = null;
    this.logout = this.logout.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount(){
    if(!localStorage.getItem("token")){
      this.props.history.replace("/", null);
    }
  }

  componentWillUnmount(){
    if(this.timerID){
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  onSubmit(e){
    e.preventDefault();

    this.setState({isLoading: true});
    this.props.ApplyRequest(this.state)
      .then(data => {
        this.setState({
          firstName: "",
          lastName: "",
          dob: "",
          email: "",
          sex: "",
          stateOfOrigin: "",
          occupation: "",
          address: "",
          applicationType: "",
          isLoading: false, 
          info: data.data,
          isAdmin: false,
        });
        this.setOrClearInfo();
      })
      .catch(data => {
        this.setState({
          isLoading: false, 
          info: data.response.data
        });
        this.setOrClearInfo();
      })

  }

  logout(){
    this.props.Logout();
    this.props.history.replace("/", null);
  }

  setOrClearInfo(){
    if(this.timerID){
      clearTimeout(this.timerID);
      this.timerID = null;
    }

    this.timerID = setTimeout(()=> {
      this.setState({info: null});
      clearTimeout(this.timerID);
    }, 7000);
  }

  onChange(e){
    this.setState({
      [e.target.name]: e.target.value,
      isAdmin: e.target.checked
    });
  }

  render() {

    const {
      firstName,
      lastName,
      dob,
      email,
      sex,
      stateOfOrigin,
      occupation,
      address,
      applicationType,
      isLoading,
      info,
    } = this.state;


    return (
      <span>
        <Header logout={this.logout} />
        <div
          className="form">
          {info && <MsgInfo info={info} />}
          {isLoading && <Loading />}
          <form className="apply-form" onSubmit={this.onSubmit}>
            <div className="form-heading">
              LICENCE REGISTRATION
            </div>
            {/* <!-- end of form heading --> */}
            <div className="input-wrapper">
              <input 
                onChange={ this.onChange }
                value={firstName}
                name="firstName"
                className="input" type="text"
                placeholder="first name" />
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper">
              <input
                onChange={ this.onChange }
                value={lastName}
                name="lastName"
                className="input" type="text"
                placeholder="last name" />
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper">
              <input
                onChange={ this.onChange }
                value={email}
                name="email"
                className="input" type="email"
                placeholder="email" />
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper">
              <select 
                className="input"
                onChange={ this.onChange }
                value={stateOfOrigin}
                name="stateOfOrigin">
                <option value="" default selected>State of Origin</option>
                <option value="Abia">Abia</option>
                <option value="Adamawa">Adamawa</option>
                <option value="Akwa Ibom">Akwa Ibom</option>
                <option value="Anambra">Anambra</option>
                <option value="Bauchi">Bauchi</option>
                <option value="Bayelsa">Bayelsa</option>
                <option value="Benue">Benue</option>
                <option value="Borno">Borno</option>
                <option value="Cross River">Cross River</option>
                <option value="Delta">Delta</option>
                <option value="Ebonyi">Ebonyi</option>
                <option value="Enugu">Enugu</option>
                <option value="Edo">Edo</option>
                <option value="Ekiti">Ekiti</option>
                <option value="Gombe">Gombe</option>
                <option value="Imo">Imo</option>
                <option value="Jigawa">Jigawa</option>
                <option value="Kaduna">Kaduna</option>
                <option value="Kano">Kano</option>
                <option value="Katsina">Katsina</option>
                <option value="Kebbi">Kebbi</option>
                <option value="Kogi">Kogi</option>
                <option value="Kwara">Kwara</option>
                <option value="Lagos">Lagos</option>
                <option value="Nasarawa">Nasarawa</option>
                <option value="Niger">Niger</option>
                <option value="Ogun">Ogun</option>
                <option value="Ondo">Ondo</option>
                <option value="Osun">Osun</option>
                <option value="Oyo">Oyo</option>
                <option value="Plateau">Plateau</option>
                <option value="Rivers">Rivers</option>
                <option value="Sokoto">Sokoto</option>
                <option value="Taraba">Taraba</option>
                <option value="Yobe">Yobe</option>
                <option value="Zamfara">Zamfara</option>
              </select>
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper">
              <input
                onChange={ this.onChange }
                value={occupation}
                name="occupation"
                className="input" type="text"
                placeholder="occupation" />
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper">
              <input
                onChange={ this.onChange }
                value={address}
                name="address"
                className="input" type="text"
                placeholder="address" />
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper">
              <input
                onChange={ this.onChange }
                value={dob}
                name="dob"
                className="input" type="date"
                placeholder="date of birth" />
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper">
              <select 
                className="input"
                onChange={ this.onChange }
                value={sex}
                name="sex">
                <option value="" disabled selected>Sex</option>
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
              </select>
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper">
              <select 
                className="input"
                onChange={ this.onChange }
                value={applicationType}
                name="applicationType">
                <option value="" disabled selected>Application Type</option>
                <option value="Articulated Vehicle">
                  Articulated Vehicle
                </option>
                <option value="Commercial">Commercial</option>
                <option value="Private">Private</option>
                <option value="Motorcycle">Motorcycle</option>
              </select>           
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper _flex">
              <div className="_left">
                <button type="submit" 
                  className="button login-btn">
                  Apply
                </button>
              </div>
              {/* <!-- end of _left --> */}
            </div>
            {/* <!-- end of input wrapper --> */}
          </form>
        </div>
      </span>
    )
  }
}


function mapStateToProps(state){
  return { 
    user: state.User,
  }
}
export default connect(mapStateToProps, { 
  Logout,
  ApplyRequest
})(Application);
