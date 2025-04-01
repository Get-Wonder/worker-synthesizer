var SCRIPT_TITLE = "RM - birthdaysong";
var phonetics = [];

function getClientInfo() {
    return {
        "name": SV.T(SCRIPT_TITLE),
        "author": "Zalotron",
        "versionNumber": 1,
        "minEditorVersion": 65537
    }
}

function main() {
    var noteGroup = SV.getMainEditor().getCurrentTrack().getGroupReference(0).getTarget();
    
    var notes = [];
    for (let i = 0; i < 8; i++) {
        notes[i] = noteGroup.getNote(i);
    }

    for (let i = 0; i < notes.length; i++) {
        notes[i].setPhonemes("");
    }

    for (let i = 0; i < phonetics.length; i++) {
        if (i < notes.length) {
            notes[i].setPhonemes(phonetics[i]);
        }
    }

    if (phonetics.length === 6 || phonetics.length === 8) {
        notes[1].setDuration(480);
    }

    return true;
}