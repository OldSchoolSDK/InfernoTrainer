export class BrowserUtils {
  static getQueryVar(varName: string): string {
    // Grab and unescape the query string - appending an '&' keeps the RegExp simple
    // for the sake of this example.
    const queryStr = unescape(window.location.search) + "&";

    // Dynamic replacement RegExp
    const regex = new RegExp(".*?[&\\?]" + varName + "=(.*?)&.*");

    // Apply RegExp to the query string
    const val = queryStr.replace(regex, "$1");

    // If the string is the same, we didn't find a match - return false
    return val === queryStr ? "" : val;
  }
}
