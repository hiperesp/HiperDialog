class Dialog {
    promptPromise = {
        resolve: null,
        reject: null
    };
    dialog = null;
    _nextElementId = 0;
    constructor(title, text){
        this._createStructure();
        this.title = title;
        this.text = text;
    }
    addElement(...elements) {
        const dialogContent = this.dialog.querySelector(".dialog-content");
        for(let i=0; i<elements.length; i++) {
            let element;
            if(elements[i] instanceof DialogButton) {
                element = elements[i].getButton();
                element.addEventListener("click", this.handleButtonClick.bind(this));
            } else if(elements[i] instanceof DialogInput) {
                element = elements[i].getInput();
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
            if(title==null) {
                dialogTitle.remove();
            } else {
                dialogTitle.textContent = title;
            }
        } else {
            if(title!=null) {
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
            if(text==null) {
                dialogText.remove();
            } else {
                dialogText.textContent = text;
            }
        } else {
            if(text!=null) {
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

        this.dialog.addEventListener("blur", this.blurHandler.bind(this));
    }
    show() {
        document.querySelector("body").appendChild(this.dialog);
        this.dialog.dispatchEvent(new Event("blur"));
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
    blurHandler(event){
        this.focusFirstElement();
    }
    focusFirstElement(){
        const focusableElement = this.dialog.querySelector("input, button")||this.dialog;
        focusableElement.focus();
    }
}
class DialogButton {
    button = null;
    constructor(text, type = "normal", enabled = true){
        this._createButton();
        this.text = text;
        this.type = type;
        this.enabled = enabled;
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
            throw new Error("O tipo do botão deve ser um de"+types);
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
    add(dialog) {
        dialog.addElement(this);
        return this;
    }
    remove() {
        this.button.remove();
    }
    _createButton(){
        this.button = document.createElement("button");
    }
}

class DialogInput {
    input = null;
    constructor(placeholder = "", defaultValue = ""){
        this._createInput();
        this.placeholder = placeholder;
        this.text = defaultValue;
    }
    getInput() {
        return this.input;
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
    add(dialog) {
        dialog.addElement(this);
        return this;
    }
    remove() {
        this.input.remove();
    }
    _createInput(){
        this.input = document.createElement("input");
    }
}

