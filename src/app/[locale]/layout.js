import "../../app/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { headers } from 'next/headers';
import { Analytics } from "@vercel/analytics/react";

const tools = {
  en: {
    calorie: { name: "Calorie Calculator - BMR, TDEE & Macros", desc: "Free online calorie calculator: calculate BMR, TDEE, BMI, and macronutrients (protein, carbs, fat) for weight loss, maintenance or muscle gain. Mac OS 9 retro style.", cat: "HealthApplication, Nutrition" },
    bmi: { name: "BMI Calculator - Body Mass Index", desc: "Free online BMI calculator: calculate your Body Mass Index and check your weight category. Color-coded gauge and healthy weight range.", cat: "HealthApplication" },
    convert: { name: "Unit Converter - Length, Weight, Temperature", desc: "Free online unit converter: convert length (cm to inches, meters to feet), weight (kg to lbs), temperature (C to F), volume, area, speed, pressure.", cat: "UtilitiesApplication" },
    date: { name: "Date Calculator - Days Between Dates, D-Day, Age", desc: "Free online date calculator: calculate days between dates, D-Day countdown, add/subtract days, calculate age and anniversaries.", cat: "UtilitiesApplication" },
    photo: { name: "Photo Editor - Resize, Crop, Compress Images", desc: "Free online photo editor: resize, crop, and compress images. Convert between JPEG, PNG, and WebP formats.", cat: "MultimediaApplication" },
    qr: { name: "QR Code Generator - Free Online QR Code Maker", desc: "Generate QR codes for free. Enter URL or text, customize size and error correction, download as PNG.", cat: "UtilitiesApplication" },
    password: { name: "Password Generator - Strong Random Password", desc: "Generate strong, secure random passwords instantly. Customizable length, uppercase, lowercase, numbers, and symbols.", cat: "SecurityApplication" },
    lotto: { name: "Lottery Number Generator - Powerball, Mega Millions", desc: "Generate random lottery numbers for Powerball, Mega Millions, EuroMillions, and UK Lotto. Cryptographically secure.", cat: "EntertainmentApplication" },
    percent: { name: "Percentage Calculator - Free Online Percent Calculator", desc: "Free online percentage calculator. Calculate what is X% of Y, X is what percent of Y, and percentage change between two numbers.", cat: "UtilitiesApplication" },
    currency: { name: "Currency Converter - Free Online Exchange Rate Calculator", desc: "Free online currency converter. Convert between 20 major world currencies with live exchange rates.", cat: "UtilitiesApplication" },
  },
  es: {
    calorie: { name: "Calculadora de Calor\u00edas - BMR, TDEE y Macros", desc: "Calculadora de calor\u00edas gratuita: calcula BMR, TDEE, IMC y macronutrientes.", cat: "HealthApplication, Nutrition" },
    bmi: { name: "Calculadora de IMC - \u00cdndice de Masa Corporal", desc: "Calculadora de IMC gratuita: calcule su \u00cdndice de Masa Corporal.", cat: "HealthApplication" },
    convert: { name: "Conversor de Unidades - Longitud, Peso, Temperatura", desc: "Conversor de unidades gratuito: longitud, peso, temperatura, volumen, \u00e1rea, velocidad, presi\u00f3n.", cat: "UtilitiesApplication" },
    date: { name: "Calculadora de Fechas - D\u00edas Entre Fechas", desc: "Calculadora de fechas gratuita: calcule d\u00edas entre fechas, D-Day, edad.", cat: "UtilitiesApplication" },
    photo: { name: "Editor de Fotos - Redimensionar, Recortar, Comprimir", desc: "Editor de fotos gratuito: redimensione, recorte y comprima im\u00e1genes.", cat: "MultimediaApplication" },
    qr: { name: "Generador de C\u00f3digos QR - Creador Gratuito", desc: "Genera c\u00f3digos QR gratis. Ingresa URL o texto.", cat: "UtilitiesApplication" },
    password: { name: "Generador de Contrase\u00f1as - Contrase\u00f1a Segura", desc: "Genere contrase\u00f1as seguras y aleatorias.", cat: "SecurityApplication" },
    lotto: { name: "Generador de N\u00fameros de Loter\u00eda", desc: "Genere n\u00fameros de loter\u00eda aleatorios.", cat: "EntertainmentApplication" },
    percent: { name: "Calculadora de Porcentajes - Gratis Online", desc: "Calculadora de porcentajes gratuita. Calcula qu\u00e9 es X% de Y, qu\u00e9 porcentaje es X de Y.", cat: "UtilitiesApplication" },
    currency: { name: "Conversor de Moneda - Calculadora de Tipo de Cambio", desc: "Conversor de moneda gratuito entre 20 monedas principales.", cat: "UtilitiesApplication" },
  },
  zh: {
    calorie: { name: "\u5361\u8def\u91cc\u8ba1\u7b97\u5668 - BMR\u3001TDEE\u548c\u5b8f\u517b\u6210\u5206", desc: "\u514d\u8d39\u5728\u7ebf\u5361\u8def\u91cc\u8ba1\u7b97\u5668\uff1a\u8ba1\u7b97BMR\u3001TDEE\u3001BMI\u548c\u5b8f\u517b\u6210\u5206\u3002", cat: "HealthApplication, Nutrition" },
    bmi: { name: "BMI\u8ba1\u7b97\u5668 - \u8eab\u4f53\u8d28\u91cf\u6307\u6570", desc: "\u8ba1\u7b97\u60a8\u7684\u8eab\u4f53\u8d28\u91cf\u6307\u6570\uff08BMI\uff09\u3002", cat: "HealthApplication" },
    convert: { name: "\u5355\u4f4d\u6362\u7b97\u5668 - \u957f\u5ea6\u3001\u91cd\u91cf\u3001\u6e29\u5ea6", desc: "\u514d\u8d39\u5355\u4f4d\u6362\u7b97\u5668\uff1a\u957f\u5ea6\u3001\u91cd\u91cf\u3001\u6e29\u5ea6\u3001\u4f53\u79ef\u3002", cat: "UtilitiesApplication" },
    date: { name: "\u65e5\u671f\u8ba1\u7b97\u5668 - \u65e5\u671f\u95f4\u9699", desc: "\u514d\u8d39\u65e5\u671f\u8ba1\u7b97\u5668\uff1a\u8ba1\u7b97\u65e5\u671f\u95f4\u9699\u3001D-Day\u3002", cat: "UtilitiesApplication" },
    photo: { name: "\u7167\u7247\u7f16\u8f91\u5668 - \u8c03\u6574\u5927\u5c0f\u3001\u88c1\u526a", desc: "\u514d\u8d39\u5728\u7ebf\u7167\u7247\u7f16\u8f91\u5668\u3002", cat: "MultimediaApplication" },
    qr: { name: "QR\u7801\u751f\u6210\u5668 - \u514d\u8d39\u5728\u7ebf", desc: "\u514d\u8d39\u751f\u6210QR\u7801\u3002", cat: "UtilitiesApplication" },
    password: { name: "\u5bc6\u7801\u751f\u6210\u5668 - \u5f3a\u968f\u673a\u5bc6\u7801", desc: "\u751f\u6210\u5f3a\u5927\u5b89\u5168\u7684\u968f\u673a\u5bc6\u7801\u3002", cat: "SecurityApplication" },
    lotto: { name: "\u5f69\u7968\u53f7\u7801\u751f\u6210\u5668", desc: "\u751f\u6210\u968f\u673a\u5f69\u7968\u53f7\u7801\u3002", cat: "EntertainmentApplication" },
    percent: { name: "\u767e\u5206\u6bd4\u8ba1\u7b97\u5668 - \u514d\u8d39\u5728\u7ebf", desc: "\u514d\u8d39\u767e\u5206\u6bd4\u8ba1\u7b97\u5668\u3002\u8ba1\u7b97 X \u7684 Y%\u3001X \u662f Y \u7684\u767e\u5206\u4e4b\u51e0\u3002", cat: "UtilitiesApplication" },
    currency: { name: "\u8d27\u5e01\u8f6c\u6362\u5668 - \u514d\u8d39\u6c47\u7387\u8ba1\u7b97", desc: "\u572820\u79cd\u4e3b\u8981\u8d27\u5e01\u4e4b\u95f4\u8fdb\u884c\u8f6c\u6362\u3002", cat: "UtilitiesApplication" },
  },
  ko: {
    calorie: { name: "\uce7c\ub85c\ub9ac \uacc4\uc0b0\uae30 - BMR, TDEE & \uc601\uc591\uc18c", desc: "\ubb34\ub8cc \uc628\ub77c\uc778 \uce7c\ub85c\ub9ac \uacc4\uc0b0\uae30: BMR, TDEE, BMI, \uc601\uc591\uc18c\ub97c \uacc4\uc0b0\ud569\ub2c8\ub2e4.", cat: "HealthApplication, Nutrition" },
    bmi: { name: "BMI \uacc4\uc0b0\uae30 - \uccb4\uc9c8\ub7c9\uc9c0\uc218", desc: "\ubb34\ub8cc BMI \uacc4\uc0b0\uae30: \uccb4\uc9c8\ub7c9\uc9c0\uc218\ub97c \uacc4\uc0b0\ud558\uace0 \uccb4\uc911 \uce74\ud14c\uace0\ub9ac\ub97c \ud655\uc778\ud558\uc138\uc694.", cat: "HealthApplication" },
    convert: { name: "\ub2e8\uc704 \ubcc0\ud658\uae30 - \uae38\uc774\u00b7\ubb34\uac8c\u00b7\uc628\ub3c4", desc: "\ubb34\ub8cc \ub2e8\uc704 \ubcc0\ud658\uae30: \uae38\uc774, \ubb34\uac8c, \uc628\ub3c4, \ubd80\ud53c, \uba74\uc801, \uc18d\ub3c4, \uc555\ub825.", cat: "UtilitiesApplication" },
    date: { name: "\ub0a0\uc9dc \uacc4\uc0b0\uae30 - \ub0a0\uc9dc \uac04\uaca9, D-Day", desc: "\ubb34\ub8cc \ub0a0\uc9dc \uacc4\uc0b0\uae30: \ub0a0\uc9dc \uac04\uaca9, D-Day, \ub098\uc774 \uacc4\uc0b0.", cat: "UtilitiesApplication" },
    photo: { name: "\uc0ac\uc9c4 \ud3b8\uc9d1\uae30 - \ub9ac\uc0ac\uc774\uc988\u00b7\uc790\ub974\uae30", desc: "\ubb34\ub8cc \uc628\ub77c\uc778 \uc0ac\uc9c4 \ud3b8\uc9d1\uae30.", cat: "MultimediaApplication" },
    qr: { name: "QR \ucf54\ub4dc \uc0dd\uc131\uae30 - \ubb34\ub8cc", desc: "\ubb34\ub8cc\ub85c QR \ucf54\ub4dc\ub97c \uc0dd\uc131\ud558\uc138\uc694.", cat: "UtilitiesApplication" },
    password: { name: "\ube44\ubc00\ubc88\ud638 \uc0dd\uc131\uae30 - \uac15\ub825\ud55c \ub79c\ub364", desc: "\uac15\ub825\ud558\uace0 \uc548\uc804\ud55c \ub79c\ub364 \ube44\ubc00\ubc88\ud638\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4.", cat: "SecurityApplication" },
    lotto: { name: "\ub85c\ub610 \ubc88\ud638 \uc0dd\uc131\uae30", desc: "\ub85c\ub610, \ud30c\uc6cc\ubcfc, \uba54\uac00\ubc00\ub9ac\uc5b8\uc988 \ubc88\ud638 \uc0dd\uc131.", cat: "EntertainmentApplication" },
    percent: { name: "\ud37c\uc13c\ud2b8 \uacc4\uc0b0\uae30 - \ubb34\ub8cc \uc628\ub77c\uc778", desc: "\ubb34\ub8cc \ud37c\uc13c\ud2b8 \uacc4\uc0b0\uae30. X\uc758 Y%, X\ub294 Y\uc758 \uba87% \uacc4\uc0b0, \ud37c\uc13c\ud2b8 \ubcc0\ud654.", cat: "UtilitiesApplication" },
    currency: { name: "\ud1b5\ud654 \ubcc0\ud658\uae30 - \ubb34\ub8cc \ud658\uc728 \uacc4\uc0b0\uae30", desc: "\ubb34\ub8cc \ud1b5\ud654 \ubcc0\ud658\uae30. 20\uac1c \uc8fc\uc694 \ud1b5\ud654 \uac04 \uc2e4\uc2dc\uac04 \ud658\uc728 \ubcc0\ud658.", cat: "UtilitiesApplication" },
  },
  pt: {
    calorie: { name: "Calculadora de Calorias - BMR, TDEE e Macros", desc: "Calculadora de calorias gratuita: calcule BMR, TDEE, IMC e macronutrientes.", cat: "HealthApplication, Nutrition" },
    bmi: { name: "Calculadora de IMC - \u00cdndice de Massa Corporal", desc: "Calculadora de IMC gratuita: calcule seu \u00cdndice de Massa Corporal.", cat: "HealthApplication" },
    convert: { name: "Conversor de Unidades - Comprimento, Peso", desc: "Conversor de unidades gratuito: comprimento, peso, temperatura.", cat: "UtilitiesApplication" },
    date: { name: "Calculadora de Datas - Dias Entre Datas", desc: "Calculadora de datas gratuita: calcule dias entre datas.", cat: "UtilitiesApplication" },
    photo: { name: "Editor de Fotos - Redimensionar, Cortar", desc: "Editor de fotos gratuito: redimensione, corte e comprima.", cat: "MultimediaApplication" },
    qr: { name: "Gerador de C\u00f3digo QR - Criador Gratuito", desc: "Gere c\u00f3digos QR gratuitamente.", cat: "UtilitiesApplication" },
    password: { name: "Gerador de Senhas - Senha Forte Aleat\u00f3ria", desc: "Gere senhas seguras e aleat\u00f3rias.", cat: "SecurityApplication" },
    lotto: { name: "Gerador de N\u00fameros da Loteria", desc: "Gere n\u00fameros de loteria aleat\u00f3rios.", cat: "EntertainmentApplication" },
    percent: { name: "Calculadora de Porcentagem - Gr\u00e1tis Online", desc: "Calculadora de porcentagem gratuita. Calcule X% de Y, X \u00e9 quantos % de Y.", cat: "UtilitiesApplication" },
    currency: { name: "Conversor de Moedas - Calculadora de C\u00e2mbio", desc: "Conversor de moedas gratuito entre 20 moedas principais.", cat: "UtilitiesApplication" },
  },
};

function getToolKey(pathname) {
  if (!pathname) return 'calorie';
  const p = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/').replace(/\/$/, '');
  const toolMap = { '/bmi': 'bmi', '/convert': 'convert', '/date': 'date', '/photo': 'photo', '/qr': 'qr', '/password': 'password', '/lotto': 'lotto', '/percent': 'percent', '/currency': 'currency' };
  return toolMap[p] || 'calorie';
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-url') || '';
  const toolKey = getToolKey(pathname);
  const t = tools[locale] || tools.en;
  const tool = t[toolKey] || t.calorie;

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.desc,
    applicationCategory: tool.cat,
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "hello-tools",
      url: "https://oxoxox1.com",
    },
  });

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson }}
          suppressHydrationWarning
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: 'var(--os9-bg)' }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}