import { beforeAll, describe, it, beforeEach } from "https://deno.land/std@0.157.0/testing/bdd.ts";
import {ElementMock} from "../mockups/element-mock.js";
import { assertEquals, assertNotEquals, assert } from "https://deno.land/std@0.147.0/testing/asserts.ts";
import {init} from "./../mockups/init.js";

await init();

beforeAll(async () => {
    await import("./../../src/action-systems/fixed-layout-actions.js");
})

describe("fixed layout tests", () => {
    let target;
    let element;

    beforeEach(async () => {
        target = document.createElement("div");
        target.bounds = { x: 100, left: 100, y: 100, top: 100, width: 100, right: 100, height: 100, bottom: 100 };

        element = document.createElement("div");
        element.bounds = { x: 0, left: 0, y: 0, top: 0, width: 50, right: 50, height: 50, bottom: 50 };
    })

    it("top - left", async () => {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "top",
            anchor: "left",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "100px 40px")
    })

    it("top - right", async () => {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "top",
            anchor: "right",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "50px 40px")
    })

    it("bottom - left", async () => {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "bottom",
            anchor: "left",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "100px 210px");
    })

    it("bottom - right", async () => {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "bottom",
            anchor: "right",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "50px 210px");
    })

    it ("left - top", async () => {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "left",
            anchor: "top",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "40px 100px");
    })

    it ("left - bottom", async () => {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "left",
            anchor: "bottom",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "40px 50px");
    })

    it ("right - top", async () => {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "right",
            anchor: "top",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "210px 100px");
    })

    it ("left - bottom", async () => {
        await crs.call("fixed_layout", "set", {
            element: element,
            target: target,
            at: "right",
            anchor: "bottom",
            margin: 10
        });

        assertEquals(element.style.position, "fixed");
        assertEquals(element.style.translate, "210px 50px");
    })
})