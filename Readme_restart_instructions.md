# SENTICS

## Steps for starting frontend

### sudo npm install
### HOST=0.0.0.0 sudo npm start

## Steps for starting live page backend

### Move to backend folder
### node index.js

## Steps for setting up MongoDB

### Install Mongodb in system
### Install MongoDB compass in the system
### sudo systemctl enable mongod
### sudo systemctl status mongod

#### If status shows mongod as inactive then run : sudo systemctl restart mongod

## Steps for running analytics page backend

### Move to backend/fast_api folder
### python3 saver.py
### uvicorn main:app --reload
