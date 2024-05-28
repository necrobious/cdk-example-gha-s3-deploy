import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

// waiting for https://github.com/aws/aws-cdk/issues/21771#issuecomment-2125690147
//import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
//import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export interface ExampleGhaS3DeployStackProps extends cdk.StackProps {
  gitHubOidcIdpArn: string,
  gitHubOidcAudience: string,
  gitHubOrgOrUserName: string,
  gitHubRepositoryName: string,
}

export class ExampleGhaS3DeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ExampleGhaS3DeployStackProps) {
    super(scope, id, props);

    const gitHubOidcIdp = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
      this,
      "ExampleGhaS3DeployGitHubIdp",
      props.gitHubOidcIdpArn
    );

    const gitHubOidcPrincipal = new iam.OpenIdConnectPrincipal(
      gitHubOidcIdp,
      {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": props.gitHubOidcAudience,
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": `repo:${props.gitHubOrgOrUserName}/${props.gitHubRepositoryName}:*`, 
        },
      }
    );

    const role = new iam.Role(this, "ExampleGhaS3DeployRole", {
      assumedBy: gitHubOidcPrincipal,
    });

    //--- The role should now be usable with other CDK constructs like S3

    const exampleBucket = new s3.Bucket(this, 'ExampleGhaS3DeployBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    exampleBucket.grantReadWrite(role);

    // waiting for https://github.com/aws/aws-cdk/issues/21771#issuecomment-2125690147
    //new cloudfront.Distribution(this, 'ExampleGhaS3DeployDistribution', {
    //  defaultBehavior: { origin: new origins.S3Origin(myBucket) },
    //});

    new cdk.CfnOutput(this, "ExampleGhaS3DeployBucketName", {
      value: exampleBucket.bucketName,
      exportName: "ExampleGhaS3DeployBucketName",
    });
  }
}
