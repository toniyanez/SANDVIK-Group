// Simple script to refresh insights and show freshness info
console.log("🔄 REFRESHING INSIGHTS PANEL...")

// Direct API test
fetch("/api/contextual-insights?activeTab=logistics")
  .then((response) => response.json())
  .then((data) => {
    console.log("📊 INSIGHTS FRESHNESS RESULTS:")
    console.log("=".repeat(40))

    const articles = data.newsArticles || []
    const freshness = data.metadata?.articleFreshness

    console.log(`📰 Total articles: ${articles.length}`)

    if (freshness) {
      console.log(`📅 Average age: ${freshness.averageAgeDays} days`)
      console.log(`✅ All recent (≤15 days): ${freshness.allRecent}`)
      console.log(`📊 Age distribution: [${freshness.ageDistribution?.join(", ")}] days`)
    }

    console.log(`🔍 News status: ${data.metadata?.realNewsStatus}`)
    console.log(`🏢 Sources used: ${data.metadata?.newsSourcesUsed}`)

    // Show sample articles
    if (articles.length > 0) {
      console.log("\n📰 SAMPLE ARTICLES:")
      articles.slice(0, 3).forEach((article, i) => {
        const age = Math.round((new Date() - new Date(article.publishedAt)) / (1000 * 60 * 60 * 24))
        console.log(`${i + 1}. ${article.title.substring(0, 50)}...`)
        console.log(`   Age: ${age} days | Source: ${article.source}`)
      })
    }
  })
  .catch((error) => {
    console.error("❌ Error:", error)
  })
