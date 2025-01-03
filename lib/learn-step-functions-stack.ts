import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { FirstExample } from "./FirstExample/first-example";

/**
 * Step Functions examples
 */

export class LearnStepFunctionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new FirstExample(this, "FirstExample");
  }
}
