# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


# ReactJS vs React Native: Diferencias y Uso de Expo

## Introducción
ReactJS y React Native son bibliotecas desarrolladas por Facebook para construir interfaces de usuario. Aunque comparten fundamentos similares, están diseñadas para diferentes propósitos. Este documento destaca sus principales diferencias y cómo usar Expo para facilitar el desarrollo de aplicaciones móviles con React Native.

---

## Diferencias entre ReactJS y React Native

| Aspecto               | ReactJS                                           | React Native                                        |
|-----------------------|--------------------------------------------------|----------------------------------------------------|
| **Propósito**         | Construcción de aplicaciones web.                | Construcción de aplicaciones móviles.             |
| **Plataforma**        | Se ejecuta en navegadores web.                   | Se ejecuta en dispositivos móviles (iOS/Android). |
| **Componentes**       | Usa elementos HTML (div, span, etc.).            | Usa componentes nativos (View, Text, Button).     |
| **Estilos**           | CSS o bibliotecas como Tailwind y Styled Components. | Usa **StyleSheet** con estilos en JavaScript.     |
| **Navegación**        | React Router u otras bibliotecas de routing.     | React Navigation es la opción más común.          |
| **Renderizado**       | Renderiza en el DOM del navegador.               | Renderiza en vistas nativas a través de un puente.|
| **Compatibilidad**    | Compatible con cualquier navegador moderno.      | Compatible con iOS y Android (algunas diferencias). |

---

## ¿Qué es Expo?

Expo es un framework y una plataforma que facilita el desarrollo, la creación y el despliegue de aplicaciones móviles usando **React Native**. Proporciona herramientas y servicios integrados para simplificar el desarrollo, sin necesidad de configuraciones complejas.

### Ventajas de usar Expo
1. **Sin configuraciones iniciales complicadas**: No necesitas instalar Xcode o Android Studio para empezar.  
2. **Despliegue rápido**: Prueba la aplicación en tiempo real usando la app de **Expo Go** en tu dispositivo móvil.  
3. **Compatibilidad multiplataforma**: El mismo código funciona tanto en iOS como en Android.  
4. **Biblioteca integrada**: Incluye módulos útiles como cámara, notificaciones push, acceso a sensores, etc.  
5. **Actualizaciones OTA (Over-The-Air)**: Despliega actualizaciones directamente sin pasar por las tiendas de apps.

---

## Uso de Expo para el Desarrollo de Apps con React Native

### **1. Instalación de Expo CLI**
Asegúrate de tener instalado **Node.js**. Luego, instala Expo CLI globalmente:  
```bash
npm install -g expo-cli

npx expo start para lanzar la app a ambiente de desarrollo, despues le indicas en que software siendo el usado IOS y con r en terminal reseteas la app que es como el refresh de Web.
