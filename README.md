# Bulletin Board Studio

A free website that helps teachers plan a classroom bulletin board and print every piece.

Teachers can start from **41 ready-made boards** or type their own:

- **Subjects:** English, Arabic, Islamic Education, Mathematics, Science, Biology, Chemistry, Physics, Individuals & Societies, Language Acquisition, Design, PHE, Visual Arts, Music, Drama and The Arts.
- **UAE:** Social Studies, Moral Education, Moral Social & Cultural Studies and UAE Elements.
- **IB & DP core:** CAS, TOK and Service as Action.
- **Wellbeing & pastoral:** Wellbeing, Inclusion, Counselling, and Trips & Residentials.
- **Events & weeks:** Pink Day, Jeans for Genes, Maths, Science, Arabic, English, Languages, Arts, Sports, Design and I&S weeks, International Day and UAE National Day.
- **House system:** Meadows Mavericks house points (Camels, Dhows, Falcons, Khanjars) with the four point levels.

All ready-made boards are in `library.js`. To add a board, copy one block in that file and change the text.

There are two kinds of board:

- **Topic board.** A subject, unit or theme, with facts, key words, lift-the-flaps, challenges and celebration pieces.
- **Year group board.** Year title, class timetable spaces, a wellbeing check-in, notices, student leaders with photos, and house points tiles in each house's own colour.

Teachers go through five steps:

1. **Topic** – choose the type of board, then type a title and idea, or fill in the year group details.
2. **Colours** – choose black, green or beige backing paper and a colour for the pieces.
3. **Layout** – pick one of three layouts and drag pieces into place.
4. **Pictures & extras** – search free pictures, paste pictures from Google, upload photos, add icons and IB cards (learner profile, ATL skills, global contexts, key concepts, PYP themes, DP core).
5. **Check & print** – edit any wording and download one PDF with the title letters and every piece on its own A4 page.

Boards save themselves in the teacher's browser. **Save board file** downloads a copy that a colleague can open with **Open board**.

---

## Part 1 – Put the website online with GitHub Pages (about 10 minutes)

You only need a free GitHub account. No coding.

1. **Create an account.** Go to <https://github.com> and sign up.
2. **Create a repository** (a folder for your website).
   - Click the **+** at the top right → **New repository**.
   - Name it, for example `bulletin-board-studio`.
   - Choose **Public**.
   - Click **Create repository**.
3. **Upload the files.**
   - On the new repository page, click **uploading an existing file**. You can also use **Add file → Upload files**.
   - Unzip the download from Claude first.
   - Drag in **everything inside** the `bulletin-board-studio` folder: `index.html`, `styles.css`, `app.js`, `config.js`, `library.js`, `README.md` and the `ai-writer` folder.
   - The files must sit at the top level of the repository, not inside another folder.
   - Click **Commit changes**.
4. **Switch on GitHub Pages.**
   - Go to **Settings** (top of the repository) → **Pages** (left menu).
   - Under **Build and deployment**, set **Source** to **Deploy from a branch**.
   - Set **Branch** to **main** and the folder to **/ (root)**, then click **Save**.
5. **Wait 1–2 minutes and refresh the Pages screen.** It shows your website address, for example `https://yourname.github.io/bulletin-board-studio/`.
6. **Share that address with your teachers.** They need nothing else.

### Changing the website later
- Open a file on GitHub, click the **pencil** icon, make your change and click **Commit changes**.
- The website updates within a minute or two.

---

## Part 2 (optional) – Let the website write board content with AI

Without this part, the **Fill the board with starter text** button gives simple starter text from the teacher's idea. Teachers then edit it in step 5.

With this part, the button becomes **Write my board content**. It writes facts, key words, questions, challenges and prompts for any topic.

### Why there is an extra step
- AI needs a secret key, which is paid per use.
- If you put a secret key in GitHub, anyone could copy it.
- So a tiny free "middle-man" service on Cloudflare holds the key and passes requests along.
- Each board costs a fraction of a cent.

### Steps
1. **Get an API key.** Go to <https://console.anthropic.com>, sign up, add a small credit amount, and create an API key under **API Keys**. Copy it.
2. **Create a free Cloudflare account** at <https://dash.cloudflare.com/sign-up>.
3. **Create the Worker.**
   - In Cloudflare, go to **Workers & Pages** → **Create** → **Create Worker**.
   - Name it, for example `board-writer`, and click **Deploy**.
   - Click **Edit code**.
   - Delete the sample code, paste in everything from `ai-writer/worker.js`, and click **Deploy**.
4. **Add the settings.** In the Worker, go to **Settings → Variables and Secrets** and add:
   - `ANTHROPIC_API_KEY`: choose type **Secret** and paste your key.
   - `ALLOWED_ORIGIN`: type **Text**. Enter your site address without the folder, for example `https://yourname.github.io`.
     This stops other websites from using your key.
5. **Copy the Worker address.** It looks like `https://board-writer.yourname.workers.dev`.
6. **Connect the website.**
   - On GitHub, open `config.js` and click the pencil.
   - Paste the Worker address between the quotes:
     ```js
     window.BOARD_CONFIG = {
       aiEndpoint: "https://board-writer.yourname.workers.dev"
     };
     ```
   - Click **Commit changes**.
   - After a minute, the button on your site reads **Write my board content**.

**Spending limit:** in the Anthropic console, set a monthly spend limit under **Billing** so costs can never surprise you.

---

## Year group boards and timetables

- Choose **Year group board** in step 1 and type the year, for example "Year 8".
- Press **Add timetables from the school PDF** and choose the year-wise timetable PDF.
- The site finds that year's classes (for example 8A to 8E) and puts each timetable on the board.

## About the pictures

- **Search** uses two free libraries:
  - **Openverse** (from WordPress), with adult content filtered out.
  - **Wikimedia Commons**.
- Every picture from search keeps its credit (title, creator and licence). The credit prints under the picture and on its PDF page.
- **Google Images:** the site opens Google with the teacher's search. With **Only show pictures that are free to reuse** ticked, Google filters by licence. The teacher copies a picture and presses Ctrl+V (⌘+V on a Mac) on the site.
- **Upload your own pictures:** use the big upload box at the top of the Pictures tab, the **Add pictures** button under the board, drag files onto the page, or paste a copied picture. Several pictures can be added at once, and each one gets a caption, a size and a Remove button.
- Pictures always stay on the teacher's own computer. Nothing is uploaded to any server.
- A few websites block their pictures from being printed by other sites. If that happens, the site says so and gives a link to save the picture and upload it instead.
- Teachers should check every picture before printing, as search results come from open libraries.

## Printing tips
- Print at **100% / actual size** on A4 white card.
- Title letters print white with a grey cutting line.
- Lift-the-flap pieces have two pages. Glue the flap's top strip onto the base.

## Files
| File | What it does |
|---|---|
| `index.html` | The page teachers see |
| `styles.css` | Colours, fonts and layout of the website |
| `app.js` | Everything the website does |
| `config.js` | Your settings (the AI writer address) |
| `library.js` | The ready-made boards |
| `ai-writer/worker.js` | Optional AI writer for Cloudflare (Part 2) |
