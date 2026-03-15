# Serpientes y Escaleras — Plan de Desarrollo

## Visión General

Un juego de Serpientes y Escaleras multijugador en tiempo real con temática de aventura/jungla, construido con **React 19**, **PixiJS v8** y **Socket.IO**. Soporta de 1 a 4 jugadores (humanos o CPU), con animaciones cinematográficas, partículas y efectos de sonido.

---

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend Framework** | React 19 + TypeScript | Manejo de UI, estado, routing |
| **Motor de Juego** | PixiJS v8 + @pixi/react v8 | Renderizado 2D WebGL/WebGPU de alto rendimiento |
| **Partículas** | ParticleContainer nativo de PixiJS v8 | Hasta 1M partículas a 60fps |
| **Comunicación** | Socket.IO (cliente + servidor) | WebSockets con reconexión automática, salas, fallback |
| **Backend** | Node.js + Express + Socket.IO | Servidor de juego y API |
| **Estado del juego** | Zustand | Estado global ligero, ideal para juegos |
| **Sonido** | Howler.js | Audio cross-browser confiable |
| **Build** | Vite | Build rápido, HMR, soporte TypeScript nativo |
| **Estilos UI** | Tailwind CSS | UI fuera del canvas (lobby, menús) |

---

## Arquitectura del Proyecto

```
serpientes-escaleras/
├── client/                          # Frontend React
│   ├── public/
│   │   └── assets/
│   │       ├── sprites/             # Texturas del tablero, fichas, serpientes, escaleras
│   │       ├── particles/           # Configuraciones de emisores de partículas
│   │       ├── sounds/              # Efectos de sonido y música
│   │       └── fonts/               # Fuentes temáticas
│   ├── src/
│   │   ├── main.tsx                 # Entry point
│   │   ├── App.tsx                  # Router principal
│   │   ├── components/
│   │   │   ├── ui/                  # Componentes React (lobby, HUD, chat)
│   │   │   │   ├── Lobby.tsx
│   │   │   │   ├── PlayerHUD.tsx
│   │   │   │   ├── DiceButton.tsx
│   │   │   │   ├── GameOverModal.tsx
│   │   │   │   └── Chat.tsx
│   │   │   └── game/                # Componentes PixiJS (@pixi/react)
│   │   │       ├── GameCanvas.tsx   # Wrapper principal del canvas PixiJS
│   │   │       ├── Board.tsx        # Tablero 10x10 con temática de jungla
│   │   │       ├── Cell.tsx         # Casilla individual
│   │   │       ├── Snake.tsx        # Serpiente animada (sprite + tween)
│   │   │       ├── Ladder.tsx       # Escalera con efecto de brillo
│   │   │       ├── Token.tsx        # Ficha del jugador con trail de partículas
│   │   │       ├── Dice3D.tsx       # Dado animado con física simulada
│   │   │       └── ParticleEffects.tsx  # Explosiones, confeti, fuego, etc.
│   │   ├── hooks/
│   │   │   ├── useSocket.ts         # Conexión y eventos Socket.IO
│   │   │   ├── useGameState.ts      # Estado del juego (Zustand)
│   │   │   ├── useSound.ts          # Control de audio
│   │   │   └── useAnimation.ts      # Utilidades de animación
│   │   ├── game/
│   │   │   ├── engine.ts            # Lógica central del juego
│   │   │   ├── board-config.ts      # Posiciones de serpientes/escaleras
│   │   │   ├── cpu-player.ts        # IA para jugadores CPU
│   │   │   ├── dice.ts              # Lógica del dado
│   │   │   └── types.ts             # Tipos TypeScript compartidos
│   │   ├── store/
│   │   │   └── gameStore.ts         # Zustand store
│   │   └── utils/
│   │       ├── coordinates.ts       # Conversión casilla → pixel
│   │       ├── tweens.ts            # Funciones de easing
│   │       └── constants.ts         # Constantes del juego
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                          # Backend Node.js
│   ├── src/
│   │   ├── index.ts                 # Entry point del servidor
│   │   ├── socket/
│   │   │   ├── handler.ts           # Manejador de eventos Socket.IO
│   │   │   ├── rooms.ts             # Gestión de salas
│   │   │   └── events.ts            # Definición de eventos
│   │   ├── game/
│   │   │   ├── state.ts             # Estado autoritativo del juego
│   │   │   ├── logic.ts             # Lógica de negocio (servidor autoritativo)
│   │   │   └── validator.ts         # Validación de movimientos
│   │   └── types/
│   │       └── shared.ts            # Tipos compartidos cliente-servidor
│   ├── package.json
│   └── tsconfig.json
│
└── shared/                          # Código compartido
    ├── types.ts                     # Interfaces del juego
    ├── board.ts                     # Configuración del tablero (serpientes/escaleras)
    └── constants.ts                 # Constantes compartidas
```

