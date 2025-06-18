// Quick server status check
async function checkServerStatus() {
  console.log("🔍 Checking development server status...")

  const endpoints = [
    "/api/contextual-insights",
    "/api/newsapi-supply-chain",
    "/api/thenewsapi-supply-chain",
    "/api/digital-twin",
  ]

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint}...`)
      const response = await fetch(`http://localhost:3000${endpoint}`)

      if (response.ok) {
        console.log(`✅ ${endpoint}: Working (${response.status})`)
      } else {
        console.log(`⚠️  ${endpoint}: ${response.status} ${response.statusText}`)

        if (response.status === 500) {
          const errorData = await response.json().catch(() => ({}))
          if (errorData.error) {
            console.log(`   Error: ${errorData.error}`)
          }
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`)

      if (error.message.includes("fetch failed")) {
        console.log(`   💡 Server may not be running on localhost:3000`)
      }
    }
  }

  console.log("\n🔧 Troubleshooting Steps:")
  console.log("1. Make sure your development server is running:")
  console.log("   npm run dev")
  console.log("2. Check that it's running on http://localhost:3000")
  console.log("3. Verify your .env.local file has the API keys:")
  console.log("   NEWS_API_KEY=your_newsapi_key")
  console.log("   THENEWSAPI_KEY=your_thenewsapi_key")
  console.log("4. Restart the server after adding environment variables")
}

checkServerStatus().catch(console.error)
