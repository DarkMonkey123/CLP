/**
 * Base de dados local dos equipamentos industriais com geradores de imagem vetorial
 */
const EQUIPMENTS_DATA = [
  {
    "id": "clp",
    "name": "Controlador Lógico Programável (CLP)",
    "category": "Automação/CLP",
    "icon": "💻",
    "imagePath": "",
    "shortDescription": "Cérebro eletrônico industrial que executa lógicas de controle de processos.",
    "purpose": "Comandar máquinas e processos industriais lendo entradas (sensores) e acionando saídas (atuadores) de acordo com um programa gravado em sua memória.",
    "howItWorks": {
      "simple": "Funciona como um computador industrial que checa continuamente o estado dos botões e sensores e decide quais motores ou válvulas devem ser ligados.",
      "technical": "Opera em um ciclo contínuo chamado Scan Cycle (Varredura): 1. Leitura das entradas físicas na memória de imagem; 2. Execução sequencial da lógica de programa (Ladder/FBD); 3. Atualização das saídas físicas."
    },
    "specs": {
      "voltage": "24 VDC ou 100-240 VAC",
      "current": "0.5 A a 3 A (Alimentação)",
      "signalType": "Entradas/Saídas Digitais (0/24V) e Analógicas (4-20mA, 0-10V)",
      "ranges": "Expansível até centenas de pontos de I/O"
    },
    "applications": [
      "Linhas de montagem automatizadas",
      "Sistemas de embalagem e envase",
      "Controle de estações de tratamento de água",
      "Sistemas de bombeamento e iluminação industrial"
    ],
    "safetyAndFailures": {
      "safety": [
        "Desligar a alimentação principal antes de manipular fiações de I/O.",
        "Utilizar fontes de alimentação de 24VDC com proteção contra surtos."
      ],
      "commonFailures": [
        "Queima de saídas a relé/transistor por curto-circuito na carga.",
        "Ruído eletromagnético nas entradas analógicas por falta de blindagem (shield)."
      ]
    },
    "relatedIds": [
      "ihm",
      "fonte-24v",
      "sensor-indutivo",
      "contatora"
    ]
  },
  {
    "id": "contatora",
    "name": "Contatora de Potência",
    "category": "Elétrica",
    "icon": "⚡",
    "imagePath": "",
    "shortDescription": "Chave eletromecânica utilizada para manobrar cargas elétricas de alta corrente.",
    "purpose": "Ligar e desligar cargas de alta potência (como motores e resistências) remotamente através de um sinal de baixa potência enviado pelo CLP ou botoeira.",
    "howItWorks": {
      "simple": "Quando uma corrente passa pela bobina interna, ela cria um campo magnético que atrai contatos metálicos, fechando o circuito e ligando o motor.",
      "technical": "A energização da bobina (A1-A2) gera um fluxo magnético no núcleo fixo que atrai o núcleo móvel, vencendo a força das molas de retorno e alterando o estado dos contatos principais (1-L1, 3-L2, 5-L3) e auxiliares (NA/NF)."
    },
    "specs": {
      "voltage": "Bobina: 24 VDC / 220 VAC; Carga: Até 690 VAC",
      "current": "9 A a mais de 800 A (Categorias AC-1, AC-3)",
      "signalType": "Acionamento On/Off por Bobina",
      "ranges": "Frequência de operação até 1200 manobras/hora"
    },
    "applications": [
      "Acionamento de motores trifásicos",
      "Ligamento de bancos de resistências de aquecimento",
      "Chaveamento de sistemas de iluminação de grande porte"
    ],
    "safetyAndFailures": {
      "safety": [
        "Nunca operar sem a capa de proteção contra arcos elétricos.",
        "Dimensionar corretamente para a categoria de emprego (ex: AC-3 para motores)."
      ],
      "commonFailures": [
        "Soldagem dos contatos devido a picos de corrente ou curtos-circuitos.",
        "Ruído excessivo (zumbido) na bobina provocado por sujeira no núcleo magnético."
      ]
    },
    "relatedIds": [
      "rele-termico",
      "disjuntor-motor",
      "motor-trifasico",
      "clp"
    ]
  },
  {
    "id": "rele-termico",
    "name": "Relé Térmico de Sobrecarga",
    "category": "Elétrica",
    "icon": "🌡️",
    "imagePath": "",
    "shortDescription": "Dispositivo de proteção contra aquecimento excessivo em motores elétricos.",
    "purpose": "Proteger motores elétricos contra sobrecargas sustentadas e falta de fase, evitando que o isolamento do motor queime por superaquecimento.",
    "howItWorks": {
      "simple": "Possui lâminas internas que se curvam quando esquentam demais com a corrente elétrica. Se esquentarem muito, elas se movem e desligam a contatora.",
      "technical": "Baseia-se na deformação de lâminas bimetálicas com diferentes coeficientes de dilatação térmica. O aquecimento por Efeito Joule desvia as lâminas que acionam um mecanismo mecânico, abrindo o contato auxiliar de comando 95-96."
    },
    "specs": {
      "voltage": "Até 690 VAC",
      "current": "Ajustável (ex: 1.6A-2.5A, 4A-6.3A, etc.)",
      "signalType": "Contatos auxiliares secos (95-96 NF, 97-98 NA)",
      "ranges": "Classe de disparo 10A, 10, 20, 30"
    },
    "applications": [
      "Proteção individual de motores elétricos trifásicos em painéis elétricos",
      "Quadros de comando de bombas e compressores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Ajustar a corrente de disparo exatamente para a corrente nominal (In) do motor.",
        "Não utilizar como proteção contra curto-circuito (exige fusível ou disjuntor prévio)."
      ],
      "commonFailures": [
        "Disparo falso por má fixação dos cabos nos terminais de potência.",
        "Mecanismo travado por acúmulo de poeira ou degradação do plástico."
      ]
    },
    "relatedIds": [
      "contatora",
      "motor-trifasico",
      "disjuntor-motor"
    ]
  },
  {
    "id": "disjuntor-motor",
    "name": "Disjuntor Motor",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Proteção contra sobrecarga e curto-circuito com ajuste de corrente para motores.",
    "purpose": "Protege motores e permite ligar e desligar manualmente, substituindo fusível e relé térmico.",
    "howItWorks": {
      "simple": "Desliga o motor sozinho se a corrente passar do valor ajustado ou ocorrer um curto-circuito.",
      "technical": "Combina disparador térmico regulável para sobrecarga e disparador magnético fixo para curto-circuito."
    },
    "specs": {
      "voltage": "Até 690VAC",
      "current": "0,1A a 80A (ajustável)",
      "signalType": "Potência trifásica",
      "ranges": "Faixas de ajuste por modelo"
    },
    "applications": [
      "Proteção de motores trifásicos",
      "Partida direta manual",
      "Proteção de circuitos de comando"
    ],
    "safetyAndFailures": {
      "safety": [
        "Ajustar a corrente de acordo com a placa do motor."
      ],
      "commonFailures": [
        "Desarme indevido por ajuste abaixo da corrente nominal.",
        "Falta de desarme por ajuste muito acima da corrente do motor."
      ]
    }
  },
  {
    "id": "sensor-indutivo",
    "name": "Sensor de Proximidade Indutivo",
    "category": "Sensores",
    "icon": "🧲",
    "imagePath": "",
    "shortDescription": "Detector sem contato físico para objetos metálicos.",
    "purpose": "Detectar a presença, passagem ou fim de curso de peças metálicas sem desgaste mecânico e em altíssima velocidade.",
    "howItWorks": {
      "simple": "Cria um campo magnético invisível na sua ponta. Quando qualquer metal se aproxima, esse campo muda e o sensor acende um LED e envia um sinal ao CLP.",
      "technical": "Um circuito oscilador gera um campo magnético de alta frequência na face sensora. A aproximação de um condutor metálico induz correntes parasitas (Foucault), reduzindo a amplitude de oscilação que é detectada por um disparador Schmitt."
    },
    "specs": {
      "voltage": "10 a 30 VDC",
      "current": "Consumo < 15mA; Saída até 200mA",
      "signalType": "PNP ou NPN (Digital - NA/NF)",
      "ranges": "Distância de sensoriamento (Sn): 1mm a 25mm"
    },
    "applications": [
      "Contagem de peças metálicas em esteiras",
      "Detecção de posição de eixos e atuadores",
      "Monitoramento de rotação de engrenagens"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar o tipo de fiação (PNP para entradas sinking / NPN para sourcing).",
        "Atentar para o fator de correção de distância dependendo do metal (Alumínio reduz Sn)."
      ],
      "commonFailures": [
        "Danificação física da face sensora por colisão com peças mecânicas.",
        "Interferência em fios de sinal não blindados instalados junto a cabos de motor."
      ]
    },
    "relatedIds": [
      "clp",
      "sensor-capacitivo",
      "cilindro-pneumatico"
    ]
  },
  {
    "id": "sensor-capacitivo",
    "name": "Sensor de Proximidade Capacitivo",
    "category": "Sensores",
    "icon": "📡",
    "imagePath": "",
    "shortDescription": "Detector de presença para materiais metálicos e não-metálicos.",
    "purpose": "Detectar líquidos, plásticos, grãos, madeira, vidro ou metais através de superfícies não metálicas ou visada direta.",
    "howItWorks": {
      "simple": "Funciona como um sensor de toque sem contato que percebe quando qualquer objeto (até líquidos ou plásticos) chega perto da sua ponta.",
      "technical": "A face sensora funciona como uma das placas de um capacitor aberto. A aproximação de qualquer material com constante dielétrica diferente do ar altera a capacitância do circuito, acionando o estágio de saída."
    },
    "specs": {
      "voltage": "10 a 30 VDC ou 20-250 VAC",
      "current": "Saída até 250mA",
      "signalType": "PNP/NPN Digital (Transistor) ou Relé",
      "ranges": "Sn ajustável de 2mm a 20mm por trimpot traseiro"
    },
    "applications": [
      "Detecção de nível de líquidos em reservatórios plásticos",
      "Verificação de preenchimento de caixas de papelão ou embalagens",
      "Detecção de grãos em silos agrícolas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Ajustar o trimpot de sensibilidade para ignorar o acúmulo de sujeira na face sensora.",
        "Manter distância de fontes de alta frequência de rádio/inversores."
      ],
      "commonFailures": [
        "Ativações falsas provocadas por umidade alta ou condensação de água na face sensora.",
        "Perda de sensibilidade por acúmulo de poeira impregnada."
      ]
    },
    "relatedIds": [
      "sensor-indutivo",
      "sensor-fotoeletrico",
      "clp"
    ]
  },
  {
    "id": "sensor-fotoeletrico",
    "name": "Sensor Fotoelétrico Refletivo",
    "category": "Sensores",
    "icon": "👁️",
    "imagePath": "",
    "shortDescription": "Sensor óptico de presença por feixe de luz.",
    "purpose": "Detectar objetos de qualquer natureza a médias e longas distâncias utilizando reflexão de luz infravermelha ou laser.",
    "howItWorks": {
      "simple": "Dispara um raio de luz invisível contra um espelho especial. Se um objeto passar no meio e interromper a luz, o sensor avisa a máquina.",
      "technical": "Possui um emissor (LED infravermelho) e um receptor óptico na mesma carcaça. O feixe emitido atinge um retrorrefletor e retorna ao receptor. A interrupção da luz pelo objeto aciona a saída."
    },
    "specs": {
      "voltage": "10 a 30 VDC",
      "current": "Consumo médio de 30mA",
      "signalType": "Digital PNP/NPN (Light-ON / Dark-ON)",
      "ranges": "Distância de detecção até 5 metros"
    },
    "applications": [
      "Barreiras de contagem em esteiras transportadoras",
      "Portas automáticas e sistemas de cancelas",
      "Identificação de altura e presença de paletes em estoques"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não utilizar fotoelétricos comuns como sistemas de proteção de segurança humana (usar Cortinas de Luz para esta função).",
        "Proteger as lentes contra impactos mecânicos."
      ],
      "commonFailures": [
        "Desalinhamento óptico entre o sensor e o espelho refletor por vibração da estrutura.",
        "Sujeira ou névoa de óleo acumulada na lente bloqueando o feixe de luz."
      ]
    },
    "relatedIds": [
      "sensor-indutivo",
      "clp",
      "ihm"
    ]
  },
  {
    "id": "botoeira",
    "name": "Botoeira Industrial Pulsadora",
    "category": "Elétrica",
    "icon": "🔘",
    "imagePath": "",
    "shortDescription": "Interface manual para comando humano imediato em painéis.",
    "purpose": "Permitir que o operador envie sinais manuais temporários de partida, parada ou pulso para o circuito de comando.",
    "howItWorks": {
      "simple": "Um botão com mola que aciona um contato elétrico enquanto mantido pressionado e volta sozinho quando você solta.",
      "technical": "Ao ser pressionado, o atuador mecânico desloca os blocos de contato internos metálicos, comutando a condição dos contatos Normalmente Aberto (NA - 13/14) ou Normalmente Fechado (NF - 11/12)."
    },
    "specs": {
      "voltage": "Até 600V nos contatos",
      "current": "Até 10A (AC-15 em 230V)",
      "signalType": "Contato Seco sem potencial",
      "ranges": "Diâmetro padrão de furação de painel: 22mm"
    },
    "applications": [
      "Botão de Start/Stop de motores e máquinas",
      "Comandos de reset de falhas de painel",
      "Sinalização de operações manuais"
    ],
    "safetyAndFailures": {
      "safety": [
        "Usar cores padronizadas: Verde (Início/Ligar), Vermelho (Parada/Desligar), Amarelo (Atenção/Reset).",
        "Botões de Emergência devem ter travamento do tipo soco-trava mecânico."
      ],
      "commonFailures": [
        "Oxidação dos contatos elétricos em ambientes muito úmidos ou agressivos.",
        "Quebra da mola de retorno mecânico por excesso de força do operador."
      ]
    },
    "relatedIds": [
      "contatora",
      "clp",
      "rele-auxiliar"
    ]
  },
  {
    "id": "motor-trifasico",
    "name": "Motor Elétrico Trifásico (Indução)",
    "category": "Mecânica",
    "icon": "⚙️",
    "imagePath": "",
    "shortDescription": "Principal atuador para conversão de energia elétrica em energia mecânica.",
    "purpose": "Proporcionar torque mecânico rotacional para acionar bombas, ventiladores, compressores, esteiras e máquinas em geral.",
    "howItWorks": {
      "simple": "A energia elétrica trifásica cria um campo magnético giratório no motor que 'puxa' o eixo central, fazendo-o girar com muita força.",
      "technical": "A aplicação de correntes alternadas trifásicas desfasadas 120° no estator gera um Campo Magnético Girante (CMG). Este campo induz correntes no rotor ('gaiola de esquilo'), produzindo um campo magnético oposto que gera o torque de rotação."
    },
    "specs": {
      "voltage": "220V / 380V / 440V Trifásico",
      "current": "Varia de acordo com a potência (ex: 3.5A para 1CV em 220V)",
      "signalType": "Alimentação de Potência Senoidal 60Hz",
      "ranges": "Rendimento IE2/IE3, carcaças de 0.25 CV a mais de 500 CV"
    },
    "applications": [
      "Tracionamento de correias e transportadores",
      "Bombas centrífugas de água e fluidos",
      "Exaustores e ventiladores industriais"
    ],
    "safetyAndFailures": {
      "safety": [
        "Garantir aterramento adequado da carcaça do motor no barramento PE.",
        "Verificar sentido de rotação correto antes do acoplamento mecânico definitivo."
      ],
      "commonFailures": [
        "Queima do enrolamento do estator por operação em falta de fase.",
        "Desgaste dos rolamentos por desalinhamento do eixo ou falta de lubrificação."
      ]
    },
    "relatedIds": [
      "contatora",
      "rele-termico",
      "inversor-frequencia",
      "disjuntor-motor"
    ]
  },
  {
    "id": "inversor-frequencia",
    "name": "Inversor de Frequência (VFD)",
    "category": "Acionamentos",
    "icon": "📊",
    "imagePath": "",
    "shortDescription": "Controlador eletrônico de velocidade e torque para motores elétricos.",
    "purpose": "Variar a velocidade de rotação de motores trifásicos, controlar aceleração/desaceleração e economizar energia elétrica.",
    "howItWorks": {
      "simple": "Transforma a energia fixa da rede e gera uma nova energia ajustável, permitindo acelerar ou desacelerar o motor de forma suave como um pedal de acelerador.",
      "technical": "Converte a tensão CA da rede em CC através de uma ponte retificadora. O barramento CC é filtrado por capacitores e reconstruído em uma tensão CA de frequência e amplitude variáveis usando transistores IGBT via Modulação por Largura de Pulso (PWM)."
    },
    "specs": {
      "voltage": "Entrada: 220V Mono/Tri ou 380-480V Tri; Saída: 0-Ventrada",
      "current": "Dimensionado pela corrente nominal de saída (A)",
      "signalType": "Sinais de controle 0-10V, 4-20mA, Modbus/Profinet",
      "ranges": "Frequência de saída de 0 Hz a 400 Hz"
    },
    "applications": [
      "Controle de vazão em bombas sem necessidade de válvulas estranguladoras",
      "Pontes rolantes e elevadores para paradas suaves sem solavancos",
      "Sistemas de exaustão inteligentes"
    ],
    "safetyAndFailures": {
      "safety": [
        "Aguardar a descarga total dos capacitores do barramento CC (mínimo 5-10 min) antes de tocar nas conexões.",
        "Utilizar cabos blindados aterrados nas duas pontas entre inversor e motor."
      ],
      "commonFailures": [
        "Erros de Sobretensão (Overvoltage) durante desacelerações muito rápidas sem resistor de frenagem.",
        "Superaquecimento dos módulos IGBT por ventoinha de arrefecimento travada ou sujeira."
      ]
    },
    "relatedIds": [
      "motor-trifasico",
      "clp",
      "ihm"
    ]
  },
  {
    "id": "valvula-solenoide",
    "name": "Válvula Solenoide Direcional",
    "category": "Pneumática",
    "icon": "🚰",
    "imagePath": "",
    "shortDescription": "Válvula acionada eletricamente para controle de fluxo de ar comprimido ou fluidos.",
    "purpose": "Direcionar o fluxo de ar comprimido para avançar ou recuar cilindros pneumáticos através de um comando elétrico vindo do CLP.",
    "howItWorks": {
      "simple": "É uma torneira elétrica rápida: quando você envia energia para o fio dela, um eletroímã puxa um pino interno e libera o ar para o pistão.",
      "technical": "Uma bobina elétrica cria um campo magnético que atrai um êmbolo usinado. Este deslocamento altera as passagens internas de ar comprimido entre os canais de pressão (P), utilização (A/B) e escape (R/S)."
    },
    "specs": {
      "voltage": "24 VDC, 110 VAC ou 220 VAC",
      "current": "Consumo de 2W a 5W em CC",
      "signalType": "Acionamento On/Off Digital",
      "ranges": "Pressão de trabalho de 1.5 a 10 bar"
    },
    "applications": [
      "Comando de cilindros e garras pneumáticas",
      "Sinalização e dosagem de fluidos em indústrias químicas",
      "Sistemas de sopro e limpeza automatizados"
    ],
    "safetyAndFailures": {
      "safety": [
        "Instalar sempre um filtro e regulador de ar purificado e lubrificado a montante das válvulas.",
        "Garantir botão de despressurização manual no circuito pneumático."
      ],
      "commonFailures": [
        "Travamento do carretel interno por contaminação com água ou partículas de poeira no ar.",
        "Queima da bobina solenoide por energização sem o núcleo magnético montado."
      ]
    },
    "relatedIds": [
      "cilindro-pneumatico",
      "clp",
      "fonte-24v"
    ]
  },
  {
    "id": "cilindro-pneumatico",
    "name": "Cilindro Pneumático Dupla Ação",
    "category": "Pneumática",
    "icon": "🏗️",
    "imagePath": "",
    "shortDescription": "Atuador linear acionado por ar comprimido.",
    "purpose": "Converter a energia potencial do ar comprimido em movimento mecânico linear reto de empurrar, puxar ou levantar cargas.",
    "howItWorks": {
      "simple": "Um tubo com um êmbolo dentro. Quando o ar entra por um lado o braço do cilindro sai; quando entra pelo outro lado o braço recolhe.",
      "technical": "O ar comprimido injetado na câmara traseira empurra o embolo e a haste para fora (Avanço). Para o retorno (Recuo), o ar é direcionado à câmara dianteira enquanto a câmara traseira é conectada ao escape."
    },
    "specs": {
      "voltage": "Não se aplica (Mecânico/Pneumático)",
      "current": "Não se aplica",
      "signalType": "Pressão Pneumática (Ar comprimido filtrado)",
      "ranges": "Diâmetros de 12mm a 320mm; Cursos de 10mm a mais de 2000mm"
    },
    "applications": [
      "Empurradores de caixas e desvios de linha",
      "Prensas e fixadores pneumáticos de peças",
      "Abertura e fechamento de comportas e portas industriais"
    ],
    "safetyAndFailures": {
      "safety": [
        "Cuidado com pontos de esmagamento durante a movimentação rápida da haste.",
        "Utilizar reguladores de fluxo para controlar a velocidade de movimento."
      ],
      "commonFailures": [
        "Vazamento de ar pelas gaxetas de vedação gastas da haste.",
        "Empeno da haste por aplicação de cargas laterais não suportadas."
      ]
    },
    "relatedIds": [
      "valvula-solenoide",
      "sensor-indutivo",
      "clp"
    ]
  },
  {
    "id": "ihm",
    "name": "Interface Homem-Máquina (IHM)",
    "category": "Automação/CLP",
    "icon": "🖥️",
    "imagePath": "",
    "shortDescription": "Painel com tela sensível ao toque para monitoramento e controle de processos.",
    "purpose": "Permitir que operadores visualizem o estado da máquina em tempo real, alterem parâmetros de processo e visualizem alarmes.",
    "howItWorks": {
      "simple": "É um tablet industrial muito resistente fixado na porta do painel que se comunica direto com o CLP para mostrar desenhos da máquina e botões virtuais.",
      "technical": "Equipamento microprocessado com sistema operacional embutido que executa telas gráficas. Comunica-se com o CLP via protocolos industriais (Modbus RTU/TCP, Profinet, Ethernet/IP) para ler e escrever tags de memória."
    },
    "specs": {
      "voltage": "24 VDC",
      "current": "0.3 A a 1.5 A",
      "signalType": "Comunicação Serial (RS485/RS232) e Ethernet (RJ45)",
      "ranges": "Telas coloridas TFT Touchscreen de 4.3\" até 15.6\""
    },
    "applications": [
      "Central de comando na porta de painéis industriais",
      "Exibição de gráficos de tendência de temperatura e pressão",
      "Gerenciamento de receitas de produção e histórico de alarmes"
    ],
    "safetyAndFailures": {
      "safety": [
        "Proteger a tela contra ferramentas afiadas e solventes agressivos.",
        "Configurar níveis de senha para evitar alterações críticas por operadores não autorizados."
      ],
      "commonFailures": [
        "Perda de comunicação com o CLP por cabo rompido ou configurações de IP incorretas.",
        "Descalibração ou falha do touch no vidro capacitivo/resistivo."
      ]
    },
    "relatedIds": [
      "clp",
      "inversor-frequencia",
      "fonte-24v"
    ]
  },
  {
    "id": "fonte-24v",
    "name": "Fonte de Alimentação Chaveada 24VDC",
    "category": "Elétrica",
    "icon": "🔋",
    "imagePath": "",
    "shortDescription": "Conversor de tensão alternada para contínua para circuitos de comando.",
    "purpose": "Fornecer uma tensão contínua estável e purificada de 24VDC para alimentar CLPs, sensores, IHM e relés com total segurança.",
    "howItWorks": {
      "simple": "Pega a energia da tomada (110V ou 220V AC) e transforma em uma energia de 24V DC limpa e sem oscilações para não queimar as placas eletrônicas.",
      "technical": "Retifica a entrada CA, chaveia a tensão em alta frequência via semicondutores, rebaixa através de um transformador compacto e filtra a saída para obter 24VDC estabilizados com alta eficiência térmica (>85%)."
    },
    "specs": {
      "voltage": "Entrada: 85-264 VAC; Saída: 24 VDC (Ajustável ±10%)",
      "current": "Modelos de 2.5A, 5A, 10A, 20A a 40A",
      "signalType": "Tensão Contínua Regulada (Rippel < 50mV)",
      "ranges": "Fixação em Trilho DIN padrão"
    },
    "applications": [
      "Alimentação de barramento de comando em painéis de automação",
      "Alimentação de sensores de campo e transdutores",
      "Alimentação de circuitos eletrônicos e interfaces de sinal"
    ],
    "safetyAndFailures": {
      "safety": [
        "Garantir espaço livre acima e abaixo do gabinete para ventilação por convecção.",
        "Não ultrapassar a corrente máxima de pico especificada."
      ],
      "commonFailures": [
        "Desarme da proteção por curto-circuito na fiação externa do campo.",
        "Estufamento dos capacitores eletrolíticos por operação contínua em alta temperatura."
      ]
    },
    "relatedIds": [
      "clp",
      "sensor-indutivo",
      "ihm",
      "rele-auxiliar"
    ]
  },
  {
    "id": "rele-auxiliar",
    "name": "Relé Auxiliar Eletromecânico",
    "category": "Elétrica",
    "icon": "🔀",
    "imagePath": "",
    "shortDescription": "Isolador e multiplicador de contatos de sinal elétrico.",
    "purpose": "Isolar eletricamente o circuito de comando digital do CLP dos circuitos de carga ou multiplicar o número de contatos disponíveis.",
    "howItWorks": {
      "simple": "Um interruptor elétrico de pequeno porte que liga quando recebe um pequeno sinal elétrico na sua bobina, acionando várias chaves ao mesmo tempo.",
      "technical": "Uma bobina atrai uma armadura mecânica de ferro macio ao ser energizada. A armadura comuta contatos reversíveis (SPDT/DPDT) isolando galvanicamente a bobina dos circuitos de saída."
    },
    "specs": {
      "voltage": "Bobina: 24VDC, 24VAC, 110VAC, 220VAC; Contatos: até 250V",
      "current": "Contatos dimensionados para 5A a 16A",
      "signalType": "Bobina ON/OFF e Contatos Reversíveis (NA/NF)",
      "ranges": "Soquete encaixável em trilho DIN com LED indicador"
    },
    "applications": [
      "Interface de desacoplamento entre saídas do CLP e solenoides/contatoras",
      "Multiplicação de sinais de alarme ou intertravamento",
      "Inversão de lógica de contato (converter NA em NF)"
    ],
    "safetyAndFailures": {
      "safety": [
        "Usar diodo de roda-livre (supressor de surto) em paralelo com a bobina CC para evitar picos de sobretensão no transistor do CLP.",
        "Respeitar o limite de corrente dos contatos finos."
      ],
      "commonFailures": [
        "Carbonização dos contatos elétricos por acionamento de cargas indutivas sem proteção.",
        "Desgaste prematuro por altas frequências de chaveamento."
      ]
    },
    "relatedIds": [
      "clp",
      "botoeira",
      "fonte-24v",
      "contatora"
    ]
  },
  {
    "id": "clp-compacto",
    "name": "CLP Compacto",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Controlador lógico com CPU, entradas e saídas integradas em um único corpo.",
    "purpose": "Controla máquinas e processos de pequeno e médio porte executando um programa lógico a partir dos sinais de sensores e botoeiras.",
    "howItWorks": {
      "simple": "Lê os sinais que chegam dos sensores, decide o que fazer de acordo com o programa e liga ou desliga as saídas, como motores e válvulas.",
      "technical": "A CPU executa ciclicamente o ciclo de varredura: leitura das entradas, execução do programa (Ladder, ST, FBD) e atualização das saídas."
    },
    "specs": {
      "voltage": "24VDC / 100-240VAC",
      "current": "0,3A a 1A (alimentação)",
      "signalType": "Digital 24VDC / Analógico 0-10V e 4-20mA",
      "ranges": "14 a 40 pontos de E/S"
    },
    "applications": [
      "Esteiras transportadoras",
      "Máquinas de embalagem",
      "Controle de bombas e reservatórios"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar a tensão de alimentação indicada na etiqueta antes de energizar.",
        "Manter fiação de potência separada da fiação de sinais."
      ],
      "commonFailures": [
        "Perda do programa por bateria descarregada.",
        "Saída digital danificada por carga indutiva sem proteção."
      ]
    }
  },
  {
    "id": "clp-modular",
    "name": "CLP Modular",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Controlador expansível formado por CPU, fonte e módulos de E/S em rack.",
    "purpose": "Atende processos maiores e mais complexos, permitindo montar a quantidade exata de entradas, saídas e comunicação necessária.",
    "howItWorks": {
      "simple": "É como um computador industrial em que você encaixa módulos conforme a necessidade da máquina.",
      "technical": "A CPU se comunica com os módulos pelo barramento de fundo de painel (backplane), executando o programa e trocando dados de E/S a cada ciclo."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "1A a 5A (rack completo)",
      "signalType": "Digital / Analógico / Rede industrial",
      "ranges": "Dezenas a milhares de pontos de E/S"
    },
    "applications": [
      "Linhas de produção",
      "Estações de tratamento de água",
      "Controle de processos químicos"
    ],
    "safetyAndFailures": {
      "safety": [
        "Desligar o rack antes de inserir ou remover módulos, salvo se o fabricante permitir hot-swap."
      ],
      "commonFailures": [
        "Mau contato nos conectores do backplane.",
        "Sobrecarga da fonte por excesso de módulos."
      ]
    }
  },
  {
    "id": "clp-seguranca",
    "name": "CLP de Segurança",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Controlador com arquitetura redundante e certificada para funções de segurança.",
    "purpose": "Monitora dispositivos de segurança e leva a máquina a um estado seguro em caso de falha ou acionamento de emergência.",
    "howItWorks": {
      "simple": "Funciona como um CLP comum, mas com dois cérebros que se vigiam; se algo estiver errado, ele desliga a máquina por segurança.",
      "technical": "Utiliza processamento redundante com comparação cruzada e diagnóstico contínuo para atender níveis SIL e PL conforme normas de segurança funcional."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "0,5A a 2A",
      "signalType": "Digital de segurança (dois canais)",
      "ranges": "Até SIL 3 / PL e"
    },
    "applications": [
      "Células robotizadas",
      "Prensas e dobradeiras",
      "Monitoramento de cortinas de luz e emergências"
    ],
    "safetyAndFailures": {
      "safety": [
        "Somente profissionais capacitados devem programar e validar funções de segurança.",
        "Realizar testes periódicos de validação do sistema."
      ],
      "commonFailures": [
        "Falha de discrepância entre canais por contato defeituoso.",
        "Parada indevida por fiação mal dimensionada."
      ]
    }
  },
  {
    "id": "micro-clp",
    "name": "Micro CLP",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Controlador de pequeno porte e baixo custo para automações simples.",
    "purpose": "Automatiza tarefas simples com poucas entradas e saídas, em aplicações onde um CLP maior não se justifica.",
    "howItWorks": {
      "simple": "É um mini controlador que segue um programa curto para ligar e desligar equipamentos.",
      "technical": "Executa o ciclo de varredura em CPU de recursos limitados, geralmente com E/S fixas e memória reduzida."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 110-240VAC",
      "current": "0,1A a 0,5A",
      "signalType": "Digital / Analógico limitado",
      "ranges": "6 a 20 pontos de E/S"
    },
    "applications": [
      "Portões automáticos",
      "Controle de iluminação",
      "Pequenas bombas e compressores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não ultrapassar a corrente máxima das saídas a relé ou transistor."
      ],
      "commonFailures": [
        "Contatos de saída a relé desgastados por excesso de manobras."
      ]
    }
  },
  {
    "id": "rele-programavel",
    "name": "Relé Programável (Mini CLP)",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Módulo lógico programável por blocos ou teclado frontal.",
    "purpose": "Substitui circuitos de relés e temporizadores por lógica programada em aplicações simples.",
    "howItWorks": {
      "simple": "Você monta a lógica na própria tela ou no computador, e ele passa a comandar as saídas sozinho.",
      "technical": "Executa diagramas em blocos de função (FBD) ou Ladder simplificado em microcontrolador com entradas e saídas integradas."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 115-240VAC",
      "current": "0,1A a 0,3A",
      "signalType": "Digital / Analógico opcional",
      "ranges": "8 a 12 pontos de E/S, expansível"
    },
    "applications": [
      "Acionamento de bombas alternadas",
      "Controle de portões e iluminação",
      "Temporização de processos simples"
    ],
    "safetyAndFailures": {
      "safety": [
        "Confirmar se a tensão de alimentação é CC ou CA antes da ligação."
      ],
      "commonFailures": [
        "Perda de relógio interno por bateria esgotada.",
        "Programa corrompido por queda de energia durante gravação."
      ]
    }
  },
  {
    "id": "ihm-touchscreen",
    "name": "IHM Touchscreen",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Tela sensível ao toque para operar e monitorar máquinas.",
    "purpose": "Permite ao operador visualizar variáveis, alarmes e receitas e enviar comandos ao CLP de forma gráfica.",
    "howItWorks": {
      "simple": "É a tela da máquina: mostra o que está acontecendo e deixa você tocar para dar comandos.",
      "technical": "Comunica-se com o CLP por protocolo serial ou Ethernet, lendo e escrevendo tags de memória exibidas em telas gráficas configuráveis."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "0,2A a 1A",
      "signalType": "Ethernet / RS-232 / RS-485",
      "ranges": "Telas de 4,3 a 15 polegadas"
    },
    "applications": [
      "Painéis de operação de máquinas",
      "Supervisão local de processos",
      "Ajuste de receitas de produção"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não utilizar a IHM como único meio de parada de emergência."
      ],
      "commonFailures": [
        "Perda de comunicação por cabo ou configuração de protocolo incorreta.",
        "Touch descalibrado ou danificado por uso com objetos pontiagudos."
      ]
    }
  },
  {
    "id": "ihm-textual",
    "name": "IHM Textual (Display Alfanumérico)",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Interface com display de caracteres e teclas físicas.",
    "purpose": "Exibe mensagens e permite ajustes simples de parâmetros em máquinas que não exigem gráficos.",
    "howItWorks": {
      "simple": "Mostra textos e números em uma tela pequena e você navega com os botões.",
      "technical": "Troca dados com o CLP via comunicação serial, exibindo mensagens e valores associados a endereços de memória."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "0,1A a 0,3A",
      "signalType": "RS-232 / RS-485",
      "ranges": "Displays de 2 a 4 linhas"
    },
    "applications": [
      "Ajuste de setpoints",
      "Exibição de alarmes em texto",
      "Contagem de produção"
    ],
    "safetyAndFailures": {
      "safety": [
        "Proteger o frontal contra respingos de óleo e produtos químicos."
      ],
      "commonFailures": [
        "Teclas desgastadas pelo uso intenso.",
        "Display apagado por falha na alimentação."
      ]
    }
  },
  {
    "id": "modulo-entradas-digitais",
    "name": "Módulo de Entradas Digitais",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Módulo que lê sinais liga/desliga de sensores e botoeiras.",
    "purpose": "Informa ao CLP o estado de dispositivos de campo como botões, chaves fim de curso e sensores.",
    "howItWorks": {
      "simple": "Percebe se cada fio está com tensão ou sem tensão e avisa o CLP.",
      "technical": "Circuitos com isolação óptica convertem os níveis de tensão de campo em sinais lógicos para o barramento do controlador."
    },
    "specs": {
      "voltage": "24VDC / 110-230VAC",
      "current": "2mA a 10mA por canal",
      "signalType": "Digital (Sink / Source)",
      "ranges": "8, 16 ou 32 canais"
    },
    "applications": [
      "Leitura de botoeiras e fins de curso",
      "Monitoramento de sensores de posição",
      "Detecção de estado de contatores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar a polaridade e o tipo de entrada (NPN ou PNP)."
      ],
      "commonFailures": [
        "Canal travado em nível alto por tensão residual.",
        "Ruído elétrico causando leituras falsas."
      ]
    }
  },
  {
    "id": "modulo-saidas-digitais",
    "name": "Módulo de Saídas Digitais",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Módulo que aciona cargas liga/desliga por relé ou transistor.",
    "purpose": "Permite ao CLP comandar contatores, solenoides e sinaleiros.",
    "howItWorks": {
      "simple": "Recebe a ordem do CLP e liga ou desliga cada carga conectada.",
      "technical": "Saídas a relé, transistor ou triac, isoladas oticamente, comutam a carga conforme o estado da memória de saída."
    },
    "specs": {
      "voltage": "24VDC / 24-240VAC",
      "current": "0,5A a 2A por canal",
      "signalType": "Digital (Relé / Transistor / Triac)",
      "ranges": "8, 16 ou 32 canais"
    },
    "applications": [
      "Acionamento de bobinas de contatores",
      "Comando de válvulas solenoides",
      "Sinalização luminosa e sonora"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não exceder a corrente por canal e a corrente total do módulo.",
        "Usar diodo ou supressor em cargas indutivas."
      ],
      "commonFailures": [
        "Contatos do relé colados por sobrecorrente.",
        "Transistor queimado por curto-circuito na carga."
      ]
    }
  },
  {
    "id": "modulo-entradas-analogicas",
    "name": "Módulo de Entradas Analógicas",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Módulo que converte sinais contínuos de sensores em valores numéricos.",
    "purpose": "Permite ao CLP medir grandezas como temperatura, pressão, nível e vazão.",
    "howItWorks": {
      "simple": "Transforma uma variação de tensão ou corrente em um número que o CLP entende.",
      "technical": "Conversor A/D com resolução de 12 a 16 bits amostra sinais de 0-10V, 4-20mA ou sensores RTD e termopar."
    },
    "specs": {
      "voltage": "24VDC (alimentação)",
      "current": "50mA a 150mA",
      "signalType": "0-10V / 4-20mA / PT100 / Termopar",
      "ranges": "2, 4 ou 8 canais"
    },
    "applications": [
      "Medição de temperatura de processos",
      "Leitura de transmissores de pressão",
      "Monitoramento de nível analógico"
    ],
    "safetyAndFailures": {
      "safety": [
        "Usar cabo blindado e aterrar a malha em um único ponto."
      ],
      "commonFailures": [
        "Leitura instável por ruído ou aterramento inadequado.",
        "Rompimento do laço 4-20mA indicado por valor abaixo de 4mA."
      ]
    }
  },
  {
    "id": "modulo-saidas-analogicas",
    "name": "Módulo de Saídas Analógicas",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Módulo que gera sinais contínuos de tensão ou corrente.",
    "purpose": "Permite ao CLP controlar a velocidade de inversores, posição de válvulas proporcionais e outros dispositivos analógicos.",
    "howItWorks": {
      "simple": "Converte um número do CLP em uma tensão ou corrente que varia aos poucos.",
      "technical": "Conversor D/A gera sinais de 0-10V ou 4-20mA proporcionais ao valor digital gravado na memória de saída."
    },
    "specs": {
      "voltage": "24VDC (alimentação)",
      "current": "50mA a 200mA",
      "signalType": "0-10V / 4-20mA",
      "ranges": "2 ou 4 canais"
    },
    "applications": [
      "Referência de velocidade para inversores",
      "Controle de válvulas proporcionais",
      "Dimerização de processos de aquecimento"
    ],
    "safetyAndFailures": {
      "safety": [
        "Verificar a impedância máxima da carga conectada à saída."
      ],
      "commonFailures": [
        "Saída fixa em zero por laço aberto em modo corrente.",
        "Valor oscilante por interferência eletromagnética."
      ]
    }
  },
  {
    "id": "modulo-comunicacao-ethernet",
    "name": "Módulo de Comunicação Ethernet",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Módulo que conecta o CLP a redes Ethernet industriais.",
    "purpose": "Permite a troca de dados entre CLPs, IHMs, supervisórios e sistemas de gestão.",
    "howItWorks": {
      "simple": "Funciona como a placa de rede do CLP, ligando-o a outros equipamentos por cabo de rede.",
      "technical": "Implementa protocolos como Modbus TCP, EtherNet/IP ou Profinet sobre Ethernet 10/100 Mbps."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "100mA a 300mA",
      "signalType": "Ethernet (RJ45)",
      "ranges": "10/100 Mbps, cabo até 100m por segmento"
    },
    "applications": [
      "Integração com sistemas SCADA",
      "Comunicação entre CLPs",
      "Acesso remoto para diagnóstico"
    ],
    "safetyAndFailures": {
      "safety": [
        "Segmentar a rede e proteger o acesso contra usuários não autorizados."
      ],
      "commonFailures": [
        "Conflito de endereços IP na rede.",
        "Perda de comunicação por cabo ou conector danificado."
      ]
    }
  },
  {
    "id": "modulo-comunicacao-profibus",
    "name": "Módulo de Comunicação Profibus",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Módulo para integração do CLP em redes de campo Profibus DP.",
    "purpose": "Conecta o controlador a dispositivos remotos como inversores, remotas de E/S e instrumentos pela mesma rede.",
    "howItWorks": {
      "simple": "Permite que vários equipamentos conversem entre si usando apenas um par de fios.",
      "technical": "Implementa o protocolo Profibus DP sobre RS-485, com velocidades de 9,6 kbps a 12 Mbps e controle por mestre."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "100mA a 250mA",
      "signalType": "RS-485 (Profibus DP)",
      "ranges": "Até 126 endereços, 32 nós por segmento"
    },
    "applications": [
      "Redes de inversores e remotas de E/S",
      "Integração de instrumentação de campo",
      "Automação de plantas de processo"
    ],
    "safetyAndFailures": {
      "safety": [
        "Instalar resistores de terminação nas duas extremidades da rede."
      ],
      "commonFailures": [
        "Erros de comunicação por falta de terminação.",
        "Endereço duplicado entre escravos da rede."
      ]
    }
  },
  {
    "id": "modulo-comunicacao-modbus",
    "name": "Módulo de Comunicação Modbus",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Módulo para comunicação serial ou TCP com o protocolo Modbus.",
    "purpose": "Integra o CLP a medidores, inversores, controladores de temperatura e outros dispositivos compatíveis.",
    "howItWorks": {
      "simple": "Permite que o CLP pergunte e receba valores de outros equipamentos por uma linguagem comum.",
      "technical": "Implementa Modbus RTU sobre RS-485 ou Modbus TCP sobre Ethernet, com modelo mestre-escravo e acesso a registradores."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "50mA a 200mA",
      "signalType": "RS-485 / RS-232 / Ethernet",
      "ranges": "Até 247 escravos (RTU)"
    },
    "applications": [
      "Leitura de medidores de energia",
      "Comunicação com inversores de frequência",
      "Integração com controladores de temperatura"
    ],
    "safetyAndFailures": {
      "safety": [
        "Configurar corretamente baud rate, paridade e endereço de cada escravo."
      ],
      "commonFailures": [
        "Timeout por parâmetros de comunicação divergentes.",
        "Ruído na linha RS-485 sem blindagem adequada."
      ]
    }
  },
  {
    "id": "modulo-contagem-rapida",
    "name": "Módulo de Contagem Rápida (High Speed Counter)",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Módulo que conta pulsos em frequências acima da varredura do CLP.",
    "purpose": "Permite ler encoders e sensores de alta frequência para medir posição, velocidade e quantidade.",
    "howItWorks": {
      "simple": "Conta pulsos muito rápidos que o CLP sozinho não conseguiria acompanhar.",
      "technical": "Contador por hardware independente do ciclo de varredura, com suporte a entradas A/B/Z de encoders e comparadores de valor."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "50mA a 150mA",
      "signalType": "Pulsos A/B/Z (NPN / PNP / Line Driver)",
      "ranges": "Até 100kHz a 1MHz"
    },
    "applications": [
      "Leitura de encoders de posição",
      "Medição de velocidade de eixos",
      "Dosagem e corte por comprimento"
    ],
    "safetyAndFailures": {
      "safety": [
        "Utilizar cabo blindado e separado da fiação de potência."
      ],
      "commonFailures": [
        "Contagem perdida por ruído nos sinais do encoder.",
        "Valor incorreto por ligação invertida entre canais A e B."
      ]
    }
  },
  {
    "id": "gateway-industrial-iot",
    "name": "Gateway Industrial IoT",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Dispositivo que coleta dados de máquinas e os envia para a nuvem.",
    "purpose": "Conecta equipamentos industriais a sistemas de monitoramento remoto e análise de dados.",
    "howItWorks": {
      "simple": "Lê as informações da máquina e as envia pela internet para você acompanhar à distância.",
      "technical": "Converte protocolos industriais como Modbus e OPC UA para MQTT ou HTTP, com envio criptografado para plataformas em nuvem."
    },
    "specs": {
      "voltage": "9-36VDC",
      "current": "0,1A a 0,5A",
      "signalType": "Ethernet / RS-485 / Wi-Fi / 4G",
      "ranges": "MQTT, OPC UA, Modbus"
    },
    "applications": [
      "Monitoramento remoto de máquinas",
      "Manutenção preditiva",
      "Painéis de indicadores de produção"
    ],
    "safetyAndFailures": {
      "safety": [
        "Aplicar autenticação, criptografia e firewall na conexão com a internet."
      ],
      "commonFailures": [
        "Perda de dados por queda do link de internet.",
        "Falha de leitura por mapeamento de registradores incorreto."
      ]
    }
  },
  {
    "id": "fonte-24vcc",
    "name": "Fonte de Alimentação 24 Vcc",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Fonte chaveada que converte a tensão da rede em 24VDC regulados.",
    "purpose": "Alimenta CLPs, sensores, IHMs e demais dispositivos de comando em painéis elétricos.",
    "howItWorks": {
      "simple": "Transforma a tensão da tomada em uma tensão contínua e estável de 24V.",
      "technical": "Conversor chaveado AC/DC com retificação, filtragem e regulação, protegido contra curto-circuito e sobrecarga."
    },
    "specs": {
      "voltage": "Entrada 100-240VAC / Saída 24VDC",
      "current": "1A a 40A (saída)",
      "signalType": "Alimentação CC regulada",
      "ranges": "24W a 960W"
    },
    "applications": [
      "Alimentação de painéis de comando",
      "Fornecimento para sensores e CLPs",
      "Alimentação de IHMs e módulos de E/S"
    ],
    "safetyAndFailures": {
      "safety": [
        "Dimensionar a fonte com folga de pelo menos 20% sobre a carga total.",
        "Garantir ventilação adequada no painel."
      ],
      "commonFailures": [
        "Desligamento por proteção de sobrecarga.",
        "Capacitores degradados por operação em alta temperatura."
      ]
    }
  },
  {
    "id": "switch-ethernet-industrial",
    "name": "Switch Ethernet Industrial",
    "category": "Automação & CLP",
    "icon": "💻",
    "shortDescription": "Switch de rede robusto para ambientes industriais.",
    "purpose": "Interliga CLPs, IHMs, inversores e computadores em uma rede Ethernet confiável.",
    "howItWorks": {
      "simple": "Distribui o sinal de rede entre todos os equipamentos conectados a ele.",
      "technical": "Comuta quadros Ethernet na camada 2, com recursos como VLAN, redundância em anel e montagem em trilho DIN, em carcaça resistente a vibração e temperatura."
    },
    "specs": {
      "voltage": "12-48VDC",
      "current": "0,2A a 1A",
      "signalType": "Ethernet 10/100/1000 Mbps",
      "ranges": "5 a 24 portas"
    },
    "applications": [
      "Redes de automação em painéis",
      "Interligação de câmeras e controladores",
      "Redes redundantes em anel"
    ],
    "safetyAndFailures": {
      "safety": [
        "Utilizar alimentação redundante em aplicações críticas."
      ],
      "commonFailures": [
        "Loop de rede por cabeamento incorreto.",
        "Porta danificada por surtos sem proteção."
      ]
    }
  },
  {
    "id": "contator-tripolar",
    "name": "Contator Tripolar",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Chave eletromagnética para ligar e desligar cargas trifásicas.",
    "purpose": "Aciona motores e outras cargas de potência a partir de um comando de baixa corrente.",
    "howItWorks": {
      "simple": "Uma bobina vira um ímã quando energizada e fecha os contatos que alimentam a carga.",
      "technical": "A bobina gera campo magnético que atrai o núcleo móvel, fechando os três contatos principais e os contatos auxiliares associados."
    },
    "specs": {
      "voltage": "Bobina 24VDC / 24-440VAC",
      "current": "9A a 800A (AC-3)",
      "signalType": "Comando CA ou CC",
      "ranges": "Até 690V no circuito de potência"
    },
    "applications": [
      "Partida de motores trifásicos",
      "Acionamento de resistências de aquecimento",
      "Comando de bancos de iluminação"
    ],
    "safetyAndFailures": {
      "safety": [
        "Utilizar sempre com relé térmico ou disjuntor motor.",
        "Desenergizar o circuito antes de qualquer manutenção."
      ],
      "commonFailures": [
        "Contatos soldados por sobrecorrente.",
        "Bobina queimada por tensão incorreta ou núcleo sujo."
      ]
    }
  },
  {
    "id": "contator-auxiliar",
    "name": "Contator Auxiliar",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Contator de baixa potência com vários contatos para lógica de comando.",
    "purpose": "Replica e multiplica sinais em circuitos de comando, intertravamentos e sinalização.",
    "howItWorks": {
      "simple": "Funciona como um contator pequeno que abre e fecha vários contatos de comando ao mesmo tempo.",
      "technical": "Bobina eletromagnética aciona contatos auxiliares NA e NF dimensionados para correntes baixas, tipicamente até 10A."
    },
    "specs": {
      "voltage": "Bobina 24VDC / 24-240VAC",
      "current": "6A a 10A (contatos)",
      "signalType": "Comando CA ou CC",
      "ranges": "4 a 8 contatos NA/NF"
    },
    "applications": [
      "Intertravamentos de painéis",
      "Multiplicação de contatos de comando",
      "Lógicas de sinalização e alarme"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não usar para acionar cargas de potência."
      ],
      "commonFailures": [
        "Contatos oxidados por baixa corrente de trabalho.",
        "Zumbido por mola ou núcleo desgastado."
      ]
    }
  },
  {
    "id": "contator-capacitores",
    "name": "Contator para Capacitores",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Contator com resistores de pré-carga para limitar a corrente de inrush.",
    "purpose": "Manobra bancos de capacitores usados na correção de fator de potência sem danificar os contatos.",
    "howItWorks": {
      "simple": "Liga o capacitor aos poucos, evitando um pico de corrente forte no momento da energização.",
      "technical": "Contatos de pré-inserção com resistores limitam a corrente de inrush, que pode chegar a dezenas de vezes a nominal."
    },
    "specs": {
      "voltage": "Bobina 24-440VAC",
      "current": "12,5 a 100 kvar",
      "signalType": "Comando CA",
      "ranges": "Até 690V"
    },
    "applications": [
      "Correção de fator de potência",
      "Bancos de capacitores automáticos",
      "Compensação reativa industrial"
    ],
    "safetyAndFailures": {
      "safety": [
        "Descarregar os capacitores antes de manutenção, respeitando o tempo de descarga."
      ],
      "commonFailures": [
        "Desgaste dos contatos por picos de inrush.",
        "Resistores de pré-carga queimados por manobras muito frequentes."
      ]
    }
  },
  {
    "id": "disjuntor-termomagnetico-monopolar",
    "name": "Disjuntor Termomagnético Monopolar",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Dispositivo de proteção de um polo contra sobrecarga e curto-circuito.",
    "purpose": "Protege circuitos monofásicos de iluminação, tomadas e cargas de baixa potência.",
    "howItWorks": {
      "simple": "Desarma sozinho quando a corrente é maior do que o circuito suporta.",
      "technical": "Elemento bimetálico atua em sobrecargas e bobina eletromagnética atua instantaneamente em curto-circuito."
    },
    "specs": {
      "voltage": "127V / 230VAC",
      "current": "6A a 63A",
      "signalType": "Potência monofásica",
      "ranges": "Curvas B, C e D; capacidade de interrupção 3 a 10kA"
    },
    "applications": [
      "Circuitos de iluminação",
      "Circuitos de tomadas",
      "Proteção de cargas monofásicas em painéis"
    ],
    "safetyAndFailures": {
      "safety": [
        "Escolher a corrente nominal compatível com a bitola do condutor."
      ],
      "commonFailures": [
        "Desarmes frequentes por sobrecarga do circuito.",
        "Aquecimento por aperto insuficiente dos terminais."
      ]
    }
  },
  {
    "id": "disjuntor-termomagnetico-tripolar",
    "name": "Disjuntor Termomagnético Tripolar",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Dispositivo de proteção de três polos para circuitos trifásicos.",
    "purpose": "Protege alimentadores, quadros de distribuição e cargas trifásicas contra sobrecarga e curto-circuito.",
    "howItWorks": {
      "simple": "Corta as três fases ao mesmo tempo quando detecta corrente excessiva.",
      "technical": "Os três polos são acoplados mecanicamente e atuam por disparadores térmico e magnético, desligando todas as fases em conjunto."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "10A a 125A (caixa moldada acima)",
      "signalType": "Potência trifásica",
      "ranges": "Curvas B, C e D; capacidade de interrupção 3 a 25kA"
    },
    "applications": [
      "Proteção geral de quadros",
      "Alimentação de motores e máquinas",
      "Circuitos de distribuição trifásica"
    ],
    "safetyAndFailures": {
      "safety": [
        "Dimensionar a capacidade de interrupção acima da corrente de curto-circuito presumida."
      ],
      "commonFailures": [
        "Desarme por sobrecarga em um dos polos.",
        "Superaquecimento por conexão frouxa."
      ]
    }
  },
  {
    "id": "disjuntor-diferencial-residual",
    "name": "Disjuntor Diferencial Residual (DR)",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Dispositivo que detecta fuga de corrente para a terra.",
    "purpose": "Protege pessoas contra choques elétricos e instalações contra incêndios causados por correntes de fuga.",
    "howItWorks": {
      "simple": "Percebe quando parte da corrente está escapando pelo caminho errado e desliga o circuito.",
      "technical": "Transformador toroidal compara as correntes de ida e volta; a diferença acima da sensibilidade, por exemplo 30mA, dispara o mecanismo de abertura."
    },
    "specs": {
      "voltage": "230V / 400VAC",
      "current": "25A a 100A",
      "signalType": "Potência (monofásico / trifásico)",
      "ranges": "Sensibilidade 30mA, 100mA ou 300mA"
    },
    "applications": [
      "Proteção de banheiros e áreas molhadas",
      "Proteção de circuitos de tomadas",
      "Painéis de distribuição"
    ],
    "safetyAndFailures": {
      "safety": [
        "Testar o botão de teste periodicamente.",
        "Não substitui a proteção contra sobrecarga."
      ],
      "commonFailures": [
        "Desarmes indevidos por umidade ou isolação degradada.",
        "Não desarmar por mecanismo travado por falta de uso."
      ]
    }
  },
  {
    "id": "dps",
    "name": "Dispositivo de Proteção contra Surtos (DPS)",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Protege equipamentos contra sobretensões transitórias.",
    "purpose": "Desvia para a terra os surtos causados por descargas atmosféricas e manobras na rede.",
    "howItWorks": {
      "simple": "Funciona como uma válvula de alívio: quando surge uma tensão alta demais, ele a desvia para o aterramento.",
      "technical": "Varistores de óxido de zinco ou centelhadores tornam-se condutores acima de uma tensão limite, limitando a sobretensão aplicada à carga."
    },
    "specs": {
      "voltage": "175V a 460VAC",
      "current": "20kA a 40kA (In)",
      "signalType": "Proteção de linha de potência",
      "ranges": "Classes I, II e III"
    },
    "applications": [
      "Quadros de distribuição",
      "Proteção de CLPs e inversores",
      "Instalações com risco de descargas atmosféricas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Instalar com aterramento adequado e cabos o mais curtos possível."
      ],
      "commonFailures": [
        "Varistor degradado após múltiplos surtos.",
        "Falta de proteção por indicador de fim de vida ignorado."
      ]
    }
  },
  {
    "id": "rele-termico-sobrecarga",
    "name": "Relé Térmico de Sobrecarga",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Protege motores contra sobrecarga prolongada.",
    "purpose": "Desliga o contator quando a corrente do motor ultrapassa o valor ajustado por tempo suficiente para causar aquecimento.",
    "howItWorks": {
      "simple": "Esquenta com a corrente do motor e, se esquentar demais, abre um contato que desliga o comando.",
      "technical": "Lâminas bimetálicas se deformam com o aquecimento causado pela corrente, atuando contatos auxiliares NA/NF de comando."
    },
    "specs": {
      "voltage": "Até 690VAC",
      "current": "0,1A a 150A (ajustável)",
      "signalType": "Contato auxiliar NA/NF",
      "ranges": "Classes de disparo 10, 20 e 30"
    },
    "applications": [
      "Proteção de motores trifásicos",
      "Partidas diretas e estrela-triângulo",
      "Proteção de bombas e ventiladores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Ajustar a corrente conforme a placa do motor, considerando o fator de serviço."
      ],
      "commonFailures": [
        "Desarme indevido por ajuste muito baixo.",
        "Atuação lenta por mau contato ou ajuste excessivo."
      ]
    }
  },
  {
    "id": "rele-temporizador-energizacao",
    "name": "Relé Temporizador - Retardo na Energização",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Relé que atrasa o fechamento do contato após ser energizado.",
    "purpose": "Introduz atrasos de tempo em sequências de comando, como partidas escalonadas e estrela-triângulo.",
    "howItWorks": {
      "simple": "Ao receber energia, espera o tempo ajustado e só então liga o contato.",
      "technical": "Circuito eletrônico ou pneumático inicia a contagem na energização e comuta o contato de saída ao fim do tempo ajustado."
    },
    "specs": {
      "voltage": "24VDC / 24-240VAC",
      "current": "Contato 5A a 10A",
      "signalType": "Contato reversível (NA/NF)",
      "ranges": "0,1s a 100h (conforme modelo)"
    },
    "applications": [
      "Partida estrela-triângulo",
      "Sequenciamento de motores",
      "Atrasos em lógicas de comando"
    ],
    "safetyAndFailures": {
      "safety": [
        "Conferir a faixa de tempo selecionada antes de energizar."
      ],
      "commonFailures": [
        "Temporização incorreta por ajuste fora da escala.",
        "Contato desgastado por carga acima da capacidade."
      ]
    }
  },
  {
    "id": "rele-temporizador-desenergizacao",
    "name": "Relé Temporizador - Retardo na Desenergização",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Relé que mantém o contato fechado por um tempo após a retirada do comando.",
    "purpose": "Mantém cargas ligadas por um período após o fim do sinal, como ventilação residual e luz de escada.",
    "howItWorks": {
      "simple": "Quando o comando é desligado, ele espera o tempo ajustado para desligar a saída.",
      "technical": "Ao ser retirada a energização do comando, o circuito inicia a contagem e abre o contato de saída apenas ao fim do tempo."
    },
    "specs": {
      "voltage": "24VDC / 24-240VAC",
      "current": "Contato 5A a 10A",
      "signalType": "Contato reversível com entrada de comando",
      "ranges": "0,1s a 100h (conforme modelo)"
    },
    "applications": [
      "Ventilação pós-processo",
      "Iluminação temporizada",
      "Atraso de desligamento de bombas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Verificar se o modelo exige alimentação permanente e sinal de comando separado."
      ],
      "commonFailures": [
        "Não temporizar por ligação incorreta do sinal de comando.",
        "Tempo impreciso por falha do circuito eletrônico."
      ]
    }
  },
  {
    "id": "rele-falta-fase",
    "name": "Relé de Falta de Fase",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Monitora a rede trifásica e desliga o comando se faltar uma fase.",
    "purpose": "Protege motores contra operação em duas fases, que causa superaquecimento e queima.",
    "howItWorks": {
      "simple": "Vigia as três fases e, se uma sumir, desliga o comando do motor.",
      "technical": "Monitora a tensão de cada fase e comuta o contato de saída quando detecta ausência, assimetria ou subtensão fora do limite ajustado."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "Contato 5A a 8A",
      "signalType": "Contato reversível (NA/NF)",
      "ranges": "Assimetria ajustável de 5% a 15%"
    },
    "applications": [
      "Proteção de motores trifásicos",
      "Proteção de bombas e compressores",
      "Painéis com alimentação trifásica"
    ],
    "safetyAndFailures": {
      "safety": [
        "Ligar o contato de saída no circuito de comando da contatora."
      ],
      "commonFailures": [
        "Atuação indevida por oscilações da rede.",
        "Falha de proteção por contato de saída soldado."
      ]
    }
  },
  {
    "id": "rele-sequencia-fase",
    "name": "Relé de Sequência de Fase",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Detecta a inversão da ordem das fases de alimentação.",
    "purpose": "Evita que motores sensíveis, como compressores scroll e bombas, girem no sentido errado.",
    "howItWorks": {
      "simple": "Confere se as três fases chegam na ordem certa e só libera o comando se estiver correto.",
      "technical": "Compara a sequência angular das tensões trifásicas e comuta o contato de saída somente para a sequência configurada como correta."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "Contato 5A a 8A",
      "signalType": "Contato reversível (NA/NF)",
      "ranges": "Rede trifásica 50/60Hz"
    },
    "applications": [
      "Compressores scroll",
      "Esteiras e elevadores",
      "Bombas trifásicas de sentido único"
    ],
    "safetyAndFailures": {
      "safety": [
        "Reconferir a sequência após qualquer manutenção na rede de alimentação."
      ],
      "commonFailures": [
        "Não liberar o comando após troca de fases na manutenção.",
        "Contato de saída danificado por carga excessiva."
      ]
    }
  },
  {
    "id": "rele-interface",
    "name": "Relé de Interface (Relé Acoplador)",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Relé compacto que isola e amplifica sinais entre CLP e cargas.",
    "purpose": "Permite que saídas de baixa corrente do CLP comandem cargas maiores com isolamento galvânico.",
    "howItWorks": {
      "simple": "Recebe um sinal fraco do CLP e fecha um contato mais forte para acionar a carga.",
      "technical": "Bobina de baixa potência aciona contato de comutação isolado, montado em base para trilho DIN com LED indicador."
    },
    "specs": {
      "voltage": "Bobina 12VDC / 24VDC / 110-230VAC",
      "current": "Contato 6A a 16A",
      "signalType": "Contato reversível (SPDT / DPDT)",
      "ranges": "1 ou 2 contatos de comutação"
    },
    "applications": [
      "Interface entre CLP e contatores",
      "Isolação de sinais em painéis",
      "Acionamento de solenoides e sinaleiros"
    ],
    "safetyAndFailures": {
      "safety": [
        "Usar diodo ou supressor em bobinas CC para proteger a saída do CLP."
      ],
      "commonFailures": [
        "Contatos desgastados por manobras frequentes.",
        "Bobina danificada por tensão de comando incorreta."
      ]
    }
  },
  {
    "id": "rele-estado-solido",
    "name": "Relé de Estado Sólido",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Relé sem partes móveis que comuta cargas por semicondutores.",
    "purpose": "Comuta cargas em alta frequência e sem desgaste mecânico, como em controle de temperatura por PID.",
    "howItWorks": {
      "simple": "Liga e desliga a carga eletronicamente, sem contatos que se movem.",
      "technical": "Entrada acoplada oticamente aciona triacs, tiristores ou MOSFETs que comutam a carga, geralmente com detecção de passagem por zero."
    },
    "specs": {
      "voltage": "Controle 3-32VDC / Carga 24-480VAC",
      "current": "10A a 100A",
      "signalType": "Controle DC, saída CA ou CC",
      "ranges": "Passagem por zero ou disparo instantâneo"
    },
    "applications": [
      "Controle de resistências de aquecimento",
      "Fornos e estufas",
      "Controle de temperatura por PID"
    ],
    "safetyAndFailures": {
      "safety": [
        "Instalar em dissipador de calor dimensionado para a corrente da carga.",
        "Utilizar fusível ultrarrápido em série."
      ],
      "commonFailures": [
        "Curto-circuito permanente por sobreaquecimento.",
        "Fuga de corrente que mantém cargas pequenas parcialmente ligadas."
      ]
    }
  },
  {
    "id": "botoeira-pulsante-verde",
    "name": "Botoeira Pulsante (Verde - Liga)",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Botão de comando com retorno por mola, normalmente aberto, para ligar.",
    "purpose": "Envia o comando de partida a contatores, relés e CLPs.",
    "howItWorks": {
      "simple": "Ao ser pressionado, fecha o contato; ao soltar, volta sozinho à posição de repouso.",
      "technical": "Contato NA de ação momentânea com mola de retorno, montado em furo de 22mm de painel."
    },
    "specs": {
      "voltage": "Até 600VAC / 250VDC",
      "current": "10A (contatos)",
      "signalType": "Contato NA momentâneo",
      "ranges": "Furo de painel 22mm, IP65"
    },
    "applications": [
      "Partida de motores",
      "Comando de máquinas",
      "Entradas digitais de CLP"
    ],
    "safetyAndFailures": {
      "safety": [
        "Seguir o padrão de cores: verde para liga."
      ],
      "commonFailures": [
        "Contato oxidado por umidade.",
        "Mola quebrada que impede o retorno do botão."
      ]
    }
  },
  {
    "id": "botoeira-pulsante-vermelha",
    "name": "Botoeira Pulsante (Vermelha - Desliga)",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Botão de comando com retorno por mola, normalmente fechado, para desligar.",
    "purpose": "Interrompe o circuito de comando e desliga o equipamento de forma controlada.",
    "howItWorks": {
      "simple": "Ao ser pressionado, abre o contato e corta o comando da carga.",
      "technical": "Contato NF de ação momentânea que interrompe a retenção do circuito de comando ao ser acionado."
    },
    "specs": {
      "voltage": "Até 600VAC / 250VDC",
      "current": "10A (contatos)",
      "signalType": "Contato NF momentâneo",
      "ranges": "Furo de painel 22mm, IP65"
    },
    "applications": [
      "Parada de motores",
      "Desligamento de máquinas",
      "Circuitos de selo com retenção"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não usar como parada de emergência; para isso, utilizar o botão de emergência."
      ],
      "commonFailures": [
        "Contato NF com mau contato, causando desligamentos aleatórios.",
        "Botão travado por sujeira ou umidade."
      ]
    }
  },
  {
    "id": "botao-emergencia-cogumelo",
    "name": "Botão de Emergência (Cogumelo)",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Botão vermelho de grande cabeça com trava, para parada de emergência.",
    "purpose": "Interrompe imediatamente o funcionamento da máquina em situações de risco.",
    "howItWorks": {
      "simple": "Ao apertar, ele trava na posição e corta o comando; para liberar, é preciso girar ou puxar o botão.",
      "technical": "Contatos NF de abertura positiva com trava mecânica e rearme manual, conforme requisitos de parada de emergência."
    },
    "specs": {
      "voltage": "Até 600VAC / 250VDC",
      "current": "10A (contatos)",
      "signalType": "Contato NF de abertura positiva",
      "ranges": "Furo 22mm, cabeça de 40mm a 60mm"
    },
    "applications": [
      "Paradas de emergência em máquinas",
      "Linhas de produção",
      "Painéis de comando de segurança"
    ],
    "safetyAndFailures": {
      "safety": [
        "Posicionar em local de fácil acesso, sobre fundo amarelo.",
        "Rearmar somente após eliminar a causa da emergência."
      ],
      "commonFailures": [
        "Contato NF com falha silenciosa por oxidação.",
        "Trava mecânica que não mantém a posição acionada."
      ]
    }
  },
  {
    "id": "chave-seletora-2-posicoes",
    "name": "Chave Seletora de 2 Posições",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Chave rotativa de duas posições para seleção de modos.",
    "purpose": "Permite escolher entre dois estados de operação, como manual/automático ou liga/desliga.",
    "howItWorks": {
      "simple": "Você gira a chave para escolher entre duas opções.",
      "technical": "Comutador rotativo com contatos NA/NF e retenção mecânica em cada posição, montado em furo de 22mm."
    },
    "specs": {
      "voltage": "Até 600VAC / 250VDC",
      "current": "10A (contatos)",
      "signalType": "Contato NA/NF com retenção",
      "ranges": "Furo 22mm, IP65"
    },
    "applications": [
      "Seleção manual/automático",
      "Habilitação de funções",
      "Comando local/remoto"
    ],
    "safetyAndFailures": {
      "safety": [
        "Identificar claramente cada posição com etiquetas."
      ],
      "commonFailures": [
        "Contato desgastado por uso intenso.",
        "Posição indefinida por mecanismo de retenção danificado."
      ]
    }
  },
  {
    "id": "chave-seletora-3-posicoes",
    "name": "Chave Seletora de 3 Posições",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Chave rotativa de três posições para seleção de modos.",
    "purpose": "Permite escolher entre três estados, como manual, desligado e automático.",
    "howItWorks": {
      "simple": "Você gira a chave para uma de três posições, e cada uma liga um circuito diferente.",
      "technical": "Comutador rotativo com contatos independentes para cada posição, com retenção ou retorno por mola no centro."
    },
    "specs": {
      "voltage": "Até 600VAC / 250VDC",
      "current": "10A (contatos)",
      "signalType": "Contato NA/NF com 3 posições",
      "ranges": "Furo 22mm, IP65"
    },
    "applications": [
      "Seleção manual/0/automático",
      "Escolha de sentido de giro",
      "Seleção de bombas em sistemas alternados"
    ],
    "safetyAndFailures": {
      "safety": [
        "Garantir intertravamento elétrico quando as posições acionarem cargas opostas."
      ],
      "commonFailures": [
        "Contato intermitente por oxidação.",
        "Seleção errada por etiqueta apagada ou ausente."
      ]
    }
  },
  {
    "id": "sinaleiro-led",
    "name": "Sinaleiro (Lâmpada de Sinalização) LED",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Indicador luminoso de estado em painéis e máquinas.",
    "purpose": "Informa visualmente o estado da máquina, como ligado, desligado, em falha ou em operação.",
    "howItWorks": {
      "simple": "Acende uma luz colorida quando o circuito recebe energia.",
      "technical": "Módulo LED com resistor ou driver integrado, alimentado diretamente pela tensão de comando, em furo padrão de 22mm."
    },
    "specs": {
      "voltage": "24VDC / 110VAC / 220VAC",
      "current": "10mA a 30mA",
      "signalType": "Indicação luminosa",
      "ranges": "Cores: verde, vermelho, amarelo, azul, branco"
    },
    "applications": [
      "Sinalização de máquina ligada",
      "Indicação de falha",
      "Indicação de modo de operação"
    ],
    "safetyAndFailures": {
      "safety": [
        "Seguir o padrão de cores para cada tipo de indicação."
      ],
      "commonFailures": [
        "LED queimado por tensão acima da especificada.",
        "Brilho fraco por corrente de fuga ou queda de tensão no circuito."
      ]
    }
  },
  {
    "id": "fusivel-nh",
    "name": "Fusível NH",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Fusível de alta capacidade de ruptura para proteção de circuitos de potência.",
    "purpose": "Protege cabos e equipamentos contra curto-circuito e sobrecarga em circuitos de alta corrente.",
    "howItWorks": {
      "simple": "Um elemento interno derrete e abre o circuito quando a corrente é excessiva.",
      "technical": "Elemento fusível envolto em areia de quartzo em corpo cerâmico, com curva de atuação e alta capacidade de interrupção, em tamanhos NH00 a NH4."
    },
    "specs": {
      "voltage": "Até 500VAC",
      "current": "6A a 1250A",
      "signalType": "Proteção de potência",
      "ranges": "Tamanhos NH00 a NH4, até 120kA"
    },
    "applications": [
      "Quadros gerais de distribuição",
      "Proteção de alimentadores",
      "Centros de controle de motores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Utilizar punho extrator isolado para troca.",
        "Substituir sempre por fusível de mesma corrente e classe."
      ],
      "commonFailures": [
        "Queima por sobrecarga recorrente do circuito.",
        "Aquecimento por mau contato nas facas de encaixe."
      ]
    }
  },
  {
    "id": "fusivel-diazed",
    "name": "Fusível Diazed",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Fusível de rosca com cartucho para proteção de circuitos de menor corrente.",
    "purpose": "Protege circuitos de comando e de pequenas cargas contra curto-circuito e sobrecarga.",
    "howItWorks": {
      "simple": "Um fio interno derrete e interrompe a corrente se ela passar do limite.",
      "technical": "Cartucho cerâmico com elemento fusível e indicador visual, encaixado em base com parafuso de calibre que impede a troca por valor maior."
    },
    "specs": {
      "voltage": "Até 500VAC",
      "current": "2A a 63A",
      "signalType": "Proteção de potência e comando",
      "ranges": "Até 50kA"
    },
    "applications": [
      "Proteção de circuitos de comando",
      "Proteção de pequenos motores",
      "Painéis industriais de baixa potência"
    ],
    "safetyAndFailures": {
      "safety": [
        "Nunca substituir o fusível por um de corrente maior ou por fio improvisado."
      ],
      "commonFailures": [
        "Queima por sobrecarga ou curto na carga.",
        "Mau contato na base por oxidação."
      ]
    }
  },
  {
    "id": "seccionadora-rotativa",
    "name": "Seccionadora Rotativa",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Chave rotativa para seccionar e isolar circuitos elétricos.",
    "purpose": "Permite o desligamento seguro de máquinas e painéis para manutenção.",
    "howItWorks": {
      "simple": "Ao girar o manípulo, abre ou fecha todas as fases de uma só vez.",
      "technical": "Contatos com mecanismo de ação brusca conectam ou desconectam as fases, com possibilidade de bloqueio por cadeado."
    },
    "specs": {
      "voltage": "Até 690VAC",
      "current": "16A a 630A",
      "signalType": "Potência trifásica",
      "ranges": "Categoria AC-23"
    },
    "applications": [
      "Seccionamento geral de painéis",
      "Isolação de máquinas para manutenção",
      "Chave geral de equipamentos"
    ],
    "safetyAndFailures": {
      "safety": [
        "Aplicar bloqueio e etiquetagem (LOTO) durante a manutenção.",
        "Não manobrar sob carga acima da capacidade nominal."
      ],
      "commonFailures": [
        "Contatos queimados por manobras sob carga.",
        "Manípulo travado por falha no mecanismo."
      ]
    }
  },
  {
    "id": "chave-fim-de-curso",
    "name": "Chave Fim de Curso",
    "category": "Comandos Elétricos",
    "icon": "⚡",
    "shortDescription": "Interruptor mecânico acionado pela posição de uma parte da máquina.",
    "purpose": "Detecta posição, limite de movimento ou presença de objetos para comandar ou parar atuadores.",
    "howItWorks": {
      "simple": "Quando uma peça encosta na alavanca, o contato muda de estado.",
      "technical": "Atuador mecânico, como rolete, haste ou alavanca, aciona contatos NA e NF de ação rápida ou lenta."
    },
    "specs": {
      "voltage": "Até 400VAC / 250VDC",
      "current": "3A a 10A",
      "signalType": "Contato NA + NF",
      "ranges": "IP65 a IP67"
    },
    "applications": [
      "Limites de curso de portões",
      "Fim de movimento de cilindros e esteiras",
      "Intertravamento de proteções de máquinas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Em funções de segurança, usar modelo com abertura positiva e redundância."
      ],
      "commonFailures": [
        "Desgaste do rolete ou da alavanca.",
        "Desalinhamento da fixação, gerando acionamento falho."
      ]
    }
  },
  {
    "id": "sensor-indutivo-m12",
    "name": "Sensor Indutivo Cilíndrico M12",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Detecta objetos metálicos sem contato físico, em corpo roscado M12.",
    "purpose": "Detecta a presença ou posição de peças metálicas em máquinas e linhas de produção.",
    "howItWorks": {
      "simple": "Cria um campo invisível na ponta e percebe quando um metal se aproxima.",
      "technical": "Oscilador gera campo eletromagnético de alta frequência; a aproximação do metal causa correntes parasitas que amortecem a oscilação e comutam a saída."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "Até 200mA (saída)",
      "signalType": "NPN / PNP, NA ou NF",
      "ranges": "2mm a 8mm (distância sensora)"
    },
    "applications": [
      "Detecção de peças metálicas em esteiras",
      "Fim de curso de cilindros",
      "Contagem de dentes de engrenagens"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar a distância sensora nominal e a distância mínima entre sensores."
      ],
      "commonFailures": [
        "Falso acionamento por acúmulo de cavacos metálicos.",
        "Saída danificada por ligação invertida ou curto-circuito."
      ]
    }
  },
  {
    "id": "sensor-indutivo-m18",
    "name": "Sensor Indutivo Cilíndrico M18",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Sensor de proximidade metálico em corpo roscado M18, com maior alcance.",
    "purpose": "Detecta peças metálicas em aplicações que exigem maior distância sensora ou robustez.",
    "howItWorks": {
      "simple": "Percebe a aproximação de metais por um campo eletromagnético na ponta.",
      "technical": "Oscilador LC com bobina maior, que amplia a distância sensora; o metal próximo amortece a oscilação e muda o estado da saída."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "Até 200mA (saída)",
      "signalType": "NPN / PNP, NA ou NF",
      "ranges": "5mm a 12mm (distância sensora)"
    },
    "applications": [
      "Detecção em máquinas pesadas",
      "Posicionamento de eixos",
      "Monitoramento de rotação de engrenagens"
    ],
    "safetyAndFailures": {
      "safety": [
        "Aplicar torque de fixação recomendado nas porcas de montagem."
      ],
      "commonFailures": [
        "Dano mecânico por impacto na face sensora.",
        "Distância de detecção reduzida por material não ferroso."
      ]
    }
  },
  {
    "id": "sensor-indutivo-retangular",
    "name": "Sensor Indutivo Retangular",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Sensor de proximidade metálico em corpo retangular, para espaços reduzidos.",
    "purpose": "Detecta peças metálicas onde o formato cilíndrico não se adapta, como cantos e superfícies planas.",
    "howItWorks": {
      "simple": "Percebe a presença de metal sem encostar, como os sensores cilíndricos.",
      "technical": "Mesmo princípio de oscilador com campo eletromagnético, em invólucro retangular com face sensora plana."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "Até 200mA (saída)",
      "signalType": "NPN / PNP, NA ou NF",
      "ranges": "2mm a 20mm (distância sensora)"
    },
    "applications": [
      "Detecção em pistões compactos",
      "Posição em guias lineares",
      "Monitoramento em máquinas compactas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Fixar com os furos de montagem, sem exercer torque excessivo no corpo."
      ],
      "commonFailures": [
        "Falha por vibração em fixação solta.",
        "Detecção instável por interferência de campos próximos."
      ]
    }
  },
  {
    "id": "sensor-capacitivo-cilindrico",
    "name": "Sensor Capacitivo Cilíndrico",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Detecta materiais metálicos e não metálicos, como líquidos, plásticos e grãos.",
    "purpose": "Detecta presença e nível de materiais que o sensor indutivo não consegue perceber.",
    "howItWorks": {
      "simple": "Sente a mudança no campo elétrico da ponta quando qualquer material se aproxima.",
      "technical": "Eletrodo forma um capacitor com o ambiente; a aproximação do material altera a capacitância, comutando a saída por meio de circuito oscilador."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "Até 200mA (saída)",
      "signalType": "NPN / PNP, NA ou NF",
      "ranges": "3mm a 25mm (ajustável)"
    },
    "applications": [
      "Detecção de nível em tanques",
      "Detecção de grãos e pós em silos",
      "Detecção de produtos em embalagens plásticas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Ajustar a sensibilidade para evitar falsa detecção por umidade ou resíduos."
      ],
      "commonFailures": [
        "Acionamento falso por incrustação ou umidade na ponta.",
        "Leitura instável por temperatura ou material fora do ajuste."
      ]
    }
  },
  {
    "id": "sensor-capacitivo-nivel",
    "name": "Sensor Capacitivo de Nível",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Detecta nível de líquidos e sólidos, inclusive através da parede do recipiente.",
    "purpose": "Monitora níveis máximo e mínimo em reservatórios, tanques e silos.",
    "howItWorks": {
      "simple": "Percebe se há líquido ou material perto da ponta e avisa quando o nível chega nela.",
      "technical": "Mede a variação de capacitância causada pela diferença de constante dielétrica entre o ar e o produto, comutando a saída no ponto ajustado."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "Até 200mA (saída)",
      "signalType": "NPN / PNP ou 4-20mA",
      "ranges": "Detecção por contato ou através de paredes de até 4mm"
    },
    "applications": [
      "Nível de água em reservatórios",
      "Nível de líquidos em tanques plásticos",
      "Controle de silos de grãos"
    ],
    "safetyAndFailures": {
      "safety": [
        "Verificar a compatibilidade química do material do sensor com o produto."
      ],
      "commonFailures": [
        "Falsa leitura por espuma ou incrustação na parede.",
        "Desajuste de sensibilidade após troca do produto monitorado."
      ]
    }
  },
  {
    "id": "sensor-fotoeletrico-difuso",
    "name": "Sensor Fotoelétrico Difuso",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Emite luz e detecta o reflexo diretamente do objeto.",
    "purpose": "Detecta a presença de objetos sem a necessidade de refletor ou receptor separado.",
    "howItWorks": {
      "simple": "Emite uma luz e, se ela voltar ao sensor refletida pelo objeto, ele detecta a presença.",
      "technical": "Emissor e receptor no mesmo corpo; o receptor detecta a luz refletida pelo alvo e comuta a saída quando acima do limiar de sensibilidade."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "Até 100mA (saída)",
      "signalType": "NPN / PNP, NA ou NF",
      "ranges": "10cm a 2m (ajustável)"
    },
    "applications": [
      "Contagem de caixas",
      "Detecção de peças em esteiras",
      "Presença de produtos em embalagens"
    ],
    "safetyAndFailures": {
      "safety": [
        "Manter a lente limpa e alinhada com o alvo."
      ],
      "commonFailures": [
        "Detecção falha em objetos escuros ou brilhantes.",
        "Falso acionamento por reflexos do fundo."
      ]
    }
  },
  {
    "id": "sensor-fotoeletrico-retrorreflexivo",
    "name": "Sensor Fotoelétrico Retrorreflexivo",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Emite luz para um refletor e detecta a interrupção do feixe.",
    "purpose": "Detecta objetos em maiores distâncias usando um espelho refletor como referência.",
    "howItWorks": {
      "simple": "A luz bate no refletor e volta; quando um objeto passa na frente, o feixe é cortado e o sensor detecta.",
      "technical": "Emissor e receptor no mesmo corpo, com luz polarizada refletida por prisma retrorrefletor; a interrupção do feixe comuta a saída."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "Até 100mA (saída)",
      "signalType": "NPN / PNP, NA ou NF",
      "ranges": "Até 5m a 10m (com refletor)"
    },
    "applications": [
      "Detecção de objetos em esteiras largas",
      "Portões e portas automáticas",
      "Detecção de paletes"
    ],
    "safetyAndFailures": {
      "safety": [
        "Usar modelo com luz polarizada para objetos brilhantes."
      ],
      "commonFailures": [
        "Falha por sujeira no refletor.",
        "Desalinhamento do refletor por vibração."
      ]
    }
  },
  {
    "id": "sensor-fotoeletrico-barreira",
    "name": "Sensor Fotoelétrico por Barreira (Emissor/Receptor)",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Par de sensores separados, com feixe de luz direto do emissor ao receptor.",
    "purpose": "Detecta objetos com alta precisão e em grandes distâncias, pela interrupção do feixe.",
    "howItWorks": {
      "simple": "Um lado emite a luz e o outro recebe; quando algo passa no meio, o feixe é cortado e o sensor detecta.",
      "technical": "Emissor e receptor em corpos separados alinhados; a interrupção do feixe de luz comuta a saída do receptor."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "Até 100mA (saída)",
      "signalType": "NPN / PNP, NA ou NF",
      "ranges": "Até 15m a 30m"
    },
    "applications": [
      "Detecção de objetos pequenos",
      "Contagem de peças em alta velocidade",
      "Detecção em portões de garagem"
    ],
    "safetyAndFailures": {
      "safety": [
        "Alinhar cuidadosamente emissor e receptor após a instalação."
      ],
      "commonFailures": [
        "Perda de sinal por sujeira nas lentes.",
        "Desalinhamento por vibração ou impacto na fixação."
      ]
    }
  },
  {
    "id": "sensor-fotoeletrico-fibra",
    "name": "Sensor Fotoelétrico de Fibra Óptica",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Amplificador fotoelétrico com cabos de fibra óptica para pontos de difícil acesso.",
    "purpose": "Detecta objetos muito pequenos em locais de espaço reduzido ou ambientes agressivos.",
    "howItWorks": {
      "simple": "A luz viaja por um fio óptico fino até o ponto de detecção, que pode ser muito pequeno.",
      "technical": "Unidade amplificadora emite e recebe luz por fibras ópticas, permitindo cabeças sensoras minúsculas e resistentes a temperatura e interferências."
    },
    "specs": {
      "voltage": "12-24VDC",
      "current": "Até 100mA (saída)",
      "signalType": "NPN / PNP, NA ou NF",
      "ranges": "Alguns mm a 1m, conforme a fibra"
    },
    "applications": [
      "Detecção de componentes eletrônicos",
      "Detecção de objetos minúsculos",
      "Montagem em ambientes de alta temperatura"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar o raio mínimo de curvatura da fibra óptica."
      ],
      "commonFailures": [
        "Fibra quebrada por dobra excessiva.",
        "Perda de sensibilidade por ponta da fibra suja."
      ]
    }
  },
  {
    "id": "sensor-ultrassonico",
    "name": "Sensor Ultrassônico",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Mede distância e detecta objetos por pulsos de ultrassom.",
    "purpose": "Mede nível de líquidos e sólidos e detecta objetos de diversos materiais e cores, sem contato.",
    "howItWorks": {
      "simple": "Emite um som inaudível que bate no objeto e volta; o tempo de ida e volta indica a distância.",
      "technical": "Transdutor piezoelétrico emite pulsos ultrassônicos e mede o tempo de eco para calcular a distância, com saída digital ou analógica."
    },
    "specs": {
      "voltage": "12-30VDC",
      "current": "Até 50mA (consumo)",
      "signalType": "NPN / PNP / 4-20mA / 0-10V",
      "ranges": "20mm a 10m, conforme o modelo"
    },
    "applications": [
      "Medição de nível de tanques",
      "Controle de diâmetro de bobinas",
      "Detecção de objetos transparentes"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar a zona cega próxima ao sensor."
      ],
      "commonFailures": [
        "Leitura errada por espuma, vapor ou superfícies inclinadas.",
        "Interferência entre sensores ultrassônicos próximos."
      ]
    }
  },
  {
    "id": "sensor-magnetico-reed",
    "name": "Sensor Magnético (Reed Switch)",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Interruptor acionado por campo magnético, usado em cilindros e portas.",
    "purpose": "Detecta a posição do êmbolo de cilindros pneumáticos e a abertura de portas e proteções.",
    "howItWorks": {
      "simple": "Quando um ímã se aproxima, duas lâminas dentro do sensor se encostam e fecham o contato.",
      "technical": "Contato de lâminas ferromagnéticas em ampola de vidro fecha sob ação de campo magnético; versões de estado sólido (Hall) fazem função similar."
    },
    "specs": {
      "voltage": "5-240VAC/DC",
      "current": "Até 500mA",
      "signalType": "Contato NA (Reed) / PNP / NPN (Hall)",
      "ranges": "Sensibilidade conforme o ímã do cilindro"
    },
    "applications": [
      "Posição de êmbolo em cilindros pneumáticos",
      "Detecção de portas abertas",
      "Alarmes de segurança"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não exceder a corrente de comutação do contato Reed."
      ],
      "commonFailures": [
        "Contato colado por pico de corrente.",
        "Ampola de vidro quebrada por impacto."
      ]
    }
  },
  {
    "id": "sensor-temperatura-pt100",
    "name": "Sensor de Temperatura PT100",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Sensor resistivo de platina com alta precisão e estabilidade.",
    "purpose": "Mede temperaturas em processos industriais com boa precisão e linearidade.",
    "howItWorks": {
      "simple": "A resistência do sensor muda de forma previsível conforme a temperatura sobe ou desce.",
      "technical": "Elemento de platina com resistência de 100 ohms a 0°C, que varia de forma quase linear; é lido por ponte ou módulo de entrada RTD."
    },
    "specs": {
      "voltage": "Excitação 1mA (módulo de leitura)",
      "current": "~1mA",
      "signalType": "RTD 2, 3 ou 4 fios",
      "ranges": "-200°C a 600°C"
    },
    "applications": [
      "Controle de temperatura de fornos",
      "Monitoramento de processos alimentícios",
      "Medição em tubulações e tanques"
    ],
    "safetyAndFailures": {
      "safety": [
        "Usar poço de proteção em fluidos agressivos ou sob pressão."
      ],
      "commonFailures": [
        "Erro de leitura por resistência dos cabos em ligação de 2 fios.",
        "Elemento danificado por choque térmico ou vibração."
      ]
    }
  },
  {
    "id": "termopar-tipo-k",
    "name": "Termopar Tipo K",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Sensor de temperatura robusto para ampla faixa e altas temperaturas.",
    "purpose": "Mede temperaturas elevadas em fornos, estufas, caldeiras e processos industriais.",
    "howItWorks": {
      "simple": "Duas ligas metálicas unidas geram uma pequena tensão que depende da temperatura.",
      "technical": "Junção de Chromel e Alumel gera tensão por efeito Seebeck, proporcional à diferença de temperatura entre a junção quente e a de referência."
    },
    "specs": {
      "voltage": "Sinal em milivolts",
      "current": "Desprezível (sinal passivo)",
      "signalType": "Tensão em mV (termopar)",
      "ranges": "-200°C a 1260°C"
    },
    "applications": [
      "Fornos e estufas industriais",
      "Extrusoras e injetoras",
      "Monitoramento de gases de escape"
    ],
    "safetyAndFailures": {
      "safety": [
        "Usar cabo de compensação adequado e respeitar a polaridade."
      ],
      "commonFailures": [
        "Deriva de leitura por envelhecimento em altas temperaturas.",
        "Leitura errada por ligação invertida ou junção de referência incorreta."
      ]
    }
  },
  {
    "id": "transmissor-pressao",
    "name": "Transmissor de Pressão",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Converte a pressão de fluidos em sinal elétrico padronizado.",
    "purpose": "Monitora e controla a pressão em tubulações, tanques, sistemas hidráulicos e pneumáticos.",
    "howItWorks": {
      "simple": "Mede o quanto o fluido empurra e transforma isso em um sinal elétrico.",
      "technical": "Elemento sensor piezoresistivo ou capacitivo deforma sob pressão; o circuito condiciona o sinal para saída 4-20mA ou 0-10V."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "4-20mA (laço)",
      "signalType": "4-20mA / 0-10V",
      "ranges": "0 a 1bar até 0 a 600bar"
    },
    "applications": [
      "Pressão de linhas de ar comprimido",
      "Controle de bombas hidráulicas",
      "Monitoramento de tanques pressurizados"
    ],
    "safetyAndFailures": {
      "safety": [
        "Despressurizar a linha antes de remover o transmissor.",
        "Escolher a faixa de pressão com margem sobre a pressão de trabalho."
      ],
      "commonFailures": [
        "Deriva de zero por sobrepressão.",
        "Obstrução da conexão por sujeira ou fluido viscoso."
      ]
    }
  },
  {
    "id": "sensor-vazao",
    "name": "Sensor de Vazão",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Mede a quantidade de líquido ou gás que passa por uma tubulação.",
    "purpose": "Monitora e controla vazão em processos de dosagem, refrigeração e distribuição de fluidos.",
    "howItWorks": {
      "simple": "Mede quão rápido o fluido passa e transforma isso em um sinal elétrico.",
      "technical": "Pode usar turbina, efeito Hall, ultrassom, eletromagnético ou pressão diferencial, gerando pulsos ou sinal analógico proporcional à vazão."
    },
    "specs": {
      "voltage": "5-30VDC",
      "current": "10mA a 100mA",
      "signalType": "Pulsos / 4-20mA",
      "ranges": "0,1 a 1000 L/min, conforme o modelo"
    },
    "applications": [
      "Dosagem de líquidos",
      "Monitoramento de refrigeração",
      "Medição de consumo de água"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar a direção de fluxo indicada no corpo do sensor."
      ],
      "commonFailures": [
        "Entupimento por sujeira ou partículas.",
        "Leitura imprecisa por bolhas de ar na linha."
      ]
    }
  },
  {
    "id": "encoder-incremental",
    "name": "Encoder Incremental",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Gera pulsos proporcionais ao movimento de rotação de um eixo.",
    "purpose": "Mede posição relativa, velocidade e sentido de giro em máquinas e motores.",
    "howItWorks": {
      "simple": "A cada pedacinho de giro do eixo, ele envia um pulso elétrico que pode ser contado.",
      "technical": "Disco com marcações lido por sensor óptico gera sinais A e B defasados 90°, e o pulso Z de referência por volta."
    },
    "specs": {
      "voltage": "5-30VDC",
      "current": "Até 100mA",
      "signalType": "A/B/Z (NPN / PNP / Line Driver)",
      "ranges": "100 a 10.000 PPR"
    },
    "applications": [
      "Controle de velocidade de motores",
      "Medição de comprimento em esteiras",
      "Posicionamento em máquinas CNC"
    ],
    "safetyAndFailures": {
      "safety": [
        "Usar acoplamento flexível para evitar esforço no eixo."
      ],
      "commonFailures": [
        "Perda de pulsos por ruído elétrico.",
        "Desgaste de rolamento por desalinhamento do acoplamento."
      ]
    }
  },
  {
    "id": "encoder-absoluto",
    "name": "Encoder Absoluto",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Informa a posição angular exata do eixo, mesmo após desligamento.",
    "purpose": "Mede posição absoluta em aplicações que não podem perder a referência ao desligar.",
    "howItWorks": {
      "simple": "Cada posição do eixo tem um código único, então o encoder sempre sabe onde está.",
      "technical": "Disco codificado, em código Gray ou binário, é lido por sensores ópticos ou magnéticos, e envia a posição por SSI, Profibus, CANopen ou analógico."
    },
    "specs": {
      "voltage": "10-30VDC",
      "current": "Até 150mA",
      "signalType": "SSI / Profibus / CANopen / 4-20mA",
      "ranges": "Resolução de 10 a 16 bits (single-turn); multi-turn disponível"
    },
    "applications": [
      "Posicionamento de guindastes e pontes rolantes",
      "Antenas e painéis solares",
      "Eixos de máquinas-ferramenta"
    ],
    "safetyAndFailures": {
      "safety": [
        "Utilizar modelos com certificação de segurança em aplicações críticas."
      ],
      "commonFailures": [
        "Erro de posição por falha na bateria em versões multi-turn por bateria.",
        "Falha de comunicação por cabo ou terminação inadequados."
      ]
    }
  },
  {
    "id": "cortina-luz-seguranca",
    "name": "Cortina de Luz de Segurança",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Barreira óptica de segurança que protege a área de risco de máquinas.",
    "purpose": "Detecta a presença de pessoas ou partes do corpo e para a máquina para evitar acidentes.",
    "howItWorks": {
      "simple": "Cria uma parede de luz invisível; se alguém a atravessar, a máquina para.",
      "technical": "Vários feixes infravermelhos entre emissor e receptor, com circuito de segurança redundante, abrem as saídas OSSD ao interromper qualquer feixe."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "0,2A a 1A",
      "signalType": "OSSD (saídas de segurança PNP)",
      "ranges": "Resolução de 14mm a 90mm; alcance de 0,3m a 20m"
    },
    "applications": [
      "Prensas e dobradeiras",
      "Células robotizadas",
      "Entradas de linhas automatizadas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar a distância mínima de segurança calculada conforme a norma.",
        "Testar periodicamente o funcionamento e o tempo de parada."
      ],
      "commonFailures": [
        "Parada indevida por desalinhamento ou sujeira nas lentes.",
        "Falhas por burla de segurança, como bypass indevido."
      ]
    }
  },
  {
    "id": "sensor-cor",
    "name": "Sensor de Cor",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Identifica a cor de objetos por análise da luz refletida.",
    "purpose": "Distingue produtos, rótulos e peças pela cor em inspeção e seleção automatizadas.",
    "howItWorks": {
      "simple": "Ilumina o objeto e analisa a cor da luz que volta, comparando com cores já aprendidas.",
      "technical": "Emissores RGB ou luz branca e receptor com filtros medem a refletância; o sensor compara com valores aprendidos e comuta a saída conforme a tolerância."
    },
    "specs": {
      "voltage": "12-24VDC",
      "current": "50mA a 150mA",
      "signalType": "NPN / PNP / IO-Link",
      "ranges": "10mm a 100mm de distância de leitura"
    },
    "applications": [
      "Seleção de produtos por cor",
      "Verificação de rótulos e tampas",
      "Controle de qualidade em embalagem"
    ],
    "safetyAndFailures": {
      "safety": [
        "Proteger a janela óptica contra poeira e respingos."
      ],
      "commonFailures": [
        "Leitura instável por variação da luz ambiente.",
        "Erro de classificação por distância de leitura incorreta."
      ]
    }
  },
  {
    "id": "sensor-presenca-infravermelho",
    "name": "Sensor de Presença Infravermelho",
    "category": "Sensores de Campo",
    "icon": "📡",
    "shortDescription": "Detecta movimento de pessoas pela variação de radiação infravermelha.",
    "purpose": "Aciona iluminação, portas e alarmes quando detecta presença humana na área monitorada.",
    "howItWorks": {
      "simple": "Percebe o calor do corpo em movimento e liga a saída quando alguém passa.",
      "technical": "Sensor piroelétrico detecta variações de radiação infravermelha através de lentes de Fresnel e comuta um relé ou saída digital."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 127-220VAC",
      "current": "10mA a 100mA",
      "signalType": "Contato de relé / Digital",
      "ranges": "Alcance de 3m a 12m; ângulo de 90° a 360°"
    },
    "applications": [
      "Iluminação automática",
      "Alarmes de segurança",
      "Acionamento de portas automáticas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não usar como única proteção em aplicações de segurança de pessoas."
      ],
      "commonFailures": [
        "Disparos falsos por fontes de calor ou correntes de ar.",
        "Falha de detecção por lente obstruída ou suja."
      ]
    }
  },
  {
    "id": "inversor-frequencia-monofasico",
    "name": "Inversor de Frequência Monofásico",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Controla a velocidade de motores a partir de alimentação monofásica.",
    "purpose": "Permite variar velocidade, partida suave e proteção de motores de pequeno porte alimentados por rede monofásica.",
    "howItWorks": {
      "simple": "Muda a frequência da energia que vai para o motor, e assim controla a velocidade dele.",
      "technical": "Retifica a tensão da rede e, por um estágio inversor PWM, gera tensão de frequência variável para o motor, com controle escalar ou vetorial."
    },
    "specs": {
      "voltage": "Entrada 110/220VAC monofásica",
      "current": "1,6A a 16A (saída)",
      "signalType": "Comando 0-10V / 4-20mA / digital",
      "ranges": "0,25cv a 5cv"
    },
    "applications": [
      "Bombas de pequeno porte",
      "Ventiladores e exaustores",
      "Esteiras de baixa potência"
    ],
    "safetyAndFailures": {
      "safety": [
        "Aguardar a descarga dos capacitores do barramento CC antes de abrir o equipamento.",
        "Aterrar corretamente o inversor e o motor."
      ],
      "commonFailures": [
        "Falha por sobretensão ou subtensão na rede.",
        "Superaquecimento por dissipação insuficiente ou ventilação obstruída."
      ]
    }
  },
  {
    "id": "inversor-frequencia-trifasico",
    "name": "Inversor de Frequência Trifásico",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Controla a velocidade de motores trifásicos em diversas potências.",
    "purpose": "Permite controle preciso de velocidade, torque e partida suave em motores trifásicos industriais.",
    "howItWorks": {
      "simple": "Ajusta a frequência da energia enviada ao motor para ele girar mais rápido ou mais devagar.",
      "technical": "Retificador, barramento CC e inversor PWM com IGBTs geram tensão e frequência variáveis, com parametrização de rampas, limites e proteções."
    },
    "specs": {
      "voltage": "Entrada 220/380/440VAC trifásica",
      "current": "2A a 500A (saída)",
      "signalType": "Comando 0-10V / 4-20mA / Rede industrial",
      "ranges": "0,25cv a 500cv"
    },
    "applications": [
      "Esteiras e transportadores",
      "Bombas e compressores",
      "Máquinas de processo industrial"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar o tempo de descarga do barramento CC.",
        "Utilizar reatores ou filtros em redes com distorção harmônica elevada."
      ],
      "commonFailures": [
        "Falha de sobrecorrente por rampa muito curta ou carga travada.",
        "Falha por mau contato em cabos de potência ou comando."
      ]
    }
  },
  {
    "id": "inversor-frequencia-vetorial",
    "name": "Inversor de Frequência Vetorial",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Inversor com controle vetorial para alto torque em baixa rotação e precisão de velocidade.",
    "purpose": "Atende aplicações que exigem controle preciso de torque e velocidade, mesmo em baixas rotações ou com cargas variáveis.",
    "howItWorks": {
      "simple": "Controla separadamente o fluxo e o torque do motor, mantendo a força e a velocidade precisas.",
      "technical": "Controle vetorial com ou sem encoder (sensorless ou malha fechada) desacopla as componentes de torque e fluxo da corrente do motor."
    },
    "specs": {
      "voltage": "Entrada 220/380/440VAC trifásica",
      "current": "2A a 500A (saída)",
      "signalType": "Encoder / 0-10V / 4-20mA / Rede industrial",
      "ranges": "Torque nominal desde 0 Hz; precisão de velocidade de 0,01% (malha fechada)"
    },
    "applications": [
      "Guindastes e pontes rolantes",
      "Extrusoras e bobinadeiras",
      "Máquinas-ferramenta e elevadores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Executar a rotina de autoajuste (autotuning) com o motor desacoplado, quando possível."
      ],
      "commonFailures": [
        "Instabilidade por parâmetros do motor incorretos.",
        "Erro de encoder por cabo sem blindagem ou ruído elétrico."
      ]
    }
  },
  {
    "id": "inversor-bombas-ventiladores",
    "name": "Inversor de Frequência para Bombas e Ventiladores",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Inversor otimizado para cargas de torque variável, com funções para controle de processo.",
    "purpose": "Reduz o consumo de energia e controla vazão e pressão em sistemas de bombeamento e ventilação.",
    "howItWorks": {
      "simple": "Ajusta a velocidade da bomba ou do ventilador à necessidade real, economizando energia.",
      "technical": "Relação V/f quadrática e controlador PID integrado regulam vazão ou pressão a partir de um transmissor, com funções de despertar e modo soneca (sleep)."
    },
    "specs": {
      "voltage": "Entrada 220/380/440VAC",
      "current": "2A a 500A (saída)",
      "signalType": "Comando 4-20mA / PID integrado",
      "ranges": "0,5cv a 500cv"
    },
    "applications": [
      "Sistemas de pressurização de água",
      "Ventilação e exaustão",
      "Torres de resfriamento"
    ],
    "safetyAndFailures": {
      "safety": [
        "Configurar frequência mínima para garantir a lubrificação e o resfriamento do motor."
      ],
      "commonFailures": [
        "Cavitação por operação em baixa frequência com pouca vazão.",
        "Oscilação por ajuste inadequado dos ganhos do PID."
      ]
    }
  },
  {
    "id": "soft-starter-trifasica",
    "name": "Soft-Starter Trifásica",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Partida suave de motores trifásicos por controle de tensão.",
    "purpose": "Reduz a corrente e o choque mecânico na partida e na parada de motores trifásicos.",
    "howItWorks": {
      "simple": "Aumenta a tensão do motor aos poucos na partida, para ele acelerar de forma suave.",
      "technical": "Tiristores em antiparalelo controlam o ângulo de disparo, elevando a tensão de forma gradual conforme rampa configurada, com bypass opcional por contator."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC trifásica",
      "current": "3A a 1000A",
      "signalType": "Comando digital 24VDC / 110-230VAC",
      "ranges": "Rampas de 1s a 60s"
    },
    "applications": [
      "Partida de bombas e ventiladores",
      "Compressores",
      "Esteiras e transportadores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Usar o contator de bypass para reduzir o aquecimento após a partida.",
        "Respeitar o número máximo de partidas por hora."
      ],
      "commonFailures": [
        "Tiristor danificado por sobrecorrente ou partidas excessivas.",
        "Falha por superaquecimento sem ventilação adequada."
      ]
    }
  },
  {
    "id": "soft-starter-bombas",
    "name": "Soft-Starter para Bombas",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Soft-starter com funções específicas para partida e parada suaves de bombas.",
    "purpose": "Evita o golpe de aríete e reduz o desgaste de tubulações e acoplamentos em sistemas de bombeamento.",
    "howItWorks": {
      "simple": "Dá partida e para a bomba aos poucos, evitando pancadas de pressão na tubulação.",
      "technical": "Rampa de partida e de parada ajustáveis, com controle de torque, reduzem o transiente hidráulico (golpe de aríete) durante a parada."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC trifásica",
      "current": "3A a 500A",
      "signalType": "Comando digital / Rede industrial",
      "ranges": "Rampa de parada de até 60s"
    },
    "applications": [
      "Bombas centrífugas",
      "Estações de recalque",
      "Sistemas de irrigação"
    ],
    "safetyAndFailures": {
      "safety": [
        "Ajustar a rampa de parada para evitar golpe de aríete em tubulações longas."
      ],
      "commonFailures": [
        "Parada brusca por rampa de desaceleração mal ajustada.",
        "Aquecimento da soft-starter em partidas muito frequentes."
      ]
    }
  },
  {
    "id": "partida-direta-contator",
    "name": "Partida Direta com Contator",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Método de partida em que o motor é ligado diretamente à tensão total da rede.",
    "purpose": "Aciona motores de pequena e média potência de forma simples e econômica.",
    "howItWorks": {
      "simple": "Ao fechar o contator, o motor recebe toda a tensão da rede de uma vez e começa a girar.",
      "technical": "Circuito com disjuntor motor, contator e relé térmico; a corrente de partida chega a 6 a 8 vezes a nominal, sem limitação."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "Até 25A, tipicamente",
      "signalType": "Comando por botoeira ou CLP",
      "ranges": "Motores até aproximadamente 7,5cv a 10cv"
    },
    "applications": [
      "Bombas pequenas",
      "Ventiladores e exaustores",
      "Esteiras de baixa potência"
    ],
    "safetyAndFailures": {
      "safety": [
        "Verificar se a rede suporta a corrente de partida do motor."
      ],
      "commonFailures": [
        "Queda de tensão na rede por corrente de partida elevada.",
        "Desgaste de contatos por partidas frequentes."
      ]
    }
  },
  {
    "id": "partida-estrela-triangulo",
    "name": "Partida Estrela-Triângulo",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Reduz a corrente de partida ligando o motor primeiro em estrela e depois em triângulo.",
    "purpose": "Limita a corrente de partida de motores trifásicos de média potência, sem inversor.",
    "howItWorks": {
      "simple": "O motor começa ligado de um jeito que usa menos corrente e, depois de alguns segundos, muda para a ligação normal.",
      "technical": "Contatores comutam o motor de estrela para triângulo por temporizador, reduzindo a corrente e o torque de partida a cerca de um terço."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "Conforme o motor (3 contatores)",
      "signalType": "Comando por temporizador / CLP",
      "ranges": "Motores a partir de 5cv a 15cv, aproximadamente"
    },
    "applications": [
      "Bombas e compressores",
      "Ventiladores de grande porte",
      "Máquinas de partida em vazio"
    ],
    "safetyAndFailures": {
      "safety": [
        "Garantir intertravamento entre os contatores de estrela e triângulo para evitar curto-circuito."
      ],
      "commonFailures": [
        "Pico de corrente na comutação por tempo mal ajustado.",
        "Torque insuficiente na partida para cargas pesadas."
      ]
    }
  },
  {
    "id": "partida-compensadora",
    "name": "Partida Compensadora",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Reduz a corrente de partida usando autotransformador.",
    "purpose": "Permite a partida de motores de grande potência com corrente reduzida e maior torque que a estrela-triângulo.",
    "howItWorks": {
      "simple": "Alimenta o motor com tensão reduzida na partida e depois passa para a tensão total.",
      "technical": "Autotransformador com derivações (por exemplo 65% ou 80%) reduz a tensão na partida, e contatores comutam para tensão plena após o tempo ajustado."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "Conforme o motor",
      "signalType": "Comando por temporizador / CLP",
      "ranges": "Motores de 15cv a centenas de cv"
    },
    "applications": [
      "Compressores de grande porte",
      "Bombas de alta potência",
      "Motores de grandes ventiladores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar o tempo máximo de operação do autotransformador na partida."
      ],
      "commonFailures": [
        "Superaquecimento do autotransformador por partidas repetidas.",
        "Falha de comutação por contator defeituoso."
      ]
    }
  },
  {
    "id": "servoconversor",
    "name": "Servoconversor (Servodrive)",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Acionamento de alta precisão para servomotores.",
    "purpose": "Controla posição, velocidade e torque de servomotores com alta dinâmica e precisão.",
    "howItWorks": {
      "simple": "Comanda o servomotor e confere o tempo todo, com um sensor, se ele está na posição e velocidade certas.",
      "technical": "Controle em malha fechada com realimentação de encoder ou resolver, com malhas de corrente, velocidade e posição, usando comando por pulso/direção, analógico ou rede."
    },
    "specs": {
      "voltage": "Entrada 220/380VAC",
      "current": "1A a 100A",
      "signalType": "Pulso/Direção / Analógico / EtherCAT / Profinet",
      "ranges": "100W a 15kW"
    },
    "applications": [
      "Máquinas CNC e robôs",
      "Máquinas de embalagem",
      "Posicionamento de alta precisão"
    ],
    "safetyAndFailures": {
      "safety": [
        "Utilizar função de parada segura (STO) em aplicações de segurança."
      ],
      "commonFailures": [
        "Erro de seguimento por ganhos mal ajustados.",
        "Falha de encoder por cabo danificado ou sem blindagem."
      ]
    }
  },
  {
    "id": "resistor-frenagem",
    "name": "Resistor de Frenagem",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Dissipa em calor a energia gerada pelo motor durante frenagens rápidas.",
    "purpose": "Permite desacelerações rápidas com inversores, evitando sobretensão no barramento CC.",
    "howItWorks": {
      "simple": "Durante a frenagem, o motor devolve energia, e o resistor a transforma em calor.",
      "technical": "Ligado ao chopper de frenagem do inversor, dissipa a energia regenerativa quando a tensão do barramento CC excede o limite configurado."
    },
    "specs": {
      "voltage": "Até 800VDC (barramento)",
      "current": "Conforme dimensionamento",
      "signalType": "Carga resistiva de potência",
      "ranges": "Resistência de 5 a 200 ohms; potência de 100W a 10kW"
    },
    "applications": [
      "Guindastes e elevadores",
      "Centrífugas",
      "Máquinas com frenagem rápida e frequente"
    ],
    "safetyAndFailures": {
      "safety": [
        "Instalar em local ventilado e longe de materiais inflamáveis.",
        "Proteger com relé térmico, pois a superfície atinge altas temperaturas."
      ],
      "commonFailures": [
        "Queima por dimensionamento insuficiente.",
        "Falha por ciclo de frenagem acima do previsto."
      ]
    }
  },
  {
    "id": "filtro-emi-rfi",
    "name": "Filtro EMI/RFI",
    "category": "Acionamentos",
    "icon": "📊",
    "shortDescription": "Reduz interferências eletromagnéticas geradas por inversores.",
    "purpose": "Evita que o ruído do chaveamento do inversor afete outros equipamentos e a rede elétrica.",
    "howItWorks": {
      "simple": "Funciona como uma peneira que impede que o ruído elétrico do inversor se espalhe.",
      "technical": "Combinação de indutores e capacitores atenua as emissões conduzidas de alta frequência na entrada do inversor, conforme normas de compatibilidade eletromagnética."
    },
    "specs": {
      "voltage": "Até 480VAC",
      "current": "4A a 200A",
      "signalType": "Filtro passivo de linha",
      "ranges": "Atenuação conforme classe A ou B"
    },
    "applications": [
      "Instalações com muitos inversores",
      "Proximidade de equipamentos sensíveis",
      "Atendimento às normas de EMC"
    ],
    "safetyAndFailures": {
      "safety": [
        "Aguardar a descarga dos capacitores antes de manusear o filtro.",
        "Ligar o terminal de terra corretamente, pois a corrente de fuga é elevada."
      ],
      "commonFailures": [
        "Filtro ineficaz por aterramento inadequado.",
        "Capacitores degradados por superaquecimento ou surtos."
      ]
    }
  },
  {
    "id": "cilindro-pneumatico-simples-acao",
    "name": "Cilindro Pneumático de Simples Ação",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Atuador linear acionado por ar em um sentido, com retorno por mola.",
    "purpose": "Realiza movimentos lineares de empurrar, fixar ou elevar com força em um único sentido.",
    "howItWorks": {
      "simple": "O ar empurra o êmbolo para frente e, quando o ar é liberado, uma mola o traz de volta.",
      "technical": "A pressão atua em uma única câmara; o retorno é feito por mola interna, o que limita o curso útil e a força disponível no retorno."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento pneumático)",
      "current": "Não aplicável",
      "signalType": "Pneumático (ar comprimido)",
      "ranges": "Pressão de 2 a 8bar; curso de 5mm a 100mm"
    },
    "applications": [
      "Fixação e travamento de peças",
      "Estampagem leve",
      "Marcação e carimbo"
    ],
    "safetyAndFailures": {
      "safety": [
        "Despressurizar o sistema antes de qualquer manutenção.",
        "Não ultrapassar a pressão máxima do cilindro."
      ],
      "commonFailures": [
        "Mola quebrada ou fatigada, sem retorno completo.",
        "Vazamento pela vedação da haste."
      ]
    }
  },
  {
    "id": "cilindro-pneumatico-dupla-acao",
    "name": "Cilindro Pneumático de Dupla Ação",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Atuador linear acionado por ar nos dois sentidos de movimento.",
    "purpose": "Realiza movimentos lineares de avanço e retorno com força controlada em ambos os sentidos.",
    "howItWorks": {
      "simple": "O ar entra por um lado para empurrar o êmbolo e pelo outro lado para trazê-lo de volta.",
      "technical": "O ar comprimido alimenta alternadamente as câmaras dianteira e traseira, controlado por válvula direcional 5/2 ou 5/3 vias."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento pneumático)",
      "current": "Não aplicável",
      "signalType": "Pneumático (ar comprimido)",
      "ranges": "Pressão de 1 a 10bar; diâmetros de 12mm a 320mm; cursos até 1000mm"
    },
    "applications": [
      "Máquinas de embalagem",
      "Automação de montagem",
      "Prensagem e transferência de peças"
    ],
    "safetyAndFailures": {
      "safety": [
        "Utilizar válvulas de retenção ou bloqueio quando houver risco de queda de carga.",
        "Despressurizar antes de intervir."
      ],
      "commonFailures": [
        "Desgaste das vedações, causando perda de força.",
        "Haste empenada por cargas laterais."
      ]
    }
  },
  {
    "id": "cilindro-compacto",
    "name": "Cilindro Compacto",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Cilindro de dupla ação de corpo curto para espaços reduzidos.",
    "purpose": "Realiza movimentos lineares em locais com pouco espaço de instalação, para cursos curtos.",
    "howItWorks": {
      "simple": "Funciona como um cilindro comum, mas com o corpo bem mais curto.",
      "technical": "Corpo reduzido com êmbolo e vedações adaptados, com sensores magnéticos opcionais, geralmente em cursos de 5mm a 100mm."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento pneumático)",
      "current": "Não aplicável",
      "signalType": "Pneumático (ar comprimido)",
      "ranges": "Pressão de 1 a 10bar; diâmetros de 12mm a 100mm"
    },
    "applications": [
      "Fixação e travamento compactos",
      "Máquinas de montagem",
      "Dispositivos de teste"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não exceder o curso máximo especificado.",
        "Despressurizar antes de manutenção."
      ],
      "commonFailures": [
        "Desgaste acelerado por cargas laterais.",
        "Vazamento nas vedações por ar contaminado."
      ]
    }
  },
  {
    "id": "cilindro-rotativo",
    "name": "Cilindro Rotativo",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Atuador pneumático que realiza movimento angular limitado.",
    "purpose": "Gira peças ou mecanismos em ângulos definidos, como 90°, 180° ou 270°.",
    "howItWorks": {
      "simple": "Usa a força do ar para girar um eixo, em vez de empurrar uma haste.",
      "technical": "Mecanismo de pinhão e cremalheira ou palheta converte o movimento do êmbolo em rotação, com ângulo ajustável por batentes."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento pneumático)",
      "current": "Não aplicável",
      "signalType": "Pneumático (ar comprimido)",
      "ranges": "Pressão de 2 a 8bar; ângulos de 90° a 360°"
    },
    "applications": [
      "Viradores de peças",
      "Abertura e fechamento de válvulas",
      "Mesas giratórias simples"
    ],
    "safetyAndFailures": {
      "safety": [
        "Utilizar amortecimento ou batentes adequados para controlar o impacto no fim do giro."
      ],
      "commonFailures": [
        "Folga excessiva por desgaste do pinhão ou da cremalheira.",
        "Vazamento interno por vedações gastas."
      ]
    }
  },
  {
    "id": "cilindro-sem-haste",
    "name": "Cilindro sem Haste",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Atuador linear com carro externo acoplado ao êmbolo, sem haste projetada.",
    "purpose": "Permite longos cursos em espaço reduzido, pois a instalação ocupa apenas o comprimento do curso.",
    "howItWorks": {
      "simple": "Um carro desliza por fora do tubo, movido pelo êmbolo interno, sem uma haste saindo para fora.",
      "technical": "Êmbolo interno acoplado magneticamente ou por fenda e fita ao carro externo, permitindo cursos longos com guiamento integrado."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento pneumático)",
      "current": "Não aplicável",
      "signalType": "Pneumático (ar comprimido)",
      "ranges": "Pressão de 2 a 8bar; cursos de até vários metros"
    },
    "applications": [
      "Transferência de peças em longos percursos",
      "Portas e portões automáticos",
      "Posicionamento linear em linhas de montagem"
    ],
    "safetyAndFailures": {
      "safety": [
        "Proteger o carro e a fenda contra o acesso de pessoas durante o movimento."
      ],
      "commonFailures": [
        "Desacoplamento magnético por carga excessiva.",
        "Vazamento pela fita de vedação desgastada."
      ]
    }
  },
  {
    "id": "cilindro-amortecimento",
    "name": "Cilindro com Amortecimento",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Cilindro com sistema pneumático que desacelera o êmbolo no fim do curso.",
    "purpose": "Reduz impactos, ruído e desgaste mecânico no final do movimento, sobretudo com cargas pesadas ou altas velocidades.",
    "howItWorks": {
      "simple": "Perto do fim do curso, o ar fica preso e escapa devagar, freando o êmbolo suavemente.",
      "technical": "Êmbolos de amortecimento aprisionam o ar na câmara no fim do curso, escapando por válvula reguladora ajustável, que dissipa a energia cinética."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento pneumático)",
      "current": "Não aplicável",
      "signalType": "Pneumático (ar comprimido)",
      "ranges": "Pressão de 1 a 10bar; amortecimento ajustável"
    },
    "applications": [
      "Movimentação de cargas pesadas",
      "Transportes rápidos de peças",
      "Máquinas com ciclos de alta velocidade"
    ],
    "safetyAndFailures": {
      "safety": [
        "Ajustar o amortecimento com o sistema em baixa pressão antes de operar em condições normais."
      ],
      "commonFailures": [
        "Batida no fim de curso por amortecimento desregulado.",
        "Agarramento do êmbolo por agulha de ajuste obstruída."
      ]
    }
  },
  {
    "id": "garra-pneumatica",
    "name": "Garra Pneumática",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Atuador que abre e fecha dedos para segurar e liberar peças.",
    "purpose": "Segura e movimenta peças em sistemas automatizados e robôs.",
    "howItWorks": {
      "simple": "O ar faz os dedos da garra se aproximarem ou se afastarem para pegar ou soltar a peça.",
      "technical": "Pistão aciona mecanismo de alavanca, cunha ou cremalheira, movendo os dedos de forma paralela ou angular."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento pneumático)",
      "current": "Não aplicável",
      "signalType": "Pneumático (ar comprimido)",
      "ranges": "Pressão de 2 a 8bar; abertura de 4mm a 200mm; força de poucos N a milhares de N"
    },
    "applications": [
      "Robôs de pega e posicionamento (pick and place)",
      "Montagem automatizada",
      "Manuseio de peças em máquinas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Garantir força de preensão suficiente e retenção em caso de falta de ar."
      ],
      "commonFailures": [
        "Queda de peça por queda de pressão ou desgaste dos dedos.",
        "Folga nos dedos por desgaste das guias."
      ]
    }
  },
  {
    "id": "valvula-solenoide-3-2",
    "name": "Válvula Solenoide 3/2 Vias",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Válvula de três vias e duas posições comandada eletricamente.",
    "purpose": "Comanda cilindros de simples ação e outros dispositivos pneumáticos de uma única linha de trabalho.",
    "howItWorks": {
      "simple": "Quando energizada, deixa o ar passar para a carga; sem energia, ela libera o ar para a atmosfera.",
      "technical": "Uma bobina solenoide desloca o carretel ou assento, alternando a ligação entre pressão-utilização e utilização-escape."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 110VAC / 220VAC",
      "current": "100mA a 400mA (bobina)",
      "signalType": "Comando elétrico (bobina)",
      "ranges": "Pressão de 0 a 10bar"
    },
    "applications": [
      "Acionamento de cilindros de simples ação",
      "Comando de ejetores de vácuo",
      "Sopro e limpeza"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar a tensão da bobina; a tensão incorreta causa queima ou não acionamento."
      ],
      "commonFailures": [
        "Bobina queimada por tensão incorreta ou ciclo contínuo em alta temperatura.",
        "Carretel travado por sujeira ou falta de lubrificação."
      ]
    }
  },
  {
    "id": "valvula-solenoide-5-2-simples",
    "name": "Válvula Solenoide 5/2 Vias (Simples Solenoide)",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Válvula de cinco vias e duas posições com um solenoide e retorno por mola.",
    "purpose": "Comanda cilindros de dupla ação, com retorno automático ao perder o sinal elétrico.",
    "howItWorks": {
      "simple": "Com energia, o ar vai para um lado do cilindro; ao desligar, uma mola inverte e o ar vai para o outro lado.",
      "technical": "Solenoide aciona o carretel diretamente ou por piloto, com retorno por mola, alternando as ligações entre as vias de pressão e utilização."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 110VAC / 220VAC",
      "current": "100mA a 400mA (bobina)",
      "signalType": "Comando elétrico (bobina)",
      "ranges": "Pressão de 1,5 a 8bar, conforme o modelo"
    },
    "applications": [
      "Comando de cilindros de dupla ação",
      "Máquinas de embalagem",
      "Automação de montagem"
    ],
    "safetyAndFailures": {
      "safety": [
        "Prever o estado seguro do cilindro em caso de falta de energia elétrica."
      ],
      "commonFailures": [
        "Retorno por mola fatigada.",
        "Vazamento interno por vedações desgastadas."
      ]
    }
  },
  {
    "id": "valvula-solenoide-5-2-duplo",
    "name": "Válvula Solenoide 5/2 Vias (Duplo Solenoide)",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Válvula de cinco vias e duas posições com dois solenoides e memória de posição.",
    "purpose": "Comanda cilindros de dupla ação mantendo a última posição mesmo sem energia.",
    "howItWorks": {
      "simple": "Um pulso em um solenoide a coloca numa posição, e um pulso no outro a inverte, mantendo a posição sem energia.",
      "technical": "Dois solenoides pilotam o carretel, que permanece na posição comandada por atrito e retenção, sem necessidade de alimentação contínua."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 110VAC / 220VAC",
      "current": "100mA a 400mA (por bobina)",
      "signalType": "Comando elétrico (duas bobinas)",
      "ranges": "Pressão de 1,5 a 8bar"
    },
    "applications": [
      "Cilindros que devem manter posição sem energia",
      "Sistemas com memória de posição",
      "Máquinas de movimentos sequenciais"
    ],
    "safetyAndFailures": {
      "safety": [
        "Nunca energizar os dois solenoides ao mesmo tempo, salvo se o modelo permitir."
      ],
      "commonFailures": [
        "Movimento indevido por sinais simultâneos nas duas bobinas.",
        "Carretel travado por sujeira, impedindo a inversão."
      ]
    }
  },
  {
    "id": "valvula-solenoide-5-3",
    "name": "Válvula Solenoide 5/3 Vias",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Válvula de cinco vias e três posições, com posição central de bloqueio ou exaustão.",
    "purpose": "Comanda cilindros de dupla ação com possibilidade de parada em posição intermediária.",
    "howItWorks": {
      "simple": "Além de avançar e recuar o cilindro, tem uma posição central em que ele pode parar.",
      "technical": "Dois solenoides e molas de centragem definem três posições; a central pode ser fechada, com exaustão ou com pressão, conforme o tipo."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 110VAC / 220VAC",
      "current": "100mA a 400mA (por bobina)",
      "signalType": "Comando elétrico (duas bobinas)",
      "ranges": "Pressão de 1,5 a 8bar"
    },
    "applications": [
      "Parada de cilindros em posição intermediária",
      "Elevação com bloqueio de carga",
      "Posicionamento em posições múltiplas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Considerar que, com centro fechado, o cilindro pode se deslocar por vazamento sob carga."
      ],
      "commonFailures": [
        "Perda de posição por vazamento interno.",
        "Mola de centragem desgastada, impedindo a posição central."
      ]
    }
  },
  {
    "id": "valvula-controle-fluxo",
    "name": "Válvula de Controle de Fluxo (Reguladora de Vazão)",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Regula a velocidade de cilindros controlando a vazão de ar.",
    "purpose": "Ajusta a velocidade de avanço e retorno de cilindros pneumáticos.",
    "howItWorks": {
      "simple": "Estreita ou alarga a passagem de ar para deixar o cilindro mais lento ou mais rápido.",
      "technical": "Orifício regulável com válvula de retenção integrada restringe a vazão em um sentido e permite fluxo livre no sentido contrário."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento manual)",
      "current": "Não aplicável",
      "signalType": "Ajuste manual",
      "ranges": "Pressão de 0,5 a 10bar; roscas de M5 a 1/2 polegada"
    },
    "applications": [
      "Regulagem de velocidade de cilindros",
      "Controle de movimentos suaves",
      "Amortecimento externo de curso"
    ],
    "safetyAndFailures": {
      "safety": [
        "Instalar na saída (exaustão) do cilindro para melhor controle de velocidade."
      ],
      "commonFailures": [
        "Velocidade instável por sujeira no orifício.",
        "Vazamento pela rosca de ajuste."
      ]
    }
  },
  {
    "id": "valvula-reguladora-pressao",
    "name": "Válvula Reguladora de Pressão",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Mantém a pressão de saída constante, independentemente da entrada.",
    "purpose": "Ajusta e estabiliza a pressão do ar para circuitos e equipamentos pneumáticos.",
    "howItWorks": {
      "simple": "Reduz a pressão do ar para o valor que você ajustar e a mantém estável.",
      "technical": "Diafragma e mola regulam a abertura do assento, mantendo a pressão secundária constante dentro dos limites de vazão."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento manual)",
      "current": "Não aplicável",
      "signalType": "Ajuste manual",
      "ranges": "Entrada até 16bar; saída de 0,5 a 10bar"
    },
    "applications": [
      "Redução de pressão em circuitos",
      "Ajuste de força de cilindros",
      "Alimentação de ferramentas pneumáticas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Instalar manômetro e válvula de alívio quando houver risco de sobrepressão."
      ],
      "commonFailures": [
        "Pressão instável por diafragma desgastado.",
        "Vazamento pelo escape do regulador."
      ]
    }
  },
  {
    "id": "valvula-retencao",
    "name": "Válvula de Retenção",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Permite o fluxo de ar em um único sentido.",
    "purpose": "Impede o retorno de ar, mantendo a pressão em reservatórios e protegendo circuitos.",
    "howItWorks": {
      "simple": "Deixa o ar passar para frente, mas bloqueia se ele tentar voltar.",
      "technical": "Elemento obturador (esfera ou disco) com mola abre sob pressão no sentido direto e fecha com a inversão do fluxo."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento automático)",
      "current": "Não aplicável",
      "signalType": "Funcionamento por diferença de pressão",
      "ranges": "Pressão de abertura de 0,05 a 0,5bar"
    },
    "applications": [
      "Proteção de reservatórios de ar",
      "Manutenção de pressão em circuitos",
      "Evitar retorno em compressores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar o sentido de fluxo indicado pela seta."
      ],
      "commonFailures": [
        "Vazamento por sede suja ou desgastada.",
        "Travamento do obturador por sujeira."
      ]
    }
  },
  {
    "id": "unidade-conservacao",
    "name": "Unidade de Conservação (Filtro, Regulador e Lubrificador)",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Conjunto que filtra, regula e lubrifica o ar comprimido.",
    "purpose": "Prepara o ar comprimido, removendo água e impurezas e ajustando a pressão, prolongando a vida dos componentes pneumáticos.",
    "howItWorks": {
      "simple": "Limpa o ar, controla a pressão e, se necessário, acrescenta uma névoa de óleo para lubrificar.",
      "technical": "Filtro com elemento de 5 a 40 micra e dreno, regulador de pressão com manômetro e lubrificador por efeito venturi, em conjunto ou separados."
    },
    "specs": {
      "voltage": "Não aplicável (acionamento manual)",
      "current": "Não aplicável",
      "signalType": "Tratamento de ar comprimido",
      "ranges": "Entrada até 16bar; vazão conforme a rosca (1/4 a 1 polegada)"
    },
    "applications": [
      "Entrada de ar de máquinas",
      "Alimentação de ferramentas pneumáticas",
      "Proteção de válvulas e cilindros"
    ],
    "safetyAndFailures": {
      "safety": [
        "Drenar a água regularmente e despressurizar antes da manutenção.",
        "Usar óleo adequado, quando houver lubrificador."
      ],
      "commonFailures": [
        "Elemento filtrante saturado, causando queda de pressão.",
        "Água na linha por falta de dreno."
      ]
    }
  },
  {
    "id": "ilha-valvulas",
    "name": "Ilha de Válvulas",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Conjunto modular de válvulas em uma base única, com conexão por barramento.",
    "purpose": "Concentra vários pontos de comando pneumático em um bloco compacto, reduzindo fiação e tubulação.",
    "howItWorks": {
      "simple": "Reúne várias válvulas em um só bloco e as comanda por um único cabo de comunicação.",
      "technical": "Válvulas montadas em placa base comum compartilham pressão e escape, com módulo de comunicação de rede industrial (Profinet, EtherCAT, entre outras)."
    },
    "specs": {
      "voltage": "24VDC",
      "current": "Conforme o número de válvulas",
      "signalType": "Rede industrial / Multipolo",
      "ranges": "Até dezenas de válvulas por ilha"
    },
    "applications": [
      "Máquinas com muitos atuadores",
      "Linhas de montagem",
      "Painéis descentralizados"
    ],
    "safetyAndFailures": {
      "safety": [
        "Prever alimentação de potência separada para as saídas, quando exigido."
      ],
      "commonFailures": [
        "Falha de comunicação por configuração de rede incorreta.",
        "Vazamento entre módulos por vedações mal assentadas."
      ]
    }
  },
  {
    "id": "silenciador-pneumatico",
    "name": "Silenciador Pneumático",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Reduz o ruído da exaustão de ar de válvulas e cilindros.",
    "purpose": "Diminui o ruído e evita o sopro direto do ar de escape nas áreas de trabalho.",
    "howItWorks": {
      "simple": "Faz o ar sair devagar por um material poroso, o que diminui bastante o barulho.",
      "technical": "Elemento sinterizado ou de plástico poroso difunde o ar de exaustão, reduzindo a velocidade e o nível de ruído gerados."
    },
    "specs": {
      "voltage": "Não aplicável (componente passivo)",
      "current": "Não aplicável",
      "signalType": "Componente passivo",
      "ranges": "Roscas de M5 a 1 polegada; redução de 20 a 30dB"
    },
    "applications": [
      "Escapes de válvulas direcionais",
      "Exaustão de cilindros",
      "Redução de ruído em máquinas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Manter limpo para não restringir a exaustão e reduzir a velocidade dos cilindros."
      ],
      "commonFailures": [
        "Entupimento por poeira ou óleo, reduzindo a velocidade do atuador.",
        "Desprendimento por falta de aperto."
      ]
    }
  },
  {
    "id": "manometro",
    "name": "Manômetro",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Instrumento para indicar visualmente a pressão do ar ou de fluidos.",
    "purpose": "Permite acompanhar a pressão em redes, reguladores e equipamentos pneumáticos e hidráulicos.",
    "howItWorks": {
      "simple": "Um ponteiro se move conforme a pressão aumenta ou diminui.",
      "technical": "Tubo de Bourdon se deforma com a pressão, movendo o ponteiro por meio de um mecanismo de engrenagens sobre o mostrador graduado."
    },
    "specs": {
      "voltage": "Não aplicável (instrumento mecânico)",
      "current": "Não aplicável",
      "signalType": "Indicação mecânica",
      "ranges": "0 a 1bar até 0 a 1000bar; diâmetros de 40mm a 100mm"
    },
    "applications": [
      "Redes de ar comprimido",
      "Reguladores e unidades de conservação",
      "Sistemas hidráulicos"
    ],
    "safetyAndFailures": {
      "safety": [
        "Escolher faixa de medição com a pressão de trabalho entre 25% e 75% do fundo de escala."
      ],
      "commonFailures": [
        "Ponteiro travado ou desviado por sobrepressão.",
        "Vazamento na conexão da rosca."
      ]
    }
  },
  {
    "id": "compressor-ar-pistao",
    "name": "Compressor de Ar de Pistão",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Equipamento que comprime o ar atmosférico por meio de pistões.",
    "purpose": "Fornece ar comprimido para ferramentas, máquinas e sistemas pneumáticos.",
    "howItWorks": {
      "simple": "Um pistão sobe e desce, aspirando e comprimindo o ar, que é armazenado em um reservatório.",
      "technical": "Motor elétrico aciona pistões por biela e virabrequim, comprimindo o ar em um ou dois estágios e armazenando-o no reservatório controlado por pressostato."
    },
    "specs": {
      "voltage": "127V / 220V / 380VAC",
      "current": "3A a 40A (conforme a potência)",
      "signalType": "Potência (motor elétrico)",
      "ranges": "Pressão de 7 a 175psi; potência de 1 a 30cv"
    },
    "applications": [
      "Oficinas e fábricas",
      "Alimentação de ferramentas pneumáticas",
      "Redes de ar comprimido para automação"
    ],
    "safetyAndFailures": {
      "safety": [
        "Drenar o reservatório regularmente.",
        "Realizar inspeções periódicas conforme a norma de vasos de pressão."
      ],
      "commonFailures": [
        "Perda de pressão por válvulas ou anéis de pistão desgastados.",
        "Superaquecimento por ventilação ou lubrificação inadequadas."
      ]
    }
  },
  {
    "id": "ventosa-vacuo",
    "name": "Ventosa de Vácuo",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Acessório de borracha que prende objetos por sucção.",
    "purpose": "Segura e movimenta peças de superfície lisa, como vidro, chapas e caixas.",
    "howItWorks": {
      "simple": "Ao tirar o ar de dentro da ventosa, a pressão externa a mantém grudada na peça.",
      "technical": "Copo de elastômero em contato com a peça forma câmara selada; o vácuo gerado por ejetor ou bomba cria diferença de pressão que prende o objeto."
    },
    "specs": {
      "voltage": "Não aplicável (componente passivo)",
      "current": "Não aplicável",
      "signalType": "Vácuo (pneumático)",
      "ranges": "Diâmetros de 2mm a 200mm; vácuo de até -0,9bar"
    },
    "applications": [
      "Manipulação de chapas e vidros",
      "Pega de caixas e embalagens",
      "Robôs de pega e posicionamento"
    ],
    "safetyAndFailures": {
      "safety": [
        "Dimensionar com fator de segurança e manter sensor de vácuo para evitar queda de peças."
      ],
      "commonFailures": [
        "Perda de vácuo por borracha desgastada ou suja.",
        "Peça solta por superfície porosa ou contaminada."
      ]
    }
  },
  {
    "id": "gerador-vacuo-ejetor",
    "name": "Gerador de Vácuo (Ejetor)",
    "category": "Pneumática",
    "icon": "🏗️",
    "shortDescription": "Produz vácuo a partir de ar comprimido, sem partes móveis.",
    "purpose": "Alimenta ventosas e sistemas de pega por vácuo de forma simples e compacta.",
    "howItWorks": {
      "simple": "O ar comprimido passa rápido por um estreitamento e, ao passar, puxa o ar da ventosa.",
      "technical": "O efeito venturi acelera o ar em um bocal, gerando baixa pressão que aspira o ar da câmara de vácuo conectada à ventosa."
    },
    "specs": {
      "voltage": "12VDC / 24VDC (opcional, válvulas integradas)",
      "current": "Até 200mA",
      "signalType": "Pneumático / elétrico opcional",
      "ranges": "Pressão de alimentação de 3 a 7bar; vácuo máximo de até -0,9bar"
    },
    "applications": [
      "Sistemas de pega com ventosas",
      "Robôs de manipulação",
      "Máquinas de embalagem"
    ],
    "safetyAndFailures": {
      "safety": [
        "Manter silenciador e filtro limpos para não reduzir o desempenho."
      ],
      "commonFailures": [
        "Perda de vácuo por filtro ou silenciador entupido.",
        "Baixo desempenho por pressão de alimentação insuficiente."
      ]
    }
  },
  {
    "id": "motor-inducao-trifasico",
    "name": "Motor de Indução Trifásico (Gaiola de Esquilo)",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motor elétrico robusto e simples, o mais usado na indústria.",
    "purpose": "Converte energia elétrica em movimento rotativo para acionar bombas, ventiladores, esteiras e máquinas em geral.",
    "howItWorks": {
      "simple": "A energia trifásica cria um campo giratório que faz o eixo do motor girar, sem ligação elétrica ao rotor.",
      "technical": "O campo girante do estator induz correntes no rotor de gaiola de esquilo, gerando torque; a velocidade é próxima à síncrona, com escorregamento pequeno."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "1A a 500A (conforme a potência)",
      "signalType": "Potência trifásica",
      "ranges": "0,12cv a 500cv; 2, 4, 6 ou 8 polos"
    },
    "applications": [
      "Bombas e compressores",
      "Ventiladores e exaustores",
      "Esteiras e transportadores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Aterrar a carcaça e proteger com disjuntor motor e relé térmico.",
        "Respeitar o grau de proteção IP para o ambiente de instalação."
      ],
      "commonFailures": [
        "Queima do enrolamento por sobrecarga ou falta de fase.",
        "Desgaste de rolamentos por desalinhamento ou falta de lubrificação."
      ]
    }
  },
  {
    "id": "motor-trifasico-alto-rendimento",
    "name": "Motor Trifásico de Alto Rendimento",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motor de indução com perdas reduzidas e menor consumo de energia.",
    "purpose": "Reduz o custo de energia em aplicações de operação contínua, mantendo a mesma potência mecânica.",
    "howItWorks": {
      "simple": "Funciona como um motor comum, mas é construído para desperdiçar menos energia em forma de calor.",
      "technical": "Maior quantidade de material ativo, chapas de melhor qualidade e menor entreferro reduzem as perdas, atingindo classes de eficiência IE2, IE3 ou IE4."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "1A a 500A (conforme a potência)",
      "signalType": "Potência trifásica",
      "ranges": "0,75cv a 500cv; classes IE2 a IE4"
    },
    "applications": [
      "Bombas e ventiladores de operação contínua",
      "Compressores",
      "Processos industriais de alto consumo"
    ],
    "safetyAndFailures": {
      "safety": [
        "Verificar a corrente de partida, que pode ser maior em motores de alto rendimento."
      ],
      "commonFailures": [
        "Atuação indevida de proteções por corrente de partida elevada.",
        "Falha de rolamentos por lubrificação inadequada."
      ]
    }
  },
  {
    "id": "motor-trifasico-freio",
    "name": "Motor Trifásico com Freio",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motor de indução com freio eletromagnético integrado ao eixo.",
    "purpose": "Para o eixo rapidamente e o mantém travado quando a energia é cortada, em aplicações que exigem parada precisa e segura.",
    "howItWorks": {
      "simple": "Quando o motor desliga, o freio é acionado e segura o eixo; quando liga, o freio é liberado.",
      "technical": "Freio de mola com bobina eletromagnética: com a bobina energizada, o freio é liberado; sem energia, a mola pressiona o disco e trava o eixo."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC (motor) / bobina do freio 24VDC ou retificada",
      "current": "Conforme o motor; bobina de 0,2A a 2A",
      "signalType": "Potência trifásica + comando do freio",
      "ranges": "0,25cv a 30cv"
    },
    "applications": [
      "Guinchos e talhas",
      "Elevadores e plataformas",
      "Máquinas de posicionamento"
    ],
    "safetyAndFailures": {
      "safety": [
        "Verificar o desgaste das pastilhas do freio periodicamente.",
        "Não usar o freio para frenagens dinâmicas contínuas, salvo se projetado para isso."
      ],
      "commonFailures": [
        "Freio que não libera por falha na bobina ou retificador.",
        "Desgaste do disco, causando perda de torque de frenagem."
      ]
    }
  },
  {
    "id": "motor-monofasico",
    "name": "Motor Monofásico",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motor de indução alimentado por rede monofásica, para baixas potências.",
    "purpose": "Aciona cargas de pequeno porte onde só há rede monofásica disponível, como bombas, ventiladores e ferramentas.",
    "howItWorks": {
      "simple": "Usa um capacitor para criar o giro inicial e depois continua girando com energia monofásica.",
      "technical": "Enrolamento auxiliar com capacitor de partida e/ou permanente gera defasagem para o campo girante, necessário para iniciar o movimento."
    },
    "specs": {
      "voltage": "110V / 220VAC monofásico",
      "current": "1A a 30A",
      "signalType": "Potência monofásica",
      "ranges": "1/6cv a 5cv"
    },
    "applications": [
      "Bombas d'água",
      "Ventiladores",
      "Compressores e máquinas de pequeno porte"
    ],
    "safetyAndFailures": {
      "safety": [
        "Descarregar o capacitor antes de manipular o motor."
      ],
      "commonFailures": [
        "Falha de partida por capacitor queimado.",
        "Interruptor centrífugo desgastado, impedindo a desconexão do enrolamento auxiliar."
      ]
    }
  },
  {
    "id": "motor-passo",
    "name": "Motor de Passo",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motor que gira em passos discretos, com posicionamento preciso sem sensor.",
    "purpose": "Posiciona eixos com precisão em máquinas CNC, impressoras 3D e automações leves.",
    "howItWorks": {
      "simple": "A cada pulso elétrico, o eixo gira um pequeno passo fixo, e contando pulsos se sabe a posição.",
      "technical": "Enrolamentos energizados em sequência por um driver giram o rotor de ímã permanente em passos de 1,8° ou 0,9°, podendo ser subdivididos por microstepping."
    },
    "specs": {
      "voltage": "12-48VDC (driver)",
      "current": "0,5A a 6A por fase",
      "signalType": "Pulso / Direção",
      "ranges": "Torque de 0,1Nm a 20Nm; 200 ou 400 passos por volta"
    },
    "applications": [
      "Impressoras 3D",
      "Máquinas CNC leves",
      "Posicionadores e dosadores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Configurar a corrente do driver conforme a especificação do motor para evitar superaquecimento."
      ],
      "commonFailures": [
        "Perda de passos por torque insuficiente ou aceleração excessiva.",
        "Superaquecimento por corrente do driver acima do indicado."
      ]
    }
  },
  {
    "id": "servomotor",
    "name": "Servomotor",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motor de alta dinâmica com realimentação de posição para controle preciso.",
    "purpose": "Fornece controle preciso de posição, velocidade e torque em robôs, CNC e máquinas de alta performance.",
    "howItWorks": {
      "simple": "O motor gira e um sensor informa ao acionamento onde ele está, para corrigir qualquer desvio.",
      "technical": "Motor síncrono de ímãs permanentes com encoder ou resolver integrado, controlado em malha fechada por servoconversor."
    },
    "specs": {
      "voltage": "220V / 380VAC (via servoconversor)",
      "current": "1A a 100A",
      "signalType": "Potência trifásica + realimentação de encoder",
      "ranges": "100W a 15kW; 1000 a 6000rpm"
    },
    "applications": [
      "Robôs industriais",
      "Máquinas CNC",
      "Máquinas de embalagem de alta velocidade"
    ],
    "safetyAndFailures": {
      "safety": [
        "Utilizar funções de segurança do servoconversor, como o STO."
      ],
      "commonFailures": [
        "Falha de encoder por ruído ou cabo danificado.",
        "Superaquecimento por ciclo de trabalho acima do especificado."
      ]
    }
  },
  {
    "id": "motor-cc",
    "name": "Motor CC (Corrente Contínua)",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motor alimentado por corrente contínua, com fácil controle de velocidade.",
    "purpose": "Aciona cargas que exigem controle simples de velocidade e bom torque de partida.",
    "howItWorks": {
      "simple": "Variar a tensão que o motor recebe muda diretamente a velocidade do eixo.",
      "technical": "Interação entre o campo do estator e a corrente da armadura, com comutação por escovas e coletor, ou eletrônica em motores brushless."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 90VDC / 180VDC",
      "current": "0,5A a 100A",
      "signalType": "Potência CC",
      "ranges": "Potência de poucos W a dezenas de kW"
    },
    "applications": [
      "Veículos elétricos e AGVs",
      "Máquinas com controle de velocidade simples",
      "Pequenos automatismos"
    ],
    "safetyAndFailures": {
      "safety": [
        "Verificar a polaridade e limitar a corrente de partida."
      ],
      "commonFailures": [
        "Desgaste das escovas e do coletor.",
        "Faíscas por mau contato nas escovas."
      ]
    }
  },
  {
    "id": "motoredutor-helicoidal",
    "name": "Motoredutor de Engrenagens Helicoidais",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Conjunto motor e redutor com engrenagens helicoidais, eficiente e silencioso.",
    "purpose": "Reduz a velocidade e aumenta o torque do motor para acionar cargas pesadas com bom rendimento.",
    "howItWorks": {
      "simple": "As engrenagens reduzem a rotação do motor e multiplicam a força.",
      "technical": "Estágios de engrenagens helicoidais com relação de redução definida entregam torque elevado no eixo de saída, com rendimento acima de 95% por estágio."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "Conforme o motor",
      "signalType": "Potência trifásica",
      "ranges": "Relações de 3:1 a 300:1; torque de dezenas a milhares de Nm"
    },
    "applications": [
      "Esteiras transportadoras",
      "Misturadores e agitadores",
      "Máquinas de processo em geral"
    ],
    "safetyAndFailures": {
      "safety": [
        "Verificar o nível e o tipo de óleo antes de operar.",
        "Não ultrapassar o torque nominal de saída."
      ],
      "commonFailures": [
        "Vazamento de óleo por retentores gastos.",
        "Desgaste de engrenagens por sobrecarga ou lubrificação inadequada."
      ]
    }
  },
  {
    "id": "motoredutor-eixos-paralelos",
    "name": "Motoredutor de Eixos Paralelos",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motoredutor com eixo de saída paralelo ao do motor, de alto rendimento.",
    "purpose": "Fornece alto torque com construção compacta e alta eficiência para aplicações contínuas.",
    "howItWorks": {
      "simple": "Reduz a velocidade por engrenagens e entrega a força em um eixo paralelo ao do motor.",
      "technical": "Trem de engrenagens cilíndricas em estágios com eixos paralelos, com eficiência de 94% a 98% e relações de redução definidas por estágio."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "Conforme o motor",
      "signalType": "Potência trifásica",
      "ranges": "Relações de 5:1 a 500:1; torque de até milhares de Nm"
    },
    "applications": [
      "Transportadores de carga pesada",
      "Elevadores de caçamba",
      "Equipamentos de mineração e siderurgia"
    ],
    "safetyAndFailures": {
      "safety": [
        "Garantir o alinhamento correto na instalação para evitar esforço nos rolamentos."
      ],
      "commonFailures": [
        "Ruído por desgaste de engrenagens ou rolamentos.",
        "Superaquecimento por excesso ou falta de óleo."
      ]
    }
  },
  {
    "id": "motoredutor-rosca-sem-fim",
    "name": "Motoredutor Rosca sem Fim (Coroa e Sem-Fim)",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motoredutor de eixos em ângulo reto, com alta redução em pouco espaço.",
    "purpose": "Obtém grandes reduções de velocidade em construção compacta, com função de irreversibilidade em certas relações.",
    "howItWorks": {
      "simple": "Uma rosca gira uma engrenagem em forma de coroa, reduzindo muito a velocidade e aumentando a força.",
      "technical": "Par parafuso sem-fim e coroa com eixos a 90°, reduções altas em um único estágio (5:1 a 100:1), rendimento menor (50% a 90%) devido ao atrito de deslizamento."
    },
    "specs": {
      "voltage": "220V / 380V / 440VAC",
      "current": "Conforme o motor",
      "signalType": "Potência trifásica",
      "ranges": "Relações de 5:1 a 100:1; torque de dezenas a milhares de Nm"
    },
    "applications": [
      "Portões e cancelas",
      "Elevadores de carga leves",
      "Máquinas de embalagem e transportadores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Não contar apenas com a irreversibilidade para segurar cargas suspensas; usar freio quando necessário."
      ],
      "commonFailures": [
        "Desgaste da coroa de bronze por lubrificação deficiente.",
        "Superaquecimento por operação contínua acima da capacidade térmica."
      ]
    }
  },
  {
    "id": "motoredutor-planetario",
    "name": "Motoredutor Planetário",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Motoredutor compacto de alto torque e alta rigidez, com engrenagens planetárias.",
    "purpose": "Entrega alto torque em tamanho reduzido, com baixa folga, para aplicações de precisão.",
    "howItWorks": {
      "simple": "Várias engrenagens pequenas giram em torno de uma central, dividindo o esforço e permitindo muita força em pouco espaço.",
      "technical": "Engrenagem solar, satélites e coroa dividem a carga entre vários dentes, resultando em alta densidade de torque, rigidez e eficiência."
    },
    "specs": {
      "voltage": "220V / 380VAC ou 24-48VDC (servo)",
      "current": "Conforme o motor",
      "signalType": "Potência trifásica / Servo",
      "ranges": "Relações de 3:1 a 1000:1; folga angular de poucos minutos de arco"
    },
    "applications": [
      "Robôs e manipuladores",
      "Máquinas CNC",
      "Posicionadores de precisão"
    ],
    "safetyAndFailures": {
      "safety": [
        "Respeitar o torque máximo e as cargas radiais e axiais admissíveis."
      ],
      "commonFailures": [
        "Folga crescente por desgaste dos satélites.",
        "Falha por sobrecarga de torque em paradas bruscas."
      ]
    }
  },
  {
    "id": "redutor-velocidade",
    "name": "Redutor de Velocidade",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Caixa de engrenagens que reduz a rotação e multiplica o torque, acoplada a um motor.",
    "purpose": "Adapta a velocidade e o torque de um motor à necessidade da máquina.",
    "howItWorks": {
      "simple": "Recebe a rotação rápida do motor e entrega uma rotação mais lenta e mais forte.",
      "technical": "Conjunto de engrenagens, correntes ou parafuso sem-fim com relação de transmissão definida, acoplado ao eixo do motor por flange ou acoplamento."
    },
    "specs": {
      "voltage": "Não aplicável (componente mecânico)",
      "current": "Não aplicável",
      "signalType": "Transmissão mecânica",
      "ranges": "Relações de 2:1 a 1000:1, conforme o tipo"
    },
    "applications": [
      "Acionamento de esteiras",
      "Misturadores",
      "Máquinas com baixa rotação e alto torque"
    ],
    "safetyAndFailures": {
      "safety": [
        "Manter o nível de óleo correto e os respiros desobstruídos."
      ],
      "commonFailures": [
        "Vazamentos de óleo por retentores gastos.",
        "Desgaste de engrenagens por lubrificação insuficiente."
      ]
    }
  },
  {
    "id": "atuador-eletrico-linear",
    "name": "Atuador Elétrico Linear",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Atuador que converte o giro de um motor em movimento linear por fuso.",
    "purpose": "Realiza movimentos lineares com controle de posição e força, sem ar comprimido nem óleo.",
    "howItWorks": {
      "simple": "Um motor gira um parafuso longo, que empurra ou puxa uma haste em linha reta.",
      "technical": "Motor acoplado a fuso trapezoidal ou de esferas move uma porca presa à haste, com chaves fim de curso ou encoder para controle de posição."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 220VAC",
      "current": "1A a 20A",
      "signalType": "Potência CC ou CA / comando por controlador",
      "ranges": "Curso de 50mm a 1500mm; força de 100N a 10.000N"
    },
    "applications": [
      "Automação de portas e comportas",
      "Posicionamento de painéis solares",
      "Máquinas de ajuste de altura"
    ],
    "safetyAndFailures": {
      "safety": [
        "Instalar fins de curso para evitar sobrecurso e danos mecânicos."
      ],
      "commonFailures": [
        "Desgaste do fuso por falta de lubrificação.",
        "Travamento por sobrecarga ou desalinhamento."
      ]
    }
  },
  {
    "id": "atuador-rotativo-eletrico",
    "name": "Atuador Rotativo Elétrico",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Atuador que gera movimento angular controlado a partir de um motor elétrico.",
    "purpose": "Gira válvulas, dampers e mecanismos em ângulos definidos, com controle de posição e torque.",
    "howItWorks": {
      "simple": "Um motor com redutor gira o eixo até o ângulo desejado e para.",
      "technical": "Motor e trem de engrenagens movem o eixo de saída, com limitadores de torque, chaves de fim de curso e, em alguns modelos, posicionador com sinal 4-20mA."
    },
    "specs": {
      "voltage": "24VDC / 24VAC / 110VAC / 220VAC",
      "current": "0,2A a 5A",
      "signalType": "Liga/desliga / 0-10V / 4-20mA",
      "ranges": "Torque de 5Nm a 3000Nm; giro de 90° a 360°"
    },
    "applications": [
      "Acionamento de válvulas esfera e borboleta",
      "Dampers de ventilação",
      "Controle de comportas"
    ],
    "safetyAndFailures": {
      "safety": [
        "Prever retorno de segurança por mola ou bateria, quando necessário."
      ],
      "commonFailures": [
        "Atuação incompleta por ajuste incorreto dos fins de curso.",
        "Motor travado por válvula emperrada."
      ]
    }
  },
  {
    "id": "valvula-motorizada",
    "name": "Válvula Motorizada",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Válvula de controle de fluidos acionada por atuador elétrico.",
    "purpose": "Abre, fecha ou regula a passagem de líquidos e gases remotamente em processos industriais e prediais.",
    "howItWorks": {
      "simple": "Um motor elétrico abre ou fecha a válvula quando recebe o comando.",
      "technical": "Atuador elétrico acoplado ao corpo da válvula (esfera, borboleta ou globo) posiciona o obturador por comando liga/desliga ou proporcional."
    },
    "specs": {
      "voltage": "12VDC / 24VDC / 110VAC / 220VAC",
      "current": "0,2A a 3A",
      "signalType": "Liga/desliga / 0-10V / 4-20mA",
      "ranges": "Diâmetros de 1/2 a 12 polegadas ou mais"
    },
    "applications": [
      "Controle de água gelada e aquecimento",
      "Dosagem e distribuição de fluidos",
      "Sistemas de irrigação"
    ],
    "safetyAndFailures": {
      "safety": [
        "Verificar se a posição de falha, aberta ou fechada, é segura para o processo."
      ],
      "commonFailures": [
        "Vazamento por sede da válvula desgastada ou suja.",
        "Atuador travado por corpo estranho ou calcificação."
      ]
    }
  },
  {
    "id": "acoplamento-elastico",
    "name": "Acoplamento Elástico",
    "category": "Atuadores Mecânicos",
    "icon": "⚙️",
    "shortDescription": "Liga dois eixos transmitindo torque e absorvendo pequenos desalinhamentos e vibrações.",
    "purpose": "Conecta o motor à carga ou ao redutor, protegendo rolamentos e eixos contra choques e desalinhamentos.",
    "howItWorks": {
      "simple": "Une dois eixos com uma peça flexível que absorve pequenas diferenças e pancadas.",
      "technical": "Dois cubos metálicos acoplados por elemento elastomérico (como o tipo aranha) transmitem o torque e toleram desalinhamentos angulares e paralelos."
    },
    "specs": {
      "voltage": "Não aplicável (componente mecânico)",
      "current": "Não aplicável",
      "signalType": "Transmissão mecânica",
      "ranges": "Torque de 2Nm a 10.000Nm; desalinhamento angular de 1° a 2°"
    },
    "applications": [
      "Acoplamento motor-bomba",
      "Motor-redutor",
      "Eixos de esteiras e ventiladores"
    ],
    "safetyAndFailures": {
      "safety": [
        "Instalar proteção sobre o acoplamento girante.",
        "Alinhar os eixos dentro das tolerâncias do fabricante."
      ],
      "commonFailures": [
        "Desgaste ou ruptura do elemento elástico por desalinhamento.",
        "Folga por parafusos de fixação soltos."
      ]
    }
  }
];