---

## Modelo de Datos

### Tablero (Board)

```typescript
interface BoardConfig {
  size: 10;                          // 10x10 = 100 casillas
  snakes: SnakeOrLadder[];           // Ej: { start: 99, end: 12, type: 'snake' }
  ladders: SnakeOrLadder[];          // Ej: { start: 4, end: 56, type: 'ladder' }
}

interface SnakeOrLadder {
  start: number;                     // Casilla de inicio
  end: number;                       // Casilla de destino
  type: 'snake' | 'ladder';
  sprite?: string;                   // Sprite personalizado
}
```

### Estado del Juego (GameState)

```typescript
interface GameState {
  id: string;                        // ID de la sala
  phase: 'lobby' | 'playing' | 'finished';
  board: BoardConfig;
  players: Player[];
  currentPlayerIndex: number;
  lastDiceRoll: number | null;
  winner: string | null;
  turnTimer: number;                 // Segundos restantes del turno
}

interface Player {
  id: string;
  name: string;
  avatar: string;                    // Sprite de la ficha
  color: string;
  position: number;                  // Casilla actual (0 = fuera, 1-100)
  isCPU: boolean;
  isConnected: boolean;
}
```

---

## Flujo del Juego

### 1. Pantalla de Inicio → Lobby

```
[Pantalla de Inicio]
    ├── "Crear Sala"  → Genera código de sala → Lobby (como host)
    ├── "Unirse"      → Ingresa código      → Lobby (como invitado)
    └── "Jugar Solo"  → Lobby local (1 humano + 1-3 CPU)

[Lobby]
    ├── Lista de jugadores conectados (avatares, nombres)
    ├── Agregar/quitar jugadores CPU
    ├── Chat en tiempo real
    └── Botón "Iniciar" (solo host, mínimo 2 jugadores)
```

### 2. Flujo de un Turno

```
1. Se indica quién tiene el turno (animación de spotlight sobre la ficha)
2. El jugador presiona "Tirar Dado" (o CPU tira automáticamente con delay)
3. ANIMACIÓN: El dado gira con física simulada → muestra resultado
4. ANIMACIÓN: La ficha se mueve casilla por casilla con bounce
5. VERIFICACIÓN: ¿Cayó en serpiente o escalera?
   ├── SERPIENTE: La serpiente se anima (ondulación), la ficha se desliza hacia abajo
   │   → Partículas de humo/veneno, sonido dramático
   └── ESCALERA: Brillo dorado en la escalera, la ficha sube con partículas de estrellas
       → Sonido triunfal
6. VERIFICACIÓN: ¿Llegó a casilla 100?
   ├── SÍ → Secuencia de victoria (confeti, fuegos artificiales, fanfarria)
   └── NO → Turno del siguiente jugador
```

### 3. Reglas

- Se necesita el número exacto para llegar a la casilla 100
- Si el dado da un número mayor al necesario, el jugador rebota hacia atrás
- Si un jugador saca 6, tira de nuevo (máximo 3 veces consecutivas)
- Timer de 15 segundos por turno (configurable)
- Si se agota el timer, se tira automáticamente

---

## Diseño Visual — Temática Aventura/Jungla

### Tablero

- **Fondo**: Textura de mapa antiguo/pergamino con bordes desgastados
- **Casillas**: Piedras de templo maya/azteca con números tallados
- **Camino**: El recorrido serpentea como un sendero de jungla
- **Vegetación**: Hojas, lianas y flores animadas alrededor del tablero
- **Iluminación**: Efecto de antorcha con partículas de fuego en las esquinas

