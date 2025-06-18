// Simple browser-based test that doesn't require server endpoints
// This will test NewsAPI directly from the browser

async function testNewsAPIDirectly() {
  console.log("🧪 Testing NewsAPI directly (browser-based test)")
  console.log("=".repeat(60))

  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    console.log("❌ This test needs to run in a browser environment")
    console.log("💡 Please copy and paste this code into your browser's developer console")
    return
  }

  // Test 1: Check if the server is running
  console.log("\n🔍 Step 1: Testing server connectivity...")
  try {
    const healthCheck = await fetch("/api/contextual-insights")
    console.log(`✅ Server is responding: ${healthCheck.status}`)

    if (healthCheck.ok) {
      const data = await healthCheck.json()
      console.log(`📊 Contextual insights returned: ${data.newsArticles?.length || 0} articles`)
      console.log(`🔄 News status: ${data.metadata?.realNewsStatus || "Unknown"}`)
    }
  } catch (error) {
    console.log("❌ Server connectivity test failed:", error.message)
    console.log("💡 Make sure your development server is running with 'npm run dev'")
    return
  }

  // Test 2: Check environment variables (client-side check)
  console.log("\n🔍 Step 2: Checking environment setup...")
  try {
    const envCheck = await fetch("/api/newsapi-supply-chain?q=test")

    if (envCheck.status === 500) {
      const errorData = await envCheck.json()
      if (errorData.error?.includes("key not configured")) {
        console.log("❌ NEWS_API_KEY is not configured")
        console.log("🔧 To fix this:")
        console.log("   1. Get a free API key from https://newsapi.org/")
        console.log("   2. Add NEWS_API_KEY=your_key_here to your .env.local file")
        console.log("   3. Restart your development server")
        return
      }
    } else if (envCheck.ok) {
      console.log("✅ NewsAPI endpoint is working")
      const testData = await envCheck.json()
      console.log(`📊 Test returned ${testData.articles?.length || 0} articles`)
    }
  } catch (error) {
    console.log("❌ Environment check failed:", error.message)
  }

  // Test 3: Test the contextual insights with real scenario
  console.log("\n🔍 Step 3: Testing contextual insights with scenario...")
  try {
    const scenarioContext = {
      scenarioName: "Spain closes all its major trade routes",
      impactSummary: {
        revenueChangePercent: -14.0,
        marginChangePercentPoints: -0.2,
        costChangePercent: 30.0,
      },
    }

    const contextualUrl = `/api/contextual-insights?activeTab=logistics&simulationContext=${encodeURIComponent(JSON.stringify(scenarioContext))}`
    const contextualResponse = await fetch(contextualUrl)

    if (contextualResponse.ok) {
      const contextualData = await contextualResponse.json()
      console.log("✅ Contextual insights with scenario:")
      console.log(`   📊 Total insights: ${contextualData.insights?.length || 0}`)
      console.log(`   📰 News articles: ${contextualData.newsArticles?.length || 0}`)
      console.log(`   🔄 Real news status: ${contextualData.metadata?.realNewsStatus || "Unknown"}`)
      console.log(`   📡 News sources used: ${contextualData.metadata?.newsSourcesUsed || 0}`)

      if (contextualData.newsArticles && contextualData.newsArticles.length > 0) {
        console.log("\n📋 Sample news articles:")
        contextualData.newsArticles.slice(0, 3).forEach((article, index) => {
          console.log(`\n${index + 1}. ${article.title}`)
          console.log(`   📰 Source: ${article.source}`)
          console.log(`   📅 Published: ${article.publishedAt}`)
          console.log(`   🎯 Relevance: ${(article.relevanceScore * 100).toFixed(1)}%`)
        })

        // Analyze if these are real articles
        const sources = [...new Set(contextualData.newsArticles.map((a) => a.source))]
        const hasVariedSources = sources.length > 1
        const hasRecentDates = contextualData.newsArticles.some((a) => {
          const articleDate = new Date(a.publishedAt)
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return articleDate > thirtyDaysAgo
        })

        console.log(`\n🔍 News Analysis:`)
        console.log(`   🏢 Unique sources: ${sources.length}`)
        console.log(`   📰 Sources: ${sources.join(", ")}`)
        console.log(`   ✅ Varied sources: ${hasVariedSources}`)
        console.log(`   ✅ Recent articles: ${hasRecentDates}`)

        if (contextualData.metadata?.realNewsStatus === "SUCCESS") {
          console.log(`\n🎉 SUCCESS: Real news is being fetched and integrated!`)
        } else {
          console.log(`\n⚠️  Using fallback news - real news APIs may not be working`)
        }
      }
    }
  } catch (error) {
    console.log("❌ Contextual insights test failed:", error.message)
  }

  console.log("\n🏁 Testing Complete!")
  console.log("\n📋 Summary:")
  console.log("- If you see 'Server connectivity' errors: Start your dev server with 'npm run dev'")
  console.log("- If you see 'API key not configured': Add NEWS_API_KEY to your .env.local file")
  console.log("- If you see 'SUCCESS: Real news is being fetched': Everything is working!")
  console.log("- If you see 'Using fallback news': API keys may need configuration")
}

// Auto-run the test
testNewsAPIDirectly().catch(console.error)
