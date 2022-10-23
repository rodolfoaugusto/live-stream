#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { LiveStreamStack } from './live-stream-stack'

import { config } from 'dotenv'
config({ path: './.env' })
const channelName = process.env.CHANNEL_NAME as string

const app = new cdk.App()
new LiveStreamStack(app, `LiveStreamStack-${channelName}`, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
})
