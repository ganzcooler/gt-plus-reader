var article = document.getElementById("article");
var header = article.getElementsByTagName("header")[0];

// insert remove-paywall-button
var button = document.createElement('button');
button.textContent = 'Paywall entfernen';
button.style =
  "border-radius: 2px;" +
  "border: 0;" +
  "background: #e84f1c;" +
  "padding: 5px;" +
  "font-family: 'DIN Next LT Pro', Arial, Roboto, sans-serif;" +
  "font-weight: 700;" +
  "letter-spacing: -0.25px;" +
  "font-size: 26px;" +
  "line-height: 30px;";
button.onclick = removePayWall;

function removePayWall() {
  console.log("button clicked!!");
}

// Füge den Button als erstes child des Headers hinzu
if (header) {
  header.insertBefore(button, header.firstChild);
}

// Check if article is PLUS article
if (article.lastChild.lastChild.nodeName == "svg") {
  // Remove bars from article
  article.lastChild.lastChild.remove();

  // Remove top gradient
  header.lastChild.style = "overflow: initial;"
  header.lastChild.className = "";

  // das script tag mit der id "fusion-metadata" fügt dem window die Variable Fusion hinzu
  // unter "window.Fusion.globalContent.elements" sind die Elemente des Artikels
  var script = document.getElementById("fusion-metadata").innerHTML;
  eval(script); // window variable zu diesem zeitpunkt das objekt "Fusion" hinzufügen um darauf zugreifen zu können
  var global_content = window.Fusion.globalContent.elements;
  
  // Get p tags class name
  var p_tag_class_name = header.lastChild.lastChild.getElementsByTagName("p")[0].className;

  // Get h2 tags class name
  var h2_tag_class_name = header.getElementsByTagName("h2")[0].className;

  var full_article = "";
  for (let i = 0; i < global_content.length; i++) {
    // Header
    if (global_content[i]["type"] == "header") {
      full_article += "<h2 class=\"" + h2_tag_class_name + "\">";
      full_article += global_content[i]["text"];
      full_article += "</h2>";
    }

    // Text
    else if (global_content[i]["type"] == "text") {
      full_article += "<p class=\"" + p_tag_class_name + "\">";
      full_article += global_content[i]["text"];
      full_article += "</p>";
    }

    // Image
    else if (global_content[i]["type"] == "image") {
      full_article += "<img src=\"";
      full_article += global_content[i]["imageInfo"]["src"] + "\"" + " ";
      full_article += "style=\"" + "max-width: 100\%;height: auto;\"" + "/>";
      full_article += "<figcaption class=\"" + p_tag_class_name + "\"" + ">";
      full_article += global_content[i]["imageInfo"]["caption"] + "</figcaption>";
    }

    // List
    else if (global_content[i]["type"] == "list") {
      full_article += "<p class=\"" + p_tag_class_name + "\">";
      for (let j = 0; j < global_content[i]["list"]["items"].length; j++) {
        full_article += global_content[i]["list"]["items"][j]["text"] + "<br>";
      }
      full_article += "</p>";
    }

    // Gallery
    else if (global_content[i]["type"] == "gallery") {
      full_article += "<p class=\"" + p_tag_class_name + "\">";
      let gallery_link = global_content[i]["galleryInfo"]["path"];
      full_article += "<a href=\"" + gallery_link + "\">" + "Hier klicken für die Fotostrecke.</a>";
      full_article += "</p>"
    }
  }

  // Get all p tags in div and delete them
  var p_tags_article = header.lastChild.lastChild.getElementsByTagName("p");
  for (let i = 0; i < p_tags_article.length; i++) {
    p_tags_article[i].remove();
  }

  // Replace text with full article
  header.lastChild.lastChild.innerHTML = full_article;

  // Remove bottom gradient
  var lastdiv = header.parentElement.getElementsByTagName("div")[header.parentElement.getElementsByTagName("div").length - 1];
  lastdiv.className = "";
}
