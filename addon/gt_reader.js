function removePaywall() {
  var article = document.getElementsByTagName("article")[0];
  var header = article.getElementsByTagName("header")[0];

  // delete last div in article (svg-overlay und abo-optionen)
  if (article.lastChild.nodeName == "DIV") {
    article.lastChild.remove();
  }

  // Remove top gradient from article
  header.lastChild.style = "overflow: initial; height: auto;";
  header.lastChild.className = "";

  // Get class names for formatting
  var p_tag_class_name =
    header.lastChild.getElementsByTagName("p")[0].className;
  var h2_tag_class_name = header.getElementsByTagName("h2")[0].className;

  // das script tag mit der id "fusion-metadata" fügt dem window die Variable Fusion hinzu
  // unter "window.Fusion.globalContent.elements" sind die Elemente des Artikels
  var script = document.getElementById("fusion-metadata").innerHTML;
  eval(script); // window variable zu diesem zeitpunkt das objekt "Fusion" hinzufügen um darauf zugreifen zu können
  var global_content = window.Fusion.globalContent.elements;

  var full_article = "";

  // global style definition
  var styles = 'style="overflow: initial; height: auto;"';

  for (let i = 0; i < global_content.length; i++) {
    // Header
    if (global_content[i]["type"] == "header") {
      full_article += '<h2 class="' + h2_tag_class_name + '" ' + styles + '>';
      full_article += global_content[i]["text"];
      full_article += "</h2>";
    }

    // Text
    else if (global_content[i]["type"] == "text") {
      full_article += '<p class="' + p_tag_class_name + '" ' + 'style="overflow: initial; height: auto; font-weight: 400"' + '>';
      full_article += global_content[i]["text"];
      full_article += "</p>";
    }

    // Image
    else if (global_content[i]["type"] == "image") {
      full_article += '<img src="';
      full_article += global_content[i]["imageInfo"]["src"] + '"' + " ";
      full_article += 'style="' + 'max-width: 100%;height: auto; overflow: initial;"' + "/>";
      full_article += '<figcaption class="' + p_tag_class_name + '"' + ">";
      full_article +=
        global_content[i]["imageInfo"]["caption"] + "</figcaption>";
    }

    // List
    else if (global_content[i]["type"] == "list") {
      full_article += '<p class="' + p_tag_class_name + '" ' + styles + '>';
      for (let j = 0; j < global_content[i]["list"]["items"].length; j++) {
        full_article += global_content[i]["list"]["items"][j]["text"] + "<br>";
      }
      full_article += "</p>";
    }

    // Gallery
    else if (global_content[i]["type"] == "gallery") {
      full_article += '<p class="' + p_tag_class_name + '" ' + styles + '>';
      let gallery_link = global_content[i]["galleryInfo"]["path"];
      full_article +=
        '<a href="' +
        gallery_link +
        '">' +
        "Hier klicken für die Fotostrecke.</a>";
      full_article += "</p>";
    }
  }

  // Replace text with full article
  header.lastChild.innerHTML = full_article;
}

// insert button to remove paywall
function addRemoveButton() {
  let article = document.getElementsByTagName("article")[0];
  if (!article) {
    return;
  }
  let header = article.getElementsByTagName("header")[0];
  if (!header) {
    return;
  }

  // button definition
  remove_paywall_btn = document.createElement("button");
  remove_paywall_btn.innerHTML = "Remove Paywall";
  remove_paywall_btn.id = "remove-paywall";
  remove_paywall_btn.style = "background: rgb(206, 59, 10);" +
    "font-family: 'DIN Next LT Pro', Arial, Roboto, sans-serif;" +
    "font-weight: 700;" +
    "font-size: 2rem;" +
    "line-height: 30px;" +
    "border: none;" +
    "border-radius: 3px;";
    remove_paywall_btn.onclick = function() {removePaywall()};

  // set button as first child of header if it doesn't already exist
  let headerButtons = header.getElementsByTagName("button");

  for (let i = 0; i < headerButtons.length; i++) {
    if (headerButtons[i].id == "remove-paywall") {
      return;
    }
  }
  header.prepend(remove_paywall_btn);
}

// Funktion, die bei DOM-Aenderungen aufgerufen wird
function handleDOMChanges(mutationsList, observer) {
    addRemoveButton();
}

// Optionen fuer den MutationObserver
const observerOptions = { childList: true, subtree: true };

// DOM-Element, das ueberwacht werden soll (z. B. das gesamte Dokument)
const targetNode = document;

// Erstelle einen MutationObserver und fuege deine Funktion hinzu
const mutationObserver = new MutationObserver(handleDOMChanges);

// Starte die ueberwachung des DOM
mutationObserver.observe(targetNode, observerOptions);