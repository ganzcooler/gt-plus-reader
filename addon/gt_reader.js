var header;
var all_header = document.getElementsByTagName("header");

// Get article header
for (let i = 0; i < all_header.length; i++) {
  if (all_header[i].className.includes("ArticleHeadstyled")) {
    header = all_header[i];
  }
}

var sourcecode = document.getElementsByTagName("html")[0].innerHTML;
var article = header.parentElement;

// Check if article is PLUS article
if (article.lastChild.lastChild.nodeName == "svg") {
  // Remove bars from article
  article.lastChild.lastChild.remove();

  // Remove top gradient
  header.lastChild.style = "overflow: initial;"
  header.lastChild.className = "";

  // das script tag mit der id "fusion-metadata" fügt dem window die Variable Fusion hinzu
  var script = document.getElementById("fusion-metadata").innerHTML;
  eval(script); // window variable zu diesem zeitpunkt das objekt "Fusion" hinzufügen um darauf zugreifen zu können
  var global_content = window.Fusion.globalContent.elements;
  console.log(global_content);
  
  // Get p tags class name
  var p_tag_class_name = header.lastChild.lastChild.getElementsByTagName("p")[0].className;

  // Get h2 tags class name
  var h2_tag_class_name = header.getElementsByTagName("h2")[0].className;

  var full_article = "";
  for (let i = 0; i < global_content.length; i++) {
    if (global_content[i]["type"] == "header") {
      full_article += "<h2 class=\"" + h2_tag_class_name + "\">";
      full_article += global_content[i]["text"];
      full_article += "</h2>";
      continue;
    }

    if (global_content[i]["type"] == "text") {
      full_article += "<p class=\"" + p_tag_class_name + "\">";
      full_article += global_content[i]["text"];
      full_article += "</p>";
      continue;
    }

    if (global_content[i]["type"] == "image") {
      full_article += "<img src=\"";
      full_article += global_content[i]["imageInfo"]["src"] + "\"" + " ";
      full_article += "style=\"" + "max-width: 100\%;height: auto;\"" + "/>";
      full_article += "<figcaption class=\"" + p_tag_class_name + "\"" + ">";
      full_article += global_content[i]["imageInfo"]["caption"] + "</figcaption>";
      continue;
    }
  }

  // Replace text with full article
  // Get all p tags in div and delete them
  var p_tags_article = header.lastChild.lastChild.getElementsByTagName("p");

  for (let i = 0; i < p_tags_article.length; i++) {
    p_tags_article[i].remove();
  }

  // Actual replacement
  header.lastChild.lastChild.innerHTML = full_article;

  // Remove bottom gradient
  var lastdiv = header.parentElement.getElementsByTagName("div")[header.parentElement.getElementsByTagName("div").length - 1];
  lastdiv.className = "";
}
