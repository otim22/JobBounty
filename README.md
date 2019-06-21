# JobBounty

This is a bounty dApp where people can post or submit work.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. Run to compile the contract but ensure ganache is running in the background for local testing.

```
Truffle compile
```

Then

```
Truffle migrate --network rinkeyby
```

### Prerequisites

You need to have ganache cli or  ganache app which comes in the truffle suit, and npm installed,

You can run ganache-cli in the terminal or open the ganache app

```
ganache-cli
```

Copy the genrated Mnemonic 

Helps in Registration/login into matamask

### Installing

You can install project dependencies from the root directory

```
npm install
```

To run the application frontend,

```
cd client
npm install
npm run start
```

## Running the tests

You run tests on the root directory using truffle

### Break down into end to end tests

These tests the smart contracts methods

```
truffle test
```

## Deployment

The smart contract and frontend application is hosted on etherscan, github and heruko.
* [Etherscan](https://rinkeby.etherscan.io/) - To help track transactions and test net for the contracts
* [Github](https://github.com/otim22/JobBounty) - Repository for my code
* [Heruko]() - Live front app


## Built With

* [Truffle](https://www.trufflesuite.com/) - Tool for smart contract
* [Mythx](https://mythx.io/) - For security check
* [Metamask](https://metamask.io/) - For the browser interaction, this is a chrome extension.
* [React-bootstrap](https://react-bootstrap.github.io/) - The Frontend framework used


## Authors

* **Otim Fredrick** - *Initial work* - [JobBounty](https://github.com/otim22/JobBounty)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [Consensys Academy](https://consensys.net/academy/) - For Delivering the course
* [African Blockchain Allaince](https://afriblockchain.org/) - For mediating the course
* [Cryptosavannah](https://cryptosavannah.com/) - For the logistics and support.
* My mentor @joshorig - For the priceless information he shared.