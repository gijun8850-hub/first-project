# Weekly Body-Composition Coach Homepage Design

## Summary

This project turns the current app into a small workout-focused homepage that a user opens once per week after a body-composition check-in. The homepage is not a generic fitness dashboard. Its core job is to read weekly body-composition numbers and translate them into a short, actionable coaching summary for the coming week.

The homepage should feel like a personal lifting coach that is calm, direct, and useful. The product value is not "store more numbers." The value is "turn one weekly check-in into a clear next move."

## Product Goal

The first version should help a user:

- enter a weekly body-composition check-in with very low friction
- understand whether the last week was moving in the right direction
- get a simple recommendation for the coming week
- review recent trends without digging through detailed logs

The first version should optimize for clarity and repeat use, not depth.

## Target User

The target user is someone doing weight training who checks body composition roughly once per week, typically through a gym device or similar measurement process. The user cares about body weight, skeletal muscle mass, and body-fat percentage, and wants help deciding what to do next without maintaining a complicated training log.

## Core Product Decision

The homepage follows a coach-first model.

Instead of leading with charts or raw tables, the first screen leads with a weekly coaching card. That card gives a short interpretation of the latest numbers and translates it into 2-3 specific actions for the coming week.

This ordering is intentional:

1. interpretation first
2. supporting numbers second
3. historical context third

If the product leads with data first, it becomes a tracker. If it leads with interpretation first, it becomes a tool the user has a reason to revisit.

## In Scope for V1

- homepage with weekly coaching summary
- weekly check-in form
- history view for past check-ins
- recommendation rules based on recent body-composition changes
- lightweight validation and empty-state handling

## Out of Scope for V1

- detailed workout logging
- meal logging
- body photo comparison
- wearable integration
- auto-import from external fitness apps
- advanced AI coaching that uses free-form natural-language reasoning

These can be future extensions, but they should not shape the first version.

## User Flow

### Primary flow

1. User opens the app.
2. User taps `Add Check-in`.
3. User enters weight, skeletal muscle mass, and body-fat percentage.
4. User optionally adds a one-line note about the week.
5. User saves the check-in.
6. Homepage updates immediately with:
   - this week's coaching summary
   - refreshed key metrics
   - updated recent-trend view
   - this week's action checklist

### Repeat-use loop

1. User measures body composition once per week.
2. User enters the new check-in.
3. User reads the generated weekly summary.
4. User uses the action checklist as a simple training-direction reminder for the week.
5. User comes back the next week for the next check-in.

## Homepage Structure

The homepage should have five sections, in this order.

### 1. Weekly Coach Card

This is the hero section and the main reason to open the site.

The card should include:

- one short summary sentence describing the current state
- one short follow-up sentence describing what to do this week
- 2-3 action chips or checklist items

Example tone:

`Body fat is down and muscle is holding. Keep your current split and add two short conditioning sessions this week.`

The tone should be direct and stable, not hype-driven and not medical.

### 2. Key Metrics

Immediately below the coach card, show the three core metrics:

- weight
- skeletal muscle mass
- body-fat percentage

Each metric should show the latest value and a simple delta versus the prior check-in when available.

### 3. Recent Trend View

Show a compact 4-week trend for the same three metrics. The goal is not deep analysis. The goal is to let the user verify that the coaching summary matches the recent direction of the numbers.

The trend view should stay compact enough that the page still feels like a homepage, not a reporting tool.

### 4. This Week's Action List

Show a short list of the user's recommended focus points for the week. These should be phrased as simple, concrete actions. For example:

- keep current split
- add two short cardio blocks
- protect protein intake on rest days

The list should stay short. More than three items will weaken the page.

### 5. Recent Check-ins

Show recent measurements in reverse chronological order. This is mostly for trust and quick reference, not for analysis.

## Check-in Input Design

The input flow should be intentionally light.

### Required fields

- weight
- skeletal muscle mass
- body-fat percentage

### Optional field

- one-line note

The note can capture context such as poor sleep, missed cardio, higher eating out frequency, or unusually hard training weeks. The note is useful for the user later, but it should not drive recommendation logic in V1.

### Interaction requirements

