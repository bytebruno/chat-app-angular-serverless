import type { AWS } from '@serverless/typescript';
import connect from '@functions/connect';
import disconnect from '@functions/disconnect';
import hello from '@functions/hello';
import sendMessage from '@functions/sendMessage';

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
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:Scan', 'dynamodb:PutItem', 'dynamodb:DeleteItem'],
        Resource:
          'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}',
      },
    ],
  },
  // import the function via paths
  functions: { hello, connect, disconnect, sendMessage },
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
    },
  },
};

module.exports = serverlessConfiguration;
