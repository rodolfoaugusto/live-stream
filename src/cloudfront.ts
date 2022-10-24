import { Construct } from '@aws-cdk/core';
import { CfnDistribution } from '@aws-cdk/aws-cloudfront'

export interface CloudFrontProperties {
  readonly domainOrigin: string
}

export class CloudFront {
  constructor(scope: Construct, id: string, props: CloudFrontProperties) {
    const { 
        domainOrigin
    } = props

    const domainURL = this.getEndpoint(domainOrigin)

    new CfnDistribution(scope, `${id}-CloudFront-Distribution`, {
        distributionConfig: {
            origins: [
                {
                    connectionAttempts: 3,
                    connectionTimeout: 10,
                    customOriginConfig: {
                        httpPort: 80,
                        httpsPort: 443,
                        originKeepaliveTimeout: 5,
                        originProtocolPolicy: 'https-only',
                        originReadTimeout: 30,
                        originSslProtocols: [
                            'SSLv3',
                            'TLSv1'
                        ]
                    },
                    domainName: domainURL,
                    id: 'mediapackage'
                }
            ],
            originGroups: {
                quantity: 0
            },
            defaultCacheBehavior: {
                allowedMethods: [
                    'HEAD',
                    'GET',
                    'OPTIONS'
                ],
                cachedMethods: [
                    'HEAD',
                    'GET',
                    'OPTIONS'
                ],
                compress: false,
                defaultTtl: 86400,
                forwardedValues: {
                    cookies: {
                        forward: 'none'
                    },
                    headers: [
                        'Origin',
                        'Access-Control-Request-Method',
                        'Access-Control-Allow-Origin',
                        'Access-Control-Request-Header'
                    ],
                    queryString: true
                },
                maxTtl: 31536000,
                minTtl: 0,
                smoothStreaming: false,
                targetOriginId: 'mediapackage',
                viewerProtocolPolicy: 'allow-all'
            },
            comment: 'Live streaming MediaPackage',
            priceClass: 'PriceClass_100', // Europe and NA
            enabled: true,
            viewerCertificate: {
                cloudFrontDefaultCertificate: true,
                minimumProtocolVersion: 'TLSv1'
            },
            restrictions: {
                geoRestriction: {
                    restrictionType: 'none'
                }
            },
            httpVersion: 'http1.1',
            defaultRootObject: '',
            ipv6Enabled: true
        }
    });
  }

  public getEndpoint = (url: string): string => {
    let currentURL
    try {
        currentURL = new URL(url)
        return currentURL.hostname
    } catch (_) {
        return ''
    }
  }
}
