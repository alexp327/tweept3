/*

Here is the code that is provided by the ExtPay.js example file. Wrap code that should work
in the "if (user.paid)" section.

Ideally if the user hasn't paid, the code isn't injected. But if the user HAS paid,
then it works as normal.

The admin login here for testing is will.hobick@gmail.com - I'll text you the password

-- CODE BELOW --


*/
const extpay = ExtPay("tweept3");

extpay.getUser().then((user) => {
  if (user.paid) {
    document.querySelector("p").innerHTML =
      "Thanks for supporting the project 🎉 ! We're working on additional integrations at this moment and are excited to share them soon!";
    document.querySelector("button").innerHTML = "Manage Membership";
    document
      .getElementById("pay-now")
      .addEventListener("click", extpay.openPaymentPage);
  } else {
    document
      .getElementById("pay-now")
      .addEventListener("click", extpay.openPaymentPage);
  }
});

waitForElm("[data-testid='geoButton']").then((elm) => {
  geoButton = elm;

  const button = `
    <img id="OpenAIicon" src="./OpenAISVG.svg" alt="OpenAI Icon" width="18px" style="margin-left:10px; cursor: pointer;">
    <select name="tweet_type" id="tweet_type" style="appearance: none; background-color: rgb(239, 243, 244);border-radius: 24px; padding: 6px 8px 6px 8px; margin-left:6px; border:none; font-weight: 600; color: #0f1419;font-size: 10px;letter-spacing: -.5px;">
      <option value="basic">Basic Tweet</option>
      <option value="emoji">Emoji-Filled</option>
      <option value="cta">Call To Action</option>
      <option value="question">Ask a Question</option>
      <option value="shitpost">Shit Post</option>
      <option value="custom">Custom Prompt</option>
    </select>
    <script src="content.js"></script>
    `;

  geoButton.insertAdjacentHTML("afterend", button);

  let icon = document.getElementById("OpenAIicon");
  icon.src = chrome.runtime.getURL("OpenAISVG.svg");

  document
    .getElementById("OpenAIicon")
    .addEventListener("click", handleOpenAIClick);
});

function handleOpenAIClick() {
  extpay.getUser().then((user) => {
    if (user.paid) {
      // use span elements with text instead of keypresses
      let spanElements = document.querySelectorAll("[data-text='true']");
      let typedKeys = "";
      spanElements.forEach((element) => {
        console.log(element);
        console.log(element.textContent);
        if (element.textContent) {
          console.log("in if");
          typedKeys = typedKeys.concat(element.textContent);
        }
        console.log("typedkeys value:");
        console.log(typedKeys);
      });
      console.log(typedKeys);

      let selectValue = document.getElementById("tweet_type").value;
      console.log(selectValue);

      // Get the image element
      let img = document.getElementById("OpenAIicon");

      // Set the transition property with the desired easing effect
      img.style.transition = "transform 1s cubic-bezier(0.4, 0.0, 0.2, 1)";

      // Set the initial rotation to 0 degrees
      img.style.transform = "rotate(0deg)";

      // Add an event listener that will rotate the image 360 degrees when clicked
      img.addEventListener("click", function () {
        img.style.transform = "rotate(360deg)";
      });

      // Add a transitionend event listener to reset the rotation to 0 degrees when the animation ends
      img.addEventListener("transitionend", function () {
        img.style.transform = "rotate(0deg)";
        img.style.transitionDuration = "0s";
      });
      let openAIPrompt = "";

      console.log(typedKeys);
      if (selectValue === "basic") {
        openAIPrompt =
          "Write a tweet about " +
          typedKeys +
          ". Include hashtags and write this in under 255 characters.";
      }
      if (selectValue === "emoji") {
        openAIPrompt =
          "Write an exciting Tweet about " +
          typedKeys +
          ". Include lots of emojis and write this in under 255 characters.";
      }
      if (selectValue === "cta") {
        openAIPrompt =
          "Write a tweet about " +
          typedKeys +
          " and include a call to cation. Write this in under 255 characters.";
      }
      if (selectValue === "question") {
        openAIPrompt =
          "Write a Tweet about " +
          typedKeys +
          " asking a question. Write this in under 255 characters.";
      }
      if (selectValue === "shitpost") {
        openAIPrompt =
          "Write a funny, bad Tweet, known as a shit-post, about " +
          typedKeys +
          ". Write this in under 255 characters.";
      }
      if (selectValue === "custom") {
        openAIPrompt = typedKeys = " Write this is under 255 characters.";
      }
      console.log(openAIPrompt);
      fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: openAIPrompt,
          max_tokens: 256,
          temperature: 0.5,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Get the response from the API and store it in a variable
          let response = data.choices[0].text;

          // Remove any spaces or tabs before the first character in the response text
          response = response.replace(/^\s+/g, "");

          // Copy the response text to the clipboard
          navigator.clipboard.writeText(response);
          showPopup();
          console.log(response);
        });
    } else {
      extpay.openPaymentPage();
    }
  });
}

function showPopup() {
  // Create a div element
  let popup = document.createElement("div");

  // Set the text content of the div to "Response copied to clipboard"
  popup.textContent = "Tweet copied to clipboard.";

  // Set the style of the div to display it as a popup at the bottom of the screen
  popup.style.position = "fixed";
  popup.style.bottom = "0";
  popup.style.left = "0";
  popup.style.right = "0";
  popup.style.backgroundColor = "rgba(255,255,255)";
  popup.style.color = "black";
  popup.style.fontWeight = "600";
  popup.style.padding = "20px";
  popup.style.fontFamily = "Arial";
  popup.style.textAlign = "center";
  popup.style.borderRadius = "24px 24px 0px 0px";

  // Append the div to the body of the page
  document.body.appendChild(popup);

  // Remove the div after 4 seconds
  setTimeout(function () {
    document.body.removeChild(popup);
  }, 4000);
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
