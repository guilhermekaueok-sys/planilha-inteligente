/* Exemplo. Não desenha a plataforma. Token de OAuth não grava no navegador. */
/* Webhook de saída — só o endereço, nunca a chave:
   ATLAS.setWebhook("https://seu-endpoint.exemplo/ia");

   OAuth — abre o provedor e o token fica só na memória desta aba:
   ATLAS.oauthStart("gemini");
   ATLAS.oauthStart("chatgpt");
   ATLAS.oauthStart("claude");
   ATLAS.oauthStart("copilot");

   Webhook de entrada — devolve só ações de estudo:
   fetch("./api/ia-webhook", {
     method: "POST",
     headers: { "Content-Type": "application/json", "x-pi-webhook": "seu-segredo" },
     body: JSON.stringify({
       text: "adicione 2 horas de direito na terca",
       actions: [{ op: "hours", horas: 2, disc: "direito administrativo", day: "terca" }]
     })
   }).then(function (r) { return r.json(); }).then(console.log);
*/
(function () {
  window.PIExemplo = {
    webhook: function (text, actions, secret) {
      return fetch("./api/ia-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-pi-webhook": secret || "" },
        body: JSON.stringify({ text: text || "", actions: actions || [] }),
      }).then(function (r) { return r.json(); });
    },
    oauth: function (slot) {
      if (window.ATLAS && ATLAS.oauthStart) ATLAS.oauthStart(slot);
    },
  };
})();
