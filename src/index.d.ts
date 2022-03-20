declare module "dom-inspector" {
  export type ElementInfo = {
    top: string;
    left: string;
    width: string;
    height: string;
    "padding-top": string;
    "padding-right": string;
    "padding-bottom": string;
    "padding-left": string;
    "border-top-width": string;
    "border-right-width": string;
    "border-bottom-width": string;
    "border-left-width": string;
    "margin-top": string;
    "margin-right": string;
    "margin-bottom": string;
    "margin-left": string;
  };

  export type Options = Partial<{
    /** Dom inspector root element. String or Dom, default body. */
    root: string | HTMLElement;
    /** Not inspect some elements. String or Dom Array. */
    exclude: Array<string | HTMLElement>;
    /** Inspector overlay style. You can custom overlay background color as follow. */
    theme: string;
    /** max z index, if blank, will auto get document.all max z index */
    maxZIndex: number;
  }>;

  export default class DomInspector {
    constructor(options?: Options);
    target: HTMLElement;
    /** Display overlay block and addEventListener mousemove. */
    enable(): void;
    /** RemoveEventListener mousemove, pause inspector. */
    pause(): void;
    /** RemoveEventListener mousemove, display overlay none. */
    disable(): void;
    /** disable() and remove overlay. */
    destroy(): void;
    /** Return ele XPath. */
    getXPath(element: HTMLElement): string;
    /** Return ele selector. */
    getSelector(element: HTMLElement): string;
    getElementInfo(element: HTMLElement): ElementInfo;
  }
}