// Geradores em Vetor SVG para representar visualmente o equipamento (Roda 100% Offline)
const EQUIPMENT_ILLUSTRATIONS = {
  "clp": `
    <svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="200" height="120" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="3"/>
      <rect x="25" y="25" width="80" height="50" rx="4" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <text x="65" y="55" font-size="12" fill="#22c55e" font-family="monospace" text-anchor="middle">RUN: OK</text>
      <!-- Bornes de Entrada/Saída -->
      <circle cx="125" cy="35" r="4" fill="#38bdf8"/><circle cx="140" cy="35" r="4" fill="#38bdf8"/>
      <circle cx="155" cy="35" r="4" fill="#38bdf8"/><circle cx="170" cy="35" r="4" fill="#38bdf8"/>
      <circle cx="125" cy="105" r="4" fill="#f97316"/><circle cx="140" cy="105" r="4" fill="#f97316"/>
      <circle cx="155" cy="105" r="4" fill="#f97316"/><circle cx="170" cy="105" r="4" fill="#f97316"/>
      <text x="65" y="105" font-size="10" fill="#94a3b8" text-anchor="middle">CPU PLC-24V</text>
    </svg>
  `,
  "contatora": `
    <svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="10" width="150" height="120" rx="6" fill="#334155" stroke="#64748b" stroke-width="3"/>
      <rect x="60" y="20" width="100" height="30" rx="3" fill="#1e293b"/>
      <text x="110" y="40" font-size="11" fill="#f8fafc" font-weight="bold" text-anchor="middle">L1  L2  L3</text>
      <circle cx="110" cy="70" r="16" fill="#ea580c"/>
      <text x="110" y="75" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">RESET</text>
      <rect x="60" y="95" width="100" height="25" rx="3" fill="#1e293b"/>
      <text x="110" y="112" font-size="11" fill="#f8fafc" font-weight="bold" text-anchor="middle">T1  T2  T3</text>
    </svg>
  `,
  "sensor-indutivo": `
    <svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg">
      <!-- Corpo cilíndrico rosqueado -->
      <rect x="30" y="50" width="130" height="40" rx="4" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <line x1="50" y1="50" x2="50" y2="90" stroke="#64748b" stroke-width="2"/>
      <line x1="70" y1="50" x2="70" y2="90" stroke="#64748b" stroke-width="2"/>
      <line x1="90" y1="50" x2="90" y2="90" stroke="#64748b" stroke-width="2"/>
      <line x1="110" y1="50" x2="110" y2="90" stroke="#64748b" stroke-width="2"/>
      <!-- Face Sensora -->
      <path d="M 160 50 L 180 50 A 20 20 0 0 1 180 90 L 160 90 Z" fill="#ef4444"/>
      <!-- Cabo elétrico -->
      <rect x="10" y="62" width="20" height="16" rx="2" fill="#1e293b"/>
      <!-- LED indicador -->
      <circle cx="140" cy="70" r="4" fill="#22c55e"/>
    </svg>
  `,
  "default": `
    <svg width="220" height="140" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="180" height="100" rx="10" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <circle cx="110" cy="60" r="22" fill="none" stroke="#3b82f6" stroke-width="3"/>
      <text x="110" y="66" font-size="20" text-anchor="middle" fill="#3b82f6">⚙️</text>
      <text x="110" y="100" font-size="12" fill="#94a3b8" font-weight="bold" text-anchor="middle">Vista do Equipamento</text>
    </svg>
  `
};

