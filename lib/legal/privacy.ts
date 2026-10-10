import type { Locale } from "@/i18n/routing";

// Bump this date whenever the policy text changes.
export const PRIVACY_LAST_UPDATED = "2026-10-09";

export const CONTROLLER = {
  name: "David Alvarado",
  city: "Guayaquil, Ecuador",
  email: "lui.alv.ron.25@gmail.com",
};

export interface Provider {
  name: string;
  purpose: string;
  location: string;
  policyUrl: string;
}

export interface PolicySection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  /** Text shown after the list. */
  note?: string;
  providers?: Provider[];
}

export interface PrivacyContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updatedLabel: string;
  intro: string;
  tocLabel: string;
  backLabel: string;
  sections: PolicySection[];
}

const es: PrivacyContent = {
  metaTitle: "Política de Privacidad | David Alvarado",
  metaDescription:
    "Cómo se recogen, usan y protegen tus datos personales en alvarado-dev.com, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.",
  title: "Política de Privacidad",
  updatedLabel: "Última actualización",
  intro:
    "Esta política explica qué datos personales se recogen en este sitio web, para qué se usan, con quién se comparten y cómo puedes ejercer tus derechos. Se redacta conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP) y su Reglamento.",
  tocLabel: "Contenido",
  backLabel: "← Volver al inicio",
  sections: [
    {
      id: "responsable",
      title: "1. Responsable del tratamiento",
      paragraphs: [
        `El responsable del tratamiento de tus datos es ${CONTROLLER.name}, desarrollador de software independiente con domicilio en ${CONTROLLER.city}.`,
        `Para cualquier consulta sobre privacidad o para ejercer tus derechos, escribe a ${CONTROLLER.email}. Por el tamaño de la actividad no se ha designado un delegado de protección de datos; el propio responsable atiende estas solicitudes.`,
      ],
    },
    {
      id: "datos",
      title: "2. Qué datos recogemos",
      list: [
        "Formulario de contacto: nombre, correo electrónico, servicio de interés y el mensaje que escribas.",
        "Asistente virtual (chat): las opciones que elijas (servicio, alcance, presupuesto aproximado), el texto que escribas y, solo si decides darlo, tu correo electrónico.",
        "Datos técnicos: dirección IP y datos del navegador que el servidor recibe con cada visita, usados para seguridad y para limitar abusos.",
        "Estadísticas de uso anónimas y agregadas (páginas vistas, país, tipo de dispositivo, navegador y sitio de procedencia), sin cookies ni identificadores personales.",
      ],
      note: "No solicitamos datos sensibles (salud, origen étnico, religión, datos biométricos, etc.). Te pedimos que no los incluyas en tus mensajes.",
    },
    {
      id: "finalidades",
      title: "3. Para qué usamos tus datos",
      list: [
        "Responder a tu consulta y preparar una propuesta o cotización si la solicitas.",
        "Avisar al responsable en tiempo real de que llegó una consulta nueva, para responder más rápido.",
        "Proteger el sitio frente a spam y usos abusivos.",
        "Conocer de forma agregada cómo se usa el sitio para mejorarlo.",
      ],
      note: "No vendemos ni alquilamos tus datos, no los usamos para publicidad de terceros y no te enviaremos boletines o promociones sin tu consentimiento expreso.",
    },
    {
      id: "base-legal",
      title: "4. Base legal",
      list: [
        "Tu consentimiento, que otorgas al marcar la casilla del formulario o al escribir en el chat tras ver el aviso de privacidad. Puedes revocarlo cuando quieras.",
        "La aplicación de medidas precontractuales a tu solicitud, cuando nos pides una propuesta o cotización.",
        "El interés legítimo en mantener la seguridad del sitio, para los datos técnicos y el control de abusos.",
      ],
    },
    {
      id: "chat",
      title: "5. Sobre el asistente virtual",
      paragraphs: [
        "\"Alex\" es un asistente automatizado con respuestas programadas: no es una persona ni usa inteligencia artificial generativa. Sus respuestas varían según las opciones que elijas, pero no toma decisiones que produzcan efectos jurídicos sobre ti ni crea perfiles. Al terminar la conversación, el resumen se envía a David para que pueda responderte personalmente.",
      ],
    },
    {
      id: "destinatarios",
      title: "6. Con quién se comparten (encargados) y transferencias internacionales",
      paragraphs: [
        "Para que el sitio funcione usamos los siguientes proveedores, que tratan los datos por cuenta del responsable y solo para la finalidad indicada:",
      ],
      providers: [
        {
          name: "Vercel Inc.",
          purpose: "Alojamiento del sitio, registros técnicos del servidor y estadísticas anónimas (Vercel Web Analytics, sin cookies).",
          location: "Estados Unidos",
          policyUrl: "https://vercel.com/legal/privacy-policy",
        },
        {
          name: "EmailJS",
          purpose: "Envío al correo del responsable de los mensajes del formulario de contacto.",
          location: "Estados Unidos",
          policyUrl: "https://www.emailjs.com/legal/privacy-policy/",
        },
        {
          name: "Google LLC (Gmail)",
          purpose: "Recepción y gestión del correo electrónico del responsable.",
          location: "Estados Unidos",
          policyUrl: "https://policies.google.com/privacy",
        },
        {
          name: "CallMeBot y WhatsApp (Meta Platforms)",
          purpose: "Aviso al teléfono del responsable de nuevas consultas del formulario y del chat (incluye el resumen de la consulta).",
          location: "Fuera del Ecuador",
          policyUrl: "https://www.whatsapp.com/legal/privacy-policy",
        },
        {
          name: "Calendly LLC",
          purpose: "Solo si decides agendar una llamada: Calendly recoge directamente los datos de la reserva según su propia política.",
          location: "Estados Unidos",
          policyUrl: "https://calendly.com/privacy",
        },
      ],
    },
    {
      id: "transferencias",
      title: "7. Transferencias internacionales",
      paragraphs: [
        "Como se indica arriba, algunos proveedores están fuera del Ecuador, principalmente en Estados Unidos, un país que a la fecha no cuenta con una declaratoria de nivel adecuado de protección por parte de la Superintendencia de Protección de Datos Personales. Estas transferencias se realizan con tu consentimiento expreso y bajo las garantías contractuales y medidas de seguridad que ofrecen dichos proveedores. Si no estás de acuerdo, puedes contactarnos directamente por correo electrónico en lugar de usar el formulario o el chat.",
      ],
    },
    {
      id: "conservacion",
      title: "8. Cuánto tiempo conservamos tus datos",
      list: [
        "Consultas que no terminan en un proyecto: hasta 12 meses desde la última comunicación; después se eliminan.",
        "Si contratas un servicio: durante la relación contractual y, después, el tiempo que exija la normativa tributaria y contable ecuatoriana.",
        "Datos técnicos para el control de abusos: se mantienen solo en memoria y se descartan en minutos.",
        "Estadísticas: el identificador temporal de la visita se descarta a las 24 horas; solo quedan datos agregados.",
      ],
    },
    {
      id: "derechos",
      title: "9. Tus derechos",
      paragraphs: [
        "Como titular de los datos puedes ejercer, de forma gratuita, los derechos que te reconoce la LOPDP:",
      ],
      list: [
        "Información: conocer cómo se tratan tus datos (esta política).",
        "Acceso: saber qué datos tuyos tenemos.",
        "Rectificación y actualización: corregir datos inexactos o incompletos.",
        "Eliminación: pedir que se borren tus datos.",
        "Oposición: oponerte a un tratamiento concreto.",
        "Portabilidad: recibir tus datos en un formato estructurado y de uso común.",
        "Suspensión del tratamiento.",
        "No ser objeto de decisiones basadas únicamente en tratamientos automatizados.",
        "Revocar tu consentimiento en cualquier momento, sin que afecte al tratamiento previo.",
      ],
    },
    {
      id: "ejercer",
      title: "10. Cómo ejercer tus derechos",
      paragraphs: [
        `Escribe a ${CONTROLLER.email} indicando el derecho que quieres ejercer y un dato que nos permita encontrar tu consulta (por ejemplo, el correo con el que escribiste). Te responderemos en un plazo máximo de 15 días.`,
        "Si consideras que no hemos atendido correctamente tu solicitud, puedes presentar un reclamo ante la Superintendencia de Protección de Datos Personales del Ecuador.",
      ],
    },
    {
      id: "cookies",
      title: "11. Cookies y almacenamiento local",
      paragraphs: [
        "Este sitio no usa cookies publicitarias ni de seguimiento. Las estadísticas de Vercel funcionan sin cookies. Las fuentes tipográficas se sirven desde nuestro propio servidor, por lo que tu navegador no se conecta a Google Fonts. Si en el futuro se incorporan cookies no esenciales, se pedirá tu consentimiento antes de activarlas.",
      ],
    },
    {
      id: "seguridad",
      title: "12. Seguridad",
      paragraphs: [
        "Aplicamos medidas técnicas y organizativas razonables: conexión cifrada (HTTPS con HSTS), credenciales de los servicios guardadas solo en el servidor, validación de los datos recibidos y límites de envío para evitar abusos. Ningún sistema es completamente infalible; si ocurriera una vulneración de seguridad que afecte a tus datos, lo notificaremos a la autoridad y a las personas afectadas en los plazos que establece la ley.",
      ],
    },
    {
      id: "menores",
      title: "13. Menores de edad",
      paragraphs: [
        "Los servicios de este sitio están dirigidos a empresas y personas adultas. No recogemos conscientemente datos de menores de 18 años; si detectamos que un menor nos envió datos, los eliminaremos.",
      ],
    },
    {
      id: "enlaces",
      title: "14. Enlaces a otros sitios",
      paragraphs: [
        "El sitio enlaza a servicios de terceros (GitHub, LinkedIn, WhatsApp, Calendly). Al visitarlos se aplican sus propias políticas de privacidad, sobre las que no tenemos control.",
      ],
    },
    {
      id: "cambios",
      title: "15. Cambios en esta política",
      paragraphs: [
        "Podemos actualizar esta política para reflejar cambios legales o en el funcionamiento del sitio. La versión vigente siempre estará publicada en esta página con su fecha de actualización. Si los cambios son importantes, lo indicaremos de forma visible en el sitio.",
      ],
    },
  ],
};

