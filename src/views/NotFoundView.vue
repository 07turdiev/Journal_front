<template>
  <div class="not-found-container">
    <div class="animation-wrapper" aria-hidden="true">
      <!-- Animated floating dots and center '0' ring -->
      <svg viewBox="0 0 200 200" class="floating-svg" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0%" x2="100%">
            <stop offset="0%" stop-color="#6C63FF" />
            <stop offset="100%" stop-color="#00D4FF" />
          </linearGradient>
        </defs>

        <g transform="translate(100,100)">
          <circle class="ring" r="64" fill="none" stroke="url(#g)" stroke-width="6" opacity="0.95" />
          <circle class="dot d1" cx="-80" cy="-40" r="6" fill="#FF8A80" />
          <circle class="dot d2" cx="70" cy="-60" r="6" fill="#FFD180" />
          <circle class="dot d3" cx="60" cy="70" r="6" fill="#8C9EFF" />
        </g>
      </svg>
    </div>

    <h1 class="oops-text" aria-label="404"> <span>4</span><span>0</span><span>4</span> </h1>
    
    <p class="error-message">
      Sahifa mavjud emas
    </p>
    
    <div class="action-buttons">
      <RouterLink :to="getLocalizedPath('/')" class="home-button">
        Bosh sahifaga qaytish
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDynamicSeoMeta } from '@/composables/useDynamicSeoMeta';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

const route = useRoute();
const { t } = useI18n();
const { getLocalizedPath } = useLocalizedRoute();

useDynamicSeoMeta({
  fallbackKey: 'not_found',
  useApiData: false
});
</script>

<style scoped>
.not-found-container {
  width: 100%;
  max-width: 1440px;
  min-height: 100vh;
  margin: 0 auto;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

.error-illustration {
  width: 334px;
  height: 334px;
  margin-bottom: 20px;
}

.error-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.not-found-container {
  width: 100%;
  max-width: 1440px;
  /* reduce overall height so 404 doesn't dominate whole viewport */
  min-height: 70vh;
  margin: 0 auto;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
  text-align: center;
}

.animation-wrapper {
  width: 320px;
  height: 320px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ring {
  transform-origin: 100px 100px;
  animation: rotateRing 6s linear infinite;
}

.dot { animation: float 4s ease-in-out infinite; }
.dot.d1 { animation-delay: 0s; }
.dot.d2 { animation-delay: 0.6s; }
.dot.d3 { animation-delay: 1.2s; }

@keyframes rotateRing {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(20deg); }
  100% { transform: rotate(0deg); }
}

@keyframes float {
  0% { transform: translateY(0px); opacity: 1; }
  50% { transform: translateY(-12px); opacity: 0.8; }
  100% { transform: translateY(0px); opacity: 1; }
}

.oops-text {
  font-style: normal;
  font-weight: 800;
  font-size: 160px;
  margin: 6px 0 0 0;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  color: #6C63FF;
  -webkit-background-clip: text;
  background-clip: text;
  background-image: linear-gradient(90deg, #222222 0%, #6C63FF 50%, #00D4FF 100%);
  animation: pop 1.4s ease-in-out infinite alternate;
  text-shadow: 0 6px 18px rgba(12,12,30,0.08);
}

.oops-text span { display: inline-block; }
.oops-text span:nth-child(1) { animation: wobble 1.4s ease-in-out infinite; }
.oops-text span:nth-child(2) { animation: wobble 1.6s ease-in-out infinite; }
.oops-text span:nth-child(3) { animation: wobble 1.8s ease-in-out infinite; }

@keyframes wobble {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(-6deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

@keyframes pop {
  from { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08)); transform: translateY(0); }
  to { filter: drop-shadow(0 10px 18px rgba(0,0,0,0.12)); transform: translateY(-6px); }
}

.error-message {
  width: 480px;
  max-width: 85%;
  height: auto;
  margin: 12px auto 28px auto;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
  color: #514F4F;
}

.action-buttons {
  margin-top: 20px;
}

.home-button {
  display: inline-block;
  padding: 14px 30px;
  background-image: linear-gradient(90deg, #6C63FF 0%, #00D4FF 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 8px 20px rgba(108,99,255,0.12);
}

.home-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 14px 30px rgba(0, 212, 255, 0.14);
}

/* Responsive design */
@media (max-width: 768px) {
  .not-found-container {
    min-height: 100vh;
    padding: 40px 20px;
  }
  
  .animation-wrapper {
    width: 240px;
    height: 240px;
    margin-bottom: 8px;
  }
  
  .oops-text { font-size: 72px; }
  
  .error-message {
    width: 100%;
    max-width: 350px;
    margin-bottom: 20px;
    font-size: 13px;
  }
  
  .action-buttons {
    margin-top: 20px;
  }
}
</style>
