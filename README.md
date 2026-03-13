# Green Clean (2016) Inc. Website

A professional, fully responsive, high-converting website for Green Clean (2016) Inc., a family-owned property maintenance company in the Lower Mainland of British Columbia.

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js with Express.js
- **Email Service:** Nodemailer (via Gmail SMTP)
- **Security:** Helmet.js, Express Rate Limit, CORS

## Project Structure
\`\`\`
/
├── public/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Custom CSS styling
│   └── script.js        # Frontend logic and form submission
├── server.ts            # Express server and API routes
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md            # Project documentation
\`\`\`

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Create a \`.env\` file in the root directory and add the following:
   \`\`\`env
   EMAIL_USER=greenclean.new@gmail.com
   EMAIL_PASS=your_gmail_app_password
   PORT=3000
   \`\`\`

3. **How to get a Gmail App Password**
   To use Nodemailer with Gmail, you need an App Password (regular password won't work):
   - Go to your Google Account settings.
   - Navigate to "Security".
   - Under "Signing in to Google", select "2-Step Verification" (must be turned on).
   - Scroll down to "App passwords".
   - Select "Mail" for the app and "Other" for the device (name it "Website Form").
   - Click "Generate".
   - Copy the 16-character password and paste it as your \`EMAIL_PASS\` in the \`.env\` file.

4. **Run the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   The website will be available at \`http://localhost:3000\`.

## Deployment Guide (Free Hosting)

### Deploying to Render
1. Push your code to a GitHub repository.
2. Go to [Render.com](https://render.com) and sign in.
3. Click "New" and select "Web Service".
4. Connect your GitHub repository.
5. Configure the service:
   - **Name:** greenclean-website
   - **Environment:** Node
   - **Build Command:** \`npm install\`
   - **Start Command:** \`node server.js\` (or \`tsx server.ts\`)
6. Add Environment Variables under "Advanced":
   - \`EMAIL_USER\` = greenclean.new@gmail.com
   - \`EMAIL_PASS\` = your_gmail_app_password
7. Click "Create Web Service".

### Deploying to Railway
1. Push your code to a GitHub repository.
2. Go to [Railway.app](https://railway.app) and sign in.
3. Click "New Project" -> "Deploy from GitHub repo".
4. Select your repository.
5. Click "Add Variables" and add your \`EMAIL_USER\` and \`EMAIL_PASS\`.
6. Railway will automatically detect Node.js and deploy your app.

### Connecting a Custom Domain
1. In Render or Railway, go to your project's "Settings".
2. Find the "Custom Domains" section.
3. Add your domain (e.g., \`greenclean2016.ca\`).
4. Log in to your domain registrar (GoDaddy, Namecheap, etc.).
5. Go to DNS Management.
6. Add a CNAME record pointing \`www\` to your Render/Railway URL.
7. Add an ALIAS or A record for the root domain (\`@\`) pointing to the provided IP or URL.
8. Wait for DNS propagation (can take up to 24 hours).
