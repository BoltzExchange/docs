<template>
  <div class="ask-ai">
    <button 
      class="ask-ai-button"
      @click="toggleSearch"
      :aria-expanded="isOpen"
      aria-label="Ask AI"
      title="Ask AI about Boltz documentation"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="ask-ai-icon">
        <g fill="currentColor">
          <path d="M5.658,2.99l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474Z" fill="currentColor" data-stroke="none" stroke="none"></path>
          <polygon points="9.5 2.75 11.412 7.587 16.25 9.5 11.412 11.413 9.5 16.25 7.587 11.413 2.75 9.5 7.587 7.587 9.5 2.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polygon>
        </g>
      </svg>
      <span class="ask-ai-text">Ask AI</span>
    </button>
    
    <div v-if="isOpen" class="search-modal-overlay" @click="closeSearch">
      <div class="search-modal" @click.stop>
        <div class="search-header">
          <h3>Ask AI</h3>
          <button class="close-button" @click="closeSearch" aria-label="Close Ask AI">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSearch" class="search-form">
          <div class="search-input-container">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Ask a question about Boltz..."
              class="search-input"
              :class="{ 'input-error': searchQuery.length > 500 }"
              ref="searchInput"
              @keydown.escape="closeSearch"
              maxlength="500"
            />
            <div class="input-feedback">
              <span class="character-count" :class="{ 'count-error': searchQuery.length > 480 }">
                {{ searchQuery.length }}/500
              </span>
              <div v-if="searchQuery.length > 500" class="error-message">
                Question is too long. Please keep it under 500 characters.
              </div>
            </div>
          </div>
          
          <div class="search-actions">
            <button 
              type="submit" 
              class="search-submit-button"
              :disabled="!searchQuery.trim() || searchQuery.length > 500"
            >
              Ask Perplexity AI
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const isOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement>()

const toggleSearch = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const closeSearch = () => {
  isOpen.value = false
  searchQuery.value = ''
}

const handleSearch = () => {
  if (!searchQuery.value.trim() || searchQuery.value.length > 500) return
  
  const baseUrl = 'https://www.perplexity.ai/search/new'
  const contextPrompt = 'Please use Boltz API Documentation (https://api.docs.boltz.exchange/), Boltz API Swagger Specifications (https://raw.githubusercontent.com/BoltzExchange/boltz-backend/refs/heads/master/swagger-spec.json), Boltz Client Documentation (https://client.docs.boltz.exchange/), Boltz Web App Documentation (https://web.docs.boltz.exchange/), Boltz BTCPay Plugin Documentation (https://btcpay.docs.boltz.exchange/), Boltz GitHub (https://github.com/BoltzExchange), Boltz Blog (https://blog.boltz.exchange/) and Boltz Support Center (https://support.boltz.exchange/hc/center/en) as context to answer the following question. Do not use any other sources for context. Here is the question: '
  const fullQuery = contextPrompt + searchQuery.value.trim()
  const encodedQuery = encodeURIComponent(fullQuery)
  const searchUrl = `${baseUrl}?q=${encodedQuery}`
  
  // Open in new tab
  window.open(searchUrl, '_blank', 'noopener,noreferrer')
  
  // Close the modal
  closeSearch()
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeSearch()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.ask-ai {
  position: relative;
}

.ask-ai-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.25s;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
}

.ask-ai-button:hover {
  color: var(--vp-c-text-1);
}

.ask-ai-icon {
  width: 18px;
  height: 18px;
}

.ask-ai-text {
  white-space: nowrap;
}

/* Hide text on mobile */
@media (max-width: 768px) {
  .ask-ai-text {
    display: none;
  }
  
  .ask-ai-button {
    padding: 8px;
    width: 40px;
    justify-content: center;
  }
}

.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.search-modal {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
}

.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.search-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.close-button {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.search-form {
  padding: 24px;
}

.search-input-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.search-input::placeholder {
  color: var(--vp-c-text-3);
}

.search-input.input-error {
  border-color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
}

.input-feedback {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 8px;
  min-height: 20px;
}

.character-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-left: auto;
}

.character-count.count-error {
  color: var(--vp-c-warning-1);
  font-weight: 500;
}

.error-message {
  font-size: 12px;
  color: var(--vp-c-danger-1);
  margin-right: auto;
  flex: 1;
}

.search-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-submit-button {
  padding: 12px 24px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-submit-button:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.search-submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.search-description {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-align: center;
  line-height: 1.4;
}

/* Responsive design */
@media (max-width: 640px) {
  .search-modal {
    margin: 10px;
    max-height: 90vh;
  }
  
  .search-header {
    padding: 16px 20px 12px;
  }
  
  .search-form {
    padding: 20px;
  }
  
  .search-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Dark mode adjustments */
.dark .search-modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}

.dark .search-modal {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}
</style>
