document.getElementById("exportPDF").addEventListener("click", async () => {
  const title = document.getElementById("pdfTitle").value.trim() || "chatgpt-session";
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractChat,
  }, (results) => {
    const content = results[0].result;
    generatePDF(content, title);
  });
});

function extractChat() {
  const messages = Array.from(document.querySelectorAll(".markdown")).map(el => el.innerText);
  return messages.join("\n\n---\n\n");
}

function generatePDF(text, title) {
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head><title>${title}</title></head>
      <body>
        <pre style="white-space: pre-wrap; font-family: Arial;">${text}</pre>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}
