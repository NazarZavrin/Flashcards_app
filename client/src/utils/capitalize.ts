export default function capitalize(str: string) {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
}