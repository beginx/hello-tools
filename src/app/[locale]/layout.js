import "../../app/globals.css";
import { headers } from 'next/headers';
import { Analytics } from "@vercel/analytics/react";

const tools = {
  en: {
    calorie: { name: "Calorie Calculator - BMR, TDEE, BMI & Macro Calculator - Free Online", desc: "Free online calorie calculator: calculate BMR (Basal Metabolic Rate), TDEE (Total Daily Energy Expenditure), BMI, and macronutrients (protein, carbs, fat) for weight loss, weight maintenance or muscle gain. Uses Mifflin-St Jeor equation. Mac OS 9 retro style.", cat: "HealthApplication, Nutrition" },
    bmi: { name: "BMI Calculator - Body Mass Index Calculator - Free Online BMI Chart", desc: "Free online BMI calculator: calculate your Body Mass Index (BMI) using height and weight. Check your BMI category — underweight, normal, overweight, or obese. See healthy weight range and BMI chart. Color-coded gauge. Mac OS 9 retro style.", cat: "HealthApplication" },
    convert: { name: "Unit Converter - Length, Weight, Temperature, Volume, Area Converter", desc: "Free online unit converter: convert length (cm to inches, meters to feet, miles to km), weight (kg to lbs, ounces to grams), temperature (Celsius to Fahrenheit), volume (liters to gallons), area, speed, pressure. Easy bidirectional conversion.", cat: "UtilitiesApplication" },
    date: { name: "Date Calculator - Days Between Dates, D-Day Countdown, Age Calculator", desc: "Free online date calculator: calculate days between dates, D-Day countdown, add or subtract days from a date, calculate exact age in years months days, find anniversaries and due dates.", cat: "UtilitiesApplication" },
    photo: { name: "Photo Editor - Resize Image, Crop Photo, Compress JPEG PNG WebP Online Free", desc: "Free online photo editor: resize images, crop photos, compress JPEG PNG and WebP files. Reduce image file size without losing quality. Convert between image formats. Drag and drop, no upload required.", cat: "MultimediaApplication" },
    qr: { name: "QR Code Generator - Free Online QR Code Maker - Create QR Codes", desc: "Generate QR codes for free online. Enter URL, text, or phone number to create custom QR codes. Customize QR code size and error correction level. Download as high-quality PNG. No signup required.", cat: "UtilitiesApplication" },
    password: { name: "Password Generator - Strong Random Password Generator - Secure Passwords", desc: "Generate strong, secure random passwords instantly. Create complex passwords with uppercase letters, lowercase letters, numbers, and symbols. Password strength meter. Cryptographically secure random generation.", cat: "SecurityApplication" },
    lotto: { name: "Lottery Number Generator - Powerball, Mega Millions, EuroMillions Numbers", desc: "Generate random lottery numbers for Powerball, Mega Millions, EuroMillions, UK Lotto, and custom lottery games. Cryptographically secure random number generation. Multiple draws at once.", cat: "EntertainmentApplication" },
    percent: { name: "Percentage Calculator - Free Online Percent Calculator - % of Number", desc: "Free online percentage calculator. Calculate what is X% of Y, X is what percent of Y, percentage change between two numbers, percentage increase and decrease. Fast and accurate. Mac OS 9 retro style.", cat: "UtilitiesApplication" },
    currency: { name: "Currency Converter - Free Online Exchange Rate Calculator - Forex Converter", desc: "Free online currency converter. Convert between 20 major world currencies including USD, EUR, GBP, JPY, KRW, CNY, BRL with live exchange rates. Bidirectional conversion. Updated daily.", cat: "UtilitiesApplication" },
    random: { name: "Random Number Generator - Free Online Randomizer - Pick Random Numbers", desc: "Generate cryptographically secure random numbers within any range. Choose count, enable unique mode to prevent duplicates, sort results. Perfect for giveaways, raffles, and statistical sampling.", cat: "UtilitiesApplication" },
    text: { name: "Text Tools - Word Counter, Character Counter, Case Converter, Base64 Encode Decode", desc: "Free online text tools: count characters and words, convert text between uppercase and lowercase and title case, encode and decode Base64. Count sentences, paragraphs, and lines.", cat: "UtilitiesApplication" },
    timer: { name: "Stopwatch & Timer - Free Online Stopwatch and Countdown Timer - Lap Timer", desc: "Free online stopwatch and countdown timer. Measure elapsed time with lap recording and split times. Set a countdown timer with alarm. Mac OS 9 retro style. Works on mobile and desktop.", cat: "UtilitiesApplication" },
    discount: { name: "Discount Calculator - Percent Off Calculator - Free Online Savings Calculator", desc: "Free online discount calculator: calculate final price after percentage discount, savings amount you save, and percent off. Reverse discount calculation. Mac OS 9 retro style.", cat: "UtilitiesApplication" },
    loan: { name: "Loan Calculator - Free Online Loan Payment Calculator - EMI Calculator", desc: "Free online loan calculator: calculate monthly payment (EMI), total interest, and total payment for any loan. Supports personal loans, auto loans, student loans. Amortization schedule included. Mac OS 9 retro style.", cat: "FinanceApplication" },
    compound: { name: "Compound Interest Calculator - Free Online Investment Calculator - Savings Growth", desc: "Free online compound interest calculator: see how your investments and savings grow over time with monthly contributions. Calculate future value, total interest earned, and total contributions. Year-by-year breakdown table. Mac OS 9 retro style.", cat: "FinanceApplication" },
    mortgage: { name: "Mortgage Calculator - Free Home Loan Payment Calculator - Mortgage Estimator", desc: "Free online mortgage calculator: estimate your monthly mortgage payment including principal, interest, property taxes, and home insurance. Full 30-year amortization schedule. Calculate how much house you can afford. Mac OS 9 retro style.", cat: "FinanceApplication" },
    bodyfat: { name: "Body Fat Calculator - Body Fat Percentage Calculator - US Navy Method", desc: "Free online body fat calculator: estimate your body fat percentage using the U.S. Navy circumference method. Input height, neck, waist (and hip for women). Color-coded category chart shows essential fat, athlete, fitness, acceptable, and obese ranges.", cat: "HealthApplication" },
    fraction: { name: "Fraction Calculator - Add, Subtract, Multiply, Divide Fractions - Free Online", desc: "Free online fraction calculator: add fractions, subtract fractions, multiply fractions, and divide fractions. Simplifies results to lowest terms. Converts between improper fractions and mixed numbers. Shows decimal equivalent. Perfect for math homework help.", cat: "MathApplication" },
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
    random: { name: "Generador de N\u00fameros Aleatorios - Gratis", desc: "Generador de n\u00fameros aleatorios criptogr\u00e1ficamente seguros.", cat: "UtilitiesApplication" },
    text: { name: "Herramientas de Texto - Contador, Convertir, Base64", desc: "Herramientas de texto gratuitas: contar caracteres, convertir may\u00fasculas/min\u00fasculas, Base64.", cat: "UtilitiesApplication" },
    timer: { name: "Cron\u00f3metro y Temporizador - Cron\u00f3metro Online Gratuito", desc: "Cron\u00f3metro online gratuito y temporizador de cuenta atr\u00e1s con registro de vueltas.", cat: "UtilitiesApplication" },
    discount: { name: "Calculadora de Descuento - Calculadora de Porcentaje de Descuento Gratuita", desc: "Calculadora de descuento gratuita: calcule el precio final despu\u00e9s del descuento y la cantidad ahorrada. Mac OS 9 retro style.", cat: "UtilitiesApplication" },
    loan: { name: "Calculadora de Pr\u00e9stamos - Calculadora de Pago de Pr\u00e9stamo Gratuita", desc: "Calculadora de pr\u00e9stamos gratuita: calcule pagos mensuales, inter\u00e9s total y amortizaci\u00f3n para cualquier pr\u00e9stamo. Interfaz retro Mac OS 9.", cat: "FinanceApplication" },
    compound: { name: "Calculadora de Inter\u00e9s Compuesto - Calculadora de Inversi\u00f3n Gratuita", desc: "Calculadora de inter\u00e9s compuesto gratuita: vea c\u00f3mo crecen sus inversiones con aportes mensuales. Desglose anual, estilo retro Mac OS 9.", cat: "FinanceApplication" },
    mortgage: { name: "Calculadora de Hipoteca - Calculadora de Pago de Vivienda Gratuita", desc: "Calculadora de hipoteca gratuita: calcule pagos mensuales incluyendo capital, inter\u00e9s, impuestos y seguro. Tabla de amortizaci\u00f3n, estilo retro Mac OS 9.", cat: "FinanceApplication" },
    bodyfat: { name: "Calculadora de Grasa Corporal - Calculadora de Porcentaje de Grasa", desc: "Calculadora de grasa corporal gratuita: estime su porcentaje de grasa corporal usando el m\u00e9todo de la Armada de EE.UU. Gr\u00e1fico de categor\u00edas, estilo retro Mac OS 9.", cat: "HealthApplication" },
  fraction: { name: "Calculadora de Fracciones - Sumar, Restar, Multiplicar, Dividir Fracciones - Simplificar Fracciones", desc: "Calculadora de fracciones gratuita: sumar fracciones, restar fracciones, multiplicar fracciones y dividir fracciones. Simplifica resultados a la fracción irreducible. Convierte entre fracciones impropias y números mixtos. Muestra el equivalente decimal. Ideal para tareas de matemáticas.", cat: "MathApplication" },
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
    random: { name: "\u968f\u673a\u6570\u751f\u6210\u5668 - \u514d\u8d39\u5728\u7ebf", desc: "\u5728\u4efb\u610f\u8303\u56f4\u5185\u751f\u6210\u5bc6\u7801\u5b66\u5b89\u5168\u7684\u968f\u673a\u6570\u3002", cat: "UtilitiesApplication" },
    text: { name: "\u6587\u672c\u5de5\u5177 - \u5b57\u7b26\u8ba1\u6570\u3001\u5927\u5c0f\u5199\u8f6c\u6362\u3001Base64", desc: "\u514d\u8d39\u6587\u672c\u5de5\u5177\uff1a\u7edf\u8ba1\u5b57\u7b26\u548c\u5355\u8bcd\u3001\u8f6c\u6362\u5927\u5c0f\u5199\u3001Base64\u7f16\u7801/\u89e3\u7801\u3002", cat: "UtilitiesApplication" },
    timer: { name: "\u79d2\u8868\u548c\u8ba1\u65f6\u5668 - \u514d\u8d39\u5728\u7ebf\u79d2\u8868\u548c\u5012\u8ba1\u65f6", desc: "\u514d\u8d39\u5728\u7ebf\u79d2\u8868\u548c\u5012\u8ba1\u65f6\u5668\u3002\u8bb0\u5f55\u7ecf\u8fc7\u65f6\u95f4\u548c\u8ba1\u6b21\uff0c\u6216\u8bbe\u7f6e\u5012\u8ba1\u65f6\u3002", cat: "UtilitiesApplication" },
    discount: { name: "\u6298\u6263\u8ba1\u7b97\u5668 - \u514d\u8d39\u5728\u7ebf\u6298\u6263\u8ba1\u7b97\u5668", desc: "\u514d\u8d39\u5728\u7ebf\u6298\u6263\u8ba1\u7b97\u5668\uff1a\u8ba1\u7b97\u6298\u6263\u540e\u7684\u6700\u7ec8\u4ef7\u683c\u548c\u60a8\u8282\u7701\u7684\u91d1\u989d\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "UtilitiesApplication" },
    loan: { name: "\u8d37\u6b3e\u8ba1\u7b97\u5668 - \u514d\u8d39\u5728\u7ebf\u8d37\u6b3e\u8ba1\u7b97\u5668", desc: "\u514d\u8d39\u5728\u7ebf\u8d37\u6b3e\u8ba1\u7b97\u5668\uff1a\u8ba1\u7b97\u6bcf\u6708\u8fd8\u6b3e\u3001\u603b\u5229\u606f\u548c\u5206\u671f\u4ed8\u6b3e\u8868\u3002Mac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "FinanceApplication" },
    compound: { name: "\u590d\u5229\u8ba1\u7b97\u5668 - \u514d\u8d39\u5728\u7ebf\u6295\u8d44\u8ba1\u7b97\u5668", desc: "\u514d\u8d39\u590d\u5229\u8ba1\u7b97\u5668\uff1a\u67e5\u770b\u60a8\u7684\u6295\u8d44\u968f\u7740\u6708\u5b58\u800c\u589e\u957f\u7684\u60c5\u51b5\u3002\u5e74\u5ea6\u8be6\u7ec6\u62c6\u89e3\uff0cMac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "FinanceApplication" },
    mortgage: { name: "\u623f\u8d37\u8ba1\u7b97\u5668 - \u514d\u8d39\u5728\u7ebf\u623f\u5c4b\u8d37\u6b3e\u8ba1\u7b97\u5668", desc: "\u514d\u8d39\u623f\u8d37\u8ba1\u7b97\u5668\uff1a\u4f30\u7b97\u6bcf\u6708\u8fd8\u6b3e\u5305\u62ec\u672c\u91d1\u3001\u5229\u606f\u3001\u7a0e\u8d39\u548c\u4fdd\u9669\u3002\u5206\u671f\u4ed8\u6b3e\u8868\uff0cMac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "FinanceApplication" },
    bodyfat: { name: "\u4f53\u8102\u7387\u8ba1\u7b97\u5668 - \u4f53\u8102\u767e\u5206\u6bd4\u8ba1\u7b97\u5668", desc: "\u514d\u8d39\u4f53\u8102\u7387\u8ba1\u7b97\u5668\uff1a\u4f7f\u7528\u7f8e\u56fd\u6d77\u519b\u65b9\u6cd5\u4f30\u7b97\u60a8\u7684\u4f53\u8102\u7387\u3002\u989c\u8272\u7f16\u7801\u56fe\u8868\uff0cMac OS 9\u590d\u53e4\u98ce\u683c\u3002", cat: "HealthApplication" },
  fraction: { name: "分数计算器 - 分数加减乘除 - 在线分数化简器 - 带分数计算器", desc: "免费在线分数计算器：分数加法、分数减法、分数乘法、分数除法。自动将结果化简为最简分数。支持假分数和带分数互转。显示小数等效值。适合数学作业辅助。", cat: "MathApplication" },
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
    random: { name: "\ub79c\ub364 \uc22b\uc790 \uc0dd\uc131\uae30 - \ubb34\ub8cc", desc: "\uc784\uc758 \ubc94\uc704\uc5d0\uc11c \uc548\uc804\ud55c \ub79c\ub364 \uc22b\uc790\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4.", cat: "UtilitiesApplication" },
    text: { name: "\ud14d\uc2a4\ud2b8 \ub3c4\uad6c - \uae00\uc790\uc218, \ub300\uc18c\ubb38\uc790, Base64", desc: "\ubb34\ub8cc \ud14d\uc2a4\ud2b8 \ub3c4\uad6c: \uae00\uc790\uc218 \uacc4\uc0b0, \ub300\uc18c\ubb38\uc790 \ubcc0\ud658, Base64 \uc778\ucf54\ub529/\ub514\ucf54\ub529.", cat: "UtilitiesApplication" },
    timer: { name: "\uc2a4\ud1b1\uc6cc\uce58 & \ud0c0\uc774\uba38 - \ubb34\ub8cc \uc628\ub77c\uc778 \uc2a4\ud1b1\uc6cc\uce58", desc: "\ubb34\ub8cc \uc628\ub77c\uc778 \uc2a4\ud1b1\uc6cc\uce58 \ubc0f \uce74\uc6b4\ud2b8\ub2e4\uc6b4 \ud0c0\uc774\uba38. \ub7a9 \uae30\ub85d\uacfc \ud568\uaed8 \uacbd\uacfc \uc2dc\uac04 \uce21\uc815.", cat: "UtilitiesApplication" },
    discount: { name: "\ud560\uc778 \uacc4\uc0b0\uae30 - \ubb34\ub8cc \uc628\ub77c\uc778 \ud560\uc778\uc728 \uacc4\uc0b0\uae30", desc: "\ubb34\ub8cc \uc628\ub77c\uc778 \ud560\uc778 \uacc4\uc0b0\uae30: \ud560\uc778 \ud6c4 \ucd5c\uc885 \uac00\uaca9\uacfc \uc808\uc57d \uae08\uc561\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. Mac OS 9 \ubcf5\uace0 \uc2a4\ud0c0\uc77c.", cat: "UtilitiesApplication" },
    loan: { name: "\ub300\ucd9c \uacc4\uc0b0\uae30 - \ubb34\ub8cc \uc628\ub77c\uc778 \ub300\ucd9c \uacc4\uc0b0\uae30", desc: "\ubb34\ub8cc \uc628\ub77c\uc778 \ub300\ucd9c \uacc4\uc0b0\uae30: \uc6d4 \uc0c1\ud658\uc561, \ucd1d \uc774\uc790\ub97c \uacc4\uc0b0\ud569\ub2c8\ub2e4. Mac OS 9 \ubcf5\uace0 \uc2a4\ud0c0\uc77c.", cat: "FinanceApplication" },
    compound: { name: "\ubcf5\ub9ac \uacc4\uc0b0\uae30 - \ubb34\ub8cc \uc628\ub77c\uc778 \ud22c\uc790 \uacc4\uc0b0\uae30", desc: "\ubb34\ub8cc \ubcf5\ub9ac \uacc4\uc0b0\uae30: \uc6d4 \uc801\uae08\uc73c\ub85c \ubaa9\ub3c8\uc774 \uc5bc\ub9c8\ub098 \ubd88\ub9ac\ub294\uc9c0 \ud655\uc778\ud558\uc138\uc694. \ub144\ub3c4\ubcc4 \uc0c1\uc138 \ub0b4\uc5ed. Mac OS 9 \ubcf5\uace0 \uc2a4\ud0c0\uc77c.", cat: "FinanceApplication" },
    mortgage: { name: "\uc8fc\ud0dd\ub2f4\ubcf4 \ub300\ucd9c \uacc4\uc0b0\uae30 - \ubb34\ub8cc \uc628\ub77c\uc778 \uc8fc\ud0dd\ub2f4\ubcf4 \uacc4\uc0b0\uae30", desc: "\ubb34\ub8cc \uc8fc\ud0dd\ub2f4\ubcf4 \ub300\ucd9c \uacc4\uc0b0\uae30: \uc6d4 \uc0c1\ud658\uc561, \uc774\uc790, \uc7ac\uc0b0\uc138, \ubcf4\ud5d8\ub8cc\ub97c \ud3ec\ud568\ud55c \uacc4\uc0b0. \uc0c1\ud658 \uc77c\uc815\ud45c, Mac OS 9 \ubcf5\uace0 \uc2a4\ud0c0\uc77c.", cat: "FinanceApplication" },
    bodyfat: { name: "\uccb4\uc9c0\ubc29\uc728 \uacc4\uc0b0\uae30 - \uccb4\uc9c0\ubc29 \ubc31\ubd84\uc728 \uacc4\uc0b0\uae30", desc: "\ubb34\ub8cc \uccb4\uc9c0\ubc29\uc728 \uacc4\uc0b0\uae30: \ubbf8\uad6d \ud574\uad70 US Navy \ubc29\uc2dd\uc73c\ub85c \uccb4\uc9c0\ubc29\uc728\uc744 \ucd94\uc815\ud569\ub2c8\ub2e4. \uac83\ub0b4 \uc2e4\ud328 \uc0c9\uc0c1 \uce74\ud14c\uace0\ub9ac\ud45c, Mac OS 9 \ubcf5\uace0 \uc2a4\ud0c0\uc77c.", cat: "HealthApplication" },
  fraction: { name: "분수 계산기 - 분수 덧셈, 뺄셈, 곱셈, 나눗셈 - 분수 약분 계산기", desc: "무료 온라인 분수 계산기: 분수 더하기, 분수 빼기, 분수 곱하기, 분수 나누기. 결과를 자동으로 기약분수로 약분합니다. 가분수와 대분수 변환을 지원합니다. 소수 형태도 함께 표시합니다. 수학 숙제에 완벽한 도구입니다.", cat: "MathApplication" },
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
    random: { name: "Gerador de N\u00fameros Aleat\u00f3rios - Gr\u00e1tis", desc: "Gere n\u00fameros aleat\u00f3rios criptograficamente seguros.", cat: "UtilitiesApplication" },
    text: { name: "Ferramentas de Texto - Contador, Converter, Base64", desc: "Ferramentas de texto gratuitas: contar caracteres, converter mai\u00fasculas/min\u00fasculas, Base64.", cat: "UtilitiesApplication" },
    timer: { name: "Cron\u00f4metro e Temporizador - Cron\u00f4metro Online Gr\u00e1tis", desc: "Cron\u00f4metro online gratuito e temporizador de contagem regressiva com registro de voltas.", cat: "UtilitiesApplication" },
    discount: { name: "Calculadora de Desconto - Calculadora de Desconto Percentual Gr\u00e1tis", desc: "Calculadora de desconto gratuita: calcule o pre\u00e7o final ap\u00f3s o desconto e o valor economizado. Mac OS 9 retro style.", cat: "UtilitiesApplication" },
    loan: { name: "Calculadora de Empr\u00e9stimo - Calculadora de Pagamento de Empr\u00e9stimo Gratuita", desc: "Calculadora de empr\u00e9stimo gratuita: calcule pagamentos mensais, juros totais e amortiza\u00e7\u00e3o para qualquer empr\u00e9stimo. Interface retro Mac OS 9.", cat: "FinanceApplication" },
    compound: { name: "Calculadora de Juros Compostos - Calculadora de Investimento Gratuita", desc: "Calculadora de juros compostos gratuita: veja como seus investimentos crescem com contribui\u00e7\u00f5es mensais. Detalhamento anual, estilo retro Mac OS 9.", cat: "FinanceApplication" },
    mortgage: { name: "Calculadora de Hipoteca - Calculadora de Pagamento de Im\u00f3vel Gratuita", desc: "Calculadora de hipoteca gratuita: calcule pagamentos mensais incluindo principal, juros, impostos e seguro. Tabela de amortiza\u00e7\u00e3o, estilo retro Mac OS 9.", cat: "FinanceApplication" },
    bodyfat: { name: "Calculadora de Gordura Corporal - Calculadora de Percentual de Gordura", desc: "Calculadora de gordura corporal gratuita: estime seu percentual de gordura usando o m\u00e9todo da Marinha dos EUA. Gr\u00e1fico de categorias, estilo retro Mac OS 9.", cat: "HealthApplication" },
    fraction: { name: "Calculadora de Fra\u00e7\u00f5es - Somar, Subtrair, Multiplicar, Dividir Fra\u00e7\u00f5es - Simplificar Fra\u00e7\u00f5es", desc: "Calculadora de fra\u00e7\u00f5es gratuita: somar fra\u00e7\u00f5es, subtrair fra\u00e7\u00f5es, multiplicar fra\u00e7\u00f5es e dividir fra\u00e7\u00f5es. Simplifica resultados para a fra\u00e7\u00e3o irredut\u00edvel. Converte entre fra\u00e7\u00f5es impr\u00f3prias e n\u00fameros mistos. Mostra o equivalente decimal. Ideal para li\u00e7\u00f5es de matem\u00e1tica.", cat: "MathApplication" },
  }
};

function getToolKey(pathname) {
  if (!pathname) return 'calorie';
  const p = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/').replace(/\/$/, '');
  const toolMap = { '/bmi': 'bmi', '/convert': 'convert', '/date': 'date', '/photo': 'photo', '/qr': 'qr', '/password': 'password', '/lotto': 'lotto', '/percent': 'percent', '/currency': 'currency', '/random': 'random', '/text': 'text', '/timer': 'timer', '/discount': 'discount', '/loan': 'loan', '/compound': 'compound', '/mortgage': 'mortgage', '/bodyfat': 'bodyfat', '/fraction': 'fraction' };
  return toolMap[p] || 'calorie';
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}