import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RegRequest } from "../actions/actions";
import { connect } from 'react-redux'
import Loading from "./loading";
import Header from "./header";
import MsgInfo from "./msg-info";

class Register extends Component {

  constructor(props){

    super(props);

    this.state = { 
      username: "",
      password: "",
      cpassword: "",
      username_error: false,
      password_error: false,
      cpassword_error: false,
      isLoading: false,
      isAdmin: false,
      info: null,
    }

    this.timerID = null;
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount(){
    if(localStorage.getItem("token")){
      this.props.history.replace("/admin/dashboard", null);
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.user.isAdmin){
      this.props.history.replace("/admin/dashboard", null);
    } else {
      this.props.history.replace("/apply", null);
    }
  }

  componentWillUnmount(){
    if(this.timerID){
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  validateInput(data){
    let username_error = false;
    let password_error = false;
    let cpassword_error = false;

    if(!data.username){
      username_error = true;
    }
    if(!data.password){
      password_error = true;
    }
    if(!data.cpassword){
      cpassword_error = true;
    }


    this.setState({
      username_error,
      password_error,
      cpassword_error,
    });

    return !username_error && !password_error && !cpassword_error;
  }

  onSubmit(e){
    e.preventDefault();
    const {username, password, cpassword, isAdmin} = this.state;
    const data = { username, password, cpassword, isAdmin };

    console.log(data)
    if(!this.validateInput(data)){
      return;
    }

    this.setState({isLoading: true});
    this.props.RegRequest(data)
      .then(data => {
        this.setState({
          isLoading: false, 
          info: data.data,
          username: "",
          password: "",
          cpassword: "",
          isAdmin: false,
        });
        // this.setOrClearInfo();
      })
      .catch(data => {
        this.setState({
          isLoading: false, 
          info: data.response.data
        });
        this.setOrClearInfo();
      })

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
      username, 
      password, 
      cpassword, 
      username_error, 
      password_error,
      cpassword_error,
      isLoading,
      isAdmin,
      info,
    } = this.state;

    return (
      <span>
        <Header />
        <div
          className="form reg-form">
          {info && <MsgInfo info={info} />}
          {isLoading && <Loading />}
          <form onSubmit={this.onSubmit}>
            <div className="form-heading">
              REGISTRATION
            </div>
            {/* <!-- end of form heading --> */}
            <div className="input-wrapper">
              <input 
                onChange={ this.onChange }
                value={username}
                name="username"
                className="input" type="text"
                placeholder="username" />
            </div>
            {/* <!-- end of input wrapper --> */}
            {
              username_error && 
                <div className="helper-info">
                  This field is required
                </div>
            }
            {/* <!-- end of helper info --> */}
            <div className="input-wrapper">
              <input
                onChange={ this.onChange }
                value={password}
                name="password"
                className="input" type="password"
                placeholder="password" />
            </div>
            {/* <!-- end of input wrapper --> */}
            {
              password_error && 
                <div className="helper-info">
                  This field is required
                </div>
            }
            {/* <!-- end of helper info --> */}
            <div className="input-wrapper">
              <input
                onChange={ this.onChange }
                value={cpassword}
                name="cpassword"
                className="input" type="password"
                placeholder="confirm password" />
            </div>
            {/* <!-- end of input wrapper --> */}
            {
              cpassword_error && 
                <div className="helper-info">
                  This field is required
                </div>
            }
            {/* <!-- end of helper info --> */}
            <div className="input-wrapper _flex">
              <div className="_left">
                <input
                  onChange={ this.onChange }
                  value={isAdmin}
                  name="isAdmin"
                  className="input checkbox" type="checkbox" />
              </div>
              <div className="_right">
                <span className="text">register as admin</span>
              </div>
            </div>
            {/* <!-- end of input wrapper --> */}
            <div className="input-wrapper _flex">
              <div className="_left">
                <button type="submit" 
                  className="button login-btn">
                  Register
                </button>
              </div>
              {/* <!-- end of _left --> */}
              <div className="_right">
                or
                <Link className="_link" to="/">
                  &nbsp; login
                </Link>
              </div>
              {/* <!-- end of _right --> */}
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
  RegRequest
})(Register);
