import { publicApi, protectedApi } from '../api';

const TOKEN_KEY = 'access_token';
const USER_INFO_KEY = 'user_info';

const auth = {
  state: {
    accessToken: localStorage.getItem(TOKEN_KEY) || null,
    userInfo: JSON.parse(localStorage.getItem(USER_INFO_KEY) || 'null'),
    isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
    loading: false,
    error: null,
  },
  
  getters: {
    accessToken: (state) => state.accessToken,
    userInfo: (state) => state.userInfo,
    isAuthenticated: (state) => state.isAuthenticated,
    isAdmin: (state) => state.userInfo?.user_type === 'admin',
    isMember: (state) => state.userInfo?.user_type === 'member',
    userRole: (state) => state.userInfo?.role || null,
    authLoading: (state) => state.loading,
    authError: (state) => state.error,
  },
  
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
      state.isAuthenticated = !!token;
      
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    },
    

    
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      
      if (userInfo) {
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
      } else {
        localStorage.removeItem(USER_INFO_KEY);
      }
    },
    
    setLoading(state, isLoading) {
      state.loading = isLoading;
    },
    
    setError(state, error) {
      state.error = error;
    },
    
    clearAuth(state) {
      state.accessToken = null;
      state.userInfo = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_INFO_KEY);
    }
  },
  
  actions: {
    // Login action
    async login({ commit }, { email, password }) {
      commit('setLoading', true);
      commit('setError', null);
      
      try {
        const response = await publicApi.login(email, password);
        
        // Store tokens and user info
        commit('setAccessToken', response.data.access_token);
        
        // Store user info
        const userInfo = {
          user_id: response.data.user_id,
          user_type: response.data.user_type,
          role: response.data.role
        };
        commit('setUserInfo', userInfo);
        
        return response;
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
        commit('setError', errorMessage);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    // Logout action
    async logout({ commit, state }) {
      // Prevent multiple simultaneous logout calls
      if (state.loading) {
        console.log('Logout already in progress, skipping duplicate call');
        return;
      }
      
      commit('setLoading', true);
      
      try {
        // Call the logout endpoint with a timeout to prevent hanging
        await Promise.race([
          protectedApi.logout(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Logout request timeout')), 5000)
          )
        ]);
      } catch (error) {
        console.error('Logout API error:', error);
        // Don't throw the error - we still want to clear local auth data
      } finally {
        // Clear all auth data
        commit('clearAuth');
        commit('setLoading', false);
      }
    },
    
    // Refresh token - this will normally be handled by the API interceptor,
    // but can be called manually if needed
    async refreshToken({ commit }) {
      try {
        const response = await axios.post('/api/refresh-token', {}, {
          withCredentials: true
        });
        commit('setAccessToken', response.data.access_token);
        return true;
      } catch (error) {
        commit('clearAuth');
        throw error;
      }
    },
    
    // Check if current authentication is valid
    async checkAuth({ getters, commit }) {
      // If no token exists, user is not authenticated
      if (!getters.accessToken) {
        return false;
      }
      
      // Test authentication with a simple protected API call
      try {
        await protectedApi.getSettings();
        return true;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Authentication failed, clear auth state
          commit('clearAuth');
        }
        return false;
      }
    }
  }
};

export default auth;

