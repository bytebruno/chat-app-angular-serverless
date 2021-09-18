import type { AWS } from '@serverless/typescript'
import auth from '@functions/auth'
import connect from '@functions/connect'
import disconnect from '@functions/disconnect'
import handleUserLogin from '@functions/handleUserLogin'
import hello from '@functions/hello'
import sendMessage from '@functions/sendMessage'

const serverlessConfiguration: AWS = {
  service: 'backend',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 15002,
      },
    },
    'serverless-offline': {
      httpPort: 15001,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dynamodb-local',
  ],
  package: {
    individually: true,
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'us-east-1',
    // tracing: {
    //   lambda: true,
    //   apiGateway: true,
    // },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      CONNECTIONS_TABLE: 'Connections-${self:provider.stage}',
      USER_INFO_TABLE: 'UserInfo-${self:provider.stage}',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { auth, hello, connect, disconnect, sendMessage, handleUserLogin },
  resources: {
    Resources: {
      ConnectionsDynamoDBTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.CONNECTIONS_TABLE}',
          AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
          KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
          BillingMode: 'PAY_PER_REQUEST',
        },
      },
      UserInfoDynamoDBTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.USER_INFO_TABLE}',
          AttributeDefinitions: [
            { AttributeName: 'userId', AttributeType: 'S' },
          ],
          KeySchema: [{ AttributeName: 'userId', KeyType: 'HASH' }],
          BillingMode: 'PAY_PER_REQUEST',
        },
      },
    },
  },
}

module.exports = serverlessConfiguration
