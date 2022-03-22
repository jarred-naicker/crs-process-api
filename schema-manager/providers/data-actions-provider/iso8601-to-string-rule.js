import {assertStep} from "../provider-utils.js";

export default async function iso8601ToStringRule(schema, process, step) {
    return await assertStep(schema, process, step, ["value", "target"]);
}