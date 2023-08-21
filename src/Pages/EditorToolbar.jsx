// IMPORTING THE QUILL COMPONENT FROM THE 'REACT-QUILL' PACKAGE
import { Quill } from "react-quill";

// CUSTOM ICONS FOR UNDO AND REDO BUTTONS
const CustomUndo = () => (
  // SVG ICON FOR UNDO
  <svg viewBox="0 0 18 18">
    {/* POLYGON SHAPE FOR THE ICON */}
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    {/* PATH ELEMENT FOR THE ICON */}
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

const CustomRedo = () => (
  // SVG ICON FOR REDO
  <svg viewBox="0 0 18 18">
    {/* POLYGON SHAPE FOR THE ICON */}
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    {/* PATH ELEMENT FOR THE ICON */}
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);

// FUNCTION FOR UNDOING THE LAST CHANGE IN THE QUILL EDITOR
function undoChange() {
  this.quill.history.undo();
}

// FUNCTION FOR REDOING A CHANGE IN THE QUILL EDITOR
function redoChange() {
  this.quill.history.redo();
}

// IMPORTING AND REGISTERING QUILL FORMATS FOR SIZE AND FONT
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
];
Quill.register(Font, true);

// OBJECT DEFINING MODULES FOR THE QUILL EDITOR
export const modules = {
  toolbar: {
    // CONTAINER FOR THE TOOLBAR ELEMENTS
    container: "#toolbar",
    // HANDLERS FOR UNDO AND REDO BUTTONS
    handlers: {
      undo: undoChange,
      redo: redoChange,
    },
  },
  // HISTORY MODULE CONFIGURATION
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};

// ARRAY DEFINING FORMATS AVAILABLE FOR THE QUILL EDITOR
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
];

// QUILL TOOLBAR COMPONENT DEFINITION
export const QuillToolbar = () => (
  <div id="toolbar">
    {/* FONT SELECTION DROPDOWN */}
    <span className="ql-formats">
      <select className="ql-font" defaultValue="arial">
        <option value="arial">Arial</option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
      </select>
      {/* SIZE SELECTION DROPDOWN */}
      <select className="ql-size" defaultValue="medium">
        <option value="extra-small">Size 1</option>
        <option value="small">Size 2</option>
        <option value="medium">Size 3</option>
        <option value="large">Size 4</option>
      </select>
      {/* HEADER SELECTION DROPDOWN */}
      <select className="ql-header" defaultValue="3">
        <option value="1">Heading</option>
        <option value="2">Subheading</option>
        <option value="3">Normal</option>
      </select>
    </span>
    {/* FORMATTING BUTTONS */}
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
    </span>
    {/* LIST AND INDENTATION BUTTONS */}
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    {/* SCRIPT AND BLOCKQUOTE BUTTONS */}
    <span className="ql-formats">
      <button className="ql-script" value="super" />
      <button className="ql-script" value="sub" />
      <button className="ql-blockquote" />
      <button className="ql-direction" />
    </span>
    {/* ALIGNMENT AND COLOR BUTTONS */}
    <span className="ql-formats">
      <select className="ql-align" />
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    {/* LINK, IMAGE, AND VIDEO BUTTONS */}
    <span className="ql-formats">
      <button className="ql-link" />
      <button className="ql-image" />
      <button className="ql-video" />
    </span>
    {/* FORMULA, CODE BLOCK, AND CLEAN BUTTONS */}
    <span className="ql-formats">
      <button className="ql-formula" />
      <button className="ql-code-block" />
      <button className="ql-clean" />
    </span>
    {/* UNDO AND REDO BUTTONS */}
    <span className="ql-formats">
      <button className="ql-undo">
        <CustomUndo />
      </button>
      <button className="ql-redo">
        <CustomRedo />
      </button>
    </span>
  </div>
);

export default QuillToolbar;
