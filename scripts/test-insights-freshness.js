// Test script to refresh Insights panel and monitor article freshness
console.log("🔄 TESTING INSIGHTS PANEL FRESHNESS")
console.log("=".repeat(50))

// Function to test insights freshness
async function testInsightsFreshness() {
  try {
    console.log("📱 Step 1: Testing Contextual Insights API directly...")

    // Test the contextual insights API
    const response = await fetch("/api/contextual-insights?activeTab=logistics")

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`)
      return
    }

    const data = await response.json()

    console.log("✅ API Response received successfully")
    console.log(`📊 Total articles: ${data.newsArticles?.length || 0}`)

    if (data.metadata?.articleFreshness) {
      const freshness = data.metadata.articleFreshness
      console.log("📅 ARTICLE FRESHNESS ANALYSIS:")
      console.log(`   • Max allowed age: ${freshness.maxAgeDays} days`)
      console.log(`   • Average article age: ${freshness.averageAgeDays} days`)
      console.log(`   • All articles recent (≤15 days): ${freshness.allRecent ? "✅ YES" : "❌ NO"}`)
      console.log(`   • Age distribution: [${freshness.ageDistribution?.join(", ")}] days`)
    }

    // Analyze individual articles
    if (data.newsArticles && data.newsArticles.length > 0) {
      console.log("\n📰 INDIVIDUAL ARTICLE ANALYSIS:")
      console.log("-".repeat(40))

      data.newsArticles.forEach((article, index) => {
        const publishedDate = new Date(article.publishedAt)
        const now = new Date()
        const ageDays = Math.round((now - publishedDate) / (1000 * 60 * 60 * 24))
        const isRecent = ageDays <= 15

        console.log(`${index + 1}. ${article.title.substring(0, 60)}...`)
        console.log(`   📅 Published: ${article.publishedAt.split("T")[0]}`)
        console.log(`   🕒 Age: ${ageDays} days ${isRecent ? "✅" : "❌ TOO OLD"}`)
        console.log(`   📰 Source: ${article.source}`)
        console.log(`   🎯 Relevance: ${Math.round(article.relevanceScore * 100)}%`)
        console.log("")
      })
    } else {
      console.log("⚠️ No news articles found in response")
    }

    // Check for real news vs fallback
    const realNewsStatus = data.metadata?.realNewsStatus
    console.log(`🔍 News Source Status: ${realNewsStatus}`)

    if (realNewsStatus === "FALLBACK") {
      console.log("⚠️ Using fallback news - check API keys and connectivity")
    } else {
      console.log(`✅ Using real news from ${data.metadata?.newsSourcesUsed || 0} different sources`)
    }
  } catch (error) {
    console.error("❌ Error testing insights freshness:", error)
  }
}

// Function to simulate panel refresh
function simulatePanelRefresh() {
  console.log("\n🔄 SIMULATING INSIGHTS PANEL REFRESH...")
  console.log("=".repeat(50))

  // Try to find and trigger refresh button
  const refreshButton = document.querySelector('[data-testid="refresh-insights"], button:contains("Refresh")')

  if (refreshButton) {
    console.log("🖱️ Found refresh button, clicking...")
    refreshButton.click()
    console.log("✅ Refresh button clicked")
  } else {
    console.log("⚠️ Refresh button not found, triggering manual refresh...")

    // Try to trigger a manual refresh by dispatching events
    window.dispatchEvent(new CustomEvent("refreshInsights"))

    // Or try to find the insights panel and trigger a re-render
    const insightsPanel = document.querySelector('[data-testid="insights-panel"]')
    if (insightsPanel) {
      console.log("🔄 Found insights panel, triggering refresh...")
      // Trigger a re-render by changing a data attribute
      insightsPanel.setAttribute("data-refresh", Date.now().toString())
    }
  }
}

// Function to monitor console for specific logs
function monitorConsoleForInsights() {
  console.log("\n👀 MONITORING CONSOLE FOR INSIGHTS LOGS...")
  console.log("Look for these key indicators:")
  console.log("✅ '🔍 CONTEXTUAL INSIGHTS: Fetching recent news (≤15 days)'")
  console.log("✅ '📰 Built X search queries'")
  console.log("✅ 'TheNewsAPI: Fetched X articles, Y recent (≤15 days)'")
  console.log("✅ 'NewsAPI: Fetched X articles, Y recent (≤15 days)'")
  console.log("✅ '🎯 FINAL RESULT: X recent articles'")
  console.log("✅ '📅 Age distribution (days): [X, Y, Z]'")
  console.log("✅ 'Article freshness: avg X days, all ≤15 days: true'")
  console.log("")
}

// Main execution
async function main() {
  console.log("🚀 Starting Insights Freshness Test...")

  // Step 1: Monitor console
  monitorConsoleForInsights()

  // Step 2: Test API directly
  await testInsightsFreshness()

  // Step 3: Simulate panel refresh
  simulatePanelRefresh()

  // Step 4: Wait and test again
  console.log("\n⏳ Waiting 3 seconds for refresh to complete...")
  setTimeout(async () => {
    console.log("\n🔄 Testing after refresh...")
    await testInsightsFreshness()

    console.log("\n✅ INSIGHTS FRESHNESS TEST COMPLETE!")
    console.log("Check the console output above for:")
    console.log("• Article age confirmation (all ≤15 days)")
    console.log("• Real news vs fallback status")
    console.log("• Source diversity and freshness")
    console.log("• API response metadata")
  }, 3000)
}

// Run the test
main()
