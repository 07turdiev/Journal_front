<template>
  <div class="not-found-container">
    <div class="error-illustration">
      <img src="/404.png" alt="404 Error" class="error-image" />
    </div>
    
    <h1 class="oops-text">404</h1>
    
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
import { RouterLink } from 'vue-router';
import { useLocalizedRoute } from '@/composables/useLocalizedRoute';

const { getLocalizedPath } = useLocalizedRoute();
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

.oops-text {

  font-style: normal;
  font-weight: 600;
  font-size: 100px;
  line-height: 29px;
  
  color: #000000;
}

.error-message {
  width: 423px;
  max-width: 90%;
  height: auto;
  margin: 0 auto 30px auto;
  
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  
  color: #514F4F;
}

.action-buttons {
  margin-top: 20px;
}

.home-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #0056b3;
}

/* Responsive design */
@media (max-width: 768px) {
  .not-found-container {
    min-height: 100vh;
    padding: 40px 20px;
  }
  
  .error-illustration {
    width: 280px;
    height: 280px;
    margin-bottom: 20px;
  }
  
  .oops-text {
    margin-bottom: 10px;
    font-size: 50px;
  }
  
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
