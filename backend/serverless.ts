import type { AWS } from '@serverless/typescript';
import auth from '@functions/auth';
import connect from '@functions/connect';
import disconnect from '@functions/disconnect';
import generateAvatarUploadUrl from '@functions/generateAvatarUploadUrl';
import handleUserLogin from '@functions/handleUserLogin';
import sendMessage from '@functions/sendMessage';
import updateUserInfo from '@functions/updateUserInfo';

const serverlessConfiguration: AWS = {
  service: 'chat-app-backend',
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
        migrate: true,
      },
    },
    s3: {
      host: '0.0.0.0',
      port: 4569,
      cors: 'src/utils/s3-cors-localhost.xml',
    },
    'serverless-offline': {
      httpPort: 15001,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dynamodb-local',
    'serverless-s3-local',
    'serverless-iam-roles-per-function',
  ],
  package: {
    individually: true,
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'us-east-1',
    tracing: {
      lambda: true,
      apiGateway: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      CONNECTIONS_TABLE: 'Connections-${self:provider.stage}',
      USER_INFO_TABLE: 'UserInfo-${self:provider.stage}',
      AVATAR_IMAGE_S3_BUCKET:
        'avatar-image-chat-app-bytebruno${self:provider.stage}',
      SIGNED_URL_EXPIRATION: '300',
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['xray:PutTelemetryRecords', 'xray:PutTraceSegments'],
            Resource: '*',
          },
        ],
      },
    },
  },
  functions: {
    auth,
    connect,
    disconnect,
    sendMessage,
    handleUserLogin,
    updateUserInfo,
    generateAvatarUploadUrl,
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
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
      AvatarImageBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.AVATAR_IMAGE_S3_BUCKET}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ['*'],
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                MaxAge: 3000,
              },
            ],
          },
        },
      },
      BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          PolicyDocument: {
            Id: 'MyPolicy',
            Version: '2012-10-17',
            Statement: {
              Sid: 'PublicReadForGetBucketObjects',
              Effect: 'Allow',
              Principal: '*',
              Action: 's3:GetObject',
              Resource:
                'arn:aws:s3:::${self:provider.environment.AVATAR_IMAGE_S3_BUCKET}/*',
            },
          },
          Bucket: { Ref: 'AvatarImageBucket' },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