### Serpientes

- Serpientes tropicales con colores vivos (esmeralda, coral, dorada)
- Animación idle: ondulación suave del cuerpo, lengua bífida entrando y saliendo
- Animación de activación: la serpiente se enrolla alrededor de la ficha y la arrastra
- Ojos brillantes con efecto de shader

### Escaleras

- Escaleras de bambú/madera con lianas enredadas
- Brillo dorado pulsante en los peldaños
- Al activarse: partículas de luciérnagas/estrellas subiendo
- Efecto de "camino de luz" ascendente

### Fichas de Jugadores

- Pequeños exploradores/aventureros con distintos diseños:
  - Jugador 1: Explorador con sombrero (rojo)
  - Jugador 2: Arqueóloga con mochila (azul)
  - Jugador 3: Guía con machete (verde)
  - Jugador 4: Naturalista con binoculares (amarillo)
- Trail de partículas al moverse (polvo del camino)
- Animación idle: respiración sutil

### Dado

- Dado de piedra tallada con puntos de jade
- Al tirar: gira con física simulada (rotación 3D simulada en 2D con sprites)
- Impacto al caer con partículas de polvo
- Brillo especial al sacar 6

### Efectos de Partículas

| Evento | Efecto |
|--------|--------|
| Mover ficha | Trail de polvo/arena |
| Subir escalera | Estrellas doradas ascendentes |
| Bajar serpiente | Humo verde/veneno descendente |
| Sacar 6 | Chispas doradas alrededor del dado |
| Victoria | Confeti + fuegos artificiales + rayos de luz |
| Inicio del turno | Spotlight circular sobre la ficha |

---

## Comunicación WebSocket (Socket.IO)

### Eventos Cliente → Servidor

```typescript
// Lobby
'room:create'       → { playerName, avatar }
'room:join'         → { roomCode, playerName, avatar }
'room:add-cpu'      → { }
'room:remove-cpu'   → { cpuId }
'room:start'        → { }

// Juego
'game:roll-dice'    → { }                    // Solicitar tirar dado
'game:chat'         → { message }            // Mensaje de chat

// Conexión
'player:reconnect'  → { roomCode, playerId } // Reconexión
```

### Eventos Servidor → Cliente

```typescript
// Lobby
'room:created'      → { roomCode, gameState }
'room:updated'      → { gameState }          // Jugador entró/salió
'room:error'        → { message }

// Juego
'game:started'      → { gameState }
'game:dice-rolled'  → { playerId, value, newPosition, event? }
'game:turn-change'  → { currentPlayerIndex, turnTimer }
'game:snake-hit'    → { playerId, from, to, snakeId }
'game:ladder-hit'   → { playerId, from, to, ladderId }
'game:finished'     → { winnerId, finalState }

// Sistema
'player:disconnected' → { playerId }
'player:reconnected'  → { playerId }
```

### Modelo Servidor Autoritativo

El servidor es la fuente de verdad:

1. El cliente solo envía intenciones (`game:roll-dice`)
2. El servidor genera el resultado del dado, calcula posición, detecta serpientes/escaleras
3. El servidor emite el resultado a todos los clientes
4. Los clientes solo renderizan las animaciones correspondientes
5. Esto previene trampas y mantiene consistencia

---

## Sistema de Sonido

| Evento | Sonido |
|--------|--------|
| Música de fondo | Ambiente de jungla (pájaros, agua, viento entre hojas) |
| Tirar dado | Piedra rodando sobre madera |
| Dado cae | Impacto de piedra |
| Ficha se mueve | Pasos suaves sobre piedra (por cada casilla) |
| Serpiente | Siseo amenazante + deslizamiento |
| Escalera | Arpegio ascendente mágico |
| Sacar 6 | Fanfarria corta + "¡Otra vez!" |
| Tu turno | Tambor tribal suave |
| Victoria | Fanfarria épica + aplausos |
| Derrota | Trombón triste cómico |
| Chat | Pop suave |

---

## Fases de Implementación

