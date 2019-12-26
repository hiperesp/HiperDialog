async function alertDialog(text = "", title = null) {
    const dialog = new Dialog(title, text);
    dialog.addElement(/*0*/new DialogButton("OK", "positive"));
    await dialog.prompt();
}
async function confirmDialog(text = "", title = null) {
    const dialog = new Dialog(title, text);
    dialog.addElement(
        /*0*/new DialogButton("OK", "positive")
       ,/*1*/new DialogButton("Cancelar", "negative")
    );
    const answer = await dialog.prompt();
    if(answer==0) {
        return true;
    }
    return false;
}
async function promptDialog(text = "", defaultValue = "", title = null, placeholder = "") {
    const input = new DialogInput(placeholder, defaultValue);
    const dialog = new Dialog(title, text);
    dialog.addElement(
        /*0*/input
       ,/*1*/new DialogButton("OK", "positive")
       ,/*2*/new DialogButton("Cancelar", "negative")
    );
    const answer = await dialog.prompt();
    if(answer==1) {
        return input.text;
    }
    return null;
}
