const input = `
@document.meta
title: Fleeting Notes
description: A description of a fleeting note
authors: trakl
categories: [TestA
  TestB]
created: 2024-09-12T12:28:50-0500
updated: 2024-09-12T12:38:06-0500
version: 1.1.1
@end

* Fleeting Notes
  - In a typical zettelkasten system, a fleeting note is immediately discarded
  - I believe that every note will spawn from a fleeting note, so I keep them.
  - I plan to keep all fleeting notes in the [fleeting-notes]{:$folder_path} folder
  - A fleeting note could be a /TODO/, a short _memo_, or a *marginal* note.
  - Some notes may have superscripts like ^1^.
`;

const extractMetadata = (input) => {
  const metadata = {};
  const metadataStart = input.indexOf("@document.meta\n");
  const metadataEnd = input.indexOf("@end");
  const metadataText = input.slice(metadataStart + 15, metadataEnd);
  const title = metadataText.match(/title: (.*)/)[1];
  const description = metadataText.match(/description: (.*)/)[1];
  const authors = metadataText.match(/authors: (.*)/)[1];
  const cats = metadataText.match(/categories:\s*\[\s*([\s\S]*?)\s*]/)[1];
  const categories = cats.split(/\s*\n\s*/);
  const created = metadataText.match(/created: (.*)/)[1];
  const updated = metadataText.match(/updated: (.*)/)[1];
  const version = metadataText.match(/version: (.*)/)[1];
  metadata.title = title;
  metadata.description = description;
  metadata.authors = authors;
  metadata.categories = categories;
  metadata.created = created;
  metadata.updated = updated;
  metadata.version = version;
  return metadata;
};

const getBody = (input) => {
  const metadataEnd = input.indexOf("@end");
  return input.slice(metadataEnd + 5);
};

const convertToHTML = (input) => {
  const metadata = extractMetadata(input);
  const body = getBody(input);
  let html = "";
  html += `<h1>${metadata.title}</h1>`;
  html += `<p>${metadata.description}</p>`;
  html += `<ul>`;
  metadata.categories.forEach((cat) => {
    html += `<li>${cat}</li>`;
  });
  html += `</ul>`;

  for (const line of body.split("\n")) {
    console.log("LINE: ", line);
    if (line.trim() === "") {
      continue;
    }
    html += convertLineToHTML(line);
  }

  return html;
};

function convertLineToHTML(line) {
  const header = line.match(/\*+/);
  if (header) {
    console.log("HEADER: ", header);
    return `<h${header.length}>${line.slice(header[0].length + 1)}</h${header.length}>`;
  }
  // if line begins with -, build <ul and <li.
  return `<p>${line}</p>`;
}

function neorgToHtml(neorgContent) {
  // Extract metadata
  const metadataRegex = /@document\.meta\n([\s\S]*?)\n@end/;
  const metadataMatch = neorgContent.match(metadataRegex);
  let metadata = {};
  if (metadataMatch) {
    const metadataString = metadataMatch[1];
    const metadataLines = metadataString.split("\n");
    metadataLines.forEach((line) => {
      const [key, value] = line.split(":").map((str) => str.trim());
      if (key && value) {
        metadata[key] = value;
      }
    });
  }

  // Extract and convert content
  const contentRegex = /@document\.meta[\s\S]*?@end\s+([\s\S]*)/;
  const contentMatch = neorgContent.match(contentRegex);
  const new_content = "";
  if (contentMatch) {
    content = contentMatch[1].trim();

    // Convert Neorg bullet points to HTML

    // Convert Neorg links [Name]{href} to HTML <a> tags
    // Escape special characters in href
    content = content.replace(/^\* (.+)$/gm, "<ul><li>$1</li></ul>");
    content = content.replace(/^\s*-\s(.+)$/gm, "<ul><li>$1</li></ul>");
    content = content.replace(/<\/ul>\s*<ul>/g, ""); // Merge consecutive lists
    content = content.replace(/\[([^\]]+)]\{([^}]+)}/g, (match, p1, p2) => {
      // Remove `:$` prefix from href if present
      const href = p2.startsWith(":$") ? p2.slice(2) : p2;
      // Escape special characters in href
      const escapedHref = href
        .replace(/&/g, "&amp;")
        .replace(/\//g, "&#x2F;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/_/g, "&UnderBar;");
      return `<a href="${escapedHref}">${p1}</a>`;
    });

    // Convert Neorg formatting to HTML
    content = content.replace(/\/([^\/]+)/g, "<em>$1</em>"); // Italics
    content = content.replace(/_([^_]+)_/g, "<u>$1</u>"); // Underline
    content = content.replace(/\*([^*]+)\*/g, "<b>$1</b>"); // Bold
  }

  // Generate HTML
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title || "Neorg Document"}</title>
    <meta name="description" content="${metadata.description || ""}">
    <meta name="author" content="${metadata.authors || ""}">
    <meta name="categories" content="${metadata.categories ? metadata.categories.replace(/\[|\]/g, "").split(",").join(", ") : ""}">
    <meta name="created" content="${metadata.created || ""}">
    <meta name="updated" content="${metadata.updated || ""}">
    <meta name="version" content="${metadata.version || ""}">
</head>
<body>
    <h1>${metadata.title || "Neorg Document"}</h1>
    ${content}
</body>
</html>`;
  return html;
}

const htmlOutput = neorgToHtml(input);
console.log(htmlOutput);
