# lancs-lamp_api

API for Lancs Lamp System

## Notes on implementation

- Requires a messaging service for sending SMS/Emails to test subjects on result, rejection or a reminder following a period since last test
- Requires a Patient Demographics Service for pulling demographics based on NHS Number and Date of Birth
- Authentication service based on accounts created in DynamoDB, code included for Active Directory connectivity

## Commands to operate code

- `npm i` to install libraries
- `npm run start:dev` to run locally, requires port forwarded connection to Postgresql database and locally stored AWS credentials to account
- `npm run test` scripts for testing endpoints and basic security/operation of API
