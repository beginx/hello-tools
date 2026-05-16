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
    coinflip: { name: "Coin Flip - Virtual Coin Toss", desc: "Free online coin flip: flip a virtual coin with true random results. Perfect for decision making, games, and probability experiments. Mac OS 9 retro style.", cat: "EntertainmentApplication" },
    dice: { name: "Dice Roller - D4, D6, D8, D10, D12, D20", desc: "Free online dice roller: roll D4, D6, D8, D10, D12, D20, and D100 with true random results. Perfect for Dungeons &amp; Dragons, RPGs, and board games. Mac OS 9 retro style.", cat: "EntertainmentApplication" },
    ratio: { name: "Ratio Calculator - Simplify &amp; Find Missing Values", desc: "Free online ratio calculator: simplify ratios to their lowest terms or find missing values in proportions (A:B = C:D). Perfect for math homework, recipe scaling, and financial calculations. Mac OS 9 retro style.", cat: "UtilitiesApplication" },
    speed: { name: "Speed Calculator - Distance, Time &amp; Velocity", desc: "Free online speed calculator: calculate speed, distance, or time. Enter any two values to find the third. Perfect for travel, physics, and everyday use. Mac OS 9 retro style.", cat: "UtilitiesApplication" },
    ohm: { name: "Ohm's Law Calculator - Voltage, Current, Resistance", desc: "Free online Ohm's Law calculator: calculate voltage (V), current (I), resistance (R), and power (P). Enter any two values to find the others. Perfect for electronics, circuit design, and physics. Mac OS 9 retro style.", cat: "UtilitiesApplication" },
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
    coinflip: { name: "Lanzar Moneda - Lanzamiento Virtual", desc: "Lanzamiento de moneda virtual gratuito con resultados aleatorios. Perfecto para tomar decisiones, juegos y experimentos de probabilidad. Estilo retro Mac OS 9.", cat: "EntertainmentApplication" },
    dice: { name: "Lanzar Dados - D4, D6, D8, D10, D12, D20", desc: "Tirador de dados virtual gratuito: lanza D4, D6, D8, D10, D12, D20 y D100. Perfecto para D&amp;D y juegos de rol. Estilo retro Mac OS 9.", cat: "EntertainmentApplication" },
    ratio: { name: "Calculadora de Razones - Simplificar &amp; Encontrar Valores", desc: "Calculadora de razones gratuita: simplifica razones o encuentra valores faltantes en proporciones. Perfecta para matem\u00e1ticas y recetas. Estilo retro Mac OS 9.", cat: "UtilitiesApplication" },
    speed: { name: "Calculadora de Velocidad - Distancia y Tiempo", desc: "Calculadora de velocidad gratuita: calcule velocidad, distancia o tiempo. Ingrese dos valores para encontrar el tercero. Estilo retro Mac OS 9.", cat: "UtilitiesApplication" },
    ohm: { name: "Calculadora de Ley de Ohm - Voltaje, Corriente, Resistencia", desc: "Calculadora de Ley de Ohm gratuita: calcule voltaje (V), corriente (I), resistencia (R) y potencia (P). Ingrese dos valores para encontrar los otros. Estilo retro Mac OS 9.", cat: "UtilitiesApplication" },
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
    coinflip: { name: "\u629b\u786c\u5e01 - \u865a\u62df\u786c\u5e01\u629b\u6295", desc: "\u514d\u8d39\u5728\u7ebf\u629b\u786c\u5e01\uff1a\u771f\u5b9e\u968f\u673a\u7ed3\u679c\u3002\u9002\u5408\u505a\u51b3\u5b9a\u3001\u6e38\u620f\u548c\u6982\u7387\u5b9e\u9a8c\u3002Mac OS 9 \u590d\u53e4\u98ce\u683c\u3002", cat: "EntertainmentApplication" },
    dice: { name: "\u63b7\u9ab0\u5b50 - D4, D6, D8, D10, D12, D20", desc: "\u514d\u8d39\u63b7\u9ab0\u5b50\uff1aD4\u3001D6\u3001D8\u3001D10\u3001D12\u3001D20\u548cD100\uff0c\u771f\u5b9e\u968f\u673a\u7ed3\u679c\u3002\u9002\u5408D&amp;D\u548c\u89d2\u8272\u626e\u6f14\u6e38\u620f\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "EntertainmentApplication" },
    ratio: { name: "\u6bd4\u4f8b\u8ba1\u7b97\u5668 - \u7b80\u5316&amp;\u67e5\u627e\u7f3a\u5931\u503c", desc: "\u514d\u8d39\u5728\u7ebf\u6bd4\u4f8b\u8ba1\u7b97\u5668\uff1a\u7b80\u5316\u6bd4\u4f8b\u6216\u67e5\u627e\u7f3a\u5931\u503c\u3002\u9002\u5408\u6570\u5b66\u4f5c\u4e1a\u3001\u98df\u8c31\u7f29\u653e\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "UtilitiesApplication" },
    speed: { name: "\u901f\u5ea6\u8ba1\u7b97\u5668 - \u8ddd\u79bb\u3001\u65f6\u95f4\u548c\u901f\u5ea6", desc: "\u514d\u8d39\u5728\u7ebf\u901f\u5ea6\u8ba1\u7b97\u5668\uff1a\u8ba1\u7b97\u901f\u5ea6\u3001\u8ddd\u79bb\u6216\u65f6\u95f4\u3002\u8f93\u5165\u4efb\u610f\u4e24\u4e2a\u503c\u5bfb\u627e\u7b2c\u4e09\u4e2a\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "UtilitiesApplication" },
    ohm: { name: "\u6b27\u59c6\u5b9a\u5f8b\u8ba1\u7b97\u5668 - \u7535\u538b\u3001\u7535\u6d41\u3001\u7535\u963b", desc: "\u514d\u8d39\u6b27\u59c6\u5b9a\u5f8b\u8ba1\u7b97\u5668\uff1a\u8ba1\u7b97\u7535\u538b(V)\u3001\u7535\u6d41(I)\u3001\u7535\u963b(R)\u548c\u529f\u7387(P)\u3002\u8f93\u5165\u4efb\u610f\u4e24\u4e2a\u503c\u627e\u51fa\u5176\u4ed6\u503c\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "UtilitiesApplication" },
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
    coinflip: { name: "\ub3d9\uc804 \ub354\uc9c0\uae30 - \uac00\uc0c1 \ub3d9\uc804 \ud1a0\uc2a4", desc: "\ubb34\ub8cc \uc628\ub77c\uc778 \ub3d9\uc804 \ub354\uc9c0\uae30: \uc9c4\uc815\ud55c \ubb34\uc791\uc704 \uacb0\uacfc. \uacb0\uc815, \uac8c\uc784, \ud655\ub960 \uc2e4\ud5d8\uc5d0 \uc644\ubcbd\ud569\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.", cat: "EntertainmentApplication" },
    dice: { name: "\uc8fc\uc0ac\uc704 \uad6c\ub9ac\uae30 - D4, D6, D8, D10, D12, D20", desc: "\ubb34\ub8cc \uc8fc\uc0ac\uc704 \uad6c\ub9ac\uae30: D4, D6, D8, D10, D12, D20, D100\uc744 \uc9c4\uc815\ud55c \ubb34\uc791\uc704\ub85c \uad6c\ub9bd\ub2c8\ub2e4. D&amp;D\uc640 RPG\uc5d0 \uc644\ubcbd\ud569\ub2c8\ub2e4.", cat: "EntertainmentApplication" },
    ratio: { name: "\ube44\uc728 \uacc4\uc0b0\uae30 - \ube44\uc728 \ub2e8\uc21c\ud654 &amp; \ube44\ub840\uac12 \ucc3e\uae30", desc: "\ubb34\ub8cc \ube44\uc728 \uacc4\uc0b0\uae30: \ube44\uc728\uc744 \ub2e8\uc21c\ud654\ud558\uac70\ub098 \ube44\ub840\uc2dd\uc5d0\uc11c \ub204\ub77d\ub41c \uac12\uc744 \ucc3e\uc2b5\ub2c8\ub2e4. \uc218\ud559 \uc219\uc81c\uc640 \uc694\ub9ac\uc5d0 \uc644\ubcbd\ud569\ub2c8\ub2e4.", cat: "UtilitiesApplication" },
    speed: { name: "\uc18d\ub3c4 \uacc4\uc0b0\uae30 - \uac70\ub9ac, \uc2dc\uac04, \uc18d\ub3c4", desc: "\ubb34\ub8cc \uc18d\ub3c4 \uacc4\uc0b0\uae30: \uc18d\ub3c4, \uac70\ub9ac, \uc2dc\uac04\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. \ub450 \uac12\uc744 \uc785\ub825\ud558\uba74 \ub098\uba38\uc9c0\ub97c \ucc3e\uc544\ub4dc\ub9bd\ub2c8\ub2e4.", cat: "UtilitiesApplication" },
    ohm: { name: "\uc62c\uc758 \ubc95\uce59 \uacc4\uc0b0\uae30 - \uc804\uc559, \uc804\ub958, \uc800\ud56d", desc: "\ubb34\ub8cc \uc628\ub77c\uc778 \uc62c\uc758 \ubc95\uce59 \uacc4\uc0b0\uae30: \uc804\uc559(V), \uc804\ub958(I), \uc800\ud56d(R), \uc804\ub825(P)\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. \ub450 \uac12\uc744 \uc785\ub825\ud558\uba74 \ub098\uba38\uc9c0\ub97c \ucc3e\uc544\ub4dc\ub9bd\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.", cat: "UtilitiesApplication" },
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
    coinflip: { name: "Jogar Moeda - Lan\u00e7amento Virtual", desc: "Jogue uma moeda virtual gratuita com resultados aleat\u00f3rios. Perfeito para tomar decis\u00f5es, jogos e experimentos de probabilidade. Estilo retro Mac OS 9.", cat: "EntertainmentApplication" },
    dice: { name: "Rolar Dados - D4, D6, D8, D10, D12, D20", desc: "Rolador de dados virtual: role D4, D6, D8, D10, D12, D20 e D100. Perfeito para D&amp;D e RPGs. Estilo retro Mac OS 9.", cat: "EntertainmentApplication" },
    ratio: { name: "Calculadora de Propor\u00e7\u00f5es - Simplificar &amp; Encontrar Valores", desc: "Calculadora de propor\u00e7\u00f5es gratuita: simplifique propor\u00e7\u00f5es ou encontre valores faltantes. Perfeita para matem\u00e1tica e receitas. Estilo retro Mac OS 9.", cat: "UtilitiesApplication" },
    speed: { name: "Calculadora de Velocidade - Dist\u00e2ncia e Tempo", desc: "Calculadora de velocidade gratuita: calcule velocidade, dist\u00e2ncia ou tempo. Insira dois valores para encontrar o terceiro. Estilo retro Mac OS 9.", cat: "UtilitiesApplication" },
    ohm: { name: "Calculadora de Lei de Ohm - Tens\u00e3o, Corrente, Resist\u00eancia", desc: "Calculadora de Lei de Ohm gratuita: calcule tens\u00e3o (V), corrente (I), resist\u00eancia (R) e pot\u00eancia (P). Insira dois valores para encontrar os outros. Estilo retro Mac OS 9.", cat: "UtilitiesApplication" },
  },
};

function getToolKey(pathname) {
  if (!pathname) return 'calorie';
  const p = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/').replace(/\/$/, '');
  const toolMap = { '/bmi': 'bmi', '/convert': 'convert', '/date': 'date', '/photo': 'photo', '/qr': 'qr', '/password': 'password', '/lotto': 'lotto', '/ohm': 'ohm', '/coinflip': 'coinflip', '/dice': 'dice', '/ratio': 'ratio', '/speed': 'speed' };
  return toolMap[p] || 'calorie';  // calorie is default landing page
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
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8178172082493004`}
          crossOrigin="anonymous"
        />
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
        <script dangerouslySetInnerHTML={{
          __html: `(adsbygoogle = window.adsbygoogle || []).push({});`
        }} />
      </body>
    </html>
  );
}