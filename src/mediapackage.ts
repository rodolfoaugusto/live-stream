import { Construct, CfnOutput } from '@aws-cdk/core'
import { CfnChannel, CfnOriginEndpoint } from '@aws-cdk/aws-mediapackage'

export interface MediaPackageProperties {
  readonly hlsSegmentDurationSeconds: number
  readonly hlsPlaylistWindowSeconds: number
  readonly hlsMaxVideoBitsPerSeconds: number
  readonly hlsMinVideoBitsPerSeconds: number
  readonly hlsStreamOrder: string
}

export class MediaPackage {
  protected _channel: CfnChannel
  protected _hlsEndpoint: CfnOriginEndpoint
  constructor(scope: Construct, id: string, props: MediaPackageProperties) {
    const {
      hlsSegmentDurationSeconds,
      hlsPlaylistWindowSeconds,
      hlsMaxVideoBitsPerSeconds,
      hlsMinVideoBitsPerSeconds,
      hlsStreamOrder
    } = props

    // MediaPackage Channel
    this._channel = new CfnChannel(scope, `media-package-channel-${id}`, {
      id,
      description: `Channel ${id}`
    })

    const hlsPackage: CfnOriginEndpoint.HlsPackageProperty = {
      segmentDurationSeconds: hlsSegmentDurationSeconds,
      playlistWindowSeconds: hlsPlaylistWindowSeconds,
      streamSelection: {
        minVideoBitsPerSecond: hlsMinVideoBitsPerSeconds,
        maxVideoBitsPerSecond: hlsMaxVideoBitsPerSeconds,
        streamOrder: hlsStreamOrder
      }
    }

    this._hlsEndpoint = new CfnOriginEndpoint(scope, `endpoint${id}`, {
      channelId: id,
      id: `endpoint${id}`,
      hlsPackage
    })

    new CfnOutput(scope, `media-package-endpoint`, {
      value: this._hlsEndpoint.attrUrl
    })
  }

  public get channel() {
    return this._channel
  }

  public get hlsEndpoint() {
    return this._hlsEndpoint
  }
}
