# Example S3 deployment via a GitHub Action, using the GitHub OIDC Identity Provider 

This projects defines the folloing via AWS CDK
 * An S3 Bucket to host the concentents of the `static` folder within this repository.
 * A cloudfront distribution to publish the the contents of the S3 bucket origin publicly

Additionally, this project defines a GitHub Action responsible for publishing the contents
of this repository's `static` folder to the origin S3 bucket, using AWS credentials aquired
using the `aws-actions/configure-aws-credentials@v1` GitHub Action configured to use the
GitHub Identity Provider in AWS IAM.

NOTE: This example does nothing you couldnt already do via GitHub Pages. The intention it to
illustrate the use of credentialess access to AWS resources via a GitHub action.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
