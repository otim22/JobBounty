import React, { Component } from "react";
import JobBountyContract from "./contracts/JobBounty.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
    constructor(props) {
      super(props)

      this.state = {
        jobBountiesInstance: undefined,
        bountyAmount: undefined,
        bountyData: undefined,
        bountyDeadline: undefined,
        etherscanLink: "https://rinkeby.etherscan.io",
        account: null,
        web3: null
      }

      // this.handleIssueBounty = this.handleIssueBounty.bind(this)
      // this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount = async() => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = JobBountyContract.networks[networkId];
            const instance = new web3.eth.Contract(
                JobBountyContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            // this.setState({ web3, accounts, contract: instance }, this.runExample);
            this.setState({ jobBountiesInstance: instance, web3: web3, account: accounts[0]})
            this.addEventListener(this)
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    render() {
        if (!this.state.web3) {
            return <div > Loading Web3, accounts, and contract... < /div>;
        }
        return ( 
          <div className="App">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <a className="navbar-brand" href="#">JobBounty</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    {/* <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> */}
                  </li>
                </ul>
                <ul className="navbar-nav">
                  <li className="nav-item active">
                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">About</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Contact</a>
                  </li>
                </ul>
              </div>
            </nav>
            <br />
            <div className="container">
              <div className="row">
                <a href={this.state.etherscanLink} target="_blank" rel="noopener noreferrer">Last Transaction Details</a>
              </div><br/>
              <form>
                <div className="form-group row">
                  <label htmlFor="issueBounty" className="col-sm-2 col-form-label">Issue Bounty</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id="issueBounty" placeholder="Issue Bounty"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="descriptionOfBounty" className="col-sm-2 col-form-label">Description of bounty</label>
                  <div className="col-sm-10">
                    <textarea className="form-control" id="descriptionOfBounty" rows="3" placeholder="Enter description of bounty"></textarea>
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="bountyDeadline" className="col-sm-2 col-form-label">Deadline of bounty</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id="bountyDeadline" placeholder="In seconds since epoch"/>
                  </div>
                </div>
                <div className="form-group row">
                  <label htmlFor="bountyAmount" className="col-sm-2 col-form-label">Amount of bounty</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id="bountyAmount" placeholder="Amount of bounty"/>
                  </div>
                </div><br/>
                <button type="submit" className="btn btn-primary btn-block mx-auto d-block">Submit</button>
              </form>
            </div>
          </div>
        );
    }
}

export default App;