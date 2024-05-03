import {
  CloudWatchClient,
  PutMetricDataCommand
} from '@aws-sdk/client-cloudwatch'
import { parseUserId } from '../auth/utils.mjs'

export function getUserId(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function getTraceId(event) {
  return event.headers["X-Amzn-Trace-Id"]
}

export function getTime() {
  return new Date().getTime()
}

const cloudwatch = new CloudWatchClient()

export async function putTimeTakenMetric(actionName, timeTakenInMs) {
  const command = new PutMetricDataCommand({
    MetricData: [
      {
        MetricName: 'TimeTaken',
        Dimensions: [
          {
            Name: 'ActionName',
            Value: actionName
          }
        ],
        Unit: 'Milliseconds',
        Value: timeTakenInMs
      }
    ],
    Namespace: 'Udacity/Serverless'
  })
  await cloudwatch.send(command)
}