### Fase 1 — Fundación (Semana 1-2)

**Objetivo**: Juego funcional sin arte final

- [ ] Scaffold del proyecto (Vite + React 19 + TypeScript)
- [ ] Servidor básico con Express + Socket.IO
- [ ] Tablero 10x10 renderizado en PixiJS con colores planos
- [ ] Lógica del juego: movimiento, serpientes, escaleras, turnos
- [ ] Dado funcional (sin animación, solo resultado)
- [ ] 2 jugadores locales (sin red)
- [ ] Coordinadas: conversión casilla → posición pixel

### Fase 2 — Multijugador (Semana 3)

**Objetivo**: Juego funcional en red

- [ ] Sistema de salas (crear, unirse con código)
- [ ] Lobby con lista de jugadores
- [ ] Servidor autoritativo (validación de movimientos)
- [ ] Sincronización de estado en tiempo real
- [ ] Reconexión automática
- [ ] Jugadores CPU (lógica en servidor)
- [ ] Timer de turno

### Fase 3 — Arte y Animaciones (Semana 4-5)

**Objetivo**: Experiencia visual completa

- [ ] Assets de temática aventura/jungla (sprites, texturas)
- [ ] Tablero con estilo de mapa antiguo
- [ ] Serpientes animadas (idle + activación)
- [ ] Escaleras con efectos de brillo
- [ ] Fichas de exploradores con animaciones idle
- [ ] Dado animado (rotación, rebote, impacto)
- [ ] Movimiento casilla por casilla con easing
- [ ] Efectos de partículas (polvo, estrellas, humo, confeti)

### Fase 4 — Audio y Pulido (Semana 6)

**Objetivo**: Experiencia completa e inmersiva

- [ ] Sistema de sonido con Howler.js
- [ ] Música ambiental de jungla
- [ ] Efectos de sonido para cada acción
- [ ] Pantalla de victoria cinematográfica
- [ ] Chat en tiempo real
- [ ] Pantalla de inicio con animación
- [ ] Responsive (desktop + tablet)
- [ ] Optimización de rendimiento

### Fase 5 — Extras (Opcional)

- [ ] Múltiples tableros/temas desbloqueables
- [ ] Sistema de logros
- [ ] Emotes/reacciones en tiempo real
- [ ] Espectadores (observar partidas)
- [ ] Historial de partidas
- [ ] PWA (instalar como app)

---

## Configuración del Tablero Clásico

Posiciones de serpientes y escaleras para un tablero estándar:

```typescript
const BOARD_CONFIG: BoardConfig = {
  size: 10,
  snakes: [
    { start: 99, end: 54, type: 'snake' },   // Serpiente gigante
    { start: 70, end: 55, type: 'snake' },
    { start: 52, end: 42, type: 'snake' },
    { start: 25, end:  2, type: 'snake' },
    { start: 95, end: 72, type: 'snake' },
    { start: 47, end: 19, type: 'snake' },
  ],
  ladders: [
    { start:  2, end: 23, type: 'ladder' },
    { start:  8, end: 34, type: 'ladder' },
    { start: 20, end: 77, type: 'ladder' },   // Escalera épica
    { start: 32, end: 68, type: 'ladder' },
    { start: 41, end: 79, type: 'ladder' },
    { start: 74, end: 88, type: 'ladder' },
  ],
};
```

---

## Notas Técnicas

### Rendimiento
- Usar `ParticleContainer` de PixiJS v8 para todos los sistemas de partículas
- Texture atlases (spritesheets) para minimizar draw calls
- Object pooling para partículas reutilizables
- Throttle de eventos Socket.IO para animaciones (el cliente interpola)

### Seguridad Multijugador
- El servidor genera los valores del dado (no confiar en el cliente)
- Validar que solo el jugador del turno actual puede tirar
- Rate limiting en eventos
- Sanitizar mensajes de chat

### @pixi/react v8
- Requiere React 19
- Componentes JSX con prefijo `pixi` para autocompletado TypeScript
- Scaffold con: `npm create pixi.js@latest --template framework-react`

---

*Plan generado para el proyecto Serpientes y Escaleras — Marzo 2026*
