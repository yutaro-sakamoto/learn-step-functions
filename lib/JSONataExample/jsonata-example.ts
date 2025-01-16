import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as sfn from "aws-cdk-lib/aws-stepfunctions";
//import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
//import * as lambda from "aws-cdk-lib/aws-lambda";
//import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";
import * as logs from "aws-cdk-lib/aws-logs";

/**
 * JSONata example of Step Functions
 */
export class JSONataExample extends Construct {
  /*
  An example of input data
{
  "orders": [
    {
      "productName": "商品A",
      "price": 1000
    },
    {
      "productName": "商品B",
      "price": 2000
    }
  ]
}
  */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const transformState = new sfn.CustomState(this, "TransformData", {
      stateJson: {
        Type: "Pass",
        QueryLanguage: "JSONata",
        Output: {
          totalAmount: "{% $sum($states.input.orders.price) %}",
          productNames: "{% $states.input.orders.productName %}",
          mostExpensiveItem:
            "{% $states.input.orders[price = $max($states.input.orders.price)] %}",
        },
      },
    });

    new sfn.StateMachine(this, "StateMachine", {
      definition: transformState,
      timeout: cdk.Duration.minutes(5),
      logs: {
        destination: new logs.LogGroup(
          this,
          "JSONataExampleStateMachineLogGroup",
        ),
        level: sfn.LogLevel.ALL,
      },
      tracingEnabled: true,
    });
  }
}
