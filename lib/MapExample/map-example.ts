import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as logs from "aws-cdk-lib/aws-logs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { NagSuppressions } from "cdk-nag";

/**
 * The first example of Step Functions
 */
export class MapExample extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const lambdaFunc = new NodejsFunction(this, "function", {
      runtime: lambda.Runtime.NODEJS_22_X,
    });

    const lambdaInvoke = new tasks.LambdaInvoke(this, "InvokeLambda", {
      lambdaFunction: lambdaFunc,
      outputPath: "$.Payload",
    });

    const distLambdaInvoke = new tasks.LambdaInvoke(this, "DistInvokeLambda", {
      lambdaFunction: lambdaFunc,
      outputPath: "$.Payload",
    });

    const LambdaWriteToS3 = new tasks.LambdaInvoke(this, "LambdaWriteToS3", {
      lambdaFunction: lambdaFunc,
      outputPath: "$.Payload",
    });

    const mapState = new sfn.Map(this, "MapState", {
      itemsPath: sfn.JsonPath.stringAt("$.items"),
      resultPath: sfn.JsonPath.DISCARD,
    });

    mapState.itemProcessor(lambdaInvoke);

    const distMapState = new sfn.DistributedMap(this, "DistMapState", {
      itemsPath: sfn.JsonPath.stringAt("$.items"),
      resultPath: sfn.JsonPath.DISCARD,
    });

    distMapState.itemProcessor(distLambdaInvoke);

    const bucket = new s3.Bucket(this, "Bucket", {
      enforceSSL: true,
    });

    NagSuppressions.addResourceSuppressions(bucket, [
      {
        id: "AwsSolutions-S1",
        reason: "This bucket is used for demonstration purposes only",
      },
    ]);

    const writeToS3State = new sfn.DistributedMap(this, "WriteToS3State", {
      itemsPath: sfn.JsonPath.stringAt("$.items"),
      resultSelector: {
        status_abc: "$.status",
      },
      resultWriter: new sfn.ResultWriter({
        bucket,
        prefix: "output/",
      }),
    });

    writeToS3State.itemProcessor(LambdaWriteToS3);

    const logGroup = new logs.LogGroup(this, "MapExampleLogGroup");

    new sfn.StateMachine(this, "StateMachine", {
      definitionBody: sfn.DefinitionBody.fromChainable(mapState),
      timeout: cdk.Duration.minutes(5),
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
      },
      tracingEnabled: true,
    });

    new sfn.StateMachine(this, "DistStateMachine", {
      definitionBody: sfn.DefinitionBody.fromChainable(distMapState),
      timeout: cdk.Duration.minutes(5),
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
      },
      tracingEnabled: true,
    });

    new sfn.StateMachine(this, "WriteToS3StateMachine", {
      definitionBody: sfn.DefinitionBody.fromChainable(writeToS3State),
      timeout: cdk.Duration.minutes(5),
      logs: {
        destination: logGroup,
        level: sfn.LogLevel.ALL,
      },
      tracingEnabled: true,
    });
  }
}
