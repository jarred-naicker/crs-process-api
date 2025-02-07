import {getDraggable} from "./dragdrop-manager/drag-utils.js";

export class ResizeElementManager {
    #element;
    #region;
    #resizeQuery;
    #options;
    #mouseDownHandler;
    #mouseMoveHandler;
    #mouseUpHandler;
    #targetElement;
    #bounds;
    #startPos;

    constructor(element, resizeQuery, options) {
        this.#element = element;
        this.#region = element.getBoundingClientRect();
        this.#resizeQuery = resizeQuery;
        this.#options = options;

        this.#mouseDownHandler = this.#mouseDown.bind(this);
        this.#mouseMoveHandler = this.#mouseMove.bind(this);
        this.#mouseUpHandler = this.#mouseUp.bind(this);

        this.#element.addEventListener("mousedown", this.#mouseDownHandler);
        element.__resizeManager = this;
    }

    dispose() {
        this.#element.removeEventListener("mousedown", this.#mouseDownHandler);
        this.#mouseDownHandler = null;
        this.#mouseMoveHandler = null;
        this.#mouseUpHandler = null;

        delete this.#element.__resizeManager;
        this.#element = null;
        this.#resizeQuery = null;
        this.#options = null;
        this.#region = null;
    }

    #mouseDown(event) {
        const draggable = getDraggable(event, {dragQuery: this.#resizeQuery});
        if (draggable == null) return;

        this.#targetElement = draggable.parentElement;
        this.#bounds = this.#targetElement.getBoundingClientRect();
        this.#startPos = {x: event.clientX, y: event.clientY};

        this.#options.min = this.#options.min || {};
        this.#options.min.width = this.#options.min.width || this.#bounds.width;
        this.#options.min.height = this.#options.min.height || this.#bounds.height;

        this.#options.max = this.#options.max || {};
        this.#options.max.width = this.#options.max.width || Number.MAX_VALUE;
        this.#options.max.height = this.#options.max.height || Number.MAX_VALUE;

        document.addEventListener("mousemove", this.#mouseMoveHandler);
        document.addEventListener("mouseup", this.#mouseUpHandler);
    }

    #mouseMove(event) {
        let offsetX = event.clientX - this.#startPos.x;
        let offsetY = event.clientY - this.#startPos.y;

        if (this.#options.lock_axis == "x") {
            offsetY = 0;
        }

        if (this.#options.lock_axis == "y") {
            offsetX = 0;
        }

        let width = this.#bounds.width + offsetX - this.#bounds.x - 4;
        let height = this.#bounds.height + offsetY - this.#bounds.y - 4;

        width = width < this.#options.min.width ? this.#options.min.width : width > this.#options.max.width ? this.#options.max.width : width;
        height = height < this.#options.min.height ? this.#options.min.height : height > this.#options.max.height ? this.#options.max.height : height;

        this.#targetElement.style.width = `${width}px`;
        this.#targetElement.style.height = `${height}px`;
    }

    #mouseUp(event) {
        document.removeEventListener("mousemove", this.#mouseMoveHandler);
        document.removeEventListener("mouseup", this.#mouseUpHandler);

        this.#targetElement = null;
        this.#bounds = null;
        this.#startPos = null;
    }
}
