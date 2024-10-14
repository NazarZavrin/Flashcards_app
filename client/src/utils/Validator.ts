export default class Validator {
    static validateName(name: string, beginning = "Name ") {
        let warningText = "";
        if (name.length < 3) {
            warningText = beginning + "must not be shorter than 3 characters.";
        } else if (name.length > 50) {
            warningText = beginning + "must not be longer than 50 characters.";
        }
        return warningText;
    }
    private static readonly emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$/;
    static validateEmail(email: string, beginning = "Email ") {
        let warningText = "";
        if (email.length < 5) {
            warningText = beginning + "must not be shorter than 5 characters.";
        } else if (email.length > 50) {
            warningText = beginning + "must not be longer than 50 characters.";
        } else if (!email.match(this.emailRegex)) {
            warningText = `Incorrect ${beginning.toLocaleLowerCase().trim()} format.`;
        }
        return warningText;
    }
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