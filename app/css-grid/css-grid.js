import "./../../src/action-systems/css-grid-actions.js";

export default class CssGrid extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        requestAnimationFrame(async () => {
            this.element = document.querySelector("#grid");
            // crs.call("cssgrid", "init",         {element: this.element});
            // crs.call("cssgrid", "set_columns",  {element: this.element, columns: "1fr 1fr 1fr"});
            // crs.call("cssgrid", "set_rows",     {element: this.element, rows: "1fr 1fr 1fr"});

            await crs.call("cssgrid", "auto_fill", {
                element : this.element,
                columns: "2fr 2fr 2fr",
                rows: "1fr 1fr"
            })

            await crs.call("cssgrid", "enable_resize", {
                element: this.element,
                options: {
                    // columns: [0]
                }
            })
        })
    }

    async disconnectedCallback() {
        this.element = null;
        super.disconnectedCallback();
    }

    async addColumn() {
        await crs.call("cssgrid", "add_columns", {element: this.element, position: "end", width: ["10px", "11px", "12px"]});
        await crs.call("cssgrid", "add_columns", {element: this.element, position: "front", width: "20px"});
        await crs.call("cssgrid", "add_columns", {element: this.element, position: 1, width: "30px"})

        console.log(this.element.style.gridTemplateColumns);
    }

    async removeColumn() {
        await crs.call("cssgrid", "remove_columns", {element: this.element, position: 1, count: 1})
        await crs.call("cssgrid", "remove_columns", {element: this.element, position: "end", count: 3});
        await crs.call("cssgrid", "remove_columns", {element: this.element, position: "front", count: 1});
    }

    async setWidth() {
        await crs.call("cssgrid", "set_column_width", {element: this.element, position: 1, width: "10px"});
    }

    async addRow() {
        await crs.call("cssgrid", "add_rows", {element: this.element, position: "end", height: "10px"});
        await crs.call("cssgrid", "add_rows", {element: this.element, position: "front", height: "20px"});
        await crs.call("cssgrid", "add_rows", {element: this.element, position: 1, height: "30px"})
    }

    async removeRow() {
        await crs.call("cssgrid", "remove_rows", {element: this.element, position: 1})
        await crs.call("cssgrid", "remove_rows", {element: this.element, position: "end"});
        await crs.call("cssgrid", "remove_rows", {element: this.element, position: "front"});
    }

    async setHeight() {
        await crs.call("cssgrid", "set_row_height", {element: this.element, position: 1, height: "10px"});
    }

    async setRegion() {
        const areas = [
            { start: {col: 0, row: 0}, end: {col: 1, row: 1}, name: "area1" },
            { start: {col: 2, row: 0}, end: {col: 2, row: 1}, name: "area2" },
            { start: {col: 0, row: 2}, end: {col: 2, row: 2}, name: "area3" }
        ]

        await crs.call("cssgrid", "set_regions", {
            element: this.element,
            areas: areas,
            auto_fill: true,
            tag_name: "my-component"
        });
    }

    async clearRegion() {
        await crs.call("cssgrid", "clear_region", { element: this.element, area: "area1" })
    }
}