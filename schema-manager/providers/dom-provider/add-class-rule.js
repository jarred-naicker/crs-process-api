import {assertStep} from "../provider-utils.js";

export default async function addClassRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "value"]);
}