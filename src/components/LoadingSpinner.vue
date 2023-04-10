<template>
    <div v-if="loading" class="loading-spinner" :style="{ '--color': color, '--size': size + 'px' }">
      <div class="spinner"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingSpinner',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      color: {
        type: String,
        default: '#4a4e69',
      },
      size: {
        type: Number,
        default: 40,
      },
    },
  };
  </script>
  
  <style scoped>
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .spinner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: calc(var(--size) / 10) solid #ccc;
    border-top-color: var(--color);
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  