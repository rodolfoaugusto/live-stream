import { Stack, Construct, StackProps } from '@aws-cdk/core'
import { CloudFront } from './cloudfront'
import * as fs from 'fs'

import { config } from 'dotenv'
config({ path: './.env' })

export class CloudFrontStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const channelName = process.env.CHANNEL_NAME as string
    fs.exists('./outputs.json', (exists: any) => {
      if (exists) {
        const JSONfile = require('../outputs.json')
        let jsondata = JSON.parse(JSON.stringify(JSONfile))
        const stackName = `LiveStreamStack-${channelName}`
        if(jsondata.hasOwnProperty(stackName)){
          console.log('Existe padrin')
          new CloudFront(this, channelName, {
            domainOrigin: jsondata[stackName]['mediapackageendpoint']
          })
        }
      }
    });
  }
}