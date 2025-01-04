#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { LearnStepFunctionsStack } from "../lib/learn-step-functions-stack";
import { AwsSolutionsChecks, NagSuppressions } from "cdk-nag";
import { Aspects } from "aws-cdk-lib";

const app = new cdk.App();
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
const stack = new LearnStepFunctionsStack(app, "LearnStepFunctionsStack", {});
NagSuppressions.addStackSuppressions(stack, [
  { id: "AwsSolutions-IAM4", reason: "Ignore warnings of IAM policies" },
  { id: "AwsSolutions-IAM5", reason: "Ignore warnings of IAM policies" },
]);
