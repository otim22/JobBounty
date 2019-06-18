import React, { Component } from "react";
import JobBountyContract from "./contracts/JobBounty.json";
import getWeb3 from "./utils/getWeb3";
// eslint-disable-next-line
import { setJSON, getJSON } from './utils/IPFS.js';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Jumbotron from 'react-bootstrap/Jumbotron';

import "./App.css";

const etherscanBaseUrl = "https://rinkeby.etherscan.io";
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs";

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            jobBountiesInstance: undefined,
            bountyAmount: undefined,
            bountyData: undefined,
            bountyDescription: undefined,
            bountyDeadline: undefined,
            etherscanLink: "https://rinkeby.etherscan.io",
            bounties: [],
            account: null,
            web3: null
        }

        this.handleIssueBounty = this.handleIssueBounty.bind(this)
        this.handleChange = this.handleChange.bind(this)
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
            this.setState({ jobBountiesInstance: instance, web3: web3, account: accounts[0] })
            this.addEventListener(this)
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    handleChange(event)
    {
        switch(event.target.name) {
            case "bountyData":
                this.setState({"bountyData": event.target.value});
                break;
            case "bountyDescription":
                this.setState({"bountyDescription": event.target.value});
                break;
            case "bountyDeadline":
                this.setState({"bountyDeadline": event.target.value});
                break;
            case "bountyAmount":
                this.setState({"bountyAmount": event.target.value});
                break;
            default:
                break;
        }
    }

    async handleIssueBounty(event)
    {
        if (typeof this.state.jobBountiesInstance !== 'undefined') {
            event.preventDefault();
            const ipfsHash = await setJSON({ bountyData: this.state.bountyData });
            let result = await this.state.jobBountiesInstance.methods.issueBounty(ipfsHash, this.state.bountyDescription, this.state.bountyDeadline).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.bountyAmount, 'ether')})
            this.setLastTransactionDetails(result)
        }
    }

    setLastTransactionDetails(result)
    {
        if(result.tx !== 'undefined')
        {
            this.setState({etherscanLink: etherscanBaseUrl+"/tx/"+result.tx});
        }
        else
        {   
            this.setState({etherscanLink: etherscanBaseUrl});
        }
    }

    addEventListener(component) 
    {

        this.state.jobBountiesInstance.events.BountyIssued({fromBlock: 0, toBlock: 'latest'})
        .on('data', async function(event){
        //First get the data from ipfs and add it to the event
        var ipfsJson = {}
        try{
            ipfsJson = await getJSON(event.returnValues.data);
        }
        catch(e) {}

        if(ipfsJson.bountyData !== undefined)
        {
            event.returnValues['bountyData'] = ipfsJson.bountyData;
            event.returnValues['ipfsData'] = ipfsBaseUrl+"/"+event.returnValues.data;
        }
        else {
            event.returnValues['ipfsData'] = "none";
            event.returnValues['bountyData'] = event.returnValues['data'];
        }

        var newBountiesArray = component.state.bounties.slice()
        newBountiesArray.push(event.returnValues)
        component.setState({ bounties: newBountiesArray })
        }).on('error', console.error);
    }

    render() {
        if (!this.state.web3) {
            return <div > Loading Web3, accounts, and contract... < /div>;
        }
        return ( <
            div className = "App" >
            <
            Navbar collapseOnSelect expand = "lg"
            variant = "light"
            bg = "light" >
            <
            Navbar.Brand href = "#home" > Job Bounty < /Navbar.Brand> <
            Navbar.Toggle / >
            <
            Navbar.Collapse id = "responsive-navbar-nav" >
            <
            Nav className = "ml-auto" >
            <
            Nav.Link href = "#features" > Home < /Nav.Link> < /
            Nav > <
            Nav >
            <
            Nav.Link href = "#deets" > About < /Nav.Link> <
            Nav.Link eventKey = { 2 }
            href = "#memes" >
            Contact <
            /Nav.Link> < /
            Nav > <
            /Navbar.Collapse> < /
            Navbar >
            <
            Jumbotron fluid >
            <
            Container >
            <
            h1 > Post | Submit | Bounties. < /h1> <br / > <
            p >
            This is a decentralized blockchain platform where one posts job bounty
            for another person to do and get bounties or compensations, don 't be left out. < /
            p > < /
            Container > <
            /Jumbotron> <
            Container >
            <
            Row >
            <
            Col >
            <
            a href = { this.state.etherscanLink }
            target = "_blank"
            rel = "noopener noreferrer" > Recent Transaction Details < /a> < /
            Col > <
            /Row> <
            br / >
            <
            Form >

            <
            Form.Group as = { Row }
            controlId = "issueBounty" 
            onSubmit={this.handleIssueBounty}>
            <
            Form.Label column sm = "2" >
            Issue Bounty <
            /Form.Label> <
            Col sm = "10" >
            <
            Form.Control type = "issueBounty"
            name="issueBounty"
            value={this.state.bountyData}
            onChange={this.handleChange}
            placeholder = "Issue a job bounty" / >
            <
            /Col> < /
            Form.Group >

            <
            Form.Group as = { Row }
            controlId = "descriptionOfJobBounty" >
            <
            Form.Label column sm = "2" >
            Description of bounty <
            /Form.Label> <
            Col sm = "10" >
            <
            Form.Control type = "text"
            placeholder = "Description of the job bounty" 
            value={this.state.bountyDescription}
            onChange={this.handleChange}/ >
            <
            /Col> < /
            Form.Group >

            <
            Form.Group as = { Row }
            controlId = "bountyDeadline" >
            <
            Form.Label column sm = "2" >
            Deadline of bounty <
            /Form.Label> <
            Col sm = "10" >
            <
            Form.Control type = "text"
            placeholder = "Time in seconds since epoch" 
            value={this.state.bountyDeadline}
            onChange={this.handleChange}/ >
            <
            /Col> < /
            Form.Group >

            <
            Form.Group as = { Row }
            controlId = "bountyAmount" >
            <
            Form.Label column sm = "2" >
            Amount of bounty <
            /Form.Label> <
            Col sm = "10" >
            <
            Form.Control type = "text"
            placeholder = "Amount of bounty" 
            value={this.state.bountyAmount}
            onChange={this.handleChange}/ > < /Col>< /
            Form.Group >

            <
            /Form> 

            <
            br / >
            <
            Button variant = "primary"
            type = "submit"
            block >
            Submit <
            /Button> 

            <
            br / >
            <
            hr / >
            <
            br / >

            <
            Table striped bordered hover data = { this.state.bounties } >
            <
            thead >
            <
            tr >
            <
            th isKey dataField = 'bounty_id' > ID < /th> <
            th dataField = 'issuer' > Issuer < /th> <
            th dataField = 'amount' > Amount < /th> <
            th dataField = 'data' > Bounty Description < /th> <
            th dataField = 'data' > Action < /th> < /tr > </thead> <
            tbody >
            <
            tr >
            <
            td > 0 < /td> <
            td > 0x1234566 < /td> <
            td > 1000000000 < /td> <
            td > Saving data to ipfs < /td> 
            <
            td > 
            <Button variant="secondary">View</Button>
            <Button variant="warning">Update</Button>
            <Button variant="danger">Delete</Button>
            < /td>< /
            tr > < /
            tbody > < /
            Table > <
            /
            Container > <
            /
            div >
        );
    }
}

export default App;