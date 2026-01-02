import { createStore } from 'vuex';
import auth from './auth';

// Create a root store that includes modules
export default createStore({
  modules: {
    auth,
    // Add other modules here as needed, such as:
    // members: membersModule,
    // loans: loansModule,
    // etc.
  },
  
  // Root state
  state: {
    appLoading: false,
    globalNotification: null,
  },
  
  // Root getters
  getters: {
    isAppLoading: state => state.appLoading,
    globalNotification: state => state.globalNotification,
  },
  
  // Root mutations
  mutations: {
    setAppLoading(state, isLoading) {
      state.appLoading = isLoading;
    },
    
    setGlobalNotification(state, notification) {
      state.globalNotification = notification;
    },
    
    clearGlobalNotification(state) {
      state.globalNotification = null;
    }
  },
  
  // Root actions
  actions: {
    showNotification({ commit }, { type, message, timeout = 5000 }) {
      commit('setGlobalNotification', { type, message });
      
      // Auto-clear notification after timeout
      if (timeout > 0) {
        setTimeout(() => {
          commit('clearGlobalNotification');
        }, timeout);
      }
    },
    
    showSuccessNotification({ dispatch }, message) {
      dispatch('showNotification', {
        type: 'success',
        message,
      });
    },
    
    showErrorNotification({ dispatch }, message) {
      dispatch('showNotification', {
        type: 'error',
        message,
      });
    }
  }
});

