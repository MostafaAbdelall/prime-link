/* =========================================================================
   * INTEGRATED FORM DISPATCHER: FORMSPREE + WHATSAPP HUB
   * APPLICATION: Simultaneous Email Archiving & Instant Messaging Redirection
   * ARCHITECT:   Mostafa
   ========================================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Catch the correct form ID from the DOM structure
  const contactForm = document.getElementById("primeContactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      // IMPORTANT: Strictly stop the form from redirecting to external Formspree page
      e.preventDefault();

      // Setup destination WhatsApp number from your branding guidelines
      const targetWhatsApp = "201037474761";
      const currentForm = e.target;

      const uiLoader = document.getElementById("statusLoading");
      const uiSuccess = document.getElementById("statusSuccess");
      const uiError = document.getElementById("statusError");

      // Acquire exact clean values from input elements
      const clientName = document.getElementById("formName").value.trim();
      const clientCompany =
        document.getElementById("formCompany").value.trim() || "Not Provided";
      const clientEmail = document.getElementById("formEmail").value.trim();
      const clientPhone =
        document.getElementById("formPhone").value.trim() || "Not Provided";
      const clientSubject = document.getElementById("formSubject").value.trim();
      const clientMessage = document.getElementById("formMessage").value.trim();

      // Update operational feedback alerts display state
      uiLoader.style.display = "block";
      uiSuccess.style.display = "none";
      uiError.style.display = "none";

      // Gather elements payload data to dispatch forward to Formspree
      const payloadContainer = new FormData(currentForm);

      // Execute background asynchronous AJAX fetch request directly to Formspree
      fetch(currentForm.action, {
        method: currentForm.method,
        body: payloadContainer,
        headers: {
          Accept: "application/json",
        },
      })
        .then((networkResponse) => {
          // Hide loader once network returns response
          uiLoader.style.display = "none";

          if (networkResponse.ok) {
            // Show custom success message directly inside your clean layout design
            uiSuccess.style.display = "block";

            // Build clean structured text template layout for WhatsApp message context
            const compiledMessage =
              `*New Inquiry via Prime Link Website* \n\n` +
              `*Name:* ${clientName}\n` +
              `*Company:* ${clientCompany}\n` +
              `*Email:* ${clientEmail}\n` +
              `*Phone:* ${clientPhone}\n` +
              `*Subject:* ${clientSubject}\n\n` +
              `*Message:* \n${clientMessage}`;

            // URL safe string transformation conversion invocation
            const urlEncodedPayload = encodeURIComponent(compiledMessage);
            const explicitDispatchUrl = `https://wa.me/${targetWhatsApp}?text=${urlEncodedPayload}`;

            // Launch target WhatsApp interface window process and clear form inputs safely
            window.open(explicitDispatchUrl, "_blank");
            currentForm.reset();
          } else {
            // Display unexpected transmission errors from remote host endpoint
            uiError.style.display = "block";
          }
        })
        .catch((runtimeException) => {
          // Capture absolute broken pipe network exceptions
          uiLoader.style.display = "none";
          uiError.style.display = "block";
        });
    });
  }
});
