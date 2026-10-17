import { ChangelogEntry } from "@/app/types";

export const changelogData: ChangelogEntry[] = [
  {
    version: "Roadmap",
    date: null,
    status: "Planned",
    color: "yellow",
    changes: [
      "Training Mode (Unlimited play without daily restriction)",
      "Difficulty Levels (Easy/Hard)",
      "Statistics & Streak tracking improvements"
    ]
  },
  {
    version: "v0.4.0",
    date: "2026-10-17",
    status: "Current",
    color: "green",
    changes: [
      "Updated the country API to its new version",
      "Added local country data to avoid unnecessary API requests",
      "Fixed an issue where no country could be submitted",
      "Fixed the daily country falling back to Poland when hints failed",
      "Fixed country coordinates after the API update"
    ]
  },
  {
    version: "v0.3.0",
    date: "2026-03-06",
    status: null,
    color: "green",
    changes: [
      "Improved hint variety and randomization",
      "Prevent reusing countries from the last 60 days",
      "Better text truncation for hints",
      "Added Changelog Modal",
      "Minor fixes and improvements"
    ]
  },
  {
    version: "v0.2.0",
    date: "2026-03-01",
    status: null,
    color: "blue",
    changes: [
      "Stats modal with guess distribution",
      "Added calendar date picker",
      "Improved map colors and visuals"
    ]
  },
  {
    version: "v0.1.5",
    date: "2026-02-21",
    status: null,
    "color": "gray",
    "changes": [
      "Fixed critical crash on missing coordinates",
      "Networking fixes and optimizations",
      "Optimized MongoDB storage",
      "URL handling improvements"
    ]
  },
  {
    version: "v0.1.0",
    date: "2026-02-18",
    status: null,
    color: "purple",
    changes: [
        "Release",
        "Keyboard navigation (arrows for guess suggestions)",
        "Last hint is now visible near input",
        "Fixed cursor pointer issues",
        "Added tab completion for guesses",
        "UI/UX improvements with new icons"
    ]
  }
];
