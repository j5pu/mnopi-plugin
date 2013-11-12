/**
 * Tools.js
 * Date: 11/12/13
 * Support functions for plugin
 */


/**
 * Filters unnecessary tags in the html code
 * @param htmlCode
 * @param tag - Tag to remove from html code
 * @returns {String} Filtered html code
 */
function filterHTML(htmlCode, tag) {

    var re = new RegExp("<" + tag + "[\\s\\S]*?<\\/" + tag + ">", "gi")
    return htmlCode.replace(re, "")

}

/**
 * TODO: ver qué hace esto
 * @param href
 * @returns {Array}
 */
function getUrlVars(href) //para bing
{
    var vars = [], hash;
    var hashes = href.slice(href.indexOf('?') + 1).split('&'); //toma todo lo que hay entre ? y # y lo va troceando
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}