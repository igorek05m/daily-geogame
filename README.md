# 🌍 Daily GeoGame

A simple, daily geography guessing game inspired by Wordle, Travle and Globle.

**Live demo:** [https://daily-geogame.vercel.app](https://daily-geogame.vercel.app)

## How it works

- **Daily Mode:** Every day at midnight (UTC), a new country is selected.
- **Hints:** You get 6 hints (Climate, Terrain, GDP, etc.) pulled from the CIA World Factbook.
- **Map:** Interactive SVG map (zoom/pan) that highlights your guesses and neighbors.
- **No Login:** Stats are saved locally and synced anonymously via a session ID.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **MongoDB** (Atlas)
- **pnpm**

## Run it on your own

1. Clone the repo:
   ```bash
   git clone [https://github.com/igorek05m/geo.git](https://github.com/igorek05m/geo.git)
   cd geo
   ```

2. Install dependencies
    ```bash
    pnpm install
    ```

3. Setup Environment:
    Create a .env.local file in the root and add your MongoDB string:

    ```MONGODB_URI=mongodb+srv://...```

4. Run dev server
    ``` bash
    pnpm dev
    ```


## Credits 

- **Data**: [RestCountries](https://restcountries.com) & [CIA World Factbook](https://github.com/factbook/factbook.json)
- **Map**: [SimpleMaps](https://simplemaps.com)

## License
    MIT. Feel free to use this code for learning or your own projects