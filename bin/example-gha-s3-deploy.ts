#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ExampleGhaS3DeployStack } from '../lib/example-gha-s3-deploy-stack';

const app = new cdk.App();
new ExampleGhaS3DeployStack(app, 'ExampleGhaS3DeployStack', {
  // import the ARN from the GitHub AWS IAM Identity Provider's ARN exported from installing the stack
  // from: https://github.com/necrobious/cdk-github-oidc-stack/blob/main/bin/github-oidc-stack.ts
  gitHubOidcIdpArn: cdk.Fn.importValue("GitHubOidcProviderArn"), 
  gitHubOidcAudience: "sts.amazonaws.com",
  gitHubOrgOrUserName: "necrobious",
  gitHubRepositoryName: "cdk-example-gha-s3-deploy",
});