const CATEGORIES_META = [
  { id: "Automação/CLP", title: "Automação & CLP", icon: "💻", description: "Controladores, IHMs e Módulos lógicos" },
  { id: "Elétrica", title: "Comandos Elétricos", icon: "⚡", description: "Contatoras, Disjuntores, Relés e Botoeiras" },
  { id: "Sensores", title: "Sensores de Campo", icon: "📡", description: "Indutivos, Capacitivos e Fotoelétricos" },
  { id: "Acionamentos", title: "Acionamentos", icon: "📊", description: "Inversores de Frequência e Soft-Starters" },
  { id: "Pneumática", title: "Pneumática", icon: "🏗️", description: "Cilindros e Válvulas Solenoides" },
  { id: "Mecânica", title: "Atuadores Mecânicos", icon: "⚙️", description: "Motors trifásicos e Motoredutores" },
  { id: "Favoritos", title: "Meus Favoritos", icon: "⭐", description: "Equipamentos salvos para acesso rápido" }
];

/* ========================================================================
 * 1. DIAGRAMAS DE FIAÇÃO E PINAGEM (SVG) POR EQUIPAMENTO / CATEGORIA
 * ====================================================================== */
const EQUIPMENT_WIRING_DIAGRAMS = {
  // CLP / CPU
  "clp": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
      <text x="25" y="30" font-size="9" fill="#ef4444" font-family="monospace">L+ (+24V)</text>
      <text x="25" y="45" font-size="9" fill="#3b82f6" font-family="monospace">M (0V)</text>
      <line x1="90" y1="15" x2="90" y2="45" stroke="#22c55e" stroke-width="2"/>
      <circle cx="90" cy="45" r="4" fill="#22c55e"/>
      <text x="90" y="60" font-size="9" fill="#f8fafc" font-family="monospace" text-anchor="middle">I0.0 (Sinal)</text>
      <line x1="180" y1="105" x2="180" y2="75" stroke="#f97316" stroke-width="2"/>
      <circle cx="180" cy="75" r="4" fill="#f97316"/>
      <text x="180" y="65" font-size="9" fill="#f8fafc" font-family="monospace" text-anchor="middle">Q0.0 (Carga)</text>
      <text x="130" y="115" font-size="9" fill="#94a3b8" font-weight="bold" text-anchor="middle">Alimentação e I/O no CLP</text>
    </svg>
  `,

  // Botoeiras NA / NF
  "botoeira-na": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <text x="20" y="35" font-size="9" fill="#ef4444" font-family="monospace">24VDC</text>
      <line x1="55" y1="32" x2="90" y2="32" stroke="#ef4444" stroke-width="2"/>
      <circle cx="90" cy="32" r="3" fill="#ef4444"/>
      <line x1="90" y1="32" x2="130" y2="22" stroke="#f8fafc" stroke-width="2.5"/>
      <circle cx="130" cy="32" r="3" fill="#22c55e"/>
      <line x1="130" y1="32" x2="170" y2="32" stroke="#22c55e" stroke-width="2"/>
      <text x="195" y="35" font-size="9" fill="#22c55e" font-family="monospace">-> Entrada I0.0</text>
      <text x="110" y="60" font-size="9" fill="#94a3b8" text-anchor="middle">Terminais 13-14 (Normalmente Aberto)</text>
      <text x="130" y="105" font-size="9" fill="#22c55e" font-weight="bold" text-anchor="middle">Botoeira Pulsadora (Pulso em 24V)</text>
    </svg>
  `,
  "botoeira-nf": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <text x="20" y="35" font-size="9" fill="#ef4444" font-family="monospace">24VDC</text>
      <line x1="55" y1="32" x2="90" y2="32" stroke="#ef4444" stroke-width="2"/>
      <circle cx="90" cy="32" r="3" fill="#ef4444"/>
      <line x1="90" y1="32" x2="130" y2="32" stroke="#f8fafc" stroke-width="2.5"/>
      <circle cx="130" cy="32" r="3" fill="#ef4444"/>
      <line x1="130" y1="32" x2="170" y2="32" stroke="#22c55e" stroke-width="2"/>
      <text x="195" y="35" font-size="9" fill="#22c55e" font-family="monospace">-> Entrada I0.1</text>
      <text x="110" y="60" font-size="9" fill="#94a3b8" text-anchor="middle">Terminais 11-12 (Normalmente Fechado)</text>
      <text x="130" y="105" font-size="9" fill="#ef4444" font-weight="bold" text-anchor="middle">Botão de Emergência / Desliga</text>
    </svg>
  `,

  // Sensores (Indutivo, Capacitivo, Óptico)
  "sensor-indutivo": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <line x1="20" y1="35" x2="120" y2="35" stroke="#b45309" stroke-width="3"/>
      <text x="125" y="38" font-size="8" fill="#f59e0b" font-family="monospace">MARROM (+24VDC)</text>
      <line x1="20" y1="65" x2="120" y2="65" stroke="#0284c7" stroke-width="3"/>
      <text x="125" y="68" font-size="8" fill="#38bdf8" font-family="monospace">AZUL (0V / GND)</text>
      <line x1="20" y1="95" x2="120" y2="95" stroke="#f8fafc" stroke-width="3"/>
      <text x="125" y="98" font-size="8" fill="#f8fafc" font-family="monospace">PRETO (Sinal PNP -> I0.0)</text>
      <text x="130" y="20" font-size="9" fill="#22c55e" font-weight="bold" text-anchor="middle">Sensor Proximidade PNP (3 Fios)</text>
    </svg>
  `,
  "sensor-capacitivo": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <line x1="20" y1="35" x2="120" y2="35" stroke="#b45309" stroke-width="3"/>
      <text x="125" y="38" font-size="8" fill="#f59e0b" font-family="monospace">MARROM (+24VDC)</text>
      <line x1="20" y1="65" x2="120" y2="65" stroke="#0284c7" stroke-width="3"/>
      <text x="125" y="68" font-size="8" fill="#38bdf8" font-family="monospace">AZUL (0V / GND)</text>
      <line x1="20" y1="95" x2="120" y2="95" stroke="#f8fafc" stroke-width="3"/>
      <text x="125" y="98" font-size="8" fill="#f8fafc" font-family="monospace">PRETO (Sinal NPN -> I0.0 via R)</text>
      <text x="130" y="20" font-size="9" fill="#a855f7" font-weight="bold" text-anchor="middle">Sensor Capacitivo Nivel/Presença</text>
    </svg>
  `,
  "sensor-optico": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <line x1="20" y1="35" x2="120" y2="35" stroke="#b45309" stroke-width="3"/>
      <text x="125" y="38" font-size="8" fill="#f59e0b" font-family="monospace">MARROM (+24VDC)</text>
      <line x1="20" y1="65" x2="120" y2="65" stroke="#0284c7" stroke-width="3"/>
      <text x="125" y="68" font-size="8" fill="#38bdf8" font-family="monospace">AZUL (0V / GND)</text>
      <line x1="20" y1="95" x2="120" y2="95" stroke="#f8fafc" stroke-width="3"/>
      <text x="125" y="98" font-size="8" fill="#f8fafc" font-family="monospace">PRETO (Saída Reflexiva -> I0.0)</text>
      <text x="130" y="20" font-size="9" fill="#eab308" font-weight="bold" text-anchor="middle">Sensor Fotoelétrico Reflexivo</text>
    </svg>
  `,

  // Contatores e Proteção
  "contatora": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <rect x="25" y="25" width="55" height="35" rx="4" fill="#1e293b" stroke="#ea580c" stroke-width="2"/>
      <text x="52" y="46" font-size="10" fill="#ea580c" font-family="monospace" font-weight="bold" text-anchor="middle">A1 / A2</text>
      <text x="52" y="73" font-size="8" fill="#94a3b8" text-anchor="middle">Bobina Comandada por Q0.0</text>
      <text x="150" y="35" font-size="8" fill="#38bdf8" font-family="monospace">1/L1, 3/L2, 5/L3 (Rede Trifásica)</text>
      <text x="150" y="60" font-size="8" fill="#22c55e" font-family="monospace">2/T1, 4/T2, 6/T3 (Carga Motor)</text>
      <text x="150" y="85" font-size="8" fill="#f59e0b" font-family="monospace">13 / 14 (Contato Auxiliar Selo)</text>
    </svg>
  `,
  "rele-termico": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <rect x="25" y="25" width="60" height="35" rx="4" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
      <text x="55" y="46" font-size="9" fill="#ef4444" font-family="monospace" font-weight="bold" text-anchor="middle">95 / 96 (NF)</text>
      <text x="55" y="73" font-size="8" fill="#94a3b8" text-anchor="middle">Interrupção de Segurança em I0.1</text>
      <text x="155" y="45" font-size="8" fill="#f59e0b" font-family="monospace">97 / 98 (NA -> Alarme Sobrecarga)</text>
      <text x="130" y="110" font-size="9" fill="#ef4444" font-weight="bold" text-anchor="middle">Relé Sobrecarga Térmico</text>
    </svg>
  `,

  // Atuadores / Válvulas
  "valvula-solenoide": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <line x1="30" y1="35" x2="100" y2="35" stroke="#f97316" stroke-width="2.5"/>
      <text x="105" y="38" font-size="8" fill="#f97316" font-family="monospace">Comando Q0.0 (24VDC)</text>
      <line x1="30" y1="70" x2="100" y2="70" stroke="#0284c7" stroke-width="2.5"/>
      <text x="105" y="73" font-size="8" fill="#38bdf8" font-family="monospace">Retorno GND (0V)</text>
      <text x="130" y="105" font-size="9" fill="#f97316" font-weight="bold" text-anchor="middle">Solenoide Direcional Pneumática</text>
    </svg>
  `,
  "sinalizador-luminoso": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <circle cx="60" cy="50" r="20" fill="#22c55e" opacity="0.3" stroke="#22c55e" stroke-width="3"/>
      <text x="60" y="54" font-size="12" fill="#22c55e" font-weight="bold" text-anchor="middle">X1/X2</text>
      <text x="150" y="45" font-size="8" fill="#22c55e" font-family="monospace">Ligado em Q0.0 (+24VDC)</text>
      <text x="150" y="65" font-size="8" fill="#38bdf8" font-family="monospace">Referência Comum 0V</text>
      <text x="130" y="105" font-size="9" fill="#22c55e" font-weight="bold" text-anchor="middle">Sinalizador LED Painel</text>
    </svg>
  `,

  // Diagrama Padrão / Fallback
  "default": `
    <svg width="260" height="130" viewBox="0 0 260 130" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="240" height="110" rx="6" fill="#0f172a" stroke="#475569" stroke-width="2"/>
      <text x="130" y="55" font-size="10" fill="#94a3b8" font-weight="bold" text-anchor="middle">🔌 Esquema Elétrico de Bornes</text>
      <text x="130" y="75" font-size="8" fill="#64748b" text-anchor="middle">Alimentação Padrão: 24VDC / Comutação via CLP</text>
    </svg>
  `
};

