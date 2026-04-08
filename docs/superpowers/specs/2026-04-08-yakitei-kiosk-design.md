# Yakitei Kiosk Design

## Summary

Build a demo web kiosk for `야키테이`, a yakisoba shop. The kiosk should support both dine-in and takeout orders, use a cart-based flow, and highlight a real-time topping-combination recommendation feature that updates as demo orders are completed.

## Product Goals

- Let customers start an order quickly with a clear dine-in or takeout choice.
- Make the two yakisoba variants the primary products and keep drinks as secondary add-ons.
- Encourage upsells through a prominent `실시간 인기 토핑 조합` module.
- Present a kiosk-like commercial UI that feels warm, food-focused, and easy to tap.
- Keep implementation lightweight for a demo by using client-side state and `localStorage` instead of a backend.
- Improve menu scanning and ordering speed by using photo-led menu cards for all items.
- Make add/remove interactions explicit so customers can adjust cart contents without confusion.

## In Scope

- Single-store kiosk landing and ordering experience for `야키테이`
- Dine-in and takeout entry choice
- Cart-based ordering flow
- Menu selection for:
  - 기본 야끼소바 (데리야끼): 11,000원
  - 소금 야끼소바: 11,000원
  - 콜라: 2,000원
  - 사이다: 2,000원
  - 생맥주: 5,000원
  - 하이볼: 7,000원
- Topping selection for yakisoba:
  - 오징어새우: 1,500원
  - 비엔나: 1,500원
  - 면 추가: 1,000원
  - 계란 프라이 추가: 1,000원
  - 치즈 추가: 1,000원
- Real-time ranking of popular topping combinations
- Demo checkout and order-complete state
- Photo-led menu board for all mains and drinks
- Cart controls with explicit add, subtract, and remove actions

## Out of Scope

- Real payment processing
- Store staff dashboard
- Kitchen printer integration
- Authentication
- Multi-store or admin configuration
- Server-side persistence or analytics backend

## Primary User Flow

1. User lands on the kiosk home screen.
2. User chooses `매장 식사` or `포장`.
3. User selects a main menu item from the yakisoba menu.
4. User customizes toppings on the options screen.
5. User optionally uses a recommended topping combo card to apply a popular combination in one tap.
6. User optionally adds drinks.
7. User reviews the cart, edits quantity or removes items, and proceeds to demo checkout.
8. User sees an order-complete screen.
9. The chosen topping combination increments its popularity count and the recommendation ranking updates immediately for the next order.

## Screen Structure

### 1. Start Screen

Purpose: Set order type and establish the brand mood.

Content:

- `야키테이` store name and subtitle
- Large CTA cards for `매장 식사` and `포장`
- Brief brand statement about teppan yakisoba
- A small preview strip showing best-selling topping combinations

Behavior:

- Selecting an order type stores the mode in app state and moves to the menu screen.

### 2. Menu Screen

Purpose: Let the customer choose a main dish first, then optionally add drinks.

Content:

- Two primary menu cards with large food photography:
  - 기본 야끼소바 (데리야끼)
  - 소금 야끼소바
- Secondary drinks section with drink photography:
  - 콜라
  - 사이다
  - 생맥주
  - 하이볼
- Persistent cart summary panel
- Step indicator showing current progress

Behavior:

- Choosing a yakisoba item creates a draft cart line and moves to the options screen.
- Drinks can be added from this screen and from the cart flow if needed.
- Each card includes a visible `담기` action.
- Main dish cards emphasize the photo and route into topping customization.
- Drink cards add directly to the cart in one tap.
- The cart summary panel shows line items and live quantity changes while the user remains on the menu board.

### 3. Options and Recommendation Screen

Purpose: Let the customer customize a selected yakisoba and showcase the real-time topping recommendation service.

Content:

- Selected yakisoba summary card
- Topping checklist cards
- `실시간 인기 토핑 조합` panel with top 3 combos
- Per-combo metadata:
  - rank
  - topping names
  - selection count
  - one-tap apply action
- Cart preview on the side or below, depending on screen width

Behavior:

- User can toggle toppings individually.
- User can tap a recommendation card to apply the full combination at once.
- Applied recommended combos remain editable; the user can add or remove toppings afterward.
- User adds the configured item to the cart and proceeds to cart review or continues shopping.

### 4. Cart and Checkout Screen

Purpose: Final review before demo payment.

Content:

- Order type badge (`매장 식사` or `포장`)
- Cart line items with per-item toppings and prices
- Explicit `+` and `-` quantity controls
- Dedicated remove action
- Drinks and mains in the same cart list
- Total price area
- Demo `결제하기` button

Behavior:

- User can return to menu selection to add more items.
- On checkout, the app updates combo popularity data based on each yakisoba item's topping set.
- The app transitions to an order-complete screen.
- Quantity is never silently dropped without user action; users can decrement with `-` and remove with a separate delete action.

### 5. Order Complete Screen

Purpose: Close the demo flow and reinforce the recommendation feature.

Content:

- Order complete confirmation
- Order number or demo receipt token
- Summary of what was ordered
- Small notice that popular combinations have been updated
- Restart button for next customer

Behavior:

- Reset cart state for the next order while keeping updated recommendation counts in local persistence.

## Visual Direction

The kiosk should feel like a polished commercial ordering screen for a warm teppan food concept, not a generic dashboard.

### Color System

- Background and card base: `#FFF8F0`
- Primary interactive accents: `#C08552`
- Secondary accents and structural emphasis: `#8C5A3C`
- Text and strongest contrast: `#4B2E2B`

### Visual Style Rules

