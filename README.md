# Live Stream Stack
The Live Stream Stack is a platform to release new scalable live stream channels on AWS.

# To-do
1. Add WAF to CloudFront
2. Add custom domain to CloudFront

## Infrastructure Architecture
The infrastructure overview can be found at 
![Infrastructure](assets/architecture.svg?raw=true)
* [Architecture](https://app.diagrams.net/?splash=0&libs=aws4#G1tWet5hIjabRQfZj1M2ii_6HjS9YDvpF3)

## AWS Resources Deployed

* Elemental MediaLive
* Elemental MediaPackage
* Secrets Manager
* CloudFront(CDN)

## Getting Started

### Requirements

* NodeJS (13/14 recommended)
* NPM
* [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
* [AWS CDK Toolkit](https://docs.aws.amazon.com/cdk/v2/guide/cli.html)

### Development

```
git clone git@github.com:rodolfoaugusto/live-stream.git
cd live-stream
npm run build
npm run test
npm run deploy
```
 
* You have to assume to appropriate AWS IAM Role by using the awscli before tryng to deploy the resources defined by the Stack.
 
