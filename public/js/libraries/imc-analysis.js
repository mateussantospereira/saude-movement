// Análise de IMC

// 27/08/2024

// Respostas retiradas do Chat GPT

async function analyze(imc) {
    let min = 8;
    let max = 80;
    
    if (!Number(imc) || Number(imc) < min || Number(imc) > max) {
        return `Erro. Envie um IMC de ${min} a ${max}`;
    }

    imc = Number(imc);

    const classes = [
        {
            num: 16,
            text: `
<b class="center">Análise do IMC ${imc}:</b><br><br>

<b>Categoria:</b> Muito abaixo do peso<br>
<b>Implicações:</b> Um IMC de ${imc} indica que o peso está significativamente abaixo do intervalo considerado saudável para a altura. Isso pode sugerir uma condição de desnutrição ou outras questões de saúde que estão contribuindo para um peso muito baixo.<br>
<b>Saúde Geral:</b> Estar muito abaixo do peso pode levar a sérios problemas de saúde, incluindo deficiências nutricionais, enfraquecimento do sistema imunológico, fraqueza muscular, fadiga, e problemas com a função orgânica. Também pode estar associado a condições médicas como transtornos alimentares, doenças crônicas ou problemas metabólicos.
            `
        },
        {
            num: 18.5,
            text: `
<b class="center">Análise do IMC ${imc}:</b><br><br>

<b>Categoria:</b> Abaixo do peso<br>
<b>Implicações:</b> Um IMC de ${imc} indica que o peso está abaixo da faixa considerada saudável  para a altura. Isso pode sugerir uma deficiência no peso corporal em relação à altura, o que pode ter várias causas e implicações para a saúde.<br>
<b>Saúde Geral:</b> Estar abaixo do peso pode estar associado a uma série de riscos para a saúde, como deficiências nutricionais, enfraquecimento do sistema imunológico, e maior vulnerabilidade a doenças. Em alguns casos, também pode estar relacionado a condições médicas ou a um estilo de vida muito ativo sem uma ingestão calórica adequada.
            `
        },
        {
            num: 24.9,
            text: `
<b class="center">Análise do IMC ${imc}:</b><br><br>

<b>Categoria:</b> Peso normal<br>
<b>Implicações:</b> Um IMC de ${imc} sugere que o peso está adequado em relação à altura, indicando que não há excessos nem deficiências significativas de peso.<br>
<b>Saúde Geral:</b> Geralmente, um IMC dentro dessa faixa é associado a um menor risco de problemas de saúde relacionados ao peso, como doenças cardiovasculares e diabetes tipo 2.
            `
        },
        {
            num: 29.9,
            text: `
<b class="center">Análise do IMC ${imc}:</b><br><br>

<b>Categoria:</b> Sobrepeso<br>
<b>Implicações:</b> Um IMC de ${imc} indica que o peso está acima da faixa saudável para a altura, entrando na categoria de sobrepeso. Isso pode sugerir uma quantidade de gordura corporal maior do que a considerada ideal para a saúde.<br>
<b>Saúde Geral:</b> Estar na faixa de sobrepeso pode aumentar o risco de várias condições de saúde, incluindo doenças cardiovasculares, diabetes tipo 2 e hipertensão. Manter um estilo de vida saudável, com uma dieta equilibrada e atividade física regular, pode ajudar a gerenciar o peso e reduzir esses riscos.
            `
        },
        {
            num: 34.9,
            text: `
<b class="center">Análise do IMC ${imc}:</b><br><br>

<b>Classificação:</b> Obesidade Grau I<br>
<b>Risco para a saúde:</b> Com um IMC de ${imc}, o risco para a saúde aumenta, incluindo uma maior probabilidade de desenvolver condições como hipertensão, diabetes tipo 2, doenças cardiovasculares e outros problemas relacionados ao excesso de peso.<br>
<b>Intervenções recomendadas:</b> Adotar um estilo de vida mais saudável é crucial. Isso pode incluir mudanças na alimentação, aumento da atividade física e, em alguns casos, a consulta com um profissional de saúde para avaliar a necessidade de intervenções adicionais, como acompanhamento nutricional ou médico.
            `
        },
        {
            num: 39.9,
            text: `
<b class="center">Análise do IMC ${imc}:</b><br><br>

<b>Classificação:</b> Obesidade Grau II (Obesidade severa)<br>
<b>Risco para a saúde:</b> Um IMC de ${imc} indica um risco elevado de desenvolver várias condições de saúde, como:<br>
Doenças cardiovasculares: Maior risco de hipertensão, infarto e acidente vascular cerebral.<br>
Diabetes tipo 2: O excesso de peso está fortemente associado ao desenvolvimento de resistência à insulina e diabetes.<br>
Apneia do sono: Condição em que a respiração para e começa repetidamente durante o sono.<br>
Problemas articulares: O peso extra pode causar desgaste nas articulações, levando a osteoartrite.<br>
Certos tipos de câncer: A obesidade está associada a um risco maior de desenvolver vários tipos de câncer, incluindo câncer de mama e de cólon.<br>
<b>Intervenções recomendadas:</b><br>
Dieta e nutrição: Uma dieta equilibrada, rica em nutrientes e com controle de calorias, é essencial para a perda de peso.<br>
Exercício físico: Aumentar a atividade física regular, adaptada às capacidades físicas da pessoa, pode ajudar a melhorar a saúde cardiovascular e a facilitar a perda de peso.<br>
Acompanhamento médico: Consultar profissionais de saúde, como médicos e nutricionistas, para monitorar o estado de saúde e receber orientações personalizadas.
            `
        },
        {
            num: 100,
            text: `
<b class="center">Análise do IMC ${imc}:</b><br><br>

<b>Classificação:</b> Obesidade Grau III (Obesidade mórbida)<br>
<b>Risco para a saúde:</b> Um IMC de ${imc} implica um risco extremamente elevado para a saúde, incluindo:<br>
Doenças cardiovasculares: Aumento significativo do risco de hipertensão, insuficiência cardíaca e doenças coronárias.<br>
Diabetes tipo 2: Risco muito alto de desenvolver diabetes devido à resistência à insulina.<br>
Apneia do sono: O risco de apneia do sono grave é elevado, o que pode afetar a qualidade do sono e a saúde geral.<br>
Problemas articulares e musculares: O excesso de peso coloca uma carga excessiva sobre as articulações, especialmente nos joelhos e quadris, podendo levar a osteoartrite e dor crônica.<br>
Outros problemas de saúde: Maior risco de certos tipos de câncer, complicações respiratórias e problemas de mobilidade.<br>
<b>Intervenções recomendadas:</b><br>
Mudanças no estilo de vida:<br>
Dieta: Implementar uma dieta saudável e controlada em calorias, frequentemente com o apoio de um nutricionista.<br>
Exercício: Iniciar uma rotina de exercícios, com o suporte de um profissional de saúde, adaptada às capacidades físicas da pessoa.<br>
Acompanhamento médico: É crucial ter um acompanhamento médico regular para monitorar a saúde e ajustar as estratégias conforme necessário.<br>
Tratamentos adicionais: Dependendo da situação, considerar opções como medicamentos para perda de peso ou, em casos mais graves, cirurgia bariátrica (como a cirurgia de redução do estômago). Essas decisões devem ser feitas em conjunto com uma equipe médica especializada.
            `
        }
    ];

    let text = "";

    for (let c of classes) {
        if (imc <= c.num) {
            text = c.text;
            break;
        }
    }

    return `<p>${text}</p>`;
}
