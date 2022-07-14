# hoDl! app

![](https://github.com/BlackH3art/hodl-app-vol3-backend/blob/main/src/images/thumbnail.jpg "thumbnail")

Application is deployed on heroku: \
https://hodlapp-vol3.herokuapp.com/

It serves as a REST API for React application deployed on:\
https://www.hodl-app.xyz

Frontend repository:\
https://github.com/BlackH3art/hodl-app-vol3-frontend

-----

## About

This application is meant to help crypto traders manage their portfolio, as well as opened positions and transactions history.\
It tracks current price of given crypto asset based on https://coinmarketcap.com/ API.

**hoDl! app** consists of three segments:
- Positions
- Wallet
- History


### Positions
Where you can track current price and state for each and every buy transaction u made.\
Application calculates:
- percent PNL
- dolar PNL
- your total investment
- how much is it currently worth
- amount of crypto


### Wallet
Wallet aggregates your multiple positions, in case if you are interested in DCA (dolar cost average) strategies.\
Application calculates:
- average price you bought each and every crypto
- total percent PNL
- total dolar PNL
- your total investment
- how much is it currently worth
- atotal mount of crypto


### History
Keeps track of your each transaction buying, selling\
Stored data:
- date when position was opened
- date when positions was closed,
- dolar PNL from selling transactions
- amount of crypto bought and sold

-----

## Try this app:
To try this app:
- go to https://www.hodl-app.xyz
- create your account
- add first transaction filling up the form

`Ticker` - is the cryptocurrency symbol (e.g BTC)\
`Amount` - what is the amount of crypto you bought (e.g 2 for 2BTC)\
`Price` - what is the price that you bought it for.\
Example:

You bought two Bitcoins at the price of 15000$\
Application will calculate that you know have 2BTC and they are worth 30000$\

### Access
Application is restricted to two domains:
```javascript
  app.enableCors({
    origin: ['https://hodl-app.xyz', 'https://www.hodl-app.xyz'],
    credentials: true
  });
```
So you won't be able to test endpoints, but you can clone this repository with:
```
git clone https://github.com/BlackH3art/hodl-app-vol3-backend.git
```
\
Fill your `.env` file:\
`CONNECTION_URL` - MongoDB Connection rul\
`CMC_API_KEY` - coin market cap API key\
`SECRET_STRING` - some secret long string\
`SALT` - some secret long string\
`SECRET` - some secret long string\

Then:
```
npm install
```
Then:
```
nest start --watch
```


----

