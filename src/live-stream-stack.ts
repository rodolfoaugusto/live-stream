import { Stack, Construct, StackProps, ConcreteDependable, CfnOutput } from '@aws-cdk/core';
import { MediaPackage } from './mediapackage';
import { MediaLive } from './medialive';

import { config } from 'dotenv'
config({ path: './.env' })

export class LiveStreamStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const channelName = process.env.CHANNEL_NAME as string
    const streamName = process.env.STREAM_NAME as string
    const securityGroupInputsIP = process.env.SECURITY_GROUP_INPUTS_IP as string

    const mediaPackage = new MediaPackage(this, channelName, {
      hlsSegmentDurationSeconds: 5,
      hlsPlaylistWindowSeconds: 60,
      hlsMaxVideoBitsPerSeconds: 2147483647,
      hlsMinVideoBitsPerSeconds: 0,
      hlsStreamOrder: 'ORIGINAL'
    })

    const mediaLive = new MediaLive(this, channelName, {
      ipSgInput: securityGroupInputsIP,
      streamName,
    })
    
    const mediaDep = new ConcreteDependable()
    mediaDep.add(mediaPackage.channel)
    mediaPackage.hlsEndpoint.node.addDependency(mediaDep)
    mediaLive.channelLive.node.addDependency(mediaDep)
    // mediaLive.channelLive._toCloudFormation()

    // --- Ready to Start
    const region = process.env.CDK_DEFAULT_REGION as string
    // Media Live Channel Ready
    new CfnOutput(this, `live-channel-ready`, {
      value: `https://${region}.console.aws.amazon.com/medialive/home?region=${region}#!/channels`
    })

    // Demo Player
    new CfnOutput(this, `demo-player`, {
      value: `https://hls-js.netlify.app/demo/?src=${mediaPackage.hlsEndpoint.attrUrl}`
    })
  }
}