"use strict";
class Dialog {
    promptPromise = {
        resolve: null,
        reject: null
    };
    dialog = null;
    elements = [];
    _nextElementId = 0;
    constructor(title, text){
        this._createStructure();
        this.title = title;
        this.text = text;
    }
    addElement(...elements) {
        const dialogContent = this.dialog.querySelector(".dialog-content");
        this.elements.push(...elements);
        for(let i=0; i<elements.length; i++) {
            let element = elements[i].getElement();
            if(elements[i] instanceof DialogButton) {
                if(!elements[i].doNotAddEventListener) {
                    element.addEventListener("click", this.handleButtonClick.bind(this));
                }
            } else if(elements[i] instanceof DialogInput) {
                //
            } else if(elements[i] instanceof DialogTextarea) {
                //
            } else {
                throw new Error("O tipo de elemento \""+elements[i].constructor.name+"\" não foi definido.");
            }
            element.dataset.dialogElementId = this._nextElementId++;
            dialogContent.appendChild(element);
        }
        return this;
    }
    handleButtonClick(event) {
        this.remove();
        if(this.promptPromise.resolve) {
            this.promptPromise.resolve(parseInt(event.target.dataset.dialogElementId));
        }
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setText(text) {
        this.text = text;
        return this;
    }
    set title(title) {
        const dialogContent = this.dialog.querySelector(".dialog-content");
        let dialogTitle = dialogContent.querySelector(".dialog-title");
        if(dialogTitle) {
            if(title) {
                dialogTitle.textContent = title;
            } else {
                dialogTitle.remove();
            }
        } else {
            if(title) {
                dialogTitle = document.createElement("div");
                dialogTitle.classList.add("dialog-title");
                if(dialogContent.firstChild) {
                    dialogContent.insertBefore(dialogTitle, dialogContent.firstChild);
                } else {
                    dialogContent.appendChild(dialogTitle);
                }
                dialogTitle.textContent = title;
            }
        }
    }
    get title(){
        const dialogContent = this.dialog.querySelector(".dialog-content");
        let dialogTitle = dialogContent.querySelector(".dialog-title");
        if(dialogTitle) {
            return dialogTitle.textContent;
        }
        return null;
    }
    set text(text) {
        const dialogContent = this.dialog.querySelector(".dialog-content");
        let dialogText = dialogContent.querySelector(".dialog-text");
        if(dialogText) {
            if(text) {
                dialogText.textContent = text;
            } else {
                dialogText.remove();
            }
        } else {
            if(text) {
                dialogText = document.createElement("div");
                dialogText.classList.add("dialog-text");
                if(dialogContent.querySelector("button")) {
                    dialogContent.insertBefore(dialogText, dialogContent.querySelector("button"));
                } else {
                    dialogContent.appendChild(dialogText);
                }
                dialogText.textContent = text;
            }
        }
    }
    get text(){
        const dialogContent = this.dialog.querySelector(".dialog-content");
        let dialogText = dialogContent.querySelector(".dialog-text");
        if(dialogText) {
            return dialogText.textContent;
        }
        return null;
    }
    _createStructure(){
        this.dialog = document.createElement("div");
        this.dialog.classList.add("dialog");
        this.dialog.tabIndex = 1;
    
        const dialogContainer = document.createElement("div");
        dialogContainer.classList.add("dialog-container");
    
        const dialogContent = document.createElement("div");
        dialogContent.classList.add("dialog-content");
        
        dialogContainer.appendChild(dialogContent);
        this.dialog.appendChild(dialogContainer);

        this.dialog.addEventListener("blur", this.handleBlur.bind(this));
    }
    show() {
        document.querySelector("body").appendChild(this.dialog);
        this.dialog.dispatchEvent(new Event("blur"));
        for(let i=0; i<this.elements.length; i++) {
            this.elements[i].onRender();
        }
    }
    remove() {
        this.dialog.style.opacity = "0";
        this.dialog.style.pointerEvents = "none";
        setTimeout(() => {
            this.dialog.remove();
            this.dialog.style.opacity = "";
            this.dialog.style.pointerEvents = "";
        }, 125);
    }
    prompt(){
        this.show();
        return new Promise((resolve, reject) => {
            this.promptPromise.resolve = resolve;
            this.promptPromise.reject = reject;
        });
    }
    handleBlur(event){
        this.focusFirstElement();
    }
    focusFirstElement(){
        const focusableElement = this.dialog.querySelector("input:not(:disabled), button:not(:disabled), textarea:not(:disabled)")||this.dialog;
        focusableElement.focus({preventScroll: true});
        focusableElement.focus();
    }
}
class DialogElement {
    doNotAddEventListener = false;
    add(dialog) {
        dialog.addElement(this);
        return this;
    }
    getElement(){
        return;
    }
    onRender(){
        return;
    }
}
class DialogButton extends DialogElement {
    button = null;
    constructor(text, type = "normal", enabled = true, bold = false){
        super();
        this._createButton();
        this.text = text;
        this.type = type;
        this.enabled = enabled;
        this.bold = bold;
    }
    getButton() {
        return this.button;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    set type(type) {
        const types = ["normal", "positive", "negative"];
        if(types.indexOf(type)==-1) {
            throw new Error("O tipo do botão deve ser um entre ["+types+"]");
        }
        for(let i=0; i<types.length; i++) {
            this.button.classList.remove("dialog-"+types[i]);
        }
        this.button.classList.add("dialog-"+type);
    }
    get type() {
        const types = ["normal", "positive", "negative"];
        for(let i=0; i<types.length; i++) {
            if(this.buttons.classList.contains("dialog-"+types[i])) {
                return types[i];
            }
        }
        return null;
    }
    setEnabled(enabled) {
        this.enabled = enabled;
        return this;
    }
    set enabled(enabled) {
        this.button.disabled = !enabled;
    }
    get enabled(){
        return !this.button.disabled;
    }
    setBold(bold) {
        this.bold = bold;
        return this;
    }
    set bold(bold) {
        const className = "bold";
        if(bold) {
            this.button.classList.add("dialog-"+className);
        } else {
            this.button.classList.remove("dialog-"+className);
        }
    }
    get bold(){
        const className = "bold";
        return this.button.classList.contains("dialog-"+className);
    }
    setText(text) {
        this.text = text;
        return this;
    }
    set text(text) {
        this.button.textContent = text;
    }
    get text(){
        return this.button.textContent;
    }
    remove() {
        this.button.remove();
    }
    _createButton(){
        this.button = document.createElement("button");
    }
    //@Override
    getElement(){
        return this.getButton();
    }
}

class DialogInput extends DialogElement {
    input = null;
    constructor(placeholder = "", defaultValue = "", type = "text", enabled = true){
        super();
        this._createInput();
        this.type = type;
        this.text = defaultValue;
        this.placeholder = placeholder;
        this.enabled = enabled;
    }
    getInput() {
        return this.input;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    set type(type) {
        this.input.type = type;
    }
    get type() {
        return this.input.type;
    }
    setText(text) {
        this.text = text;
        return this;
    }
    set text(text) {
        this.input.value = text;
    }
    get text() {
        return this.input.value;
    }
    set value(value){
        this.text = value
    }
    get value(){
        return this.text;
    }
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }
    set placeholder(placeholder) {
        this.input.placeholder = placeholder;
    }
    get placeholder() {
        return this.input.placeholder;
    }
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    set enabled(enabled) {
        this.input.disabled = !enabled;
    }
    get enabled() {
        return !this.input.disabled;
    }
    remove() {
        this.input.remove();
    }
    _createInput(){
        this.input = document.createElement("input");
    }
    //@Override
    getElement(){
        return this.getInput();
    }
}
class DialogTextarea extends DialogElement {
    textarea = null;
    constructor(placeholder = "", defaultValue = "", enabled = true){
        super();
        this._createTextarea();
        this.placeholder = placeholder;
        this.enabled = enabled;
        this.text = defaultValue;
    }
    getTextarea() {
        return this.textarea;
    }
    setText(text) {
        this.text = text;
        return this;
    }
    set text(text) {
        this.textarea.value = text;
    }
    get text() {
        return this.textarea.value;
    }
    set value(value){
        this.text = value
    }
    get value(){
        return this.text;
    }
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }
    set placeholder(placeholder) {
        this.textarea.placeholder = placeholder;
    }
    get placeholder() {
        return this.textarea.placeholder;
    }
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    set enabled(enabled) {
        this.textarea.disabled = !enabled;
    }
    get enabled() {
        return !this.textarea.disabled;
    }
    remove() {
        this.textarea.remove();
    }
    _createTextarea(){
        this.textarea = document.createElement("textarea");
        this.textarea.addEventListener("input", this.handleInput.bind(this));
        this.handleInput();
    }
    handleInput(event) {
        this.textarea.style.height = "auto";
        this.textarea.style.height = "calc("+this.textarea.scrollHeight+"px - 2em)";
    }
    //@Override
    getElement(){
        return this.getTextarea();
    }
    //@Override
    onRender(){
        this.handleInput();
    }
}
