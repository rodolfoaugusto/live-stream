#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { LiveStreamStack } from './live-stream-stack'
import { CloudFrontStack } from './cloudfront-stack'

import { config } from 'dotenv'
config({ path: './.env' })
const channelName = process.env.CHANNEL_NAME as string

const app = new cdk.App()

const liveStreamStack = new LiveStreamStack(app, `LiveStreamStack-${channelName}`, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
})

new CloudFrontStack(app, `CloudFrontStack-${channelName}`).addDependency(liveStreamStack);
