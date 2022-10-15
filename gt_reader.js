var header = document.getElementsByTagName("header")[0];
var sourcecode = document.getElementsByTagName("html")[0].innerHTML;

// Remove bars from article
var article = header.parentElement;
//article.lastChild.getElementsByTagName("rect")[0].remove();
article.lastChild.remove();

// Remove top gradient
header.lastChild.style = "overflow: initial;"
header.lastChild.className = "";

// Divide article in body, headline, etc.
var preview_text = header.lastChild.firstChild.innerHTML;
var split_desc = sourcecode.split("\",\"description\":\"") // ","description":"
var split_body = split_desc[1].split("\",\"articleBody\":\"") // ","articleBody":"
var split_image = split_body[1].split("\",\"image\":") // ","image":
var body = split_image[0];

// Replace text with full article
var p_tags_article = header.lastChild.lastChild.getElementsByTagName("p");
p_tags_article[0].innerText = body;

for (let i = p_tags_article.length; i > 1; i--) {
    p_tags_article[i-1].remove();
}

// Remove bottom gradient
var lastdiv = header.parentElement.getElementsByTagName("div")[header.parentElement.getElementsByTagName("div").length - 1];
lastdiv.className = "";