import { defineStore } from 'pinia'
import { ref } from 'vue';

import Keycloak, { type KeycloakTokenParsed } from 'keycloak-js'

const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
});

export const useAuthenticationStore = defineStore('authenticationStore', () => {

    const isAuthenticated = ref<boolean>(false);
    const token = ref<string|undefined>(undefined);
    const tokenParsed = ref<KeycloakTokenParsed|undefined>(undefined);
    
    const login = async () => {
        try {
            const authenticated = await keycloak.init({ onLoad: 'login-required' });
        
            isAuthenticated.value = authenticated;
            token.value = keycloak.token;
            tokenParsed.value = keycloak.tokenParsed;
        } catch (e) {
            const error = e as Error;
            console.error('Failed to initialize adapter:', error);
        }
    }

    const logout = async () => {
        await keycloak.logout();
    }

    return {
        isAuthenticated,
        logout,
        token,
        tokenParsed,
        login
    }

})
