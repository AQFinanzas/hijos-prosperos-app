/* CONTENIDO DE LOS 7 DÍAS GRATIS
   Este archivo tiene todo el texto de las misiones. Para cambiar una frase, se cambia aquí.
   Cada día tiene:
   - titulo, leccion (del Módulo 5 del curso)
   - pasos: lo que Dinerito explica (texto corto para 5–7 años y texto para 8–13 años)
   - actividad: el juego del día (su tipo y sus datos)
   - familia: la tarea para hacer con papá o mamá
   - guiaPadres: lo que ve el papá en su panel
*/

const DIAS = [
  {
    dia: 1,
    titulo: "Conoce a Dinerito",
    leccion: "Lección 1",
    pose: "saludando",
    pasos: [
      { chico: "¡Hola, {nombre}! Soy Dinerito. Voy a ser tu guía.", grande: "¡Hola, {nombre}! Soy Dinerito y voy a ser tu guía en la Isla del Dinero." },
      { chico: "Vamos a aprender a ganar, guardar y hacer crecer el dinero.", grande: "En 7 días vas a aprender tres cosas: cómo se gana el dinero, cómo se guarda y cómo se hace crecer." },
      { chico: "Cada día hay una misión. ¡Y ganas monedas!", grande: "Cada día te espera una misión corta. Por cada misión ganas monedas, y si la haces con tu familia, ganas el doble." },
    ],
    actividad: {
      tipo: "revelar",
      instruccion: "Toca cada cofre para ver qué vas a aprender",
      cartas: [
        { frente: "Ganar", detras: "El dinero se gana con esfuerzo: estudiando, ayudando y aprendiendo." },
        { frente: "Guardar", detras: "Una parte de lo que ganas se guarda. Siempre. Primero te pagas a ti." },
        { frente: "Crecer", detras: "El dinero guardado puede trabajar para ti y crecer con el tiempo." },
      ],
    },
    familia: "Muéstrale a papá o mamá a Dinerito y cuéntale qué vas a aprender esta semana.",
    guiaPadres:
      "Hoy su hijo conoce a Dinerito y las tres ideas del programa: ganar, guardar y hacer crecer. Pregúntele qué aprendió. La meta no es que su hijo tenga dinero a cierta edad, sino que sepa qué hacer con él.",
  },
  {
    dia: 2,
    titulo: "¿Para qué sirve el dinero?",
    leccion: "Lección 2",
    pose: "pensando",
    pasos: [
      { chico: "El dinero sirve para comprar cosas que necesitamos.", grande: "El dinero es una herramienta. Sirve para comprar lo que necesitamos y para alcanzar metas." },
      { chico: "Pero hay cosas que no se compran con dinero.", grande: "Pero no lo es todo: hay cosas valiosas que ningún dinero puede comprar." },
      { chico: "En tu casa se puede hablar de dinero. ¡Preguntar está bien!", grande: "En tu casa se habla de dinero sin miedo. Preguntar es la mejor forma de aprender." },
    ],
    actividad: {
      tipo: "clasificar",
      instruccion: "¿Esto se puede comprar con dinero?",
      opciones: ["Sí se compra", "No se compra"],
      items: [
        { texto: "Un helado", correcta: 0 },
        { texto: "Un abrazo", correcta: 1 },
        { texto: "Un libro", correcta: 0 },
        { texto: "Un amigo de verdad", correcta: 1 },
        { texto: "Zapatos", correcta: 0 },
        { texto: "La alegría de jugar en familia", correcta: 1 },
      ],
    },
    familia: "En la cena, pregúntale a papá o mamá: ¿cómo se gana el dinero en nuestra casa?",
    guiaPadres:
      "Traiga el tema del dinero a la mesa, sin juicios. No hace falta dar cifras exactas ni hablar de deudas. Cuente cómo se gana el dinero en casa. Lo que no se habla se convierte en un secreto o en un miedo.",
  },
  {
    dia: 3,
    titulo: "Tu mesada y sus 3 partes",
    leccion: "Lecciones 3 a 6",
    pose: "feliz",
    pasos: [
      { chico: "La mesada es dinero que recibes cada mes.", grande: "La mesada es el dinero que recibes cada mes para aprender a tomar tus propias decisiones." },
      { chico: "Pero se gana con esfuerzo. Tiene 3 partes.", grande: "Pero no es un regalo: se gana con esfuerzo. Por eso se divide en 3 partes iguales." },
      { chico: "Una por estudiar, una por ayudar en casa y una por aprender de dinero.", grande: "Una parte depende de tus notas, otra de tus tareas en casa y otra de leer o ver algo sobre dinero." },
    ],
    actividad: {
      tipo: "frascos",
      instruccion: "Toca cada frasco para ver cómo se gana",
      frascos: [
        { nombre: "Estudio", detalle: "Si tus notas son buenas, ganas esta parte." },
        { nombre: "Casa", detalle: "Si cumples tus tareas, como tender la cama o lavar los platos, ganas esta parte." },
        { nombre: "Aprender", detalle: "Si lees tu libro o ves tu video de dinero del mes, ganas esta parte." },
      ],
      pregunta: {
        texto: "Si no hago mis tareas de la casa, ¿qué pasa?",
        opciones: ["Igual recibo toda la mesada", "No recibo la parte de Casa", "No recibo nada"],
        correcta: 1,
      },
    },
    familia: "Acuerden con papá o mamá cuánto es tu mesada y cuáles son tus 3 reglas.",
    guiaPadres:
      "Defina el monto de la mesada en su panel (ejemplo: 30 dólares = 10 + 10 + 10). Fije la nota mínima (por ejemplo, 7 de 10), elija 3 tareas de la casa y un libro o video corto del mes. Adapte las reglas a su familia.",
  },
  {
    dia: 4,
    titulo: "Tu primer 10%",
    leccion: "Lecciones 7 y 9",
    pose: "celebrando",
    pasos: [
      { chico: "De cada 10 monedas, 1 va a tu alcancía.", grande: "Ahora viene el hábito más importante: de todo lo que recibes, guardas el 10%." },
      { chico: "Esa moneda no es para gastar. ¡Es para tu futuro!", grande: "Ese 10% no es para gastar. Se llama pagarte a ti primero, y es el secreto de las personas a las que les va bien con el dinero." },
      { chico: "Vamos a llenar tu alcancía.", grande: "No importa cuánto ganas. Importa cuánto te queda. Vamos a calcular tu primer 10%." },
    ],
    actividad: {
      tipo: "diezporciento",
      instruccion: "Pon tu 10% en la alcancía",
      pregunta: {
        texto: "Si recibes 50 dólares, ¿cuánto es tu 10%?",
        opciones: ["5 dólares", "10 dólares", "15 dólares"],
        correcta: 0,
      },
    },
    familia: "Con papá o mamá, aparten tu primer 10% en una alcancía de verdad.",
    guiaPadres:
      "Ayude a su hijo a apartar el 10% de la mesada. De 0 a 8 años, en una alcancía. Desde los 8, se puede abrir una cuenta de ahorro yendo juntos al banco, para que viva el proceso. Este hábito marca la diferencia entre tener problemas de dinero de adulto o no.",
  },
  {
    dia: 5,
    titulo: "Elige tu primera meta",
    leccion: "Lecciones 10 y 11",
    pose: "pensando",
    pasos: [
      { chico: "¿Qué te gustaría tener? ¡Esa es tu meta!", grande: "Una meta es algo que quieres y para lo que ahorras con un plan." },
      { chico: "Ahorras un poquito cada mes hasta llegar.", grande: "Muchos adultos compran ya lo que no pueden pagar y se endeudan. Tú vas a aprender a esperar y ahorrar." },
      { chico: "Papá o mamá te pueden ayudar.", grande: "Tu plan dice cuánto pones tú, cuánto te ayuda tu familia y en cuántos meses llegas." },
    ],
    actividad: { tipo: "meta", instruccion: "Arma el plan de tu meta" },
    familia: "Muéstrale tu meta a papá o mamá y pónganle juntos el precio y la fecha.",
    guiaPadres:
      "Ejemplo del curso: una bicicleta de 150 dólares. Su hijo ahorra 6 al mes (20% de una mesada de 30) y usted pone 24, durante 5 meses. Lo importante no es cuánto pone su hijo, sino el hábito de ahorrar para algo concreto y esperar.",
  },
  {
    dia: 6,
    titulo: "Las 4 piezas del dinero",
    leccion: "Lecciones 15 a 19",
    pose: "feliz",
    pasos: [
      { chico: "El dinero que entra se llama ingreso.", grande: "Ingreso: el dinero que gano con un trabajo y entra a mi bolsillo o cuenta." },
      { chico: "El dinero que sale se llama gasto.", grande: "Gasto: el dinero que sale de mi bolsillo o cuenta." },
      { chico: "¡Ahora juguemos!", grande: "Activo: todo bien que pone dinero en mi bolsillo. Pasivo: todo bien que saca dinero de mi bolsillo." },
    ],
    actividad: {
      tipo: "clasificar",
      instruccion: "¿Dónde va cada cosa?",
      opcionesChico: ["Entra dinero", "Sale dinero"],
      opciones: ["Ingreso", "Gasto", "Activo", "Pasivo"],
      items: [
        { texto: "Tu mesada", correcta: 0, chico: 0 },
        { texto: "Comprar un helado", correcta: 1, chico: 1 },
        { texto: "Un apartamento que se alquila", correcta: 2, chico: 0 },
        { texto: "El carro de la familia", correcta: 3, chico: 1 },
        { texto: "El sueldo de papá", correcta: 0, chico: 0 },
        { texto: "Una bicicleta que hay que arreglar", correcta: 3, chico: 1 },
      ],
    },
    familia: "Busquen juntos en la casa algo que sea un activo y algo que sea un pasivo.",
    guiaPadres:
      "Estas definiciones son desde el éxito financiero, no desde la contabilidad: activo es lo que pone dinero en el bolsillo; pasivo, lo que lo saca. El carro propio es un pasivo. No significa no tenerlo, sino saber qué tipo de bien es.",
  },
  {
    dia: 7,
    titulo: "El juego del dinero",
    leccion: "Lección 20",
    pose: "celebrando",
    pasos: [
      { chico: "¿Sabes en qué consiste el juego del dinero?", grande: "Hoy vas a aprender la frase más importante de todas: en qué consiste el juego del dinero." },
      { chico: "Juntar cosas que te den dinero, y que siempre te quede.", grande: "El juego consiste en acumular activos que paguen los pasivos, y que siempre quede dinero." },
      { chico: "¡Arma la frase!", grande: "Ahora arma la frase. Cuando te la sepas de memoria, eres parte del juego." },
    ],
    actividad: {
      tipo: "frase",
      instruccion: "Toca las palabras en orden",
      partes: ["Acumular activos", "que paguen", "los pasivos", "y que siempre", "quede dinero"],
    },
    familia: "Pídele a papá o mamá que te pregunte la frase en la cena o en el carro. ¡Dila de memoria!",
    guiaPadres:
      "Pregúntele en cualquier momento: ¿en qué consiste el juego del dinero? Hasta que lo responda solo. Hoy termina la prueba gratis: lo esperan la Isla de la Mesada, la Isla de la Alcancía, las 4 Piezas y el Monopolio Próspero.",
  },
];

const ISLAS_SIGUIENTES = [
  { nombre: "Isla de la Mesada", semana: "Mes 1, semana 1" },
  { nombre: "Isla de la Alcancía", semana: "Mes 1, semana 2" },
  { nombre: "Isla de las 4 Piezas", semana: "Mes 1, semana 3" },
  { nombre: "Mercado y Monopolio", semana: "Mes 1, semana 4" },
];

const METAS_OPCIONES = [
  { nombre: "Bicicleta", precio: 150 },
  { nombre: "Balón", precio: 30 },
  { nombre: "Videojuego", precio: 60 },
  { nombre: "Muñeca o juguete", precio: 40 },
  { nombre: "Libro", precio: 20 },
  { nombre: "Otra cosa", precio: 50 },
];

const AVATARES = ["#2D8EBB", "#ED480F", "#170B5B", "#FFB81C", "#3BB273", "#9B5DE5"];
