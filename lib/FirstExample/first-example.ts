import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as logs from "aws-cdk-lib/aws-logs";

/**
 * The first example of Step Functions
 */
export class FirstExample extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const LambdaFunc = new NodejsFunction(this, "function", {
      runtime: lambda.Runtime.NODEJS_22_X,
    });

    const lambdaInvoke = new tasks.LambdaInvoke(this, "InvokeLambda", {
      lambdaFunction: LambdaFunc,
      outputPath: "$.Payload",
    });

    const successState = new sfn.Pass(this, "Success State");
    const failureState = new sfn.Pass(this, "Failure State");

    const choice = new sfn.Choice(this, "Choice")
      .when(sfn.Condition.stringEquals("$.status", "SUCCESS"), successState)
      .otherwise(failureState);

    new sfn.StateMachine(this, "StateMachine", {
      definitionBody: sfn.DefinitionBody.fromChainable(
        lambdaInvoke.next(choice),
      ),
      timeout: cdk.Duration.minutes(5),
      logs: {
        destination: new logs.LogGroup(
          this,
          "FirstExampleStateMachineLogGroup",
        ),
        level: sfn.LogLevel.ALL,
      },
      tracingEnabled: true,
    });
  }
}
