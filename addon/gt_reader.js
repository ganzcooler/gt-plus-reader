function removePaywall() {
  var article = document.getElementById("article");
  var header = article.getElementsByTagName("header")[0];

  if (isPlusArticle(article)) {
    console.log("Removing Paywall...");
  } else {
    console.log("Article is non-plus-article.");
    return;
  }

  // svg-overlay (bars) entfernen
  if (article.lastChild.lastChild.nodeName == "svg") {
    article.lastChild.lastChild.remove();
  }

  // abo-optionen entfernen
  var divs_article = article.getElementsByTagName("div");
  var lastdiv_article;
  for (let i = divs_article.length - 1; i > 0; i--) {
    if (divs_article[i].parentElement.id == "article") {
      lastdiv_article = divs_article[i];
      lastdiv_article.remove();
      break;
    }
  }

  // Remove top gradient from article
  header.lastChild.style = "overflow: initial;";
  header.lastChild.className = "";

  // Get class names for formatting
  var p_tag_class_name =
    header.lastChild.lastChild.getElementsByTagName("p")[0].className;
  var h2_tag_class_name = header.getElementsByTagName("h2")[0].className;

  // das script tag mit der id "fusion-metadata" fügt dem window die Variable Fusion hinzu
  // unter "window.Fusion.globalContent.elements" sind die Elemente des Artikels
  var script = document.getElementById("fusion-metadata").innerHTML;
  eval(script); // window variable zu diesem zeitpunkt das objekt "Fusion" hinzufügen um darauf zugreifen zu können
  var global_content = window.Fusion.globalContent.elements;

  // get article
  var full_article = "";
  for (let i = 0; i < global_content.length; i++) {
    // Header
    if (global_content[i]["type"] == "header") {
      full_article += '<h2 class="' + h2_tag_class_name + '">';
      full_article += global_content[i]["text"];
      full_article += "</h2>";
    }

    // Text
    else if (global_content[i]["type"] == "text") {
      full_article += '<p class="' + p_tag_class_name + '">';
      full_article += global_content[i]["text"];
      full_article += "</p>";
    }

    // Image
    else if (global_content[i]["type"] == "image") {
      full_article += '<img src="';
      full_article += global_content[i]["imageInfo"]["src"] + '"' + " ";
      full_article += 'style="' + 'max-width: 100%;height: auto;"' + "/>";
      full_article += '<figcaption class="' + p_tag_class_name + '"' + ">";
      full_article +=
        global_content[i]["imageInfo"]["caption"] + "</figcaption>";
    }

    // List
    else if (global_content[i]["type"] == "list") {
      full_article += '<p class="' + p_tag_class_name + '">';
      for (let j = 0; j < global_content[i]["list"]["items"].length; j++) {
        full_article += global_content[i]["list"]["items"][j]["text"] + "<br>";
      }
      full_article += "</p>";
    }

    // Gallery
    else if (global_content[i]["type"] == "gallery") {
      full_article += '<p class="' + p_tag_class_name + '">';
      let gallery_link = global_content[i]["galleryInfo"]["path"];
      full_article +=
        '<a href="' +
        gallery_link +
        '">' +
        "Hier klicken für die Fotostrecke.</a>";
      full_article += "</p>";
    }
  }

  // Get all p tags in div and delete them
  var p_tags_article = header.lastChild.lastChild.getElementsByTagName("p");
  for (let i = 0; i < p_tags_article.length; i++) {
    p_tags_article[i].remove();
  }

  // Replace text with full article
  header.lastChild.lastChild.innerHTML = full_article;
}

function isPlusArticle(article) {
  // 1) Check for "Kostenfrei"
  if (article.innerHTML.search("Kostenfrei") != -1) {
    return false;
  }

  // 2) Check for paid icon
  var all_spans = document.getElementsByTagName("span");
  for (let i = 0; i < all_spans.length; i++) {
    if (all_spans[i].getAttribute("data-testid") == "paid-icon") {
      return true;
    }
  }

  // 3) Kein paid-icon und kein Kostenfrei
  return false;
}

let lastExecutionTime = 0; // Zeitpunkt der letzten Ausführung
let timeout; // Timeout-Referenz

// Funktion, die bei DOM-Änderungen aufgerufen wird
function handleDOMChanges(mutationsList, observer) {
  const currentTime = Date.now();

  // Prüfe, ob mindestens eine Sekunde seit der letzten Ausführung vergangen ist
  if (currentTime - lastExecutionTime >= 1000) {
    // Dein Code, der bei jeder DOM-Änderung ausgeführt werden soll
    removePaywall();

    // Aktualisiere den Zeitpunkt der letzten Ausführung
    lastExecutionTime = currentTime;
  } else {
    // Falls ein Timeout bereits geplant ist, breche es ab
    if (timeout) {
      clearTimeout(timeout);
    }

    // Setze ein neues Timeout, um den Code nach einer Sekunde auszuführen
    timeout = setTimeout(() => {
      lastExecutionTime = Date.now(); // Aktualisiere den Zeitpunkt der letzten Ausführung
    }, 1000);
  }
}

// Optionen für den MutationObserver
const observerOptions = { childList: true, subtree: true };

// DOM-Element, das überwacht werden soll (z. B. das gesamte Dokument)
const targetNode = document;

// Erstelle einen MutationObserver und füge deine Funktion hinzu
const mutationObserver = new MutationObserver(handleDOMChanges);

// Starte die Überwachung des DOM
mutationObserver.observe(targetNode, observerOptions);
