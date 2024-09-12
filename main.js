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
  - I plan to keep all fleeting notes in the [fleeting_notes]{:$/20.03_Honors_Colloquium\Notes2\fleeting_notes\index:} folder
  - A fleeting note could be a TODO, a short memo, a marginal note.
`;
const metadata = {};
const metadataStart = input.indexOf("@document.meta\n");
const metadataEnd = input.indexOf("@end");
const metadataText = input.slice(metadataStart + 15, metadataEnd);
const title = metadataText.match(/title: (.*)/)[1];
const description = metadataText.match(/description: (.*)/)[1];
const authors = metadataText.match(/authors: (.*)/)[1];
const cats = metadataText.match(/categories:\s*\[\s*([\s\S]*?)\s*]/)[1];
const categories = cats.split(/\s*\n\s*/);

console.log(title);
console.log(description);
console.log(authors);
console.log(categories);
console.log(title);
