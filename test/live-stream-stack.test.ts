import { expect as expectCDK, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as LiveStreamStack from '../src/live-stream-stack';

import { config } from 'dotenv'
config({ path: './.env' })
const channelName = process.env.CHANNEL_NAME as string

test('MediaPackage Channel exists', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LiveStreamStack.LiveStreamStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike("AWS::MediaPackage::Channel"));
});

test('MediaPackage Endpoint exists', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LiveStreamStack.LiveStreamStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike("AWS::MediaPackage::OriginEndpoint"));
});

test('MediaLive SecurityGroup exists', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LiveStreamStack.LiveStreamStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike("AWS::MediaLive::InputSecurityGroup"));
});

test('MediaLive Input exists', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LiveStreamStack.LiveStreamStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike("AWS::MediaLive::Input"));
});

test('MediaLive Channel exists', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LiveStreamStack.LiveStreamStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike("AWS::MediaLive::Channel"));
});

test('MediaLive Role exists', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new LiveStreamStack.LiveStreamStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResourceLike("AWS::IAM::Role", {
    "RoleName": `medialive-role-${channelName}`
  }));
});