import {BindingActions} from "./binding-actions.js";

export class ColorsActions {
    static async perform(step, context, process, item) {
        await this[step.action]?.(step, context, process, item);
    }

    /**
     * Convert a hex string "#ff00ff" to a rgb object {r: 255, g: 0, b: 255}
     */
    static async hex_to_rgb(step, context, process, item) {
        const hex = await crs.process.getValue(step.args.hex, context, process, item);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Convert a four value hex string "#ff00ffff" that includes alpha to rgba {r: 255, g: 0, b: 255, a: 255}
     */
    static async hex_to_rgba(step, context, process, item) {
        const hex = await crs.process.getValue(step.args.hex, context, process, item);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            a: parseInt(result[4], 16)
        } : null;
    }

    /**
     * Convert hex string to an rgb object where the rgb values range between 0 and 1
     */
    static async hex_to_normalised(step, context, process, item) {
        const result = await this.hex_to_rgba(step, context, process, item);
        result.r = await crs.call("math", "normalize", { value: result.r, min: 0, max: 255 });
        result.g = await crs.call("math", "normalize", { value: result.g, min: 0, max: 255 });
        result.b = await crs.call("math", "normalize", { value: result.b, min: 0, max: 255 });
        result.a = await crs.call("math", "normalize", { value: result.a, min: 0, max: 255 });
        return result;
    }

    /**
     * Taken r, g, and b values convert it to a hex string.
     */
    static async rgb_to_hex(step, context, process, item) {
        const r = (await crs.process.getValue(step.args.r, context, process, item)) || 0;
        const g = (await crs.process.getValue(step.args.g, context, process, item)) || 0;
        const b = (await crs.process.getValue(step.args.b, context, process, item)) || 0;

        return ["#", decimalToHex(r), decimalToHex(g), decimalToHex(b)].join("");
    }

    /**
     * Taken r, g, b, a values convert it to a hex string
     */
    static async rgba_to_hex(step, context, process, item) {
        const r = (await crs.process.getValue(step.args.r, context, process, item)) || 0;
        const g = (await crs.process.getValue(step.args.g, context, process, item)) || 0;
        const b = (await crs.process.getValue(step.args.b, context, process, item)) || 0;
        const a = (await crs.process.getValue(step.args.a, context, process, item)) || 255;

        return ["#", decimalToHex(r), decimalToHex(g), decimalToHex(b), decimalToHex(a)].join("");
    }

    /**
     * Convert a rgb text "rgb(255, 255, 2555)" to a hex string
     */
    static async rgb_text_to_hex(step, context, process, item) {
        let value = await crs.process.getValue(step.args.value, context, process, item);
        value = value.replace("rgba(", "");
        value = value.replace("rgb(", "");
        value = value.replace(")", "");
        const parts = value.split(",");

        return await this.rgb_to_hex({
            args: {
                r: Number(parts[0].trim()),
                g: Number(parts[1].trim()),
                b: Number(parts[2].trim())
            }
        }, context, process, item);
    }

    /**
     * Get css variables and convert them to a hex string
     */
    static async css_to_hex(step, context, process, item) {
        const results = await processVariables(step, context, process, item, async (value) => {
            if (value.indexOf("#") != -1) {
                if (value.length == 7) {
                    return `${value}ff`;
                }
                return value;
            }
            else {
                value = value.replace("rgba(", "");
                value = value.replace("rgb(", "");
                value = value.replace(")", "");
                const parts = value.split(",");

                return await this.rgba_to_hex({
                    args: {
                        r: Number(parts[0].trim()),
                        g: Number(parts[1].trim()),
                        b: Number(parts[2].trim()),
                        a: parts.length == 3 ? 255 : Number(parts[3].trim())
                    }
                }, context, process, item);
            }
        });
        return results;
    }

    /**
     * Get a css variable and covert it to a normalized rgb
     */
    static async css_to_normalized(step, context, process, item) {
        const results = await this.css_to_hex(step, context, process, item);
        const keys = Object.keys(results);

        for (const key of keys) {
            const value = results[key];
            results[key] = await this.hex_to_normalised({args: {hex: value}}, context, process, item).catch(e => console.error(error));
        }

        return results;
    }
}

async function processVariables(step, context, process, item, callback) {
    const element = await crs.dom.get_element(step.args.element);
    const variables = await crs.process.getValue(step.args.variables, context, process, item);
    const style = getComputedStyle(element);
    const result = {};

    for (let variable of variables) {
        const cssValue = style.getPropertyValue(variable).trim()
        const value = await callback(cssValue).catch(e => console.error(e));
        result[variable] = value;
    }
    return result;
}

function decimalToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

crs.intent.colors = ColorsActions;