import * as test from "tape"
import { DynamoDb, SES, SNS } from "./aws"
import * as _ from "ramda"
import { Signals } from "./signals"
import * as sinon from "sinon"

const SIGNALS_URL = "http://tb-staging-signals.elasticbeanstalk.com"
const SIGNALS_APIKEY = "secret"


test("Signals:", (ot) => {
  ot.plan(3)

  const timestamp = new Date().getTime()

  ot.test("- should be able to get all closed signals", (t) => {
    t.plan(2)

    Signals.getClosedSignals(SIGNALS_URL, SIGNALS_APIKEY, "test-grid", "e0c6fc18-9e08-43f9-9f68-10bd87d552d7")
      .then(signals => {
        t.equal(signals.length > 0, true, "some signals should be returned")
        t.equal(signals[0].signal, 0, "last signal should be CLOSE") // newest signal is first
      })
  })

  ot.test("- should NOT be able to get signals with wrong secret", (t) => {
    t.plan(1)

    Signals.getClosedSignals(SIGNALS_URL, "wrong", "test-grid", "e0c6fc18-9e08-43f9-9f68-10bd87d552d7")
      .catch((e: Error) => {
        t.equals(e.message.indexOf("not authorized") > -1, true, "shpuld fail, with authentification error")
      })

  })

  ot.test("- should return empety array when not found", (t) => {
    t.plan(1)

    Signals.getClosedSignals(SIGNALS_URL, SIGNALS_APIKEY, "test-grid", "e0c6fc18-9e08-9-9f68-10bd87d552d7")
      .then(signals => {
        t.equal(signals.length, 0, "empety ")
      })

  })
})