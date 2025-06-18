// Fixed test script to verify NewsAPI integration with proper URL handling

async function testNewsAPIEndpoint() {
  console.log("🧪 Testing NewsAPI endpoint for real articles...\n")

  // Get the base URL for the current environment
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  console.log(`🌐 Base URL: ${baseUrl}`)

  const testQueries = [
    "supply chain disruption",
    "shipping delays",
    "port congestion",
    "manufacturing shortage",
    "logistics crisis",
  ]

  for (const query of testQueries) {
    console.log(`\n📰 Testing query: "${query}"`)
    console.log("=".repeat(50))

    try {
      const url = `${baseUrl}/api/newsapi-supply-chain?q=${encodeURIComponent(query)}`
      console.log(`🔗 Calling: ${url}`)

      const response = await fetch(url)

      if (!response.ok) {
        console.error(`❌ HTTP ${response.status}: ${response.statusText}`)
        const errorText = await response.text()
        console.error("Error details:", errorText)
        continue
      }

      const data = await response.json()

      console.log(`✅ Status: Success`)
      console.log(`📊 Total Results: ${data.totalResults}`)
      console.log(`📄 Articles Returned: ${data.articles?.length || 0}`)
      console.log(`🔍 Query: ${data.query}`)
      console.log(`📡 Source: ${data.source}`)

      if (data.articles && data.articles.length > 0) {
        console.log("\n📋 Sample Articles:")

        // Show first 3 articles as examples
        data.articles.slice(0, 3).forEach((article, index) => {
          console.log(`\n${index + 1}. ${article.title}`)
          console.log(`   📰 Source: ${article.source}`)
          console.log(`   📅 Published: ${new Date(article.publishedAt).toLocaleDateString()}`)
          console.log(`   🎯 Relevance: ${(article.relevanceScore * 100).toFixed(1)}%`)
          console.log(`   📝 Description: ${article.description?.substring(0, 100)}...`)
          console.log(`   🔗 URL: ${article.url}`)
        })

        // Analyze article sources and dates
        const sources = [...new Set(data.articles.map((a) => a.source))]
        const dates = data.articles.map((a) => new Date(a.publishedAt))
        const oldestDate = new Date(Math.min(...dates))
        const newestDate = new Date(Math.max(...dates))

        console.log(`\n📊 Analysis:`)
        console.log(`   🏢 Unique Sources: ${sources.length}`)
        console.log(`   📰 Sources: ${sources.slice(0, 5).join(", ")}${sources.length > 5 ? "..." : ""}`)
        console.log(`   📅 Date Range: ${oldestDate.toLocaleDateString()} to ${newestDate.toLocaleDateString()}`)

        // Check if articles are recent (within last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const recentArticles = data.articles.filter((a) => new Date(a.publishedAt) > thirtyDaysAgo)
        console.log(`   ⏰ Recent Articles (last 30 days): ${recentArticles.length}/${data.articles.length}`)

        // Verify these are real articles (not placeholder/mock data)
        const realIndicators = {
          hasVariedSources: sources.length > 1,
          hasRecentDates: recentArticles.length > 0,
          hasRealURLs: data.articles.some((a) => a.url && a.url.startsWith("http")),
          hasVariedTitles: new Set(data.articles.map((a) => a.title)).size === data.articles.length,
          hasDescriptions: data.articles.every((a) => a.description && a.description.length > 50),
        }

        console.log(`\n✅ Real News Verification:`)
        Object.entries(realIndicators).forEach(([check, passed]) => {
          console.log(`   ${passed ? "✅" : "❌"} ${check}: ${passed}`)
        })

        const allChecksPassed = Object.values(realIndicators).every(Boolean)
        console.log(
          `\n🎯 Overall Assessment: ${allChecksPassed ? "✅ REAL NEWS CONFIRMED" : "⚠️  POTENTIAL ISSUES DETECTED"}`,
        )
      } else {
        console.log("❌ No articles returned")

        // Check if it's an API key issue
        if (data.error && data.error.includes("key")) {
          console.log("💡 This might be an API key configuration issue")
        }
      }
    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error.message)

      // Provide more specific error guidance
      if (error.message.includes("fetch")) {
        console.log("💡 This might be a network connectivity issue")
      } else if (error.message.includes("parse")) {
        console.log("💡 This might be a URL or response parsing issue")
      }
    }
  }

  // Test API key configuration with proper URL
  console.log("\n🔑 API Configuration Test:")
  console.log("=".repeat(50))

  try {
    const configUrl = `${baseUrl}/api/newsapi-supply-chain?q=test`
    console.log(`🔗 Testing config at: ${configUrl}`)

    const configResponse = await fetch(configUrl)

    if (configResponse.status === 500) {
      const errorData = await configResponse.json()
      if (errorData.error?.includes("key not configured")) {
        console.log("❌ NewsAPI key is not configured in environment variables")
        console.log("💡 Make sure NEWS_API_KEY is set in your environment")
        console.log("🔧 You can get a free API key from: https://newsapi.org/")
      } else {
        console.log("❌ Server error:", errorData.error)
      }
    } else if (configResponse.status === 401) {
      console.log("❌ NewsAPI key is invalid or expired")
      console.log("💡 Check your NEWS_API_KEY in environment variables")
    } else if (configResponse.ok) {
      console.log("✅ NewsAPI key appears to be configured and working")
      const testData = await configResponse.json()
      console.log(`📊 Test query returned ${testData.articles?.length || 0} articles`)
    } else {
      console.log(`❌ Unexpected response: ${configResponse.status} ${configResponse.statusText}`)
    }
  } catch (error) {
    console.log("❌ Could not test API configuration:", error.message)
    console.log("💡 Make sure the development server is running")
  }

  console.log("\n🏁 NewsAPI Testing Complete!")
  console.log("\n📋 Next Steps:")
  console.log("1. If you see API key errors, configure NEWS_API_KEY environment variable")
  console.log("2. If you see network errors, ensure the development server is running")
  console.log("3. If articles are returned, check the 'Real News Verification' results")
  console.log("4. Look for varied sources and recent dates to confirm real news")
}

// Also test the existing contextual insights endpoint
async function testContextualInsights() {
  console.log("\n\n🔍 Testing Contextual Insights Integration:")
  console.log("=".repeat(60))

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  try {
    const url = `${baseUrl}/api/contextual-insights`
    console.log(`🔗 Calling: ${url}`)

    const response = await fetch(url)

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}: ${response.statusText}`)
      return
    }

    const data = await response.json()

    console.log(`✅ Contextual Insights Status: Success`)
    console.log(`📊 Total Insights: ${data.insights?.length || 0}`)
    console.log(`📰 News Sources Used: ${data.newsSourcesUsed || 0}`)
    console.log(`🔄 Real News Status: ${data.realNewsStatus || "Unknown"}`)

    if (data.insights && data.insights.length > 0) {
      console.log("\n📋 Sample Insights:")
      data.insights.slice(0, 2).forEach((insight, index) => {
        console.log(`\n${index + 1}. ${insight.title}`)
        console.log(`   📰 Source: ${insight.source}`)
        console.log(`   📅 Date: ${insight.date}`)
        console.log(`   🎯 Relevance: ${insight.relevance}%`)
        console.log(`   📝 Summary: ${insight.summary?.substring(0, 100)}...`)
      })
    }
  } catch (error) {
    console.error("❌ Error testing contextual insights:", error.message)
  }
}

// Run both tests
async function runAllTests() {
  await testNewsAPIEndpoint()
  await testContextualInsights()
}

// Execute the tests
runAllTests().catch(console.error)
