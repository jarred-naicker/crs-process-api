import {assertStep} from "../provider-utils.js";

export default async function getTextRule(schema, process, step) {
    return await assertStep(schema, process, step, ["element", "target"]);
}