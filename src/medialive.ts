import { Construct } from '@aws-cdk/core';
import { CfnInputSecurityGroup, CfnInput, CfnChannel } from '@aws-cdk/aws-medialive';
import { Role, ServicePrincipal, ManagedPolicy, PolicyDocument } from '@aws-cdk/aws-iam';

import INLINE_POLICY from './medialive-policy'

import { config } from 'dotenv'
config({ path: './.env' })
const channelName = process.env.CHANNEL_NAME as string

export interface MediaLiveProperties {
  readonly ipSgInput: string
  readonly streamName: string
}

export class MediaLive {
  protected _channelLive: CfnChannel
  constructor(scope: Construct, id: string, props: MediaLiveProperties) {
    const { 
      ipSgInput,
      streamName
    } = props
  
    const securityGroupsInput = new CfnInputSecurityGroup(scope,
      `media-live-sg-input`, {
      whitelistRules: [{ 'cidr': ipSgInput }]
    });

    // Input with destinations output
    const medialiveInput = new CfnInput(scope,
      `media-input-channel`, {
      name: `input-${id}`,
      type: 'RTMP_PUSH',
      inputSecurityGroups: [securityGroupsInput.ref],
      destinations: [{ streamName }]
    })

    // IAM Role
    const roleName = `medialive-role-${channelName}`
    let iamRole = new Role(scope, roleName, {
      roleName,
      assumedBy: new ServicePrincipal('medialive.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AWSElementalMediaLiveFullAccess')],
      inlinePolicies: { 'medialivecustom': PolicyDocument.fromJson(INLINE_POLICY) }
    })

    // Live Channel
    this._channelLive = new CfnChannel(scope, `media-live-channel-${id}`, {
      channelClass: 'SINGLE_PIPELINE',
      name: id,
      inputSpecification: {
        codec: 'AVC',
        maximumBitrate: 'MAX_20_MBPS',
        resolution: 'HD'
      },
      inputAttachments: [{
        inputId: medialiveInput.ref,
        inputAttachmentName: 'attach-input'
      }],
      destinations: [{
        id: 'media-destination',
        mediaPackageSettings: [{
          channelId: id
        }]
      }],
      encoderSettings: {
        timecodeConfig: {
          source: 'EMBEDDED'
        },
        audioDescriptions: [{
          audioSelectorName: 'Default',
          audioTypeControl: 'FOLLOW_INPUT',
          languageCodeControl: 'FOLLOW_INPUT',
          name: 'audio_1',
          codecSettings: {
            aacSettings: {
              bitrate: 192000,
              codingMode: 'CODING_MODE_2_0',
              inputType: 'NORMAL',
              profile: 'LC',
              rateControlMode: 'CBR',
              rawFormat: 'NONE',
              sampleRate: 48000,
              spec: 'MPEG4'
            }
          }
        },
        {
          audioSelectorName: 'Default',
          audioTypeControl: 'FOLLOW_INPUT',
          languageCodeControl: 'FOLLOW_INPUT',
          name: 'audio_2',
          codecSettings: {
            aacSettings: {
              bitrate: 192000,
              codingMode: 'CODING_MODE_2_0',
              inputType: 'NORMAL',
              profile: 'LC',
              rateControlMode: 'CBR',
              rawFormat: 'NONE',
              sampleRate: 48000,
              spec: 'MPEG4'
            }
          }
        }],
        videoDescriptions: [{
          codecSettings: {
            h264Settings: {
              adaptiveQuantization: 'HIGH',
              afdSignaling: 'NONE',
              bitrate: 5000000,
              colorMetadata: 'INSERT',
              entropyEncoding: 'CABAC',
              flickerAq: 'ENABLED',
              framerateControl: 'SPECIFIED',
              framerateDenominator: 1,
              framerateNumerator: 50,
              gopBReference: 'ENABLED',
              gopClosedCadence: 1,
              gopNumBFrames: 3,
              gopSize: 60,
              gopSizeUnits: 'FRAMES',
              level: 'H264_LEVEL_AUTO',
              lookAheadRateControl: 'HIGH',
              numRefFrames: 3,
              parControl: 'SPECIFIED',
              profile: 'HIGH',
              rateControlMode: 'CBR',
              scanType: 'PROGRESSIVE',
              sceneChangeDetect: 'ENABLED',
              slices: 1,
              spatialAq: 'ENABLED',
              syntax: 'DEFAULT',
              temporalAq: 'ENABLED',
              timecodeInsertion: 'DISABLED'
            }
          },
          height: 1080,
          name: 'video_1080p30',
          respondToAfd: 'NONE',
          scalingBehavior: 'DEFAULT',
          sharpness: 50,
          width: 1920
        },
        {
          codecSettings: {
            h264Settings: {
              adaptiveQuantization: 'HIGH',
              afdSignaling: 'NONE',
              bitrate: 3000000,
              colorMetadata: 'INSERT',
              entropyEncoding: 'CABAC',
              flickerAq: 'ENABLED',
              framerateControl: 'SPECIFIED',
              framerateDenominator: 1,
              framerateNumerator: 50,
              gopBReference: 'ENABLED',
              gopClosedCadence: 1,
              gopNumBFrames: 3,
              gopSize: 60,
              gopSizeUnits: 'FRAMES',
              level: 'H264_LEVEL_AUTO',
              lookAheadRateControl: 'HIGH',
              numRefFrames: 3,
              parControl: 'SPECIFIED',
              profile: 'HIGH',
              rateControlMode: 'CBR',
              scanType: 'PROGRESSIVE',
              sceneChangeDetect: 'ENABLED',
              slices: 1,
              spatialAq: 'ENABLED',
              syntax: 'DEFAULT',
              temporalAq: 'ENABLED',
              timecodeInsertion: 'DISABLED'
            }
          },
          height: 720,
          name: 'video_720p30',
          respondToAfd: 'NONE',
          scalingBehavior: 'DEFAULT',
          sharpness: 100,
          width: 1280
        }
        ],
        outputGroups: [{
          name: 'HD',
          outputGroupSettings: {
            mediaPackageGroupSettings: {
              destination: {
                destinationRefId: 'media-destination'
              }
            }
          },
          outputs: [{
            audioDescriptionNames: ['audio_1'],
            outputName: '1080p30',
            videoDescriptionName: 'video_1080p30',
            outputSettings: {
              mediaPackageOutputSettings: {}
            }
          },
          {
            audioDescriptionNames: ['audio_2'],
            outputName: '720p30',
            videoDescriptionName: 'video_720p30',
            outputSettings: {
              mediaPackageOutputSettings: {}
            }
          }]
        }]
      },
      roleArn: iamRole.roleArn
    });
  }
  
  public get channelLive() {
    return this._channelLive
  }
}