/* ========================================================================
 * 2. PROGRAMAS PRESET EM LADDER ASSOCIADOS AOS EQUIPAMENTOS
 * ====================================================================== */
const EQUIPMENT_PRESETS = {
  // Botoeiras
  "botoeira-na": {
    rungs: [
      {
        id: "preset-btn-na",
        comment: "Acionamento direto de saída Q0.0 por pulso na botoeira NA (I0.0)",
        nodes: [
          { id: "p-bna-1", type: "NO", target: "I0.0" },
          { id: "p-bna-2", type: "COIL", target: "Q0.0" }
        ]
      }
    ]
  },
  "botoeira-nf": {
    rungs: [
      {
        id: "preset-btn-nf",
        comment: "Linha de interrupção: Entrada NF (I0.1) Mantém circuito habilitado",
        nodes: [
          { id: "p-bnf-1", type: "NC", target: "I0.1" },
          { id: "p-bnf-2", type: "COIL", target: "Q0.0" }
        ]
      }
    ]
  },

  // Sensores
  "sensor-indutivo": {
    rungs: [
      {
        id: "preset-indutivo",
        comment: "Detecção de peça metálica via Sensor Indutivo (I0.0) acionando Atuador Q0.0",
        nodes: [
          { id: "p-sind-1", type: "NO", target: "I0.0" },
          { id: "p-sind-2", type: "COIL", target: "Q0.0" }
        ]
      }
    ]
  },
  "sensor-capacitivo": {
    rungs: [
      {
        id: "preset-capacitivo",
        comment: "Detecção de Nível / Material por Sensor Capacitivo (I0.0)",
        nodes: [
          { id: "p-scap-1", type: "NO", target: "I0.0" },
          { id: "p-scap-2", type: "COIL", target: "Q0.0" }
        ]
      }
    ]
  },
  "sensor-optico": {
    rungs: [
      {
        id: "preset-optico",
        comment: "Contagem de caixas em esteira via Sensor Óptico (I0.2) e Contador CTU C0",
        nodes: [
          { id: "p-sopt-1", type: "NO", target: "I0.2" },
          { id: "p-sopt-2", type: "CTU", target: "C0", pv: 5 }
        ]
      },
      {
        id: "preset-optico-out",
        comment: "Aciona lâmpada Q0.1 ao atingir 5 itens detectados",
        nodes: [
          { id: "p-sopt-3", type: "NO", target: "C0" },
          { id: "p-sopt-4", type: "COIL", target: "Q0.1" }
        ]
      }
    ]
  },

  // Proteção e Comandos
  "contatora": {
    rungs: [
      {
        id: "preset-contatora",
        comment: "Acionamento de Contatora Q0.0 com Retenção (Selo) e Botão Desliga em I0.1",
        nodes: [
          { id: "p-cnt-1", type: "NC", target: "I0.1" },
          {
            id: "p-cnt-2",
            type: "PARALLEL",
            branches: [
              [{ id: "p-cnt-2-1", type: "NO", target: "I0.0" }],
              [{ id: "p-cnt-2-2", type: "NO", target: "Q0.0" }]
            ]
          },
          { id: "p-cnt-3", type: "COIL", target: "Q0.0" }
        ]
      }
    ]
  },
  "rele-termico": {
    rungs: [
      {
        id: "preset-rele-termico",
        comment: "Bloqueio do motor se o contato de falha do Relé Térmico (I0.1) abrir",
        nodes: [
          { id: "p-rt-1", type: "NC", target: "I0.1" },
          { id: "p-rt-2", type: "NO", target: "I0.0" },
          { id: "p-rt-3", type: "COIL", target: "Q0.0" }
        ]
      }
    ]
  },

  // Atuadores
  "valvula-solenoide": {
    rungs: [
      {
        id: "preset-solenoide",
        comment: "Temporizador TON T0 retardando o avanço do Pistão Pneumático em Q0.0",
        nodes: [
          { id: "p-sol-1", type: "NO", target: "I0.0" },
          { id: "p-sol-2", type: "TON", target: "T0", pt: 2 },
          { id: "p-sol-3", type: "COIL", target: "Q0.0" }
        ]
      }
    ]
  },
  "sinalizador-luminoso": {
    rungs: [
      {
        id: "preset-sinalizador",
        comment: "Sinalizador Painel Q0.0 ativado indicando status de operação",
        nodes: [
          { id: "p-sin-1", type: "NO", target: "I0.0" },
          { id: "p-sin-2", type: "COIL", target: "Q0.0" }
        ]
      }
    ]
  }
};