const en: PrivacyContent = {
  metaTitle: "Privacy Policy | David Alvarado",
  metaDescription:
    "How personal data is collected, used and protected on alvarado-dev.com, in line with Ecuador's Personal Data Protection Law and the GDPR.",
  title: "Privacy Policy",
  updatedLabel: "Last updated",
  intro:
    "This policy explains what personal data this website collects, why, who it is shared with and how you can exercise your rights. It follows Ecuador's Organic Law on Personal Data Protection (LOPDP) and its Regulations. If you are in the European Union or the United Kingdom, the rights described below also reflect the GDPR / UK GDPR.",
  tocLabel: "Contents",
  backLabel: "← Back to home",
  sections: [
    {
      id: "controller",
      title: "1. Data controller",
      paragraphs: [
        `The controller of your data is ${CONTROLLER.name}, an independent software developer based in ${CONTROLLER.city}.`,
        `For any privacy question or to exercise your rights, email ${CONTROLLER.email}. Given the size of the activity, no data protection officer has been appointed; the controller handles these requests directly.`,
      ],
    },
    {
      id: "data",
      title: "2. Data we collect",
      list: [
        "Contact form: name, email address, service of interest and your message.",
        "Virtual assistant (chat): the options you pick (service, scope, approximate budget), any text you type and, only if you choose to give it, your email address.",
        "Technical data: IP address and browser data received by the server on each visit, used for security and abuse prevention.",
        "Anonymous, aggregated usage statistics (pages viewed, country, device type, browser and referrer), with no cookies or personal identifiers.",
      ],
      note: "We do not ask for sensitive data (health, ethnicity, religion, biometrics, etc.). Please do not include it in your messages.",
    },
    {
      id: "purposes",
      title: "3. Why we use your data",
      list: [
        "To reply to your enquiry and prepare a proposal or quote if you request one.",
        "To notify the controller in real time that a new enquiry has arrived, so we can reply faster.",
        "To protect the site against spam and abuse.",
        "To understand, in aggregate, how the site is used in order to improve it.",
      ],
      note: "We do not sell or rent your data, we do not use it for third-party advertising and we will not send you newsletters or promotions without your explicit consent.",
    },
    {
      id: "legal-basis",
      title: "4. Legal basis",
      list: [
        "Your consent, given by ticking the box on the contact form or by typing in the chat after seeing the privacy notice. You can withdraw it at any time.",
        "Steps taken at your request prior to entering into a contract, when you ask for a proposal or quote.",
        "Legitimate interest in keeping the site secure, for technical data and abuse prevention.",
      ],
    },
    {
      id: "chat",
      title: "5. About the virtual assistant",
      paragraphs: [
        "\"Alex\" is an automated assistant with scripted replies: it is not a person and does not use generative AI. Its replies vary depending on the options you choose, but it makes no decisions with legal effects on you and creates no profiles. When the conversation ends, a summary is sent to David so he can reply to you personally.",
      ],
    },
    {
      id: "recipients",
      title: "6. Who we share data with (processors) and international transfers",
      paragraphs: [
        "To run the site we use the following providers, which process data on the controller's behalf and only for the stated purpose:",
      ],
      providers: [
        {
          name: "Vercel Inc.",
          purpose: "Site hosting, server technical logs and anonymous statistics (Vercel Web Analytics, cookieless).",
          location: "United States",
          policyUrl: "https://vercel.com/legal/privacy-policy",
        },
        {
          name: "EmailJS",
          purpose: "Delivering contact-form messages to the controller's inbox.",
          location: "United States",
          policyUrl: "https://www.emailjs.com/legal/privacy-policy/",
        },
        {
          name: "Google LLC (Gmail)",
          purpose: "Receiving and managing the controller's email.",
          location: "United States",
          policyUrl: "https://policies.google.com/privacy",
        },
        {
          name: "CallMeBot and WhatsApp (Meta Platforms)",
          purpose: "Notifying the controller's phone about new form and chat enquiries (includes the enquiry summary).",
          location: "Outside Ecuador",
          policyUrl: "https://www.whatsapp.com/legal/privacy-policy",
        },
        {
          name: "Calendly LLC",
          purpose: "Only if you choose to book a call: Calendly collects the booking data directly under its own policy.",
          location: "United States",
          policyUrl: "https://calendly.com/privacy",
        },
      ],
    },
    {
      id: "transfers",
      title: "7. International transfers",
      paragraphs: [
        "As listed above, some providers are located outside Ecuador, mainly in the United States, which currently has no adequacy recognition from Ecuador's Personal Data Protection Authority. These transfers are made with your explicit consent and under the contractual safeguards and security measures offered by those providers. If you do not agree, you can contact us directly by email instead of using the form or the chat.",
      ],
    },
    {
      id: "retention",
      title: "8. How long we keep your data",
      list: [
        "Enquiries that do not become a project: up to 12 months after the last communication, then deleted.",
        "If you hire a service: for the duration of the contract and afterwards for as long as Ecuadorian tax and accounting rules require.",
        "Technical data for abuse prevention: kept in memory only and discarded within minutes.",
        "Statistics: the temporary visit identifier is discarded after 24 hours; only aggregated data remains.",
      ],
    },
    {
      id: "rights",
      title: "9. Your rights",
      paragraphs: [
        "As the data subject you may exercise, free of charge, the rights granted by the LOPDP (and, where applicable, the GDPR):",
      ],
      list: [
        "Information: to know how your data is processed (this policy).",
        "Access: to know what data we hold about you.",
        "Rectification: to correct inaccurate or incomplete data.",
        "Erasure: to have your data deleted.",
        "Objection: to object to a specific processing activity.",
        "Portability: to receive your data in a structured, commonly used format.",
        "Restriction (suspension) of processing.",
        "Not to be subject to decisions based solely on automated processing.",
        "To withdraw your consent at any time, without affecting prior processing.",
      ],
    },
    {
      id: "exercise",
      title: "10. How to exercise your rights",
      paragraphs: [
        `Email ${CONTROLLER.email} stating the right you want to exercise and a detail that lets us find your enquiry (for example, the email address you wrote from). We will reply within 15 days at most.`,
        "If you believe your request was not handled properly, you can file a complaint with Ecuador's Superintendency of Personal Data Protection or, if you are in the EU/UK, with your local data protection authority.",
      ],
    },
    {
      id: "cookies",
      title: "11. Cookies and local storage",
      paragraphs: [
        "This site uses no advertising or tracking cookies. Vercel's statistics work without cookies. Fonts are served from our own server, so your browser does not connect to Google Fonts. If non-essential cookies are ever added, your consent will be requested before they are enabled.",
      ],
    },
    {
      id: "security",
      title: "12. Security",
      paragraphs: [
        "We apply reasonable technical and organisational measures: encrypted connections (HTTPS with HSTS), service credentials stored server-side only, validation of incoming data and rate limits against abuse. No system is completely infallible; if a security breach affecting your data occurs, we will notify the authority and the people affected within the legal deadlines.",
      ],
    },
    {
      id: "minors",
      title: "13. Minors",
      paragraphs: [
        "The services on this site are aimed at businesses and adults. We do not knowingly collect data from anyone under 18; if we find that a minor has sent us data, we will delete it.",
      ],
    },
    {
      id: "links",
      title: "14. Links to other sites",
      paragraphs: [
        "The site links to third-party services (GitHub, LinkedIn, WhatsApp, Calendly). Their own privacy policies apply when you visit them, and we have no control over them.",
      ],
    },
    {
      id: "changes",
      title: "15. Changes to this policy",
      paragraphs: [
        "We may update this policy to reflect legal changes or changes to how the site works. The current version will always be published on this page with its update date. Significant changes will be clearly flagged on the site.",
      ],
    },
  ],
};

export const privacyContent: Record<Locale, PrivacyContent> = { es, en };
