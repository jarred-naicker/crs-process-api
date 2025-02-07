export default class Schema extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();
        const json = await fetch(import.meta.url.replace(".js", ".json")).then(result => result.json());

        this.target.innerHTML = await crs.call("schema", "parse", {
            id: "html",
            schema: json
        });

        await crsbinding.parsers.parseElements(this.target.children, this._dataId);
    }

    async greeting() {
        console.log("Hello World");
    }
}