/**
 * AUTO TECH HUB — BANCO DE DADOS DE EQUIPAMENTOS INDUSTRIAIS (FASE 3)
 */
const CATALOG_DATA = {
  categories: [
    { id: "automação", name: "Automação & CLP", icon: "💻", desc: "Controladores programáveis, I/Os e IHMs" },
    { id: "comandos", name: "Comandos Elétricos", icon: "⚡", desc: "Contatores, relés térmicos, disjuntores e botoeiras" },
    { id: "sensores", name: "Sensores de Campo", icon: "📡", desc: "Indutivos, capacitivos, fotoelétricos e ultrassônicos" },
    { id: "acionamentos", name: "Acionamentos", icon: "⚙️", desc: "Inversores de frequência e soft-starters" },
    { id: "pneumatica", name: "Pneumática", icon: "💨", desc: "Válvulas solenoides, atuadores e blocos manifolds" },
    { id: "atuadores", name: "Atuadores Mecânicos", icon: "🦾", desc: "Motores elétricos, servomotores e cilindros" },
    { id: "favoritos", name: "Meus Favoritos", icon: "⭐", desc: "Seus equipamentos salvos para consulta rápida" }
  ],
  equipments: [
    {
      id: "eq-001",
      name: "Sensor Indutivo M12 PNP NA",
      category: "sensores",
      manufacturer: "Balluff",
      shortDesc: "Detecção metálica sem contato com alcance de 4mm.",
      purpose: "Detectar a presença de peças metálicas em esteiras e posicionamento de máquinas sem atrito mecânico.",
      simpleHow: "Funciona como um ímã inteligente: quando um metal chega perto, ele percebe a alteração no campo magnético e envia um sinal de 24V para o CLP.",
      techHow: "Gera um campo eletromagnético de alta frequência na face sensora. A aproximação de um condutor metálico reduz a amplitude de oscilação do circuito interno, acionando o transistor de saída PNP.",
      voltage: "24VDC",
      current: "200mA",
      power: "4.8W",
      ipRating: "IP67",
      outputType: "PNP NA",
      apps: ["Contagem de peças na esteira", "Fim de curso sem contato", "Confirmação de trava de segurança"],
      specsTable: {
        "Distância de Comutação": "4 mm",
        "Rosca": "M12 x 1",
        "Frequência de Resposta": "1000 Hz",
        "Material do Corpo": "Latão Niquelado",
        "Conexão": "Conector M12 4 pinos"
      },
      diagramImg: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60",
      datasheetUrl: "https://www.balluff.com"
    },
    {
      id: "eq-002",
      name: "Contator Tripolar 18A 24VDC",
      category: "comandos",
      manufacturer: "WEG",
      shortDesc: "Chaveamento de motores elétricos trifásicos até 10 CV.",
      purpose: "Ligar e desligar motores elétricos de alta potência com segurança a partir de um sinal de baixa potência do CLP.",
      simpleHow: "É um interruptor elétrico gigante acionado por um eletroímã. Quando o CLP manda 24V para a bobina, ele puxa os contatos internos e liga o motor.",
      techHow: "Uma bobina eletromagnética energizada em 24VDC atrai um núcleo de ferro móvel, fechando simultaneamente 3 contatos de potência (L1-T1, L2-T2, L3-T3) e contatos auxiliares.",
      voltage: "220V/380VAC (Bobina 24VDC)",
      current: "18A",
      power: "7.5kW / 10CV",
      ipRating: "IP20",
      outputType: "Relé",
      apps: ["Partida direta de motores", "Chaveamento de resistências industriais", "Inversão de rotação"],
      specsTable: {
        "Categoria de Uso": "AC-3",
        "Contatos Auxiliares": "1NA + 1NF",
        "Fixação": "Trilho DIN 35mm / Parafuso",
        "Vida Útil Mecânica": "10 milhões de operações"
      },
      diagramImg: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60",
      datasheetUrl: "https://www.weg.net"
    },
    {
      id: "eq-003",
      name: "Inversor de Frequência 3CV 380V",
      category: "acionamentos",
      manufacturer: "Siemens",
      shortDesc: "Controle preciso de velocidade e torque para motores trifásicos.",
      purpose: "Ajustar a velocidade de rotação de motores elétricos, reduzindo picos de corrente e economizando energia.",
      simpleHow: "Funciona como um acelerador eletrônico de carro para o motor da fábrica, permitindo subir ou descer a velocidade suavemente.",
      techHow: "Converte a tensão alternada da rede em contínua (rectificação), e depois sintetiza uma nova tensão alternada com frequência e amplitude variáveis através de transistores IGBT (inversão PWM).",
      voltage: "380VAC",
      current: "7.3A",
      power: "2.2kW / 3CV",
      ipRating: "IP20",
      outputType: "PWM / Analógico",
      apps: ["Esteiras com velocidade variável", "Controle de vazão em bombas", "Sistemas de exaustão"],
      specsTable: {
        "Modo de Controle": "V/f e Vetorial",
        "Entradas Analógicas": "2x (0-10V / 4-20mA)",
        "Comunicação": "Modbus RTU / Profinet",
        "Sobrecarga": "150% por 60 segundos"
      },
      diagramImg: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=60",
      datasheetUrl: "https://www.siemens.com"
    }
  ]
};