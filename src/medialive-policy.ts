export default {
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams",
        "logs:DescribeLogGroups"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "mediaconnect:ManagedDescribeFlow",
        "mediaconnect:ManagedAddOutput",
        "mediaconnect:ManagedRemoveOutput"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:describeSubnets",
        "ec2:describeNetworkInterfaces",
        "ec2:createNetworkInterface",
        "ec2:createNetworkInterfacePermission",
        "ec2:deleteNetworkInterface",
        "ec2:deleteNetworkInterfacePermission",
        "ec2:describeSecurityGroups"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["mediapackage:DescribeChannel"],
      "Resource": "*"
    }]
  }