import React, { Component } from "react";
import JobBountyContract from "./contracts/JobBounty.json";
import getWeb3 from "./utils/getWeb3";

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
            controlId = "issueBounty" >
            <
            Form.Label column sm = "2" >
            Issue Bounty <
            /Form.Label> <
            Col sm = "10" >
            <
            Form.Control type = "issueBounty"
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
            placeholder = "Description of the job bounty" / >
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
            placeholder = "Time in seconds since epoch" / >
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
            placeholder = "Amount of bounty" / > < /Col>< /
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
            th dataField = 'data' > Bounty Description < /th> < /
            tr > <
            /thead> <
            tbody >
            <
            tr >
            <
            td > 0 < /td> <
            td > 0x1234566 < /td> <
            td > 1000000000 < /td> <
            td > Saving data to ipfs < /td> < /
            tr > <
            tr >
            <
            td > 1 < /td> <
            td > 0x2134566 < /td> <
            td > 2000000000 < /td> <
            td > Documentation of app < /td> < /
            tr >
            <
            tr >
            <
            td > 2 < /td> <
            td > 0x3134566 < /td> <
            td > 6000000000 < /td> <
            td > Test the blockchain mulla < /td> < /
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