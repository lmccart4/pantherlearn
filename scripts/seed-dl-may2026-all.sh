#!/bin/bash
set -e
export GOOGLE_APPLICATION_CREDENTIALS="/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json"
cd ~/pantherlearn
SCRIPTS=(
  scripts/seed-diglit-brand-kit-day1.js
  scripts/seed-diglit-brand-kit-day2.js
  scripts/seed-diglit-brand-kit-day3.js
  scripts/seed-diglit-photo-essay-day1.js
  scripts/seed-diglit-photo-essay-day2.js
  scripts/seed-diglit-photo-essay-day3.js
  scripts/seed-diglit-infographic-day1.js
  scripts/seed-diglit-infographic-day2.js
  scripts/seed-diglit-infographic-day3.js
  scripts/seed-diglit-short-form-video-day1.js
  scripts/seed-diglit-short-form-video-day2.js
  scripts/seed-diglit-short-form-video-day3.js
  scripts/seed-diglit-short-form-video-day4.js
  scripts/seed-diglit-psa-day1.js
  scripts/seed-diglit-psa-day2.js
  scripts/seed-diglit-psa-day3.js
  scripts/seed-diglit-psa-day4.js
)
ok=0; fail=0
for s in "${SCRIPTS[@]}"; do
  echo "→ $s"
  if node "$s"; then ok=$((ok+1)); else fail=$((fail+1)); echo "  FAILED"; fi
done
echo ""
echo "Seed complete: $ok ok, $fail failed"
exit $fail
