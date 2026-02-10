// ─── Initial canvas state — complete chatbot UI flow ──────────────────────────
//
// Flow overview:
//
//   [Start]
//     │
//   [Welcome message]
//     │
//   [Ask for name]  ← UserInput
//     │
//   [Greet by name]  ← Message (rich text)
//     │
//   [Ask intent]  ← UserInput
//     │
//   [Check intent]  ← Condition (is intent recognized?)
//    ├─ true ──► [Route topic]  ← Switch (billing / support / sales / other)
//    │              ├─ billing ──► [Fetch account]  ← API
//    │              │                ├─ success ──► [Show billing info]  ← Message
//    │              │                └─ failure ──► [API error msg]  ← Message
//    │              ├─ support ──► [Delay 2s]  ← Delay
//    │              │                └──► [Connect to agent msg]  ← Message
//    │              ├─ sales   ──► [Show pricing]  ← Message (link)
//    │              └─ default ──► [Fallback msg]  ← Message
//    └─ false ──► [Didn't understand]  ← Message
//                   └──► [Jump back to ask intent]  ← Jump
//     │ (all paths converge)
//   [Anything else?]  ← UserInput
//     │
//   [End session?]  ← Condition
//    ├─ true ──► [Goodbye message]  ← Message (rich text)
//    │              └──► [End]
//    └─ false ──► [Jump to greet]  ← Jump (restart topic selection)

export const chatbotUINode01 = [
  // ── 1. Entry ──────────────────────────────────────────────────────────────
  {
    id: "start-1",
    type: "start",
    data: {},
    position: { x: 480, y: 0 },
  },

  // ── 2. Welcome ────────────────────────────────────────────────────────────
  {
    id: "msg-welcome",
    type: "message",
    data: {
      label: "Welcome Banner",
      messageType: "rich_text",
      content: "👋 Welcome! I'm your virtual assistant. I'm here to help.",
    },
    position: { x: 380, y: 100 },
  },

  // ── 3. Ask name ───────────────────────────────────────────────────────────
  {
    id: "input-name",
    type: "userInput",
    data: {
      label: "Ask for name",
      placeholder: "What's your name?",
      inputType: "text",
      required: true,
      variableName: "{{user.name}}",
    },
    position: { x: 380, y: 230 },
  },

  // ── 4. Personalised greeting ──────────────────────────────────────────────
  {
    id: "msg-greet",
    type: "message",
    data: {
      label: "Personalised Greeting",
      messageType: "text",
      content: "Nice to meet you, {{user.name}}! How can I help you today?",
    },
    position: { x: 380, y: 370 },
  },

  // ── 5. Ask intent ─────────────────────────────────────────────────────────
  {
    id: "input-intent",
    type: "userInput",
    data: {
      label: "Capture User Intent",
      placeholder: "Type your question or choose a topic…",
      inputType: "text",
      required: true,
      variableName: "{{user.intent}}",
    },
    position: { x: 380, y: 500 },
  },

  // ── 6. Condition: intent recognized? ──────────────────────────────────────
  {
    id: "cond-intent",
    type: "condition",
    data: {
      label: "Intent Recognized?",
      mode: "if_else",
      variable: "{{user.intent}}",
      branches: [
        { id: "true", label: "Recognized" },
        { id: "false", label: "Unknown" },
      ],
    },
    position: { x: 380, y: 640 },
  },

  // ── 7a. Unknown intent → message + jump ───────────────────────────────────
  {
    id: "msg-unknown",
    type: "message",
    data: {
      label: "Didn't Understand",
      messageType: "text",
      content: "Sorry, I didn't quite catch that. Could you rephrase?",
    },
    position: { x: 760, y: 760 },
  },
  {
    id: "jump-retry",
    type: "jump",
    data: {
      label: "Retry Intent",
      targetNodeId: "input-intent",
      targetNodeLabel: "Capture User Intent",
    },
    position: { x: 760, y: 900 },
  },

  // ── 7b. Recognized → Switch on topic ──────────────────────────────────────
  {
    id: "switch-topic",
    type: "switch",
    data: {
      label: "Route by Topic",
      variable: "{{user.intent}}",
      cases: [
        { id: "billing", label: "Billing", value: "billing" },
        { id: "support", label: "Support", value: "support" },
        { id: "sales", label: "Sales", value: "sales" },
      ],
      hasDefault: true,
    },
    position: { x: 140, y: 760 },
  },

  // ── Branch A: Billing ─────────────────────────────────────────────────────
  {
    id: "api-billing",
    type: "api",
    data: {
      label: "Fetch Account Info",
      url: "https://api.example.com/account",
      method: "GET",
      mock: true,
      mockStatusCode: 200,
      bodyPreview: '{ "plan": "Pro", "balance": "$0.00" }',
    },
    position: { x: -240, y: 1000 },
  },
  {
    id: "msg-billing-ok",
    type: "message",
    data: {
      label: "Billing Info",
      messageType: "rich_text",
      content:
        "Here's your account summary: Plan: {{account.plan}} | Balance: {{account.balance}}",
    },
    position: { x: -340, y: 1160 },
  },
  {
    id: "msg-billing-err",
    type: "message",
    data: {
      label: "Billing API Error",
      messageType: "text",
      content:
        "Sorry, we couldn't retrieve your billing info. Please try again later.",
    },
    position: { x: -100, y: 1160 },
  },

  // ── Branch B: Support ─────────────────────────────────────────────────────
  {
    id: "delay-support",
    type: "delay",
    data: {
      label: "Connecting…",
      duration: 2,
      unit: "seconds",
      description: "Simulate agent lookup",
    },
    position: { x: 60, y: 1000 },
  },
  {
    id: "msg-support",
    type: "message",
    data: {
      label: "Agent Connected",
      messageType: "text",
      content:
        "You're now connected to a support agent. Average wait time: 2 min.",
    },
    position: { x: 60, y: 1160 },
  },

  // ── Branch C: Sales ───────────────────────────────────────────────────────
  {
    id: "msg-sales",
    type: "message",
    data: {
      label: "Pricing Page",
      messageType: "link",
      linkUrl: "https://example.com/pricing",
      linkText: "View our pricing plans →",
    },
    position: { x: 280, y: 1000 },
  },

  // ── Branch D: Default fallback ────────────────────────────────────────────
  {
    id: "msg-fallback",
    type: "message",
    data: {
      label: "General Fallback",
      messageType: "text",
      content:
        "I can help with billing, support, or sales. Which would you like?",
    },
    position: { x: 460, y: 1000 },
  },

  // ── 8. Wrap-up input ──────────────────────────────────────────────────────
  {
    id: "input-more",
    type: "userInput",
    data: {
      label: "Anything Else?",
      placeholder: "Is there anything else I can help you with?",
      inputType: "text",
      required: false,
      variableName: "{{user.continue}}",
    },
    position: { x: 140, y: 1360 },
  },

  // ── 9. End session condition ──────────────────────────────────────────────
  {
    id: "cond-end",
    type: "condition",
    data: {
      label: "End Session?",
      mode: "if_else",
      variable: "{{user.continue}}",
      branches: [
        { id: "true", label: "Done" },
        { id: "false", label: "More help" },
      ],
    },
    position: { x: 140, y: 1490 },
  },

  // ── 10a. More help → jump back ────────────────────────────────────────────
  {
    id: "jump-restart",
    type: "jump",
    data: {
      label: "Back to Topic Selection",
      targetNodeId: "msg-greet",
      targetNodeLabel: "Personalised Greeting",
    },
    position: { x: 420, y: 1610 },
  },

  // ── 10b. Done → goodbye ───────────────────────────────────────────────────
  {
    id: "msg-bye",
    type: "message",
    data: {
      label: "Goodbye",
      messageType: "rich_text",
      content: "Thanks for chatting, {{user.name}}! Have a great day. 👋",
    },
    position: { x: -20, y: 1610 },
  },

  // ── 11. End ───────────────────────────────────────────────────────────────
  {
    id: "end-1",
    type: "end",
    data: {},
    position: { x: 60, y: 1750 },
  },
];

