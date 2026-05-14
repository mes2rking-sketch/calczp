---
name: salary-calculator-project
description: Russian salary payment calculator - single-page web app with multiple payment schedules and theme toggle
metadata: 
  type: project
---

## Project: Калькулятор выплат зарплаты (Salary Payment Calculator)

A comprehensive single-page web application for calculating salary payments in Russian, built with vanilla HTML/CSS/JavaScript.

### Core Functionality

**Work Schedules Supported:**
- 5/2 (5-day work week, weekends Sat-Sun)
- 6/1 (6-day work week, weekend Sun)
- 2/2 (2 days work, 2 days off rotation)
- 3/3 (3 days work, 3 days off rotation)

**Key Features:**
1. **Multiple Payment Schedules** - Configure up to 10 different payment dates per month with custom period ranges
2. **Automatic Period Assignment** - Payments on/before 15th are for previous month; after 15th for current month
3. **Bonus/Premium Support** - Add up to 10 bonuses as percentage of base salary
4. **Work Start Date Tracking** - Prorates salary if employee started mid-month
5. **Dark/Light Theme Toggle** - Theme preference saved to localStorage
6. **Russian Production Calendar** - Includes official RF holidays for 2024-2026
7. **Cumulative & Annual Projections** - Shows total paid since employment start and projected annual income

### Calculations

**Key Metrics Shown:**
- Working days in month (accounting for holidays and schedule type)
- Daily rate (salary ÷ working days)
- Actual payment amount for the period
- Cumulative payments from start date to today
- Annual income projection

**Special Handling:**
- Shift-based schedules (2/2, 3/3) use work start date to determine day position in cycle
- Prorates days when employee work period starts after month start
- Validates that payment dates fall within valid month days
- Handles year transitions (e.g., Jan 5th payment calculates for Dec of previous year)

### File Structure

- **index.html** - Single-file application (55KB) - contains all HTML, CSS, and JavaScript
- **calc.html** - Duplicate of index.html

### Technical Notes

**Theme System:**
- CSS custom properties with `[data-theme="dark"]` selector
- Light theme emoji: 🌙 (Moon) | Dark theme emoji: ☀️ (Sun)
- Persisted via localStorage under key 'theme'

**Holiday Data:**
```javascript
holidays = {
  2024: 14 official holidays
  2025: 14 official holidays  
  2026: 13 official holidays (no Jan 6-8 extended weekend)
}
```

**Currency:** Russian Rubles (₽) with locale-aware formatting

### User Workflow

1. Select work schedule type
2. Set work start date
3. Configure payment dates and periods (defaults: 5th and 20th)
4. Optionally add bonuses
5. Select month/year to calculate
6. Click "Рассчитать" (Calculate)
7. View detailed payment breakdown
