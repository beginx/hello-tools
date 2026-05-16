import json, os, re

LOCALES = ['en', 'es', 'zh', 'ko', 'pt']

# Define 5 tools with their messages and SEO descriptions
TOOLS = {
    'tdee': {
        'keys': {
            'title': ['TDEE Calculator', 'Calculadora de TDEE', 'TDEE计算器', 'TDEE 계산기', 'Calculadora de TDEE'],
            'gender': ['Gender', 'G\u00e9nero', '性别', '\uc131\ubcc4', 'G\u00eanero'],
            'male': ['Male', 'Masculino', '男性', '\ub0a8\uc131', 'Masculino'],
            'female': ['Female', 'Femenino', '女性', '\uc5ec\uc131', 'Feminino'],
            'age': ['Age (years)', 'Edad (a\u00f1os)', '年龄', '\ub098\uc774(\uc138)', 'Idade (anos)'],
            'weight': ['Weight (kg)', 'Peso (kg)', '体重(kg)', '\uccb4\uc911(kg)', 'Peso (kg)'],
            'height': ['Height (cm)', 'Altura (cm)', '身高(cm)', '\ud0a4(cm)', 'Altura (cm)'],
            'activity': ['Activity Level', 'Nivel de Actividad', '活动水平', '\ud65c\ub3d9\ub7c9', 'N\u00edvel de Atividade'],
            'sedentary': ['Sedentary (little/no exercise)', 'Sedentario (poco ejercicio)', '久坐(很少运动)', '\uc88c\uc6a9(uc6b4\ub3d9 \uac70\uc758 \uc5c6\uc74c)', 'Sedent\u00e1rio (pouco exerc\u00edcio)'],
            'light': ['Light (1-3 days/week)', 'Ligero (1-3 d\u00edas/semana)', '轻度(1-3天/周)', '\uac00\ubcbc\uc6b4(uc8fc 1-3\uc77c)', 'Leve (1-3 dias/semana)'],
            'moderate': ['Moderate (3-5 days/week)', 'Moderado (3-5 d\u00edas/semana)', '中度(3-5天/周)', '\uc911\ub4f1(uc8fc 3-5\uc77c)', 'Moderado (3-5 dias/semana)'],
            'active': ['Active (6-7 days/week)', 'Activo (6-7 d\u00edas/semana)', '活跃(6-7天/周)', '\uc801\uadf9\uc801(uc8fc 6-7\uc77c)', 'Ativo (6-7 dias/semana)'],
            'extra': ['Extra Active (athlete/physical job)', 'Extra Activo (atleta/trabajo f\u00edsico)', '高强度(运动员/体力劳动)', '\ub9e4\uc6b0 \uc801\uadf9\uc801(uc6b4\ub3d9\uc120\uc218/\uc721\uccb4\ub85d)', 'Extra Ativo (atleta/trabalho f\u00edsico)'],
            'calculate': ['Calculate TDEE', 'Calcular TDEE', '计算TDEE', 'TDEE \uacc4\uc0b0', 'Calcular TDEE'],
            'results': ['Your Results', 'Tus Resultados', '你的结果', '\uacb0\uacfc', 'Seus Resultados'],
            'bmrLabel': ['BMR (Basal Metabolic Rate)', 'BMR (Tasa Metab\u00f3lica Basal)', 'BMR(基础代谢率)', 'BMR(\uae30\ucd08\ub300\uc0ac\ub7c9)', 'BMR (Taxa Metab\u00f3lica Basal)'],
            'tdeeLabel': ['TDEE (Total Daily Energy Expenditure)', 'TDEE (Gasto Energ\u00e9tico Total)', 'TDEE(每日总能量消耗)', 'TDEE(\ucd1d \uc5d0\ub108\uc9c0 \uc18c\ube44\ub7c9)', 'TDEE (Gasto Energ\u00e9tico Total)'],
            'clear': ['Clear', 'Limpiar', '清除', '\uc9c0\uc6b0\uae30', 'Limpar'],
            'seoDescription': [
                'Free online TDEE calculator: calculate your Total Daily Energy Expenditure, BMR, and recommended calorie intake for weight loss, maintenance, or muscle gain. Uses Mifflin-St Jeor equation. Mac OS 9 retro style.',
                'Calculadora de TDEE gratuita: calcule su Gasto Energ\u00e9tico Total, BMR y consumo cal\u00f3rico recomendado. Estilo retro Mac OS 9.',
                '免费在线TDEE计算器：计算您的每日总能量消耗、BMR和推荐热量摄入。Mac OS 9复古风格。',
                '\ubb34\ub8cc \uc628\ub77c\uc778 TDEE \uacc4\uc0b0\uae30: \ucd1d \uc5d0\ub108\uc9c0 \uc18c\ube44\ub7c9, BMR, \uad8c\uc7a5 \uce7c\ub85c\ub9ac \uc12d\ucde8\ub7c9\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.',
                'Calculadora de TDEE gratuita: calcule seu Gasto Energ\u00e9tico Total, BMR e ingest\u00e3o cal\u00f3rica recomendada. Estilo retro Mac OS 9.'
            ]
        }
    },
    'calorieburn': {
        'keys': {
            'title': ['Calorie Burn Calculator', 'Calculadora de Calor\u00edas Quemadas', '卡路里消耗计算器', '\uce7c\ub85c\ub9ac \uc18c\ubaa8 \uacc4\uc0b0\uae30', 'Calculadora de Calorias Queimadas'],
            'weight': ['Weight (kg)', 'Peso (kg)', '体重(kg)', '\uccb4\uc911(kg)', 'Peso (kg)'],
            'duration': ['Duration (minutes)', 'Duraci\u00f3n (minutos)', '时长(分钟)', '\uc2dc\uac04(\ubd84)', 'Dura\u00e7\u00e3o (minutos)'],
            'activity': ['Activity', 'Actividad', '活动', '\ud65c\ub3d9', 'Atividade'],
            'running': ['Running (8 km/h)', 'Correr (8 km/h)', '跑步(8公里/小时)', '\ub2ec\ub9ac\uae30(8km/h)', 'Correr (8 km/h)'],
            'walking': ['Walking (5 km/h)', 'Caminar (5 km/h)', '步行(5公里/小时)', '\uac77\uae30(5km/h)', 'Caminhar (5 km/h)'],
            'cycling': ['Cycling (moderate)', 'Ciclismo (moderado)', '骑行(中等)', '\uc790\uc804\uac70(\uc911\ub4f1)', 'Ciclismo (moderado)'],
            'swimming': ['Swimming (moderate)', 'Nataci\u00f3n (moderada)', '游泳(中等)', '\uc218\uc601(\uc911\ub4f1)', 'Nata\u00e7\u00e3o (moderada)'],
            'yoga': ['Yoga', 'Yoga', '瑜伽', '\uc694\uac00', 'Yoga'],
            'jumping': ['Jump Rope', 'Saltar Cuerda', '跳绳', '\uc904\ub118\uae30', 'Pular Corda'],
            'weightlifting': ['Weight Lifting', 'Levantamiento de Pesas', '举重', '\uc6e8\uc774\ud2b8 \ub9ac\ud551', 'Levantamento de Peso'],
            'calculate': ['Calculate Burn', 'Calcular Quema', '计算消耗', '\uc18c\ubaa8\ub7c9 \uacc4\uc0b0', 'Calcular Queima'],
            'results': ['Results', 'Resultados', '结果', '\uacb0\uacfc', 'Resultados'],
            'caloriesBurned': ['Calories Burned', 'Calor\u00edas Quemadas', '消耗的卡路里', '\uc18c\ubaa8\ub41c \uce7c\ub85c\ub9ac', 'Calorias Queimadas'],
            'durationLabel': ['Duration', 'Duraci\u00f3n', '时长', '\uc2dc\uac04', 'Dura\u00e7\u00e3o'],
            'clear': ['Clear', 'Limpiar', '清除', '\uc9c0\uc6b0\uae30', 'Limpar'],
            'seoDescription': [
                'Free online calorie burn calculator: estimate calories burned during running, walking, cycling, swimming, yoga, jump rope, and weight lifting. Based on MET values. Perfect for fitness tracking. Mac OS 9 retro style.',
                'Calculadora gratuita de calor\u00edas quemadas: estime las calor\u00edas quemadas en diversos ejercicios. Estilo retro Mac OS 9.',
                '免费在线卡路里消耗计算器：估算跑步、步行、骑行、游泳等运动的卡路里消耗。Mac OS 9复古风格。',
                '\ubb34\ub8cc \uce7c\ub85c\ub9ac \uc18c\ubaa8 \uacc4\uc0b0\uae30: \ub2ec\ub9ac\uae30, \uac77\uae30, \uc790\uc804\uac70, \uc218\uc601 \ub4f1 \uc6b4\ub3d9\ubcc4 \uce7c\ub85c\ub9ac \uc18c\ubaa8\ub7c9\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.',
                'Calculadora gratuita de calorias queimadas: estime calorias queimadas em diversos exerc\u00edcios. Estilo retro Mac OS 9.'
            ]
        }
    },
    'duedate': {
        'keys': {
            'title': ['Pregnancy Due Date Calculator', 'Calculadora de Fecha de Parto', '预产期计算器', '\ucd9c\uc0b0\uc608\uc815\uc77c \uacc4\uc0b0\uae30', 'Calculadora de Data de Parto'],
            'lmp': ['First day of last menstrual period', 'Primer d\u00eda del \u00faltimo per\u00edodo', '末次月经第一天', '\ub9c8\uc9c0\ub9c9 \uc0dd\ub9ac \uc2dc\uc791\uc77c', 'Primeiro dia do \u00faltimo per\u00edodo menstrual'],
            'cycleLength': ['Cycle length (days)', 'Duraci\u00f3n del ciclo (d\u00edas)', '周期长度(天)', '\uc0dd\ub9ac \uc8fc\uae30(\uc77c)', 'Dura\u00e7\u00e3o do ciclo (dias)'],
            'calculate': ['Calculate Due Date', 'Calcular Fecha de Parto', '计算预产期', '\ucd9c\uc0b0\uc608\uc815\uc77c \uacc4\uc0b0', 'Calcular Data de Parto'],
            'results': ['Estimated Due Date', 'Fecha Probable de Parto', '预产期', '\uc608\uc815 \ucd9c\uc0b0\uc77c', 'Data Prov\u00e1vel do Parto'],
            'conception': ['Estimated Conception Date', 'Fecha de Concepci\u00f3n', '受孕日期', '\uc218\uc815 \uc608\uc815\uc77c', 'Data de Concep\u00e7\u00e3o Estimada'],
            'weeksPregnant': ['Current Weeks Pregnant', 'Semanas de Embarazo Actuales', '当前怀孕周数', '\ud604\uc7ac \uc784\uc2e0 \uc8fc\ucc28', 'Semanas de Gravidez Atuais'],
            'trimester': ['Current Trimester', 'Trimestre Actual', '当前孕期', '\ud604\uc7ac \ubd84\uba74\uae30', 'Trimestre Atual'],
            'firstTri': ['First Trimester (Weeks 1-13)', 'Primer Trimestre (Semanas 1-13)', '孕早期(1-13周)', '\ucd08\uae30(\uc8fc 1-13)', 'Primeiro Trimestre (Semanas 1-13)'],
            'secondTri': ['Second Trimester (Weeks 14-27)', 'Segundo Trimestre (Semanas 14-27)', '孕中期(14-27周)', '\uc911\uae30(\uc8fc 14-27)', 'Segundo Trimestre (Semanas 14-27)'],
            'thirdTri': ['Third Trimester (Weeks 28-40)', 'Tercer Trimestre (Semanas 28-40)', '孕晚期(28-40周)', '\ub9d0\uae30(\uc8fc 28-40)', 'Terceiro Trimestre (Semanas 28-40)'],
            'clear': ['Clear', 'Limpiar', '清除', '\uc9c0\uc6b0\uae30', 'Limpar'],
            'seoDescription': [
                'Free online pregnancy due date calculator: estimate your due date, conception date, and current pregnancy week using Naegele\'s rule. Track your trimester and pregnancy progress. Mac OS 9 retro style.',
                'Calculadora gratuita de fecha de parto: estime su fecha de parto y semanas de embarazo. Estilo retro Mac OS 9.',
                '免费在线预产期计算器：使用Naegele规则估算预产期、受孕日期和当前孕周。Mac OS 9复古风格。',
                '\ubb34\ub8cc \ucd9c\uc0b0\uc608\uc815\uc77c \uacc4\uc0b0\uae30: Naegele \uaddc\uce59\uc744 \uc774\uc6a9\ud55c \ucd9c\uc0b0\uc608\uc815\uc77c, \uc218\uc815\uc77c, \ud604\uc7ac \uc784\uc2e0 \uc8fc\ucc28\ub97c \uacc4\uc0b0\ud569\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.',
                'Calculadora gratuita de data de parto: estime sua data de parto e semanas de gravidez. Estilo retro Mac OS 9.'
            ]
        }
    },
    'ovulation': {
        'keys': {
            'title': ['Ovulation Calculator', 'Calculadora de Ovulaci\u00f3n', '排卵期计算器', '\ubc30\ub780\uc77c \uacc4\uc0b0\uae30', 'Calculadora de Ovula\u00e7\u00e3o'],
            'lmp': ['First day of last period', 'Primer d\u00eda del \u00faltimo per\u00edodo', '末次月经第一天', '\ub9c8\uc9c0\ub9c9 \uc0dd\ub9ac \uc2dc\uc791\uc77c', 'Primeiro dia do \u00faltimo per\u00edodo'],
            'cycleLength': ['Cycle length (days)', 'Duraci\u00f3n del ciclo (d\u00edas)', '周期长度(天)', '\uc0dd\ub9ac \uc8fc\uae30(\uc77c)', 'Dura\u00e7\u00e3o do ciclo (dias)'],
            'periodLength': ['Period length (days)', 'Duraci\u00f3n del per\u00edodo (d\u00edas)', '经期长度(天)', '\uc0dd\ub9ac \uae30\uac04(\uc77c)', 'Dura\u00e7\u00e3o do per\u00edodo (dias)'],
            'calculate': ['Calculate Ovulation', 'Calcular Ovulaci\u00f3n', '计算排卵期', '\ubc30\ub780\uc77c \uacc4\uc0b0', 'Calcular Ovula\u00e7\u00e3o'],
            'results': ['Your Fertile Window', 'Tu Ventana F\u00e9rtil', '你的排卵期', '\uac00\uc7a5 \uc785\uc0c1\ub41c \uc2dc\uae30', 'Sua Janela F\u00e9rtil'],
            'ovulationDay': ['Ovulation Day', 'D\u00eda de Ovulaci\u00f3n', '排卵日', '\ubc30\ub780\uc77c', 'Dia da Ovula\u00e7\u00e3o'],
            'fertileStart': ['Fertile Window Starts', 'Inicio de Ventana F\u00e9rtil', '排卵期开始', '\uac00\uc7a5 \uc785\uc0c1\ub41c \uc2dc\uae30 \uc2dc\uc791', 'In\u00edcio da Janela F\u00e9rtil'],
            'fertileEnd': ['Fertile Window Ends', 'Fin de Ventana F\u00e9rtil', '排卵期结束', '\uac00\uc7a5 \uc785\uc0c1\ub41c \uc2dc\uae30 \uc885\ub8cc', 'Fim da Janela F\u00e9rtil'],
            'nextPeriod': ['Next Period Expected', 'Pr\u00f3ximo Per\u00edodo Esperado', '下次月经预计', '\ub2e4\uc74c \uc0dd\ub9ac \uc608\uc815\uc77c', 'Pr\u00f3ximo Per\u00edodo Esperado'],
            'clear': ['Clear', 'Limpiar', '清除', '\uc9c0\uc6b0\uae30', 'Limpar'],
            'seoDescription': [
                'Free online ovulation calculator: track your fertile window, ovulation day, and next period. Based on your cycle length for family planning and fertility awareness. Mac OS 9 retro style.',
                'Calculadora de ovulaci\u00f3n gratuita: calcule su ventana f\u00e9rtil y d\u00eda de ovulaci\u00f3n. Estilo retro Mac OS 9.',
                '免费在线排卵期计算器：追踪您的排卵期、排卵日和下次月经。Mac OS 9复古风格。',
                '\ubb34\ub8cc \ubc30\ub780\uc77c \uacc4\uc0b0\uae30: \uac00\uc7a5 \uc785\uc0c1\ub41c \uc2dc\uae30, \ubc30\ub780\uc77c, \ub2e4\uc74c \uc0dd\ub9ac\ub97c \ucd94\uc801\ud569\ub2c8\ub2e4. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.',
                'Calculadora de ovula\u00e7\u00e3o gratuita: calcule sua janela f\u00e9rtil e dia da ovula\u00e7\u00e3o. Estilo retro Mac OS 9.'
            ]
        }
    },
    'cagr': {
        'keys': {
            'title': ['CAGR Calculator', 'Calculadora de CAGR', 'CAGR计算器', 'CAGR \uacc4\uc0b0\uae30', 'Calculadora de CAGR'],
            'initialValue': ['Initial Value', 'Valor Inicial', '初始价值', '\ucd08\uae30 \uac00\uce58', 'Valor Inicial'],
            'finalValue': ['Final Value', 'Valor Final', '最终价值', '\ucd5c\uc885 \uac00\uce58', 'Valor Final'],
            'years': ['Number of Years', 'N\u00famero de A\u00f1os', '年数', '\ub144\uc218', 'N\u00famero de Anos'],
            'calculate': ['Calculate CAGR', 'Calcular CAGR', '计算CAGR', 'CAGR \uacc4\uc0b0', 'Calcular CAGR'],
            'results': ['Results', 'Resultados', '结果', '\uacb0\uacfc', 'Resultados'],
            'cagrLabel': ['CAGR (Compound Annual Growth Rate)', 'CAGR (Tasa de Crecimiento Anual)', 'CAGR(年复合增长率)', 'CAGR(\uc5f0\ud3c9\uade0 \uc131\uc7a5\ub960)', 'CAGR (Taxa de Crescimento Anual)'],
            'totalReturn': ['Total Return', 'Rendimiento Total', '总回报', '\ucd1d \uc218\uc775\ub960', 'Retorno Total'],
            'futureValue': ['Future Value', 'Valor Futuro', '未来价值', '\ubbf8\ub798 \uac00\uce58', 'Valor Futuro'],
            'invested': ['Total Invested', 'Total Invertido', '总投资', '\ucd1d \ud22c\uc790\uae08', 'Total Investido'],
            'clear': ['Clear', 'Limpiar', '清除', '\uc9c0\uc6b0\uae30', 'Limpar'],
            'seoDescription': [
                'Free online CAGR calculator: calculate Compound Annual Growth Rate for investments. Enter initial value, final value, and years to find your average annual return. Perfect for stocks, funds, and business growth analysis. Mac OS 9 retro style.',
                'Calculadora de CAGR gratuita: calcule la tasa de crecimiento anual compuesta de sus inversiones. Estilo retro Mac OS 9.',
                '免费在线CAGR计算器：计算投资的年复合增长率。输入初始值、最终值和年数。Mac OS 9复古风格。',
                '\ubb34\ub8cc CAGR \uacc4\uc0b0\uae30: \ud22c\uc790\uc758 \uc5f0\ud3c9\uade0 \uc131\uc7a5\ub960\uc744 \uacc4\uc0b0\ud569\ub2c8\ub2e4. \ucd08\uae30\uac12, \ucd5c\uc885\uac12, \ub144\uc218\ub97c \uc785\ub825\ud558\uc138\uc694. Mac OS 9 \ub808\ud2b8\ub85c \uc2a4\ud0c0\uc77c.',
                'Calculadora de CAGR gratuita: calcule a taxa de crescimento anual composta dos seus investimentos. Estilo retro Mac OS 9.'
            ]
        }
    }
}

BASE = r'C:\Users\1one\Documents\dev\hello-tools'
MSGS_DIR = os.path.join(BASE, 'src', 'messages')

# Generate 5 locales × 5 tools = 25 JSON files
for tool_key, tool_data in TOOLS.items():
    for i, loc in enumerate(LOCALES):
        msg = {}
        for key, vals in tool_data['keys'].items():
            msg[key] = vals[i]
        path = os.path.join(MSGS_DIR, loc, f'{tool_key}.json')
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(msg, f, ensure_ascii=False)
        print(f'Created: {path}')

print('\nAll 25 JSON files created successfully!')