export default class Validator {
    /* the fields that are saved to the db are validated by mongoose schemas, 
    so we only need to validate the unhashed password (the schema 
    only validates the hashed password that is saved to the db) */
    static validatePassword(password: string, beginning = "Password ") {
        let warningText = "";
        if (password.length < 4) {
            warningText = beginning + "must not be shorter than 4 characters.";
        } else if (password.length > 20) {
            warningText = beginning + "must not be longer than 20 characters.";
        } else if (password.search(/\s/) >= 0) {
            warningText = beginning + "must not contain spaces.";
        }
        return warningText;
    }
}