- check-in entry should be fast enough to complete in under 30 seconds
- the save action should immediately return the user to the homepage
- the refreshed weekly coach summary should feel like the immediate payoff of entering the numbers

## Recommendation Logic

The first version should use explicit, understandable rules. It should not pretend to be more intelligent than it is.

The recommendation engine should look at:

- latest check-in
- previous check-in
- recent trend over roughly 3-4 entries when available

The rules should generate one status interpretation and one short action recommendation.

### Representative rule cases

#### Case A: Body fat down, skeletal muscle stable

Interpretation:

- progress is moving in the intended direction
- current strategy is broadly working

Suggested action pattern:

- maintain the main lifting split
- optionally add a small amount of conditioning
- avoid major routine changes

#### Case B: Body fat down, skeletal muscle down

Interpretation:

- weight loss is happening, but recovery or intake may be too aggressive

Suggested action pattern:

- reduce the push for extra deficit
- protect recovery and protein intake
- avoid adding more cardio immediately

#### Case C: Body fat flat, weight flat

Interpretation:

- current approach is producing little movement

Suggested action pattern:

- keep training stable
- make a small adjustment to activity or eating consistency
- re-check next week before making large changes

#### Case D: Body fat up, skeletal muscle flat or down

Interpretation:

- current week likely moved away from the intended goal

Suggested action pattern:

- tighten routine consistency
- add modest conditioning
- call out likely lifestyle drift without sounding judgmental

#### Case E: First entry only

Interpretation:

- there is no reliable comparison yet

Suggested action pattern:

- save the baseline
- wait for the next check-in before giving directional coaching

## Page Map

### Home

Purpose:

- show the weekly interpretation and what to do next

Content:

- weekly coach card
- key metrics
- 4-week trend
- action list
- recent check-ins

### Add Check-in

Purpose:

- collect the weekly body-composition data with low friction

Content:

- required numeric inputs
- optional note
- save action

### History

Purpose:

- review prior check-ins without crowding the homepage

Content:

- chronological list of past check-ins
- simple per-entry comparison to the prior week

## Data Model Direction

At the design level, each check-in record should contain:

- date
- weight
- skeletal muscle mass
- body-fat percentage
- optional note

Derived homepage content such as deltas, trend lines, and coaching messages should be computed from this stored data rather than entered separately.

## Empty States and Error Handling

### No check-ins yet

The homepage should encourage the first weekly entry rather than showing blank graphs.

Suggested message:

`Add your first weekly check-in to start getting coaching summaries.`

### Only one check-in exists

The app should show the latest numbers but avoid overconfident interpretation.

Suggested message:

`Baseline saved. Add next week's check-in to unlock trend-based coaching.`

### Missing required value

Saving should be blocked and the missing field should be clearly identified.

### Suspicious numeric input

If the value is far outside expected human ranges, the UI should ask the user to confirm or correct it before saving.

### Long gap between check-ins

If the user has not checked in for multiple weeks, the homepage should show a soft reminder and avoid pretending that the newest entry is part of a tight weekly trend.

## Tone and UX Principles

- calm, direct, coach-like language
- short sentences
- no guilt-driven messaging
- no fake precision
- no overly complex dashboards in V1

The product should make the user feel oriented, not judged.

## Success Criteria

The first version is successful if a user can:

- enter a weekly check-in in under 30 seconds
- understand the main takeaway from the homepage in under 10 seconds
- see a believable connection between the numbers and the recommendation
- return the next week with a clear expectation of what the app is for

## Testing Focus

The implementation plan should verify at least the following:

- first check-in saves correctly and produces a baseline state
- second and later check-ins produce correct deltas
- representative recommendation-rule cases map to the right summary text
- invalid or missing numeric inputs are handled correctly
- homepage sections update from the same underlying check-in data consistently

## Future Expansion

If the first version proves sticky, the most natural next expansions are:

- connect body-composition changes to workout logs
- add body-photo comparison
- add habit markers such as cardio completion or protein consistency
- personalize recommendation rules based on user goal mode such as cut, maintain, or lean bulk

V1 should leave room for these, but it should not depend on them.
