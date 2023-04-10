"use strict";
async function alertDialog(text, title, okButtonText = "OK") {
    const dialog = new Dialog(title, text);
    dialog.addElement(/*0*/new DialogButton(okButtonText, "positive", undefined, true));
    await dialog.prompt();
}
async function confirmDialog(text, title, okButtonText = "OK", cancelButtonText = "Cancel") {
    const dialog = new Dialog(title, text);
    dialog.addElement(
        /*0*/new DialogButton(okButtonText, "positive", undefined, true)
       ,/*1*/new DialogButton(cancelButtonText, "negative")
    );
    const answer = await dialog.prompt();
    if(answer==0) {
        return true;
    }
    return false;
}
async function promptDialog(text, defaultValue, title, placeholder, okButtonText = "OK", cancelButtonText = "Cancel") {
    const input = new DialogInput(placeholder, defaultValue);
    const dialog = new Dialog(title, text);
    dialog.addElement(
        /*0*/input
       ,/*1*/new DialogButton(okButtonText, "positive", undefined, true)
       ,/*2*/new DialogButton(cancelButtonText, "negative")
    );
    const answer = await dialog.prompt();
    if(answer==1) {
        return input.text;
    }
    return null;
}
