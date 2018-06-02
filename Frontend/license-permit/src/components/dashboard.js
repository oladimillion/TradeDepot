import React, { Component } from 'react';
import { connect } from 'react-redux'
import { 
} from "../actions/actions";
import { Logout, FetchApplicationsRequest } from "../actions/actions";
import Loading from "./loading";
import Header from "./header";
import MsgInfo from "./msg-info";

class Dashboard extends Component {

  constructor(props){

    super(props);

    this.state = { 
      isInitializing: true,
      isLoading: true,
      info: null,
      files: [],
      caption: "",
      file: "",
      applications: [],
    };

    this.timerID = null;
    this.onSubmit = this.onSubmit.bind(this);
    this.logout = this.logout.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount(){
    if(!localStorage.getItem("token")){
      this.props.history.replace("/", null);
    }
  }

  componentDidMount(){
    this.props.FetchApplicationsRequest()
      .then(data => {
        this.setState({
          isLoading: false, 
          isInitializing: false,
          applications: data.data.payload,
        });
      })
      .catch(data => {
        this.setState({isLoading: false, isInitializing: false,});
      })
  }

  componentWillUnmount(){
    if(this.timerID){
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  logout(){
    this.props.Logout();
    this.props.history.replace("/", null);
  }

  onSubmit(e){
    e.preventDefault();
    this.setState({isLoading: true});

    // const formData = new FormData();
    // formData.append("caption", caption);
    // formData.append("avatar", file, file.name);

    // this.props.AddFileRequest(formData)
    //   .then(data => {
    //     this.setState({
    //       isLoading: false, 
    //       info: data.data,
    //       files: [...this.state.files, data.data.payload],
    //       _showModal: false,
    //       caption: "",
    //       file: "",
    //     });
    //     this.setOrClearInfo();
    //   })
    //   .catch(data => {
    //     this.setState({isLoading: false, info: data.response.data});
    //     this.setOrClearInfo();
    //   })

  }

  addFile(e){

    let files = e.target.files;

    if(!files.length ){
      this.setState({
        file: "",
      })
      return;
    }

    let file = files[0];
    let name = file.name.toLowerCase();

    if(!this.isValidFile(name)){
      return;
    }

    this.setState({
      file 
    })
  }

  isValidFile(name){
    if(
      !name.includes(".jpg", name.length - 4)
      && !name.includes(".png", name.length - 4)
      && !name.includes(".jpeg", name.length - 5)
      && !name.includes(".gif", name.length - 4)
    ){
      const data = {
        success: false, 
        message: "File formats supported are jpeg, jpg, png and gif",
      };
      this.setState({info: data});
      this.setOrClearInfo();
      return false;
    }

    return true;
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

  render() {

    const {
      isLoading,
      info,
      files,
      isInitializing,
      applications,
    } = this.state;


    return (
      <span>
        <Header logout={this.logout} />
        {info && <MsgInfo info={info} />}
        {isLoading && <Loading />}
        {!isInitializing && <div className="dashboard">
          <header>
            WELCOME TO DASHBOARD
          </header>
          <br/>
          <br/>
          <main>
            <table>
              <thead>
                <tr>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Address</th>
                  <th>Application Type</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((list, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {list.firstName}
                      </td>
                      <td>
                        {list.lastName}
                      </td>
                      <td>
                        {list.address}
                      </td>
                      <td>
                        {list.applicationType}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </main>

        </div>
        }
      </span>
    )
  }
}


export default connect(null, { 
  Logout,
  FetchApplicationsRequest
})(Dashboard);
