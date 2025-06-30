'use client';

import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

const N8NChatWidget = () => {
  useEffect(() => {
    createChat({
      webhookUrl: "https://automation-gadcuadem.useteam.io/webhook/35646157-ad03-453a-92b4-b0dd646032b5/chat",
      metadata: {
        username: "",
        proyectId: "Soporte-Scrito",
      },
      initialMessages: [
        "🎉 ¡Bienvenido a Scrito!",
        "Hola, soy tu asistente virtual de Scrito 🤖",
        "Estoy aquí para ayudarte con todas tus dudas sobre nuestra plataforma de generación de contenido con IA.",
        "¿En qué puedo ayudarte hoy? Puedes preguntarme sobre:",
        "• 📊 Planes y precios",
        "• 🎧 Cómo funciona el análisis de podcasts", 
        "• 🎨 Tipos de contenido que generamos",
        "• 🚀 Cómo empezar a usar Scrito",
        "• 💡 Casos de uso y ejemplos"
      ],
      i18n: {
        en: {
          title: "¡Hola! 👋",
          subtitle: "¿Tienes alguna pregunta sobre Scrito?",
          footer: "Powered by Scrito AI",
          getStarted: "¡Empecemos!",
          inputPlaceholder: "Escribe tu mensaje aquí...",
          closeButtonTooltip: "Cerrar chat",
        },
      },
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Contenedor para el widget del chat */}
      <div id="n8n-chat-widget"></div>
    </div>
  );
};

export default N8NChatWidget; 