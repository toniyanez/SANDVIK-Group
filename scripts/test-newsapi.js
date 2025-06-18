// Test script to verify NewsAPI integration is working with real articles

async function testNewsAPIEndpoint() {
  console.log("🧪 Testing NewsAPI endpoint for real articles...\n")

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
      const response = await fetch(`/api/newsapi-supply-chain?q=${encodeURIComponent(query)}`)

      if (!response.ok) {
        console.error(`❌ HTTP ${response.status}: ${response.statusText}`)
        const errorData = await response.json()
        console.error("Error details:", errorData)
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
      }
    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error.message)
    }
  }

  // Test API key configuration
  console.log("\n🔑 API Configuration Test:")
  console.log("=".repeat(50))

  try {
    const configResponse = await fetch("/api/newsapi-supply-chain?q=test")
    if (configResponse.status === 500) {
      const errorData = await configResponse.json()
      if (errorData.error?.includes("key not configured")) {
        console.log("❌ NewsAPI key is not configured in environment variables")
        console.log("💡 Make sure NEWS_API_KEY is set in your environment")
      }
    } else {
      console.log("✅ NewsAPI key appears to be configured")
    }
  } catch (error) {
    console.log("❌ Could not test API configuration:", error.message)
  }

  console.log("\n🏁 NewsAPI Testing Complete!")
}

// Run the test
testNewsAPIEndpoint().catch(console.error)