- Use warm cream backgrounds with wood-and-sauce inspired contrast.
- Keep major actions large and highly tappable.
- Use rounded rectangular cards and high-clarity typography.
- Avoid overly decorative Japanese motifs; keep the style clean, modern, and retail-friendly.
- Make recommendation cards visually distinct from ordinary topping cards so the upsell feature reads as the key differentiator.
- Make menu photography the focal point of the menu screen, with image-first cards and readable text overlays or captions.
- Keep main dishes visually larger than drinks so the information hierarchy matches the business priority.

### Responsive Behavior

- Desktop and kiosk landscape: content area plus persistent right-side cart panel
- Mobile portrait: main content stacks vertically; cart becomes a bottom summary bar with an expandable details panel

## Information Architecture and Components

### Core Components

- `KioskShell`
  - overall page frame, header, step indicator, layout slots
- `OrderTypeSelector`
  - dine-in / takeout choice cards
- `MenuCard`
  - main menu presentation and selection CTA
- `DrinkCard`
  - drink item add control
- `PhotoMenuCard`
  - image-first menu presentation for mains and drinks
- `ToppingSelector`
  - selectable topping chips or cards
- `ComboRecommendationCard`
  - ranked popular combo display and quick-apply button
- `CartPanel`
  - current order summary, totals, and actions
- `OrderCompletePanel`
  - final confirmation state

### State Model

- `orderType`: `dine-in | takeout | null`
- `currentStep`: `start | menu | options | cart | complete`
- `draftMenuItem`: currently edited yakisoba item before it is committed to cart
- `cartItems`: array of ordered items
- `comboStats`: ranked topping combination counts

## Data Model

### Menu Item Shape

- `id`
- `name`
- `category` (`main` or `drink`)
- `price`
- `description`

### Topping Shape

- `id`
- `name`
- `price`

### Cart Item Shape

- `id`
- `type` (`main` or `drink`)
- `name`
- `basePrice`
- `quantity`
- `toppings`
- `lineTotal`

### Combo Stat Shape

- `key`
  - normalized topping identifier list sorted alphabetically
- `toppings`
  - display names in stable order
- `count`

## Recommendation Logic

### Initial Seed Data

The app starts with predefined popular combinations so the recommendation panel is never empty on first load. Initial combos should include:

- 오징어새우 + 계란 프라이 추가
- 치즈 추가 + 비엔나
- 면 추가 + 계란 프라이 추가

### Combination Normalization

- A combination is computed only for yakisoba items with at least one topping.
- Topping IDs are sorted before generating the combo key.
- `오징어새우 + 치즈 추가` and `치즈 추가 + 오징어새우` map to the same key.

### Real-Time Update Rule

- On demo checkout, each yakisoba cart item contributes its topping set once per quantity.
- Updated counts are stored in `localStorage`.
- Recommendation ranking is recalculated immediately after checkout.
- The options screen always reads the latest ranked top combinations from client state.

### Recommendation UX Rules

- Show top 3 combinations.
- Display a count label such as `12명이 선택했어요`.
- Include a one-tap action such as `이 조합 바로 담기`.
- Allow manual editing after applying a recommended combo.

## Demo Persistence Strategy

- Use client-side React state for the active order session.
- Mirror recommendation statistics to `localStorage`.
- Optionally mirror the last used order type and cart draft only if it improves the demo flow, but clear the cart after completed checkout.
- Include a reset path for demos, such as a `처음으로` button from the completion screen.

## Menu Photography Strategy

- Use realistic food and beverage photography for all six menu items.
- Source royalty-free images from the web and store them locally under `public/` for stable demo loading.
- Use wide, appetizing yakisoba images for the two main dishes.
- Use clean commercial beverage shots for cola, cider, draft beer, and highball.
- Apply a subtle dark gradient over bright images only when needed to preserve text readability.
- Maintain a consistent warm color temperature across all selected assets.

## Content Rules

- All customer-facing copy should be Korean.
- Prices should be rendered with comma separators and `원`.
- The typo in the provided requirement for `소금 야끼소바 - 11,0000원` is normalized to `11,000원`.

## Error and Edge Cases

- Prevent checkout when the cart is empty.
- Prevent adding a draft yakisoba item without confirming the topping selection step.
- If no recommended combinations exist beyond seed data, still show seeded combinations rather than an empty state.
- If `localStorage` is unavailable, fall back to in-memory combo statistics for the current session.
- Drinks do not contribute to topping combination statistics.

## Testing Strategy

### Functional Checks

- Start screen correctly routes dine-in and takeout flows
- Main menu items can be selected and customized
- Drinks can be added to the cart
- Menu cards render with the correct image assets
- Recommended combo cards apply the expected topping set
- Users can edit toppings after applying a recommendation
- Cart totals update correctly with toppings and quantity changes
- Cart quantity can be increased, decreased, and explicitly removed
- Checkout resets the order flow and updates combo rankings

### Persistence Checks

- Popular combo counts persist across refresh using `localStorage`
- Cart state resets after checkout
- Ranking order changes after repeated purchases of the same combo

### Responsive Checks

- Desktop layout preserves a readable side cart
- Mobile layout keeps checkout visible and usable without crowding

## Implementation Notes

- Reuse the current Next.js app shell rather than creating a separate app.
- Replace the current lunch recommendation homepage with the kiosk experience for this demo.
- Keep code modular so menu definitions, topping definitions, combo ranking logic, and UI components are separated.
- Prefer a single client-side kiosk entry page backed by small presentational components.

## Open Decisions Resolved

- Ordering model: cart-based
- Service modes: dine-in and takeout
- Recommendation basis: cumulative overall order history
- App type: demo web app
- Recommendation persistence: client-side local persistence