export const chatbotUIEdge01 = [
  // Entry → Welcome → Name → Greet → Intent
  { id: "e01", source: "start-1", target: "msg-welcome" },
  { id: "e02", source: "msg-welcome", target: "input-name" },
  { id: "e03", source: "input-name", target: "msg-greet" },
  { id: "e04", source: "msg-greet", target: "input-intent" },
  { id: "e05", source: "input-intent", target: "cond-intent" },

  // Condition: intent recognized?
  {
    id: "e06",
    source: "cond-intent",
    sourceHandle: "true",
    target: "switch-topic",
  },
  {
    id: "e07",
    source: "cond-intent",
    sourceHandle: "false",
    target: "msg-unknown",
  },

  // Unknown path → jump retry
  { id: "e08", source: "msg-unknown", target: "jump-retry" },

  // Switch branches
  {
    id: "e09",
    source: "switch-topic",
    sourceHandle: "billing",
    target: "api-billing",
  },
  {
    id: "e10",
    source: "switch-topic",
    sourceHandle: "support",
    target: "delay-support",
  },
  {
    id: "e11",
    source: "switch-topic",
    sourceHandle: "sales",
    target: "msg-sales",
  },
  {
    id: "e12",
    source: "switch-topic",
    sourceHandle: "default",
    target: "msg-fallback",
  },

  // Billing branch
  {
    id: "e13",
    source: "api-billing",
    sourceHandle: "success",
    target: "msg-billing-ok",
  },
  {
    id: "e14",
    source: "api-billing",
    sourceHandle: "failure",
    target: "msg-billing-err",
  },

  // Support branch
  { id: "e15", source: "delay-support", target: "msg-support" },

  // All branches converge to wrap-up input
  { id: "e16", source: "msg-billing-ok", target: "input-more" },
  { id: "e17", source: "msg-billing-err", target: "input-more" },
  { id: "e18", source: "msg-support", target: "input-more" },
  { id: "e19", source: "msg-sales", target: "input-more" },
  { id: "e20", source: "msg-fallback", target: "input-more" },

  // Wrap-up → end condition
  { id: "e21", source: "input-more", target: "cond-end" },

  // End condition branches
  { id: "e22", source: "cond-end", sourceHandle: "true", target: "msg-bye" },
  {
    id: "e23",
    source: "cond-end",
    sourceHandle: "false",
    target: "jump-restart",
  },

  // Goodbye → End
  { id: "e24", source: "msg-bye", target: "end-1" },
];
