## Backend 
- Access the backend folder - `cd backend`
- Install the dependencies - `npm install`

### Running locally
- Install local dynamodb environment - `sls dynamodb install`
- Start local serverless environment - `npm run offline` or `sls offline start`
- The serverless environment will be running at: 
	- **ApiGateway RestApi**:  `http://localhost:15001`
	- **ApiGateway Websocket**: `ws://localhost:3001`
	- **DynamoDB**: `http://localhost:15002` and `http://localhost:15002/shell (visual client)`
	- **S3 bucket**: `http://localhost:4569 `
	
### Running on AWS
- Change the **bucket name** on `serverless.ts` at line 62 otherwise the deploy will fail due to S3's name duplication. 
- Deploy to AWS- `npm run deploy` or `sls deploy`